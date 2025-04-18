import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Supabase client oluştur (service role key ile)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Key (ilk 10 karakter):', supabaseServiceKey.substring(0, 10) + '...');

// Service role key ile client oluştur (RLS bypass için)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

// Bucket'ın varlığını kontrol et, yoksa oluştur
async function ensureBucketExists(bucketName: string) {
  try {
    console.log(`Checking if bucket ${bucketName} exists...`);
    
    // Bucket'ları listele
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return false
    }
    
    console.log('Available buckets:', buckets);
    
    // Bucket var mı kontrol et
    const bucketExists = buckets.some(bucket => bucket.name === bucketName)
    
    if (!bucketExists) {
      console.log(`Bucket ${bucketName} does not exist, creating...`);
      
      // Bucket yoksa oluştur
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      })
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError)
        return false
      }
      
      console.log(`Bucket ${bucketName} created successfully`)
    } else {
      console.log(`Bucket ${bucketName} already exists`)
    }
    
    return true
  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
    return false
  }
}

// GET: Ürünleri getir
export async function GET(request: NextRequest) {
  console.log('GET /api/products - Fetching products')
  
  try {
    // Bucket'ları doğrudan listele
    console.log('Listing buckets directly...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    console.log('Buckets:', JSON.stringify(buckets));
    console.log('List error:', listError);
    
    // Bucket'lar boş veya hata varsa, örnek ürünleri döndür
    if (listError || !buckets || buckets.length === 0) {
      console.log('No buckets found or error occurred, returning empty products array');
      return NextResponse.json({
        success: true,
        products: []
      });
    }
    
    // Products bucket'ı var mı kontrol et
    const productsBucket = buckets.find(b => b.name === 'products');
    console.log('Products bucket found:', productsBucket);
    
    if (!productsBucket) {
      console.log('Products bucket not found, returning empty products array');
      return NextResponse.json({
        success: true,
        products: []
      });
    }
    
    // Try to directly check if a file exists
    console.log('Checking if we can access files directly...');
    
    // Try with a few common image extensions
    const testFileNames = [
      'test.jpg',
      'test.png',
      'test.jpeg',
      'top-test.jpg',
      'bottom-test.jpg',
      'full-body-test.jpg'
    ];
    
    for (const fileName of testFileNames) {
      console.log(`Checking if ${fileName} exists...`);
      const { data, error } = await supabase
        .storage
        .from('products')
        .download(fileName);
      
      if (error) {
        console.log(`Error downloading ${fileName}:`, error.message);
      } else {
        console.log(`Successfully downloaded ${fileName}!`);
      }
    }
    
    // Bucket'taki dosyaları listele
    console.log('Listing files in products bucket...');
    
    // Try listing with different folder paths
    console.log('Trying to list files with empty path...');
    const { data: filesEmptyPath, error: errorEmptyPath } = await supabase
      .storage
      .from('products')
      .list('', {
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    console.log('Files with empty path:', JSON.stringify(filesEmptyPath));
    console.log('Error with empty path:', errorEmptyPath);
    
    console.log('Trying to list files with root path...');
    const { data: filesRootPath, error: errorRootPath } = await supabase
      .storage
      .from('products')
      .list('/', {
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    console.log('Files with root path:', JSON.stringify(filesRootPath));
    console.log('Error with root path:', errorRootPath);
    
    // Use the files from empty path for processing
    const files = filesEmptyPath;
    const error = errorEmptyPath;
    
    if (error) {
      console.error('Error listing products:', error);
      return NextResponse.json({
        success: true,
        products: []
      });
    }
    
    if (!files || files.length === 0) {
      console.log('No files found in products bucket');
      return NextResponse.json({
        success: true,
        products: []
      });
    }
    
    // Dosyaları işle ve ürün verilerini oluştur
    console.log('Processing files to create product data...');
    const filteredFiles = files.filter(file => {
      // Klasörleri ve resim olmayan dosyaları filtrele
      if (file.id === null) {
        console.log(`Skipping file ${file.name} because id is null`);
        return false;
      }
      
      // Resim dosyası mı kontrol et
      const isImage = file.name.match(/\.(jpg|jpeg|png|gif)$/i);
      if (!isImage) {
        console.log(`Skipping file ${file.name} because it's not an image`);
        return false;
      }
      
      return true;
    });
    
    console.log('Filtered files:', JSON.stringify(filteredFiles));
    
    const products = await Promise.all(
      filteredFiles.map(async (file) => {
        try {
          console.log(`Processing file: ${file.name}`);
          
          // Dosya için public URL al
          const { data: urlData } = supabase
            .storage
            .from('products')
            .getPublicUrl(file.name);
          
          console.log(`Public URL for ${file.name}:`, urlData.publicUrl);
          
          // Dosya adından kategori belirle
          let category = 'top';
          if (file.name.includes('bottom')) {
            category = 'bottom';
          } else if (file.name.includes('full-body')) {
            category = 'full-body';
          }
          
          return {
            id: file.id || file.name,
            name: file.name,
            url: urlData.publicUrl,
            category,
            createdAt: file.created_at || new Date().toISOString()
          };
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          return null;
        }
      })
    );
    
    // null değerleri filtrele
    const validProducts = products.filter(product => product !== null);
    console.log('Valid products count:', validProducts.length);
    
    // Oluşturma tarihine göre sırala (en yeni önce)
    const sortedProducts = validProducts.sort((a, b) => {
      if (!a || !b) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log('Returning products:', JSON.stringify(sortedProducts));
    
    return NextResponse.json({
      success: true,
      products: sortedProducts
    });
  } catch (error: any) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      products: []
    });
  }
}

// POST: Yeni ürün yükle
export async function POST(request: NextRequest) {
  console.log('POST /api/products - Uploading new product')
  
  try {
    // Bucket'ın varlığını kontrol et
    const bucketExists = await ensureBucketExists('products')
    
    if (!bucketExists) {
      return NextResponse.json({
        success: false,
        error: 'Failed to ensure products bucket exists'
      }, { status: 500 })
    }
    
    // FormData'yı parse et
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const fileName = formData.get('fileName') as string
    
    if (!file || !category || !fileName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: file, category, or fileName'
      }, { status: 400 })
    }
    
    // Dosyayı ArrayBuffer'a dönüştür
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    
    // Dosyayı Supabase'e yükle
    const { data, error } = await supabase
      .storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })
    
    if (error) {
      console.error('Error uploading file to Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }
    
    // Yüklenen dosyanın public URL'ini al
    const { data: urlData } = supabase
      .storage
      .from('products')
      .getPublicUrl(fileName)
    
    return NextResponse.json({
      success: true,
      id: data?.path || uuidv4(),
      url: urlData.publicUrl,
      fileName: fileName
    })
  } catch (error: any) {
    console.error('Error in POST /api/products:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE: Ürün sil
export async function DELETE(request: NextRequest) {
  console.log('DELETE /api/products - Deleting product')
  
  try {
    // URL'den fileName parametresini al
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')
    
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: 'Missing fileName parameter'
      }, { status: 400 })
    }
    
    // Dosyayı Supabase'den sil
    const { error } = await supabase
      .storage
      .from('products')
      .remove([fileName])
    
    if (error) {
      console.error('Error deleting file from Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Product ${fileName} deleted successfully`
    })
  } catch (error: any) {
    console.error('Error in DELETE /api/products:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 