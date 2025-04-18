import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket') || 'products'
    
    console.log(`Making bucket public: ${bucket}`)
    
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Mjk1NTksImV4cCI6MjA1NjAwNTU1OX0.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur
    const supabase = createClient(supabaseUrl, supabaseKey)
    
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
        const { error: createError } = await supabase.storage.createBucket(bucket, {
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
      } else {
        // Bucket varsa güncelle
        const { error: updateError } = await supabase.storage.updateBucket(bucket, {
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
      }
      
      // Bucket'ı public yap - getPublicUrl artık sadece data döndürür, error döndürmez
      try {
        const { data } = await supabase.storage.from(bucket).getPublicUrl('dummy.txt')
        
        return NextResponse.json({
          success: true,
          message: `Bucket ${bucket} made public successfully`,
          bucket,
          publicUrl: data.publicUrl
        })
      } catch (publicUrlError: any) {
        console.error('Error making bucket public:', publicUrlError)
        return NextResponse.json({
          success: false,
          error: publicUrlError.message || 'Failed to get public URL',
          bucket
        }, { status: 500 })
      }
    } catch (error: any) {
      console.error('Error making bucket public:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to make bucket public',
        bucket
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in public-bucket API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 