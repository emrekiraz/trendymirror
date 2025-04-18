import { supabase } from '@/app/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

/**
 * Converts a base64 string to a File object
 */
export const base64ToFile = async (base64String: string, filename: string): Promise<File> => {
  // Remove data URL prefix if present
  const base64Data = base64String.includes('base64,') 
    ? base64String.split('base64,')[1] 
    : base64String
  
  // Decode base64 to binary
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  // Determine mime type from data URL or default to jpeg
  let mimeType = 'image/jpeg'
  if (base64String.includes('data:')) {
    mimeType = base64String.split(';')[0].split(':')[1]
  }
  
  // Create blob and file
  const blob = new Blob([bytes], { type: mimeType })
  return new File([blob], filename, { type: mimeType })
}

/**
 * Saves an image to a Supabase storage bucket
 */
export const saveImageToBucket = async (
  file: File, 
  bucketName: string, 
  filePath: string,
  metadata?: Record<string, any>
): Promise<string> => {
  // Use the provided filePath directly
  const finalFilePath = filePath;
  
  // Convert file to blob to ensure compatibility
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  
  // Upload to Supabase using the final path
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(finalFilePath, blob, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false, // Set upsert to false to avoid overwriting by mistake if path generation collides
      ...(metadata && { metadata }) // Add metadata if provided
    });
  
  if (error) {
    console.error(`Error uploading to ${bucketName} at ${finalFilePath}:`, error);
    throw error;
  }
  
  // Get public URL using the final path
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(finalFilePath);
  
  return publicUrl;
}

/**
 * Saves a base64 image to a Supabase storage bucket
 */
export const saveBase64ToBucket = async (
  base64String: string, 
  bucketName: string, 
  filePath: string,
  metadata?: Record<string, any>
): Promise<string> => {
  // Extract filename from the filePath for base64ToFile
  const filename = filePath.split('/').pop() || 'image.jpg'; 
  const file = await base64ToFile(base64String, filename);
  // Pass the full filePath and metadata to saveImageToBucket
  return saveImageToBucket(file, bucketName, filePath, metadata);
}

/**
 * Checks if a file with the same name exists in a bucket
 */
export const checkFileExists = async (
  bucketName: string,
  fileName: string
): Promise<boolean> => {
  try {
    // Try to get the file metadata
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        search: fileName
      })
    
    if (error) {
      console.error(`Error checking if file exists in ${bucketName}:`, error)
      return false
    }
    
    // If we found a file with the same name
    return data && data.some(file => file.name === fileName)
  } catch (error) {
    console.error(`Error checking if file exists in ${bucketName}:`, error)
    return false
  }
}

/**
 * Extracts filename from a URL
 */
export const getFilenameFromUrl = (url: string): string => {
  try {
    // For image proxy URLs
    if (url.includes('/api/image-proxy')) {
      const params = new URLSearchParams(url.split('?')[1])
      const name = params.get('name')
      if (name) {
        return name.split('/').pop() || ''
      }
    }
    
    // For regular URLs
    return url.split('/').pop() || ''
  } catch (error) {
    console.error('Error extracting filename from URL:', error)
    return ''
  }
}

/**
 * Saves a result to the gallery and optionally to models and products
 */
export const saveResultToGallery = async (
  userId: string,
  resultImage: string,
  modelFile?: File,
  productFile?: File,
  category?: string,
  isTemplate: boolean = false,
  originalModelName?: string,
  originalGarmentName?: string
): Promise<{
  galleryUrl: string;
  modelUrl?: string;
  productUrl?: string;
}> => {
  if (!userId) {
    throw new Error("User ID is required to save to gallery.");
  }

  const result: {
    galleryUrl: string;
    modelUrl?: string;
    productUrl?: string;
    modelId?: string;
    productId?: string;
  } = {
    galleryUrl: ''
  };
  
  // Save model if provided and not a template
  if (modelFile && !isTemplate) {
    try {
      const modelFileName = originalModelName || modelFile.name;
      const fileExists = await checkFileExists('models', `user_${userId}/${modelFileName}`);
      
      if (!fileExists) {
        console.log(`Saving model to models bucket: user_${userId}/${modelFileName}`);
        const modelId = uuidv4();
        const modelFilePath = `user_${userId}/${modelFileName}`;
        const modelMetadata = { 
          tag: 'User Uploaded',
          originalName: modelFileName
        };
        const modelUrl = await saveImageToBucket(
          modelFile, 
          'models', 
          modelFilePath,
          modelMetadata
        );
        result.modelUrl = modelUrl;
        result.modelId = modelId;
      } else {
        console.log(`Model already exists, skipping upload: user_${userId}/${modelFileName}`);
      }
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  } else if (isTemplate) {
    console.log('Template model detected, skipping model upload');
  }
  
  // Save product if provided and not a template
  if (productFile && !isTemplate) {
    try {
      const garmentFileName = originalGarmentName || productFile.name;
      const fileExists = await checkFileExists('products', `user_${userId}/${garmentFileName}`);
      
      if (!fileExists) {
        console.log(`Saving garment to products bucket: user_${userId}/${garmentFileName}`);
        const productId = uuidv4();
        const productFilePath = `user_${userId}/${garmentFileName}`;
        const productMetadata = { 
          category: category || 'full-body',
          originalName: garmentFileName
        };
        const productUrl = await saveImageToBucket(
          productFile, 
          'products', 
          productFilePath,
          productMetadata
        );
        result.productUrl = productUrl;
        result.productId = productId;
      } else {
        console.log(`Garment already exists, skipping upload: user_${userId}/${garmentFileName}`);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  } else if (isTemplate) {
    console.log('Template garment detected, skipping garment upload');
  }
  
  // Save result to gallery
  try {
    const galleryFileName = `${uuidv4()}.jpg`;
    const galleryFilePath = `user_${userId}/${galleryFileName}`;

    const metadata: Record<string, any> = {
        category: category || 'unknown', 
        ...(result.modelId && { modelId: result.modelId }), 
        ...(result.productId && { productId: result.productId }),
        ...(originalModelName && { modelName: originalModelName }),
        ...(originalGarmentName && { garmentName: originalGarmentName })
    };

    if (resultImage.startsWith('data:')) {
      console.log(`Saving base64 result to gallery: ${galleryFilePath}`);
      result.galleryUrl = await saveBase64ToBucket(
        resultImage, 
        'gallery', 
        galleryFilePath,
        metadata
      );
    } else {
      console.log(`Fetching and saving URL result to gallery: ${galleryFilePath}`);
      const response = await fetch(resultImage);
      if (!response.ok) throw new Error(`Failed to fetch result image: ${response.statusText}`);
      const blob = await response.blob();
      const fileType = blob.type || 'image/jpeg';
      const fileExtension = fileType.split('/')[1] || 'jpg';
      const finalGalleryFileName = `${uuidv4()}.${fileExtension}`;
      const finalGalleryFilePath = `user_${userId}/${finalGalleryFileName}`;
      
      const file = new File([blob], finalGalleryFileName, { type: fileType });
      
      result.galleryUrl = await saveImageToBucket(
        file, 
        'gallery',
        finalGalleryFilePath,
        metadata
      );
    }
    console.log('Successfully saved to gallery:', result.galleryUrl);
  } catch (error) {
    console.error('Failed to save result to gallery:', error);
    throw error;
  }
  
  return {
    galleryUrl: result.galleryUrl,
    modelUrl: result.modelUrl,
    productUrl: result.productUrl,
  };
} 