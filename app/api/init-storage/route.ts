import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    console.log('Init Storage - Supabase URL:', supabaseUrl);
    console.log('Init Storage - Using service role key');
    
    // Supabase istemcisini oluştur (service role key kullanarak)
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Oluşturulacak bucket'lar
    const buckets = ['models', 'products', 'gallery']
    const results = []
    
    // Her bucket için
    for (const bucket of buckets) {
      try {
        // Bucket'ı oluştur veya güncelle
        const { data, error } = await supabase
          .storage
          .createBucket(bucket, {
            public: true,
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
          })
        
        if (error) {
          // Bucket zaten varsa, güncelle
          if (error.message.includes('already exists')) {
            const { error: updateError } = await supabase
              .storage
              .updateBucket(bucket, {
                public: true,
                fileSizeLimit: 52428800, // 50MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
              })
            
            if (updateError) {
              throw updateError
            }
            
            results.push({
              bucket,
              status: 'updated to public'
            })
          } else {
            throw error
          }
        } else {
          results.push({
            bucket,
            status: 'created',
            data
          })
        }
      } catch (bucketError: any) {
        results.push({
          bucket,
          status: 'error',
          error: bucketError.message
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      results
    })
  } catch (error: any) {
    console.error('Error initializing storage:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 