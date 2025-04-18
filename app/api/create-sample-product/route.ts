import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    console.log('Creating sample product...')
    
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
          error: listError.message
        }, { status: 500 })
      }
      
      // products bucket var mı kontrol et
      const productsBucket = buckets.find(b => b.name === 'products')
      if (!productsBucket) {
        // Bucket yoksa oluştur
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
      
      // Sample product data
      const sampleProducts = [
        {
          id: uuidv4(),
          name: 'sample-top-1.jpg',
          category: 'top',
          url: '/templates/garment-1.jpg'
        },
        {
          id: uuidv4(),
          name: 'sample-bottom-1.jpg',
          category: 'bottom',
          url: '/images/sample-generation-1.jpg'
        },
        {
          id: uuidv4(),
          name: 'sample-full-body-1.jpg',
          category: 'full-body',
          url: '/images/sample-generation-2.jpg'
        }
      ]
      
      // Create a metadata file with sample products
      const metadataContent = JSON.stringify({
        products: sampleProducts,
        createdAt: new Date().toISOString()
      })
      
      // Upload metadata file to products bucket
      const { error: uploadError } = await supabase
        .storage
        .from('products')
        .upload('sample-products.json', metadataContent, {
          contentType: 'application/json',
          upsert: true
        })
      
      if (uploadError) {
        console.error('Error uploading sample products metadata:', uploadError)
        return NextResponse.json({
          success: false,
          error: uploadError.message
        }, { status: 500 })
      }
      
      // Get public URL for the metadata file
      const { data: urlData } = supabase
        .storage
        .from('products')
        .getPublicUrl('sample-products.json')
      
      return NextResponse.json({
        success: true,
        message: 'Sample products created successfully',
        metadataUrl: urlData.publicUrl,
        products: sampleProducts
      })
    } catch (error: any) {
      console.error('Error creating sample product:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to create sample product'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in create-sample-product API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 