'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import InfoPopup from '@/app/components/InfoPopup'
import { toast } from 'react-hot-toast'
import { ArrowUpTrayIcon, LinkIcon, InformationCircleIcon, XMarkIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'
import { supabase } from '@/app/lib/supabase'

// Sample model and garment images for demonstration
const SAMPLE_MODELS = [
  {
    id: 'model1',
    url: '/api/image-proxy?bucket=models&name=default/TrendyMirror_2.png',
    alt: 'Female model with blonde hair',
    fallbackColor: 'bg-pink-200'
  },
  {
    id: 'model2',
    url: '/api/image-proxy?bucket=models&name=default/TrendyMirror_13.png',
    alt: 'Female model with dark hair',
    fallbackColor: 'bg-purple-200'
  },
  {
    id: 'model3',
    url: '/api/image-proxy?bucket=models&name=default/TrendyMirror_1.png',
    alt: 'Male model with casual style',
    fallbackColor: 'bg-blue-200'
  }
]

const SAMPLE_GARMENTS = [
  {
    id: 'garment1',
    url: '/api/image-proxy?bucket=products&name=default/110000079539214.jpg',
    alt: 'Blue t-shirt',
    category: 'top',
    fallbackColor: 'bg-blue-200'
  },
  {
    id: 'garment2',
    url: '/api/image-proxy?bucket=products&name=default/pc03uu9col002-1.jpg',
    alt: 'Black jeans',
    category: 'bottom',
    fallbackColor: 'bg-gray-800'
  },
  {
    id: 'garment3',
    url: '/api/image-proxy?bucket=products&name=default/red_dress.jpg',
    alt: 'Summer dress',
    category: 'full-body',
    fallbackColor: 'bg-yellow-200'
  }
]

const GARMENT_CATEGORIES = [
  { id: 'top', name: 'Top', icon: '👕' },
  { id: 'bottom', name: 'Bottom', icon: '👖' },
  { id: 'full-body', name: 'Full-Body', icon: '👗' }
]

type ImageSource = {
  url: string
  file: File | null
}

interface ImageUploadBoxProps {
  type: 'model' | 'garment'
  image: ImageSource
  onDrop: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent) => void
  onUrlInput: (url: string) => void
  title: string
  onInfoClick: () => void
  onFileSelect: (file: File) => void
  onRemove: () => void
  selectedCategory?: string
  setSelectedCategory?: (category: string) => void
}

function ImageUploadBox({ 
  type,
  image,
  onDrop,
  onPaste,
  onUrlInput,
  title,
  onInfoClick,
  onFileSelect,
  onRemove,
  selectedCategory,
  setSelectedCategory
}: ImageUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 p-2">
      <div className="flex items-center gap-2 mb-1">
        <Heading level={3} className="text-lg">{title}</Heading>
        <button 
          className="p-1 hover:bg-gray-100 rounded-full"
          onClick={onInfoClick}
        >
          <InformationCircleIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <Card
        className="border-2 border-dashed border-gray-300 p-2 h-[400px] flex flex-col items-center justify-center relative cursor-pointer group"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e)}
        onPaste={(e) => onPaste(e)}
        onClick={handleBoxClick}
      >
        {image.url ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={image.url}
              alt={`${type} preview`}
              className="object-contain max-w-full max-h-full"
              width={400}
              height={400}
            />
            <div className="absolute top-2 right-2">
              <button 
                className="bg-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent's onClick
                  onRemove();
                }}
              >
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {type === 'model' ? (
              <UserIcon className="w-8 h-8 text-gray-400 mb-2" />
            ) : (
              <TagIcon className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <Text className="text-center mb-1 text-sm">
              Click, paste, or drop image here
            </Text>
            <Text color="light" className="text-xs text-center">OR</Text>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileSelect(file)
            }
          }}
        />
      </Card>

      <div className="mt-1">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Or paste image URL"
            className="flex-1 p-1 border rounded-lg text-sm"
            onBlur={(e) => e.target.value && onUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.value && onUrlInput(e.currentTarget.value)}
          />
        </div>
      </div>
      
      {type === 'garment' && setSelectedCategory && selectedCategory && (
        <div className="mt-1">
          <Text className="mb-1 text-sm font-medium">Category</Text>
          <div className="flex gap-1">
            {GARMENT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-primary text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string>('top')
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false)
  const [isGarmentInfoOpen, setIsGarmentInfoOpen] = useState(false)
  
  // Image upload state
  const [modelImage, setModelImage] = useState<ImageSource>({ url: '', file: null })
  const [garmentImage, setGarmentImage] = useState<ImageSource>({ url: '', file: null })

  // Event handlers for image upload
  const handleDrop = async (e: React.DragEvent, type: 'model' | 'garment') => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        type === 'model' 
          ? setModelImage({ url: result, file })
          : setGarmentImage({ url: result, file })
      }
      reader.readAsDataURL(file)
      toast.success(`${type === 'model' ? 'Model' : 'Garment'} image uploaded`)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent, type: 'model' | 'garment') => {
    const items = Array.from(e.clipboardData.items)
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            type === 'model'
              ? setModelImage({ url: result, file })
              : setGarmentImage({ url: result, file })
          }
          reader.readAsDataURL(file)
          toast.success(`${type === 'model' ? 'Model' : 'Garment'} image pasted`)
          break
        }
      }
    }
  }

  const handleUrlInput = (url: string, type: 'model' | 'garment') => {
    type === 'model'
      ? setModelImage({ url, file: null })
      : setGarmentImage({ url, file: null })
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image URL set`)
  }

  const handleFileSelect = (file: File, type: 'model' | 'garment') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      type === 'model'
        ? setModelImage({ url: result, file })
        : setGarmentImage({ url: result, file })
    }
    reader.readAsDataURL(file)
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image uploaded`)
  }

  const handleRemove = (type: 'model' | 'garment') => {
    if (type === 'model') {
      setModelImage({ url: '', file: null })
    } else {
      setGarmentImage({ url: '', file: null })
    }
    toast.success(`${type === 'model' ? 'Model' : 'Garment'} image removed`)
  }

  const handleSampleModelSelect = (modelUrl: string) => {
    setModelImage({ url: modelUrl, file: null })
  }

  const handleSampleGarmentSelect = (garmentUrl: string, category: string) => {
    setGarmentImage({ url: garmentUrl, file: null })
    setSelectedCategory(category)
  }

  const handleGenerate = async () => {
    try {
      // First mark onboarding as completed in Supabase
      if (!user || authLoading) {
        toast.error("You need to be logged in to generate images");
        return;
      }
      
      // Önce toast göster, bu kullanıcıya görsel feedback sağlar
      const loadingToast = toast.loading("Starting generation process...");
      
      // Gösterdikten sonra kullanıcıyı hemen yönlendir
      // Bu sayede kullanıcı beklemek zorunda kalmaz
      router.push('/generating', { scroll: false });
      
      // Arkaplanda onboarding_completed güncelleme işlemini yap
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        console.error("Error updating onboarding status:", error);
        toast.error("Something went wrong with your profile update.");
        return;
      }
      
      // Log completion
      console.log("Onboarding marked as completed for user:", user.id);
      
      // Toast'u başarılı olarak güncelle
      toast.success("Onboarding completed!", {
        id: loadingToast
      });
      
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-2 py-2 min-h-screen flex flex-col">
      <Card className="max-w-5xl mx-auto p-3 flex-grow flex flex-col">
        <Heading level={1} className="text-center mb-2 text-2xl">Create Your Virtual Try-On</Heading>
        
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          {/* Model Selection Section with Samples on Left */}
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {/* Sample Models - Left Side */}
            <div className="md:w-1/3">
              <Text className="mb-1 text-sm font-medium">Choose from Models</Text>
              <div className="flex flex-col space-y-2">
                {SAMPLE_MODELS.map((model) => (
                  <Card 
                    key={model.id}
                    className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
                      modelImage.url === model.url 
                        ? 'ring-2 ring-blue-primary scale-95' 
                        : ''
                    }`}
                    onClick={() => handleSampleModelSelect(model.url)}
                    hover={true}
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={model.url}
                        alt={model.alt}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(model.alt)}`;
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Model Upload - Center */}
            <div className="bg-gray-50 rounded-lg md:w-2/3">
              <ImageUploadBox
                type="model"
                image={modelImage}
                onDrop={(e) => handleDrop(e, 'model')}
                onPaste={(e) => handlePaste(e, 'model')}
                onUrlInput={(url) => handleUrlInput(url, 'model')}
                title="Select Model"
                onInfoClick={() => setIsModelInfoOpen(true)}
                onFileSelect={(file) => handleFileSelect(file, 'model')}
                onRemove={() => handleRemove('model')}
              />
            </div>
          </div>
          
          {/* Garment Selection Section with Samples on Right */}
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {/* Garment Upload - Center */}
            <div className="bg-gray-50 rounded-lg md:w-2/3 flex flex-col">
              <ImageUploadBox
                type="garment"
                image={garmentImage}
                onDrop={(e) => handleDrop(e, 'garment')}
                onPaste={(e) => handlePaste(e, 'garment')}
                onUrlInput={(url) => handleUrlInput(url, 'garment')}
                title="Select Garment"
                onInfoClick={() => setIsGarmentInfoOpen(true)}
                onFileSelect={(file) => handleFileSelect(file, 'garment')}
                onRemove={() => handleRemove('garment')}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            
            {/* Sample Garments - Right Side */}
            <div className="md:w-1/3">
              <Text className="mb-1 text-sm font-medium">Choose from Garments</Text>
              <div className="flex flex-col space-y-2">
                {SAMPLE_GARMENTS.map((garment) => (
                  <Card 
                    key={garment.id}
                    className={`relative cursor-pointer transition-all duration-200 overflow-hidden ${
                      garmentImage.url === garment.url 
                        ? 'ring-2 ring-blue-primary scale-95' 
                        : ''
                    }`}
                    onClick={() => handleSampleGarmentSelect(garment.url, garment.category)}
                    hover={true}
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={garment.url}
                        alt={garment.alt}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(garment.alt)}`;
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <div className="mt-2 flex justify-center">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={!modelImage.url || !garmentImage.url}
            className="w-full max-w-md px-4 py-2 text-base"
          >
            Generate Virtual Try-On
          </Button>
        </div>
      </Card>
      
      {/* Info Popups - with removed explanatory text */}
      <InfoPopup
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        title="Model Requirements"
        imageUrl="/images/model_guide.jpg"
        content={<div></div>}
      />
      
      <InfoPopup
        isOpen={isGarmentInfoOpen}
        onClose={() => setIsGarmentInfoOpen(false)}
        title="Garment Requirements"
        imageUrl="/images/garment_guide.jpg"
        content={<div></div>}
      />
    </div>
  )
} 