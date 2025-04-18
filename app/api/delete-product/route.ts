import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: Request) {
  try {
    // Parse the request body
    const { fileName } = await request.json()
    
    if (!fileName) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: fileName'
      }, { status: 400 })
    }
    
    console.log(`Deleting product: ${fileName}`)
    
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur (service role key kullanarak)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    try {
      // First check if the file exists
      const { data, error: listError } = await supabase
        .storage
        .from('products')
        .list('', {
          search: fileName
        })
      
      if (listError) {
        console.error('Error checking if file exists:', listError)
        return NextResponse.json({
          success: false,
          error: listError.message
        }, { status: 500 })
      }
      
      const fileExists = data.some(file => file.name === fileName)
      
      if (!fileExists) {
        console.warn(`File ${fileName} not found in products bucket`)
        return NextResponse.json({
          success: false,
          error: 'File not found',
          notFound: true
        }, { status: 404 })
      }
      
      // Delete the file
      const { error: deleteError } = await supabase
        .storage
        .from('products')
        .remove([fileName])
      
      if (deleteError) {
        console.error('Error deleting file:', deleteError)
        return NextResponse.json({
          success: false,
          error: deleteError.message
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error: any) {
      console.error('Error deleting product:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to delete product'
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in delete-product API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 