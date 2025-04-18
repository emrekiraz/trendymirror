import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket') || 'products'
    
    console.log(`Admin creating bucket: ${bucket}`)
    
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur (service role key kullanarak)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    try {
      // Bucket'ın var olup olmadığını kontrol et
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        return NextResponse.json({
          success: false,
          error: listError.message,
          bucket
        }, { status: 500 })
      }
      
      // Bucket var mı kontrol et
      const bucketExists = buckets.some(b => b.name === bucket)
      
      if (!bucketExists) {
        // Bucket yoksa oluştur
        const { data, error: createError } = await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        })
        
        if (createError) {
          console.error('Error creating bucket:', createError)
          return NextResponse.json({
            success: false,
            error: createError.message,
            bucket
          }, { status: 500 })
        }
        
        console.log('Bucket created:', data)
      } else {
        // Bucket varsa güncelle
        const { data, error: updateError } = await supabase.storage.updateBucket(bucket, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
        })
        
        if (updateError) {
          console.error('Error updating bucket:', updateError)
          return NextResponse.json({
            success: false,
            error: updateError.message,
            bucket
          }, { status: 500 })
        }
        
        console.log('Bucket updated:', data)
      }
      
      // Bucket'ı public yap
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl('test.txt')
      
      // Create a test file to verify bucket is working
      const testContent = 'This is a test file to verify the bucket is working.'
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload('test.txt', testContent, {
          contentType: 'text/plain',
          upsert: true
        })
      
      if (uploadError) {
        console.error('Error uploading test file:', uploadError)
        return NextResponse.json({
          success: false,
          error: uploadError.message,
          bucket
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        message: `Bucket ${bucket} created/updated successfully`,
        bucket,
        publicUrl: urlData.publicUrl
      })
    } catch (error: any) {
      console.error('Error creating/updating bucket:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to create/update bucket',
        bucket
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in admin-create-bucket API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 