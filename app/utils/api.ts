import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/app/lib/supabase'

// API anahtarını doğrudan kullanalım
const FAL_API_KEY = process.env.FAL_KEY

export class TryOnError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'TryOnError'
  }
}

interface ErrorResponse {
  error?: string
  message?: string
  detail?: string
}

async function compressAndConvertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Maksimum boyutlar
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800

        let width = img.width
        let height = img.height

        // En boy oranını koru
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        // Görüntüyü çiz ve sıkıştır
        ctx?.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7) // 0.7 kalite
        resolve(compressedBase64)
      } catch (error) {
        reject(new Error('Görsel sıkıştırma başarısız oldu'))
      }
    }

    img.onerror = () => {
      reject(new Error('Görsel yüklenemedi'))
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      reject(new Error('Dosya okunamadı'))
    }
    reader.readAsDataURL(file)
  })
}

export async function tryOnClothing(
  modelImage: File,
  garmentImage: File,
  category: 'top' | 'bottom' | 'full-body'
): Promise<{ image: string }> {
  try {
    console.log('Try-on işlemi başlatılıyor...')

    // Dosya boyutu kontrolü (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (modelImage.size > maxSize || garmentImage.size > maxSize) {
      throw new TryOnError(
        'Görsel boyutu çok büyük. Lütfen 10MB\'dan küçük görseller kullanın.',
        'FILE_TOO_LARGE'
      )
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(modelImage.type) || !allowedTypes.includes(garmentImage.type)) {
      throw new TryOnError(
        'Desteklenmeyen görsel formatı. Lütfen JPEG, PNG veya WEBP formatında görseller kullanın.',
        'INVALID_FILE_TYPE'
      )
    }

    console.log('Görseller sıkıştırılıyor ve dönüştürülüyor...')
    // Görselleri sıkıştır ve base64'e çevir
    const [modelBase64, garmentBase64] = await Promise.all([
      compressAndConvertToBase64(modelImage),
      compressAndConvertToBase64(garmentImage)
    ])

    // Kategori dönüşümü
    const apiCategory = category === 'top' ? 'tops' : 
                       category === 'bottom' ? 'bottoms' : 
                       'one-pieces'
    
    // Determine if long_top should be true
    const isLongTop = category === 'full-body'

    console.log(`Category: ${category}, API Category: ${apiCategory}, Long Top: ${isLongTop}`)
    
    console.log('FAL.ai API\'ye istek gönderiliyor...')
    // FAL.ai API'ye istek gönder
    const response = await axios.post(
      'https://queue.fal.run/fashn/tryon',
      {
        model_image: modelBase64,
        garment_image: garmentBase64,
        category: apiCategory,
        garment_photo_type: 'auto',
        nsfw_filter: true,
        cover_feet: false,
        adjust_hands: false,
        restore_background: false,
        restore_clothes: true,
        long_top: isLongTop,
        guidance_scale: 2,
        timesteps: 50,
        seed: 42,
        num_samples: 1
      },
      {
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    )

    console.log('İlk API yanıtı alındı:', response.data)

    // İlk isteğin yanıtını kontrol et
    if (!response.data?.request_id || !response.data?.status_url) {
      throw new TryOnError(
        'API yanıtı geçerli bir request ID veya status URL içermiyor',
        'INVALID_RESPONSE'
      )
    }

    // İşlem durumunu kontrol et ve sonucu bekle
    const statusUrl = response.data.status_url
    let result = null
    let attempts = 0
    const maxAttempts = 30 // 30 deneme (toplam yaklaşık 5 dakika)
    let waitTime = 2000 // Başlangıç bekleme süresi: 2 saniye

    console.log('İşlem durumu kontrol ediliyor...')
    while (attempts < maxAttempts) {
      try {
        const statusResponse = await axios.get(statusUrl, {
          headers: {
            'Authorization': `Key ${FAL_API_KEY}`,
          }
        })

        console.log('Status kontrolü:', statusResponse.data)

        if (statusResponse.data?.status === 'COMPLETED') {
          if (statusResponse.data?.images?.[0]?.url) {
            result = statusResponse.data.images[0].url
            break
          } else if (statusResponse.data?.response_url) {
            // Eğer images array'i yoksa response_url'i kontrol et
            const resultResponse = await axios.get(statusResponse.data.response_url, {
              headers: {
                'Authorization': `Key ${FAL_API_KEY}`,
              }
            })
            if (resultResponse.data?.images?.[0]?.url) {
              result = resultResponse.data.images[0].url
              break
            } else {
              throw new TryOnError(
                'Sonuç görseli bulunamadı',
                'NO_RESULT_IMAGE'
              )
            }
          } else {
            throw new TryOnError(
              'Sonuç URL\'i bulunamadı',
              'NO_RESULT_URL'
            )
          }
        } else if (statusResponse.data?.status === 'FAILED') {
          throw new TryOnError(
            'İşlem başarısız oldu: ' + (statusResponse.data?.error || 'Bilinmeyen hata'),
            'PROCESSING_FAILED'
          )
        } else if (statusResponse.data?.status === 'IN_PROGRESS' || statusResponse.data?.status === 'PENDING' || statusResponse.data?.status === 'IN_QUEUE') {
          // İşlem devam ediyor, exponential backoff ile bekle
          await new Promise(resolve => setTimeout(resolve, waitTime))
          attempts++
          
          // Bekleme süresini artır (max 10 saniye)
          waitTime = Math.min(waitTime * 1.5, 10000)
          continue
        }

        // Beklenmeyen durum
        throw new TryOnError(
          'Beklenmeyen API yanıtı: ' + JSON.stringify(statusResponse.data),
          'UNEXPECTED_RESPONSE'
        )
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Status kontrolü sırasında hata:', error.response?.data)
          if (error.response?.status === 404) {
            // Request ID henüz hazır değil, exponential backoff ile bekle
            await new Promise(resolve => setTimeout(resolve, waitTime))
            attempts++
            // Bekleme süresini artır (max 10 saniye)
            waitTime = Math.min(waitTime * 1.5, 10000)
            continue
          }
        }
        throw error
      }
    }

    if (!result) {
      throw new TryOnError(
        'İşlem zaman aşımına uğradı',
        'TIMEOUT'
      )
    }

    // Doğrudan sonuç URL'ini döndür
    return { image: result }

  } catch (error) {
    console.error('tryOnClothing fonksiyonunda hata:', error)
    
    if (error instanceof TryOnError) {
      throw error
    }
    
    if (axios.isAxiosError(error)) {
      const response = error.response?.data as ErrorResponse
      console.error('Axios hatası detayları:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      })
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new TryOnError(
          'API anahtarı geçersiz veya süresi dolmuş.',
          'AUTH_ERROR',
          error.response.data
        )
      }
      
      if (error.response?.status === 429) {
        throw new TryOnError(
          'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
          'RATE_LIMIT',
          error.response.data
        )
      }

      if (response?.error || response?.message || response?.detail) {
        throw new TryOnError(
          String(response.error || response.message || response.detail),
          'API_ERROR',
          response
        )
      }

      throw new TryOnError(
        'API isteği başarısız oldu: ' + error.message,
        'REQUEST_FAILED',
        error.response?.data
      )
    }
    
    throw new TryOnError(
      'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
      'UNKNOWN_ERROR',
      error
    )
  }
}

export async function generateAIModel(prompt: string): Promise<string> {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} of ${maxRetries} to generate AI model with prompt: ${prompt}`);
      
      // Use absolute URL with origin to ensure correct path
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      
      console.log(`Making request to: ${baseUrl}/api/generate-model`);
      
      const response = await fetch(`${baseUrl}/api/generate-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log(`Response status: ${response.status}`);
      const data = await response.json();
      console.log(`Response data:`, data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (!data.base64Image) {
        throw new Error('No base64 image received from the API');
      }

      return data.base64Image;
    } catch (error: any) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}