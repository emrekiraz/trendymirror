#!/usr/bin/env node

/**
 * Bu script, hazır modelleri Supabase'e yükler.
 * Kullanım: node scripts/upload-default-models.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// .env dosyasını yükle
dotenv.config({ path: '.env.local' });

// Supabase client oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Mevcut' : 'Bulunamadı');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL veya Key bulunamadı. .env.local dosyanızı kontrol edin.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Modellerin bulunduğu klasör
const DEFAULT_MODELS_DIR = path.join(process.cwd(), 'public', 'default-models');

async function uploadDefaultModels() {
  console.log('Hazır modeller yükleniyor...');
  
  try {
    // Klasörün var olup olmadığını kontrol et
    if (!fs.existsSync(DEFAULT_MODELS_DIR)) {
      console.error(`Klasör bulunamadı: ${DEFAULT_MODELS_DIR}`);
      return;
    }
    
    // Klasördeki tüm dosyaları oku
    const files = fs.readdirSync(DEFAULT_MODELS_DIR);
    
    // Sadece resim dosyalarını filtrele
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('Yüklenecek resim dosyası bulunamadı.');
      return;
    }
    
    console.log(`${imageFiles.length} adet resim dosyası bulundu.`);
    
    // Her dosyayı yükle
    for (const file of imageFiles) {
      const filePath = path.join(DEFAULT_MODELS_DIR, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`Yükleniyor: ${file}`);
      
      try {
        // Supabase'e yükle
        const { data, error } = await supabase.storage
          .from('models')
          .upload(`default/${file}`, fileBuffer, {
            upsert: true,
            contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
            cacheControl: '3600',
            metadata: {
              source: 'TrendyMirror',
              isDefault: 'true',
            }
          });
        
        if (error) {
          console.error(`Yükleme hatası (${file}):`, error);
        } else {
          console.log(`Başarıyla yüklendi: ${file}`);
        }
      } catch (uploadError) {
        console.error(`Yükleme sırasında hata (${file}):`, uploadError);
      }
    }
    
    console.log('Hazır model yükleme işlemi tamamlandı.');
  } catch (error) {
    console.error('Hata:', error);
  }
}

// Script'i çalıştır
uploadDefaultModels()
  .then(() => {
    console.log('İşlem tamamlandı.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Beklenmeyen hata:', error);
    process.exit(1);
  }); 