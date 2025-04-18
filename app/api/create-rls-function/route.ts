import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Supabase URL ve anahtarlarını environment variables'dan al
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pzdupryntrhecaveielk.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6ZHVwcnludHJoZWNhdmVpZWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDQyOTU1OSwiZXhwIjoyMDU2MDA1NTU5fQ.l5y_PDSlXAdenFm08tzLaM4eKNqq5K8fbjDOYNZf6MM'
    
    console.log('Creating RLS function in Supabase');
    
    // Supabase istemcisini oluştur (service role key kullanarak)
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // SQL sorgusu ile RLS fonksiyonunu oluştur
    const sql = `
      -- Drop the function if it already exists
      DROP FUNCTION IF EXISTS public.setup_storage_policies(text);
      
      -- Create the function
      CREATE OR REPLACE FUNCTION public.setup_storage_policies(bucket_name text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- Enable RLS on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies for this bucket if they exist
        DROP POLICY IF EXISTS "Allow public read for " || bucket_name ON storage.objects;
        DROP POLICY IF EXISTS "Allow public insert for " || bucket_name ON storage.objects;
        DROP POLICY IF EXISTS "Allow public update for " || bucket_name ON storage.objects;
        DROP POLICY IF EXISTS "Allow public delete for " || bucket_name ON storage.objects;
        
        -- Create policies for the specified bucket
        EXECUTE 'CREATE POLICY "Allow public read for ' || bucket_name || '"
          ON storage.objects FOR SELECT
          USING (bucket_id = ''' || bucket_name || ''')';
          
        EXECUTE 'CREATE POLICY "Allow public insert for ' || bucket_name || '"
          ON storage.objects FOR INSERT
          WITH CHECK (bucket_id = ''' || bucket_name || ''')';
          
        EXECUTE 'CREATE POLICY "Allow public update for ' || bucket_name || '"
          ON storage.objects FOR UPDATE
          USING (bucket_id = ''' || bucket_name || ''')';
          
        EXECUTE 'CREATE POLICY "Allow public delete for ' || bucket_name || '"
          ON storage.objects FOR DELETE
          USING (bucket_id = ''' || bucket_name || ''')';
      END;
      $$;
    `;
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Error creating RLS function:', error);
      
      // Try an alternative approach if the first one fails
      const { error: directError } = await supabase.from('_exec_sql').insert({
        query: sql
      });
      
      if (directError) {
        return NextResponse.json({
          success: false,
          error: directError.message
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'RLS function created successfully'
    });
  } catch (error: any) {
    console.error('Error creating RLS function:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 