# TrendyMirror

TrendyMirror is a virtual try-on platform for fashion that allows users to see how clothing items would look on them using AI-powered technology.

## Features

- **Studio**: Try on different clothing items on models or your own photos
- **AI Model Generation**: Generate AI models based on text prompts
- **Models Gallery**: Upload and manage model images
- **Products Gallery**: Upload and manage clothing items
- **Results Gallery**: View and manage your virtual try-on results

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Notifications**: React Hot Toast
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Storage Buckets

The application requires the following Supabase storage buckets:
- `models`: For storing model images
- `products`: For storing clothing item images
- `gallery`: For storing try-on results

You can create these buckets manually in the Supabase dashboard or use the `/api/init-storage` endpoint to create them automatically.

## Usage

1. **Studio Page**: Upload or select a model and a garment, then click "Generate" to create a virtual try-on image
2. **Models Page**: Upload and manage model images
3. **Products Page**: Upload and manage clothing items with categories
4. **Gallery Page**: View and manage your virtual try-on results

## Hazır Modeller

TrendyMirror uygulaması, kullanıcıların kendi modellerini yüklemelerinin yanı sıra hazır modeller de sunmaktadır. Bu modeller, tüm kullanıcılar tarafından görüntülenebilir ve "TrendyMirror" etiketi ile işaretlenmiştir.

### Hazır Modelleri Yükleme

Hazır modelleri Supabase'e yüklemek için aşağıdaki adımları izleyin:

1. Hazır model resimlerini `public/default-models` klasörüne ekleyin.
2. Aşağıdaki komutu çalıştırın:

```bash
npm run upload-default-models
```

Bu komut, `public/default-models` klasöründeki tüm resimleri Supabase Storage'a yükleyecektir. Yüklenen modeller, Supabase'de `models/default/` dizini altında saklanacaktır.

### Hazır Modelleri Görüntüleme

Hazır modeller, Models sayfasında diğer modellerle birlikte görüntülenir. "TrendyMirror" etiketine sahip modeller, hazır modellerdir. Filtreleme seçeneklerini kullanarak sadece hazır modelleri görüntüleyebilirsiniz.

## License

This project is licensed under the MIT License. 