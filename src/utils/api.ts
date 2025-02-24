import axios from 'axios'
import { supabase, STORAGE_BUCKETS } from './supabase'
import { v4 as uuidv4 } from 'uuid'

// API anahtarını doğrudan kullanalım
const FAL_API_KEY = 'c68c763c-72d4-414e-9d1e-00b9a6461b1f:983b512b0835d3ce1c2805a1c411172d'

interface ErrorResponse {
  error?: string;
  message?: string;
  detail?: string;
}

export class TryOnError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TryOnError';
  }
}

async function compressImage(file: File, maxWidth: number = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // En boy oranını koru
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new TryOnError('Canvas context oluşturulamadı.', 'CANVAS_ERROR'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      // JPEG formatında sıkıştır (0.8 kalite)
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new TryOnError('Görsel yüklenemedi.', 'IMAGE_LOAD_ERROR'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export async function tryOnClothing(
  modelImage: File,
  garmentImage: File,
  category: 'top' | 'bottom' | 'full-body'
): Promise<{ image: string }> {
  try {
    console.log('tryOnClothing başladı:', {
      modelImageSize: modelImage.size,
      modelImageType: modelImage.type,
      garmentImageSize: garmentImage.size,
      garmentImageType: garmentImage.type,
      category
    });

    // Dosya boyutu kontrolü (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (modelImage.size > maxSize || garmentImage.size > maxSize) {
      throw new TryOnError(
        'Görsel boyutu çok büyük. Lütfen 10MB\'dan küçük görseller kullanın.',
        'FILE_TOO_LARGE'
      );
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(modelImage.type) || !allowedTypes.includes(garmentImage.type)) {
      throw new TryOnError(
        'Desteklenmeyen görsel formatı. Lütfen JPEG, PNG veya WEBP formatında görseller kullanın.',
        'INVALID_FILE_TYPE'
      );
    }

    // Kullanıcı oturumunu kontrol et
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Oturum hatası:', sessionError);
      throw new TryOnError(
        'Oturum bilgisi alınamadı.',
        'AUTH_ERROR',
        sessionError
      );
    }

    if (!session) {
      throw new TryOnError(
        'Lütfen giriş yapın.',
        'AUTH_REQUIRED'
      );
    }

    console.log('Oturum kontrolü başarılı:', session.user.id);

    // Görselleri sıkıştır ve base64'e çevir
    console.log('Görseller sıkıştırılıyor ve base64\'e çevriliyor...');
    const [modelBase64, garmentBase64] = await Promise.all([
      compressImage(modelImage),
      compressImage(garmentImage)
    ]);
    console.log('Görseller sıkıştırıldı ve base64\'e çevrildi');

    // Try-on kaydı oluştur
    const { data: tryOn, error: tryOnError } = await supabase
      .from('try_ons')
      .insert({
        user_id: session.user.id,
        model_image_path: modelImage.name,
        garment_image_path: garmentImage.name,
        category: category,
        status: 'processing'
      })
      .select()
      .single()

    if (tryOnError) {
      console.error('Try-on kayıt hatası:', tryOnError);
      throw new TryOnError(
        'İşlem kaydı oluşturulamadı: ' + tryOnError.message,
        'DATABASE_ERROR',
        tryOnError
      );
    }

    console.log('Try-on kaydı oluşturuldu:', tryOn);

    // Kategori dönüşümü
    const apiCategory = category === 'top' ? 'tops' : 
                       category === 'bottom' ? 'bottoms' : 
                       'one-pieces'

    // FAL.ai API'ye istek gönder
    console.log('FAL.ai API isteği gönderiliyor...');

    const queueResponse = await axios.post(
      'https://queue.fal.run/fashn/tryon',
      {
        model_image: `data:image/jpeg;base64,${modelBase64}`,
        garment_image: `data:image/jpeg;base64,${garmentBase64}`,
        category: apiCategory,
        num_samples: 1,
        guidance_scale: 2.0,
        timesteps: 50
      },
      {
        headers: {
          'Authorization': `Key ${FAL_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        maxBodyLength: Infinity,
        validateStatus: function (status) {
          return status < 500;
        }
      }
    )

    console.log('FAL.ai API yanıtı:', queueResponse.data);

    if (queueResponse.status !== 200) {
      // Try-on kaydını güncelle
      await supabase
        .from('try_ons')
        .update({
          status: 'failed',
          error_message: queueResponse.data?.error || queueResponse.statusText
        })
        .eq('id', tryOn.id);

      throw new TryOnError(
        `API hatası: ${queueResponse.data?.error || queueResponse.statusText}`,
        'API_ERROR',
        {
          status: queueResponse.status,
          data: queueResponse.data
        }
      );
    }

    if (!queueResponse.data || !queueResponse.data.request_id) {
      // Try-on kaydını güncelle
      await supabase
        .from('try_ons')
        .update({
          status: 'failed',
          error_message: 'Geçersiz API yanıtı'
        })
        .eq('id', tryOn.id);

      throw new TryOnError(
        'API yanıtı geçerli bir request ID içermiyor',
        'INVALID_RESPONSE',
        queueResponse.data
      );
    }

    const requestId = queueResponse.data.request_id
    let retryCount = 0;
    const maxRetries = 30;

    while (retryCount < maxRetries) {
      const statusResponse = await axios.get(
        `https://queue.fal.run/fashn/tryon/requests/${requestId}/status`,
        {
          headers: {
            'Authorization': `Key ${FAL_API_KEY}`
          }
        }
      )

      if (statusResponse.data.status === 'COMPLETED') {
        const resultResponse = await axios.get(
          `https://queue.fal.run/fashn/tryon/requests/${requestId}`,
          {
            headers: {
              'Authorization': `Key ${FAL_API_KEY}`
            }
          }
        )

        if (!resultResponse.data.images || !resultResponse.data.images[0]?.url) {
          throw new TryOnError(
            'API yanıtı geçerli bir görsel içermiyor',
            'NO_IMAGE_RESULT'
          );
        }

        // Sonuç görselini indir
        const resultImageResponse = await axios.get(resultResponse.data.images[0].url, {
          responseType: 'blob'
        })

        const resultFileName = `${uuidv4()}.png`
        
        // Sonuç görselini Supabase'e yükle
        const { data: resultUpload, error: resultError } = await supabase.storage
          .from(STORAGE_BUCKETS.RESULTS)
          .upload(resultFileName, resultImageResponse.data)

        if (resultError) {
          throw new TryOnError(
            'Sonuç görseli yüklenemedi.',
            'UPLOAD_ERROR',
            resultError
          );
        }

        // Try-on kaydını güncelle
        const { error: updateError } = await supabase
          .from('try_ons')
          .update({
            result_image_path: resultUpload.path,
            status: 'completed'
          })
          .eq('id', tryOn.id)

        if (updateError) {
          throw new TryOnError(
            'İşlem kaydı güncellenemedi.',
            'DATABASE_ERROR',
            updateError
          );
        }

        // Sonuç görselinin public URL'ini al
        const { data: resultUrl } = supabase.storage
          .from(STORAGE_BUCKETS.RESULTS)
          .getPublicUrl(resultFileName)

        return {
          image: resultUrl.publicUrl
        }
      } else if (statusResponse.data.status === 'IN_QUEUE' || statusResponse.data.status === 'IN_PROGRESS') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        retryCount++;
      } else {
        // Try-on kaydını hata durumuna güncelle
        await supabase
          .from('try_ons')
          .update({
            status: 'failed',
            error_message: `İşlem başarısız oldu: ${statusResponse.data.status}`
          })
          .eq('id', tryOn.id)

        throw new TryOnError(
          'İşlem başarısız oldu: ' + statusResponse.data.status,
          'PROCESS_FAILED',
          statusResponse.data
        );
      }
    }

    // Zaman aşımı durumunda try-on kaydını güncelle
    await supabase
      .from('try_ons')
      .update({
        status: 'failed',
        error_message: 'İşlem zaman aşımına uğradı'
      })
      .eq('id', tryOn.id)

    throw new TryOnError(
      'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.',
      'TIMEOUT'
    );

  } catch (error: unknown) {
    console.error('tryOnClothing fonksiyonunda detaylı hata:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      details: error instanceof TryOnError ? error.details : undefined
    });
    
    if (error instanceof TryOnError) {
      throw error;
    }
    
    if (axios.isAxiosError(error)) {
      console.error('Axios hatası detayları:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers
        }
      });

      const response = error.response?.data as ErrorResponse;
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new TryOnError(
          'API anahtarı geçersiz veya süresi dolmuş.',
          'AUTH_ERROR',
          {
            status: error.response.status,
            data: error.response.data
          }
        );
      }
      
      if (error.response?.status === 429) {
        throw new TryOnError(
          'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.',
          'RATE_LIMIT',
          {
            status: error.response.status,
            data: error.response.data
          }
        );
      }

      if (error.response?.status === 400) {
        throw new TryOnError(
          'API isteği geçersiz: ' + (response?.error || response?.message || response?.detail || error.response.statusText),
          'INVALID_REQUEST',
          {
            status: error.response.status,
            data: error.response.data,
            request: {
              url: error.config?.url,
              data: error.config?.data
            }
          }
        );
      }

      if (response?.error || response?.message || response?.detail) {
        throw new TryOnError(
          String(response.error || response.message || response.detail || 'API hatası'),
          'API_ERROR',
          {
            status: error.response?.status,
            data: response
          }
        );
      }

      if (error.request) {
        throw new TryOnError(
          'API servisine bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.',
          'NETWORK_ERROR',
          {
            request: error.request,
            message: error.message
          }
        );
      }
    }
    
    throw new TryOnError(
      error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
      'UNKNOWN_ERROR',
      {
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    );
  }
} 