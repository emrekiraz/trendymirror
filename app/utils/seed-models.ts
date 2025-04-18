import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase client oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ''; // Admin key kullanılmalı
const supabase = createClient(supabaseUrl, supabaseKey);

// Hazır modellerin bilgileri
const defaultModels = [
  {
    id: 'default-model-1',
    name: 'default-model-1.jpg',
    source: 'TrendyMirror',
    path: './public/default-models/model-1.jpg',
  },
  // Daha fazla model ekleyebilirsiniz
];

/**
 * Hazır modelleri Supabase'e yükler
 */
export async function seedDefaultModels() {
  console.log('Hazır modeller yükleniyor...');
  
  for (const model of defaultModels) {
    try {
      // Dosya var mı kontrol et
      if (!fs.existsSync(model.path)) {
        console.error(`Dosya bulunamadı: ${model.path}`);
        continue;
      }
      
      // Dosyayı oku
      const fileBuffer = fs.readFileSync(model.path);
      
      // Supabase'e yükle
      const { data, error } = await supabase.storage
        .from('models')
        .upload(`default/${model.name}`, fileBuffer, {
          upsert: true,
          contentType: 'image/jpeg',
          cacheControl: '3600',
          metadata: {
            source: model.source,
            isDefault: 'true',
          }
        });
      
      if (error) {
        throw error;
      }
      
      console.log(`Model yüklendi: ${model.name}`);
    } catch (error) {
      console.error(`Model yüklenirken hata oluştu (${model.name}):`, error);
    }
  }
  
  console.log('Hazır model yükleme işlemi tamamlandı.');
}

/**
 * Bu script'i doğrudan çalıştırmak için
 */
if (require.main === module) {
  seedDefaultModels()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Hata:', error);
      process.exit(1);
    });
} 