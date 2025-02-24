import { supabase, STORAGE_BUCKETS } from './supabase'

export async function setupSupabaseStorage() {
  try {
    // Model görselleri için bucket oluştur
    const { data: modelBucket, error: modelError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.MODELS, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })
    
    if (modelError && modelError.message !== 'Bucket already exists') {
      console.error('Model bucket oluşturma hatası:', modelError)
    }

    // Kıyafet görselleri için bucket oluştur
    const { data: garmentBucket, error: garmentError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.GARMENTS, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })
    
    if (garmentError && garmentError.message !== 'Bucket already exists') {
      console.error('Garment bucket oluşturma hatası:', garmentError)
    }

    // Sonuç görselleri için bucket oluştur
    const { data: resultBucket, error: resultError } = await supabase
      .storage
      .createBucket(STORAGE_BUCKETS.RESULTS, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })
    
    if (resultError && resultError.message !== 'Bucket already exists') {
      console.error('Result bucket oluşturma hatası:', resultError)
    }

    console.log('Storage buckets başarıyla oluşturuldu')
  } catch (error) {
    console.error('Storage setup hatası:', error)
  }
} 