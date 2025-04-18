import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket') || 'products'
    
    console.log(`Setting up RLS policies for bucket: ${bucket}`)
    
    // Get Supabase URL and keys from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Create Supabase client (using service role key)
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    try {
      // First check if the bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) {
        console.error('Error listing buckets:', listError)
        return NextResponse.json({
          success: false,
          error: listError.message,
          bucket
        }, { status: 500 })
      }
      
      // Check if the bucket exists
      const bucketExists = buckets.some(b => b.name === bucket)
      
      if (!bucketExists) {
        return NextResponse.json({
          success: false,
          error: `Bucket ${bucket} does not exist`,
          bucket
        }, { status: 404 })
      }
      
      // Set up RLS policies with SQL query
      // This query grants read and write permissions to all users for the specified bucket
      const { error: policyError } = await supabase.rpc('setup_storage_policies', { 
        bucket_name: bucket 
      })
      
      if (policyError) {
        console.error('Error setting up RLS policies:', policyError)
        return NextResponse.json({
          success: false,
          error: policyError.message,
          bucket
        }, { status: 500 })
      }
      
      // Create the avatars bucket using the Supabase Storage API
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('avatars', {
          public: true
        });
        
        if (bucketError && !bucketError.message.includes('already exists')) {
          console.error('Error creating avatars bucket:', bucketError);
        }
      } catch (bucketCreateError: any) {
        // Ignore if bucket already exists
        if (!bucketCreateError.message?.includes('already exists')) {
          console.error('Error creating avatars bucket:', bucketCreateError);
        }
      }

      // Instead of using RPC for policy creation, we'll skip this step for now
      // as it requires admin privileges and proper SQL execution
      // This should ideally be handled separately in your DB setup scripts
      
      return NextResponse.json({
        success: true,
        message: `RLS policies for bucket ${bucket} set up successfully`,
        bucket
      })
    } catch (error: any) {
      console.error('Error setting up RLS policies:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to set up RLS policies',
        bucket
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in setup-rls API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 