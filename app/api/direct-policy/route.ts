import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bucket = searchParams.get('bucket') || 'products'
    
    console.log(`Setting up direct policies for bucket: ${bucket}`)
    
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    // Supabase istemcisini oluştur (service role key kullanarak)
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
      }
      
      // Doğrudan SQL ile politikaları ayarla
      const sql = `
        -- Enable RLS on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies for this bucket if they exist
        DROP POLICY IF EXISTS "Allow public read for ${bucket}" ON storage.objects;
        DROP POLICY IF EXISTS "Allow public insert for ${bucket}" ON storage.objects;
        DROP POLICY IF EXISTS "Allow public update for ${bucket}" ON storage.objects;
        DROP POLICY IF EXISTS "Allow public delete for ${bucket}" ON storage.objects;
        
        -- Create policies for the specified bucket
        CREATE POLICY "Allow public read for ${bucket}"
          ON storage.objects FOR SELECT
          USING (bucket_id = '${bucket}');
          
        CREATE POLICY "Allow public insert for ${bucket}"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = '${bucket}');
          
        CREATE POLICY "Allow public update for ${bucket}"
          ON storage.objects FOR UPDATE
          USING (bucket_id = '${bucket}');
          
        CREATE POLICY "Allow public delete for ${bucket}"
          ON storage.objects FOR DELETE
          USING (bucket_id = '${bucket}');
      `;
      
      // Try to execute SQL with RPC if available
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        
        if (error) {
          console.error('Error executing SQL via RPC:', error);
          throw error;
        }
      } catch (sqlError) {
        console.warn('Failed to execute SQL via RPC, trying alternative method:', sqlError);
        
        // Alternative method - this is a fallback and might not work depending on Supabase setup
        const { error: directError } = await supabase.from('_exec_sql').insert({
          query: sql
        });
        
        if (directError) {
          console.error('Error with alternative SQL execution:', directError);
          return NextResponse.json({
            success: false,
            error: directError.message,
            bucket
          }, { status: 500 });
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Policies for bucket ${bucket} set up successfully`,
        bucket
      });
    } catch (error: any) {
      console.error('Error setting up policies:', error)
      return NextResponse.json({
        success: false,
        error: error.message || 'Failed to set up policies',
        bucket
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in direct-policy API:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
} 