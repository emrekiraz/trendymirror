import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client'ı oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Mjk1NTksImV4cCI6MjA1NjAwNTU1OX0.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    // URL parametrelerini al
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket') || 'products'
    const name = searchParams.get('name')
    
    if (!name) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 })
    }
    
    console.log(`Fetching image from bucket: ${bucket}, name: ${name}`)
    
    // İlk olarak signed URL ile deneyelim
    try {
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from(bucket)
        .createSignedUrl(name, 60) // 60 saniyelik geçerli URL
      
      if (!signedError && signedData?.signedUrl) {
        console.log(`Using signed URL: ${signedData.signedUrl}`)
        
        // Signed URL'yi yönlendir
        return NextResponse.redirect(signedData.signedUrl)
      }
    } catch (signedError) {
      console.error('Error creating signed URL:', signedError)
    }
    
    // Signed URL başarısız olursa, dosyayı doğrudan indirmeyi dene
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .download(name)
      
      if (error) {
        throw error
      }
      
      if (!data) {
        throw new Error('File not found')
      }
      
      // Dosya türüne göre content-type belirleme
      let contentType = 'application/octet-stream'
      if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
        contentType = 'image/jpeg'
      } else if (name.endsWith('.png')) {
        contentType = 'image/png'
      } else if (name.endsWith('.gif')) {
        contentType = 'image/gif'
      }
      
      // Dosyayı base64'e çevirme ve yanıt döndürme
      const bytes = await data.arrayBuffer()
      
      return new NextResponse(bytes, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (downloadError) {
      console.error('Error downloading file:', downloadError)
      
      // Son çare olarak public URL'yi dene ve yönlendir
      const { data: publicUrlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(name)
      
      return NextResponse.redirect(publicUrlData.publicUrl)
    }
  } catch (error: any) {
    console.error('Error in image-proxy:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 