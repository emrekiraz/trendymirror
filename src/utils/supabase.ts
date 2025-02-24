import { createClient } from '@supabase/supabase-js'

// Supabase istemcisini oluşturalım
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket'ları için sabitler
export const STORAGE_BUCKETS = {
  MODELS: 'model-images',
  GARMENTS: 'garment-images',
  RESULTS: 'result-images'
} as const 