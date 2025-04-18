'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  InformationCircleIcon,
  ArrowUpTrayIcon,
  LinkIcon,
  SquaresPlusIcon,
  CameraIcon,
  SparklesIcon,
  BoltIcon,
  ScaleIcon,
  StarIcon,
  XMarkIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import InfoPopup from '@/app/components/InfoPopup'
import AIModelPopup from '@/app/components/AIModelPopup'
import { tryOnClothing, TryOnError } from '@/app/utils/api'
import { saveResultToGallery, saveBase64ToBucket, getFilenameFromUrl } from '@/app/utils/storage'
import toast from 'react-hot-toast'
import ModelSelectionPopup from '@/app/components/ModelSelectionPopup'
import ProductSelectionPopup from '@/app/components/ProductSelectionPopup'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import { Heading, Text } from '@/app/components/ui/Typography'
import Badge from '@/app/components/ui/Badge'
import Link from 'next/link'
import { useAuth } from '@/app/hooks/use-auth'

type ImageSource = {
  url: string
  file: File | null
}

type Category = 'top' | 'bottom' | 'full-body'

interface ImageUploadBoxProps {
  type: 'model' | 'garment'
  image: ImageSource
  onDrop: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent) => void
  onUrlInput: (url: string) => void
  title: string
  onInfoClick: () => void
  onFileSelect: (file: File) => void
  onRemove: () => void
  onShowModelSelection?: () => void
  onShowProductSelection?: () => void
  onShowAIModal?: () => void
}

function ImageUploadBox({ 
  type,
  image,
  onDrop,
  onPaste,
  onUrlInput,
  title,
  onInfoClick,
  onFileSelect,
  onRemove,
  onShowModelSelection,
  onShowProductSelection,
  onShowAIModal,
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Heading level={3}>{title}</Heading>
        <button 
          className="p-1 hover:bg-gray-100 rounded-full"
          onClick={onInfoClick}
        >
          <InformationCircleIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] h-[300px] flex flex-col items-center justify-center relative cursor-pointer group bg-white shadow-level-1 hover:shadow-level-2 transition-all duration-150"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e)}
        onPaste={(e) => onPaste(e)}
        onClick={handleBoxClick}
      >
        {image.url ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full max-w-[250px] max-h-[250px]">
              {image.url.startsWith('/api/image-proxy') ? (
                <img
                  src={image.url}
                  alt={`${type} preview`}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    console.error(`Error loading image via <img> tag: ${image.url}`);
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = 'https://via.placeholder.com/250x250?text=Load+Error';
                  }}
                />
              ) : (
                <Image
                  src={image.url}
                  alt={`${type} preview`}
                  className="object-contain"
                  fill
                  sizes="250px"
                />
              )}
            </div>
            <div className="absolute top-2 right-2">
              <button 
                className="bg-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent's onClick
                  onRemove();
                }}
              >
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {type === 'model' ? (
              <UserIcon className="w-12 h-12 text-blue-500 mb-4" />
            ) : (
              <TagIcon className="w-12 h-12 text-blue-500 mb-4" />
            )}
            <Text className="text-center mb-2">
              Click, paste, or drop image here
            </Text>
            <Text color="light" className="text-sm text-center">OR</Text>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileSelect(file)
            }
          }}
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Or paste image URL"
            className="flex-1 p-2 border rounded-lg"
            onBlur={(e) => e.target.value && onUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.value && onUrlInput(e.currentTarget.value)}
          />
        </div>
        
        {type === 'model' && onShowModelSelection && (
          <div className="mt-2">
            <Button 
              variant="secondary"
              fullWidth
              onClick={onShowModelSelection}
              className="flex items-center justify-center gap-2"
            >
              <SquaresPlusIcon className="w-5 h-5" />
              Choose From Models
            </Button>
          </div>
        )}
        
        {type === 'model' && (
          <div className="mt-2">
            <Button 
              variant="secondary"
              fullWidth
              onClick={onShowAIModal}
              className="flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-5 h-5" />
              Generate AI Model
            </Button>
          </div>
        )}
        
        {type === 'garment' && onShowProductSelection && (
          <div className="mt-2">
            <Button 
              variant="secondary"
              fullWidth
              onClick={onShowProductSelection}
              className="flex items-center justify-center gap-2"
            >
              <SquaresPlusIcon className="w-5 h-5" />
              Choose From Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const FASHN_API_URL = process.env.NEXT_PUBLIC_FASHN_API_URL || 'https://api.fashn.com/v1/tryon'
const FREEPIK_API_URL = process.env.NEXT_PUBLIC_FREEPIK_API_URL || 'https://api.freepik.com/v1/images/generate'

// Templates for quick start
const templates = [
  {
    model: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/models/default/TrendyMirror_2.png',
    garment: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/110000079539214.jpg',
    category: 'top',
    modelName: 'TrendyMirror_2.png',
    garmentName: '110000079539214.jpg'
  },
  {
    model: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/models/default/TrendyMirror_13.png',
    garment: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/red_dress.jpg',
    category: 'full-body',
    modelName: 'TrendyMirror_13.png',
    garmentName: 'red_dress.jpg'
  },
  {
    model: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/models/default/TrendyMirror_1.png',
    garment: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/pc03uu9col002-1.jpg',
    category: 'bottom',
    modelName: 'TrendyMirror_1.png',
    garmentName: 'pc03uu9col002-1.jpg'
  }
]

// Add a helper function to fetch an image from URL and convert to File
async function fetchImageAsFile(url: string, fileName: string): Promise<File> {
  try {
    // For image proxy URLs, extract the original filename
    if (url.includes('/api/image-proxy')) {
      try {
        const params = new URLSearchParams(url.split('?')[1]);
        const name = params.get('name');
        if (name) {
          // Use the original filename from the name parameter
          // If it includes a path (like default/filename.jpg), get just the filename
          const pathParts = name.split('/');
          fileName = pathParts[pathParts.length - 1];
          console.log(`Using original filename from proxy URL: ${fileName}`);
        }
      } catch (error) {
        console.error('Error extracting filename from proxy URL:', error);
        // Continue with the provided fileName as fallback
      }
    }
    
    console.log(`Fetching image from URL: ${url}, will save as: ${fileName}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image from URL');
  }
}

export default function Studio() {
  const [modelImage, setModelImage] = useState<ImageSource>({ url: '', file: null })
  const [garmentImage, setGarmentImage] = useState<ImageSource>({ url: '', file: null })
  const [resultImage, setResultImage] = useState<string>('')
  const [category, setCategory] = useState<Category>('full-body')
  const [quality, setQuality] = useState<'performance' | 'balanced' | 'quality'>('balanced')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Popup states
  const [modelInfoOpen, setModelInfoOpen] = useState(false)
  const [garmentInfoOpen, setGarmentInfoOpen] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  
  // Model ve Product seçim popup'ları için state'ler
  const [showModelSelection, setShowModelSelection] = useState(false)
  const [showProductSelection, setShowProductSelection] = useState(false)

  const { user } = useAuth();

  // Handle URL parameters when the page loads
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modelParam = params.get('model');
      const modelUrlParam = params.get('modelUrl');
      const garmentParam = params.get('garment');
      const categoryParam = params.get('category') as Category | null;
      
      console.log('URL parameters:', { modelParam, modelUrlParam, garmentParam, categoryParam });
      
      // If parameters are present, load the model and garment
      if (modelParam) {
        const modelUrl = `/api/image-proxy?bucket=models&name=default/${encodeURIComponent(modelParam)}`;
        setModelImage({ url: modelUrl, file: null });
        toast.success('Model loaded from template');
      } else if (modelUrlParam) {
        // If we have a direct model URL (from the Try On button)
        setModelImage({ url: modelUrlParam, file: null });
        toast.success('Model loaded successfully');
      }
      
      if (garmentParam) {
        // Add 'default/' prefix here before encoding
        const garmentUrl = `/api/image-proxy?bucket=products&name=default/${encodeURIComponent(garmentParam)}`;
        setGarmentImage({ url: garmentUrl, file: null });
        toast.success('Garment loaded from template'); // Mesajı güncelledik
      }
      
      if (categoryParam && ['top', 'bottom', 'full-body'].includes(categoryParam)) {
        setCategory(categoryParam);
        console.log(`Category set to: ${categoryParam}`);
      }
    }
  }, []);

  const handleDrop = async (e: React.DragEvent, type: 'model' | 'garment') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        type === 'model' 
          ? setModelImage({ url: result, file })
          : setGarmentImage({ url: result, file })
      }
      reader.readAsDataURL(file)
      toast.success(`${type === 'model' ? 'Model' : 'Garment'} image uploaded`)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent, type: 'model' | 'garment') => {
    const items = Array.from(e.clipboardData.items)
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            type === 'model'
              ? setModelImage({ url: result, file })
              : setGarmentImage({ url: result, file })
          }
          reader.readAsDataURL(file)
          toast.success(`${type === 'model' ? 'Model' : 'Garment'} image pasted`)
          break
        }
      }
    }
  }

  const handleUrlInput = (url: string, type: 'model' | 'garment') => {
    type === 'model'
      ? setModelImage({ url, file: null })
      : setGarmentImage({ url, file: null })
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image URL set`)
  }

  const handleFileSelect = (file: File, type: 'model' | 'garment') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      type === 'model'
        ? setModelImage({ url: result, file })
        : setGarmentImage({ url: result, file })
    }
    reader.readAsDataURL(file)
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image uploaded`)
  }

  const handleRemove = (type: 'model' | 'garment') => {
    if (type === 'model') {
      setModelImage({ url: '', file: null })
    } else {
      setGarmentImage({ url: '', file: null })
    }
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image removed`)
  }

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please log in to generate and save images.");
      return;
    }
    
    if (!modelImage.url || !garmentImage.url) {
      toast.error("Please select both model and garment images")
      return
    }

    setIsLoading(true)
    setIsSaving(false)
    
    try {
      // Prepare model and garment files
      let modelFile = modelImage.file;
      let garmentFile = garmentImage.file;
      
      // Check if this is a template - improved detection
      // If the URL is from our image proxy API, it's likely a template or existing image
      const isModelFromProxy = modelImage.url.includes('/api/image-proxy') && 
                              modelImage.url.includes('bucket=models');
      const isGarmentFromProxy = garmentImage.url.includes('/api/image-proxy') && 
                                garmentImage.url.includes('bucket=products');
      
      // If both images are from our proxy or external URLs, treat as template
      // This prevents duplicate uploads when using existing images
      const isTemplate = (isModelFromProxy && isGarmentFromProxy) || 
                         (modelImage.url.startsWith('http') && garmentImage.url.startsWith('http'));
      
      if (isTemplate) {
        console.log('Using template or existing images, will skip adding to models/products');
      }
      
      // If we don't have files but have URLs, fetch the images
      if (!modelFile && modelImage.url) {
        try {
          const modelFileName = getFilenameFromUrl(modelImage.url);
          modelFile = await fetchImageAsFile(modelImage.url, modelFileName);
          toast.success("Model image loaded successfully");
        } catch (error) {
          toast.error("Failed to load model image");
          setIsLoading(false);
          return;
        }
      }
      
      if (!garmentFile && garmentImage.url) {
        try {
          const garmentFileName = getFilenameFromUrl(garmentImage.url);
          garmentFile = await fetchImageAsFile(garmentImage.url, garmentFileName);
          toast.success("Garment image loaded successfully");
        } catch (error) {
          toast.error("Failed to load garment image");
          setIsLoading(false);
          return;
        }
      }
      
      if (!modelFile || !garmentFile) {
        toast.error("Failed to prepare images for processing");
        setIsLoading(false);
        return;
      }
      
      const { image: resultImageUrl } = await tryOnClothing(
        modelFile,
        garmentFile,
        category
      )
      
      setResultImage(resultImageUrl)
      
      // Save the result to gallery and add model/garment to their pages
      if (modelFile && garmentFile) {
        setIsSaving(true)
        try {
          // Get original file names if available, otherwise derive from URL
          const modelFileName = modelImage.file?.name || getFilenameFromUrl(modelImage.url);
          const garmentFileName = garmentImage.file?.name || getFilenameFromUrl(garmentImage.url);
          
          const savedData = await saveResultToGallery(
            user.id,
            resultImageUrl,
            modelFile,
            garmentFile,
            category,
            isTemplate,
            modelFileName,
            garmentFileName
          )
          
          if (savedData && savedData.galleryUrl) {
            toast.success("Result saved to gallery successfully!")
          }
        } catch (error: any) {
          console.error("Error saving to gallery:", error)
          
          // Check if it's a bucket not found error
          if (error.message && error.message.includes('Bucket not found')) {
            toast.error("Storage buckets not found. Please create 'gallery', 'models', and 'products' buckets in Supabase.")
          } else {
            toast.error("Failed to save to gallery")
          }
        } finally {
          setIsSaving(false)
        }
      }
    } catch (error) {
      console.error("Error generating try-on:", error)
      toast.error("Failed to generate try-on image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateAIModel = async (prompt: string): Promise<string> => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      throw new Error("Prompt is required");
    }
    
    setIsGeneratingAI(true);
    
    try {
      const response = await fetch('/api/generate-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.base64Image) {
        throw new Error('No image generated');
      }
      
      toast.success("AI model generated successfully!");
      return data.base64Image;
    } catch (error) {
      console.error("Error generating AI model:", error);
      toast.error("Failed to generate AI model");
      throw error;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleModelSelect = (modelUrl: string) => {
    setModelImage({ url: modelUrl, file: null })
  }

  const handleGarmentSelect = (productUrl: string, productCategory: Category) => {
    console.log(`Garment selected: ${productUrl}, category: ${productCategory}`);
    
    // Set the garment image
    setGarmentImage({ url: productUrl, file: null });
    
    // Always set the category when a garment is selected from the popup
    setCategory(productCategory);
    
    // Show success message
    toast.success(`Garment selected: ${productCategory}`);
  }

  const handleModelUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setModelImage({ url: result, file })
      toast.success("Model image uploaded")
    }
    reader.readAsDataURL(file)
  }

  const handleGarmentUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setGarmentImage({ url: result, file })
      toast.success("Garment image uploaded")
    }
    reader.readAsDataURL(file)
  }

  // Add a new function to handle template selection
  const handleTemplateSelect = (template: typeof templates[0]) => {
    // Set the model image
    setModelImage({ 
      url: template.model, 
      file: null 
    });
    
    // Set the garment image
    setGarmentImage({ 
      url: template.garment, 
      file: null 
    });
    
    // Set the category
    setCategory(template.category as Category);
    
    // Log that we're using a template
    console.log('Template selected:', {
      model: template.modelName,
      garment: template.garmentName,
      category: template.category
    });
    
    toast.success('Template applied successfully');
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Heading level={1}>Studio</Heading>
        <Link href="#" className="text-blue-500 hover:underline flex items-center">
          <span>Watch 2-Minute Tutorial</span>
        </Link>
      </div>

      <Card variant="default" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {/* First Row */}
          {/* Model Upload Section */}
          <div className="flex flex-col">
            <div className="flex-1">
              <ImageUploadBox
                type="model"
                image={modelImage}
                onDrop={(e) => handleDrop(e, 'model')}
                onPaste={(e) => handlePaste(e, 'model')}
                onUrlInput={(url) => handleUrlInput(url, 'model')}
                title="Select Model"
                onInfoClick={() => setModelInfoOpen(true)}
                onFileSelect={(file) => handleFileSelect(file, 'model')}
                onRemove={() => handleRemove('model')}
                onShowModelSelection={() => setShowModelSelection(true)}
                onShowAIModal={() => setShowAIModal(true)}
              />
            </div>
          </div>

          {/* Garment Upload Section */}
          <div className="flex flex-col">
            <ImageUploadBox
              type="garment"
              image={garmentImage}
              onDrop={(e) => handleDrop(e, 'garment')}
              onPaste={(e) => handlePaste(e, 'garment')}
              onUrlInput={(url) => handleUrlInput(url, 'garment')}
              title="Select Garment"
              onInfoClick={() => setGarmentInfoOpen(true)}
              onFileSelect={(file) => handleFileSelect(file, 'garment')}
              onRemove={() => handleRemove('garment')}
              onShowProductSelection={() => setShowProductSelection(true)}
            />
            
            <div className="px-4 mb-4">
              <Text color="light" className="mb-2">Category</Text>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'top', icon: <span className="text-blue-500">👕</span>, label: 'Top' },
                  { id: 'bottom', icon: <span className="text-blue-500">👖</span>, label: 'Bottom' },
                  { id: 'full-body', icon: <span className="text-blue-500">👗</span>, label: 'Full-body' },
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    variant={category === cat.id ? "primary" : "secondary"}
                    className={`flex items-center justify-center gap-2 px-3 py-2 ${
                      category === cat.id ? 'ring-2 ring-blue-500 shadow-md' : ''
                    }`}
                    size="sm"
                    onClick={() => {
                      setCategory(cat.id as typeof category);
                      toast.success(`Category set to: ${cat.label}`);
                      console.log(`Category changed to: ${cat.id}`);
                    }}
                  >
                    {cat.icon}
                    <span className="font-medium">{cat.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="flex flex-col">
            <div className="p-4">
              <Heading level={3} className="mb-4">Result</Heading>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[300px] h-[300px] flex flex-col items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <Text>Processing...</Text>
                  </div>
                ) : resultImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-w-[250px] max-h-[250px]">
                      <Image
                        src={resultImage}
                        alt="Result"
                        className="object-contain"
                        fill
                        sizes="250px"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Text color="light">
                      Your result will appear here
                    </Text>
                  </div>
                )}
              </div>
              
              {/* Quality Options */}
              <div className="flex justify-center gap-2 mt-4 max-w-full mx-auto">
                {[
                  { id: 'performance', icon: <BoltIcon className="w-5 h-5" />, label: 'Performance' },
                  { id: 'balanced', icon: <ScaleIcon className="w-5 h-5" />, label: 'Balanced' },
                  { id: 'quality', icon: <StarIcon className="w-5 h-5" />, label: 'Quality' },
                ].map((q) => (
                  <Button
                    key={q.id}
                    variant={quality === q.id ? "primary" : "tertiary"}
                    size="sm"
                    className="flex items-center gap-2 px-3 py-2"
                    onClick={() => setQuality(q.id as typeof quality)}
                  >
                    {q.icon}
                    <span className="font-medium">{q.label}</span>
                  </Button>
                ))}
              </div>
              
              {/* Generate Button */}
              <div className="mt-4">
                {/* Category indicator */}
                <div className="mb-2 text-center bg-blue-50 py-2 px-3 rounded-md border border-blue-200">
                  <Text className="font-medium">
                    Selected Category: <span className="text-blue-600 font-bold">{category === 'top' ? 'Top' : category === 'bottom' ? 'Bottom' : 'Full-body'}</span>
                  </Text>
                  {category === 'top' && (
                    <Text className="text-sm text-gray-600 mt-1">
                      Best for shirts, t-shirts, and upper garments
                    </Text>
                  )}
                  {category === 'bottom' && (
                    <Text className="text-sm text-gray-600 mt-1">
                      Best for pants, skirts, and lower garments
                    </Text>
                  )}
                  {category === 'full-body' && (
                    <Text className="text-sm text-gray-600 mt-1">
                      Best for dresses & complete outfits
                    </Text>
                  )}
                </div>
                
                <Button 
                  variant="gradient"
                  fullWidth
                  onClick={handleGenerate}
                  disabled={isLoading || isSaving || !modelImage.url || !garmentImage.url}
                  className="flex items-center justify-center gap-2 text-lg font-bold py-3"
                >
                  <SparklesIcon className="w-6 h-6" />
                  {isLoading ? 'Generating...' : isSaving ? 'Saving...' : 'Generate'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-6">
        <Heading level={2} className="mb-3">Templates</Heading>
        <Text className="mb-4">
          Start with these templates to quickly explore virtual try-on options.
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <Card key={index} className="p-4">
              <div className="flex flex-col mb-3">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Text color="light" className="mb-1">Model</Text>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={template.model}
                        alt="Model"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.log(`Model image load error: ${template.model}`);
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = 'https://via.placeholder.com/300x300?text=Model+Not+Available';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text color="light" className="mb-1">Garment</Text>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={template.garment}
                        alt="Garment"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.log(`Garment image load error: ${template.garment}`);
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = 'https://via.placeholder.com/300x300?text=Garment+Not+Available';
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-1">
                  <Text color="light" className="mb-1">Category</Text>
                  <Badge variant="default">
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="secondary"
                fullWidth
                onClick={() => handleTemplateSelect(template)}
              >
                Try
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <InfoPopup
        isOpen={modelInfoOpen}
        onClose={() => setModelInfoOpen(false)}
        title="Model Requirements"
        imageUrl="/images/model_guide.jpg"
      />

      <InfoPopup
        isOpen={garmentInfoOpen}
        onClose={() => setGarmentInfoOpen(false)}
        title="Garment Requirements"
        imageUrl="/images/garment_guide.jpg"
      />

      <AIModelPopup
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateAIModel}
        onImageGenerated={(base64Image) => {
          setModelImage({ url: base64Image, file: null })
        }}
      />
      
      {/* Model ve Product seçim popup'ları */}
      <ModelSelectionPopup
        isOpen={showModelSelection}
        onClose={() => setShowModelSelection(false)}
        onSelectModel={handleModelSelect}
      />
      
      <ProductSelectionPopup
        isOpen={showProductSelection}
        onClose={() => setShowProductSelection(false)}
        onSelect={handleGarmentSelect}
      />
    </div>
  )
}