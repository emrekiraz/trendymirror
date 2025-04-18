import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Supabase URL ve anahtarlarını doğrudan belirtelim
    const supabaseUrl = 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0Mjk1NTksImV4cCI6MjA1NjAwNTU1OX0.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Bucketları listele
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      supabaseUrl,
      supabaseAnonKeyFirstChars: supabaseAnonKey.substring(0, 10) + '...',
      buckets
    })
  } catch (error: any) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
} 