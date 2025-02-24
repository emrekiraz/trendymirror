# TrendyMirror - Virtual Try-On Platform

TrendyMirror, yapay zeka destekli bir sanal giysi deneme platformudur. Kullanıcılar, kendi fotoğrafları üzerinde seçtikleri kıyafetleri gerçekçi bir şekilde deneyebilirler.

## Özellikler

- 🤖 FAL.ai API ile güçlendirilmiş AI görsel işleme
- 🔐 Güvenli kullanıcı kimlik doğrulama
- 💾 Supabase ile veri ve dosya depolama
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Responsive tasarım

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- FAL.ai API

## Geliştirme

### Gereksinimler

- Node.js 18.17 veya üzeri
- npm veya yarn
- Supabase hesabı
- FAL.ai API anahtarı

### Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/trendymirror.git
cd trendymirror
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.local` dosyasını oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FAL_API_KEY=your_fal_api_key
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Deployment

Bu proje Vercel üzerinde host edilmektedir. Main branch'e yapılan her push otomatik olarak production'a deploy edilir.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ftrendymirror)

## Ortam Değişkenleri

Deployment için gerekli ortam değişkenleri:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonim anahtar
- `NEXT_PUBLIC_FAL_API_KEY`: FAL.ai API anahtarı

## License

MIT 