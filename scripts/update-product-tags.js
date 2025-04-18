import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import os from 'os'

// ES modules için çalışma dizinini ayarla
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// .env dosyasını yükle
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Supabase client oluştur - service_role anahtarı ile
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY // Dikkat: Service Role Key kullanılıyor!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL veya Service Role Key bulunamadı. .env.local dosyasını kontrol edin.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Güncellenmesi gereken dosyalar ve yeni kategorileri
const filesToUpdate = [
  { 
    path: 'default/red_dress.jpg', 
    category: 'full-body',
    description: 'Kırmızı elbise → Full-Body olarak güncellendi'
  },
  { 
    path: 'default/110000079539214.jpg', 
    category: 'top',
    description: 'Kuru kafalı tişört → Top olarak doğrulandı'
  },
  { 
    path: 'default/pc03uu9col002-1.jpg', 
    category: 'bottom',
    description: 'Beyaz şort (pc03uu9col002-1.jpg) → Bottom olarak güncellendi'
  }
]

// Dosyayı geçici olarak indirip, metadata ile birlikte tekrar yüklemek için
async function downloadFile(url, outputPath) {
  const response = await fetch(url)
  const buffer = await response.buffer()
  fs.writeFileSync(outputPath, buffer)
  return outputPath
}

async function updateProductTags() {
  console.log('Ürün etiketleri güncelleniyor... (Service Role Key ile)')
  
  for (const file of filesToUpdate) {
    try {
      // Dosyayı geçici olarak indir, metadata ile yeniden yükle yaklaşımını kullanacağız
      console.log(`İşlem başlatılıyor: ${file.path}`)
      
      // 1. Dosya public URL'ini al
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('products')
        .getPublicUrl(file.path)
      
      if (urlError) {
        console.error(`Public URL alınamadı - ${file.path}: ${urlError.message}`)
        continue
      }
      
      // 2. Dosyayı geçici dizine indir
      const tempPath = path.join(os.tmpdir(), path.basename(file.path))
      console.log(`Dosya indiriliyor: ${urlData.publicUrl}`)
      
      try {
        await downloadFile(urlData.publicUrl, tempPath)
        console.log(`Dosya indirildi: ${tempPath}`)
        
        // 3. Dosyayı metadata ile birlikte tekrar yükle (bu mevcut dosyayı üzerine yazacak)
        console.log(`Dosya metadata ile tekrar yükleniyor...`)
        
        // Dosya içeriğini oku
        const fileContent = fs.readFileSync(tempPath)
        
        // Şimdi dosyayı metadata ile birlikte geri yükle
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('products')
          .upload(file.path, fileContent, {
            upsert: true, // Mevcut dosyanın üzerine yaz
            contentType: 'image/jpeg',
            cacheControl: '3600',
            metadata: {
              category: file.category // İstediğimiz metadata
            }
          })
        
        if (uploadError) {
          console.error(`Dosya güncellenemedi - ${file.path}: ${uploadError.message}`)
        } else {
          console.log(`✅ ${file.description}`)
        }
        
        // 4. Geçici dosyayı temizle
        fs.unlinkSync(tempPath)
        
      } catch (downloadError) {
        console.error(`Dosya indirilemedi: ${downloadError.message}`)
      }
      
    } catch (error) {
      console.error(`Hata oluştu - ${file.path}: ${error.message}`)
    }
  }
  
  console.log('İşlem tamamlandı.')
}

// Scripti çalıştır
updateProductTags() 