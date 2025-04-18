import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // Parse the multipart form data
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
    
    console.log(`Uploading product: ${fileName}, category: ${category}`)
    
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur (service role key kullanarak)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    try {
      // First ensure the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        return NextResponse.json({
          success: false,
          error: listError.message
        }, { status: 500 })
      }
      
      // Check if products bucket exists
      const productsBucket = buckets.find(b => b.name === 'products')
      if (!productsBucket) {
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket('products', {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        })
        
        if (createError) {
          console.error('Error creating products bucket:', createError)
          return NextResponse.json({
            success: false,
            error: createError.message
          }, { status: 500 })
        }
      }
      
      // Convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      
      // Upload the file to Supabase
      const { data, error: uploadError } = await supabase
        .storage
        .from('products')
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        })
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError)
        return NextResponse.json({
          success: false,
          error: uploadError.message
        }, { status: 500 })
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('products')
        .getPublicUrl(fileName)
      
      return NextResponse.json({
        success: true,
        message: 'Product uploaded successfully',
        path: data?.path,
        publicUrl: urlData.publicUrl
      })
    } catch (error: any) {
      console.error('Error uploading product:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to upload product'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in upload-product API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 