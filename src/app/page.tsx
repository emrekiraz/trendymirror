'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageUploadCard from '@/components/ImageUploadCard'
import CategorySelector from '@/components/CategorySelector'
import ResultCard from '@/components/ResultCard'
import { tryOnClothing } from '@/utils/api'
import { TryOnError } from '@/utils/api'
import AuthModal from '@/components/AuthModal'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { setupSupabaseStorage } from '@/utils/setupSupabase'

export default function Home() {
  const [modelImage, setModelImage] = useState<File | null>(null)
  const [garmentImage, setGarmentImage] = useState<File | null>(null)
  const [category, setCategory] = useState<'top' | 'bottom' | 'full-body'>('top')
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'top' | 'bottom' | 'full-body'>('top')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Storage setup
    setupSupabaseStorage()

    // Mevcut oturum bilgisini al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleTryOn = async () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    if (!modelImage || !garmentImage) {
      alert('Lütfen model ve kıyafet görsellerini yükleyin')
      return
    }

    setIsLoading(true)
    try {
      console.log('Try-on işlemi başlatılıyor:', {
        modelImage: {
          name: modelImage.name,
          size: modelImage.size,
          type: modelImage.type
        },
        garmentImage: {
          name: garmentImage.name,
          size: garmentImage.size,
          type: garmentImage.type
        },
        category: selectedCategory
      });

      const result = await tryOnClothing(modelImage, garmentImage, selectedCategory)
      setResultImage(result.image)
    } catch (error) {
      console.error('Try-on işlemi sırasında hata:', error)
      
      let errorMessage = 'İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      let errorDetails = '';
      
      if (error instanceof TryOnError) {
        switch (error.code) {
          case 'FILE_TOO_LARGE':
          case 'INVALID_FILE_TYPE':
          case 'FILE_READ_ERROR':
            errorMessage = error.message
            break
          case 'AUTH_ERROR':
          case 'AUTH_REQUIRED':
            setIsAuthModalOpen(true)
            return
          case 'RATE_LIMIT':
            errorMessage = 'Çok fazla istek yapıldı. Lütfen birkaç dakika bekleyip tekrar deneyin.'
            break
          case 'NETWORK_ERROR':
            errorMessage = 'İnternet bağlantınızı kontrol edip tekrar deneyin.'
            break
          case 'TIMEOUT':
            errorMessage = 'İşlem çok uzun sürdü. Lütfen tekrar deneyin.'
            break
          case 'PROCESS_FAILED':
            errorMessage = 'Görsel işleme başarısız oldu. Lütfen farklı görseller ile tekrar deneyin.'
            break
          case 'UPLOAD_ERROR':
            errorMessage = error.message
            errorDetails = error.details?.message || ''
            break
          case 'INVALID_REQUEST':
            errorMessage = 'API isteği geçersiz. Lütfen görselleri kontrol edip tekrar deneyin.'
            errorDetails = error.message
            break
          case 'API_ERROR':
            errorMessage = 'API servisi şu anda yanıt vermiyor. Lütfen daha sonra tekrar deneyin.'
            errorDetails = error.message
            break
          default:
            if (error.details) {
              console.error('Hata detayları:', error.details)
              errorDetails = error.message
            }
            errorMessage = error.message
        }
      }
      
      alert(errorDetails ? `${errorMessage}\n\nDetay: ${errorDetails}` : errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <nav className="p-4 space-y-2">
          <div className="flex items-center justify-between p-2">
            <span className="text-sm font-medium text-gray-700">
              {user ? user.email : 'Misafir'}
            </span>
            <button
              onClick={() => user ? supabase.auth.signOut() : setIsAuthModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {user ? 'Çıkış Yap' : 'Giriş Yap'}
            </button>
          </div>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 bg-gray-100 text-gray-700 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Studio</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Models</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Background</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>My Gallery</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="flex items-center">
              Mockups
              <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-100 text-cyan-800 rounded">BETA</span>
            </span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-2 text-gray-700 rounded hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Developer API</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Virtual Try-On Studio</h1>
            <a href="#" className="text-blue-600 hover:underline">Watch 2-Minute Tutorial</a>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Model Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Select Model</h2>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <ImageUploadCard
                image={modelImage}
                onImageChange={setModelImage}
                label="Model Image"
              />
              <button className="w-full mt-4 bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800">
                Generate AI Model
              </button>
              <div className="mt-4">
                <button className="flex items-center w-full text-gray-700 justify-between p-2 hover:bg-gray-50 rounded">
                  <span>Model Image Controls</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Garment Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Select Garment</h2>
                <button className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <ImageUploadCard
                image={garmentImage}
                onImageChange={setGarmentImage}
                label="Garment Image"
              />
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <button
                    onClick={() => setSelectedCategory('top')}
                    className={`p-4 text-center rounded-md border ${
                      selectedCategory === 'top'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4l2 2m0 0l2 2m-2-2v12M9 4L7 6m0 0L5 8m2-2v12" />
                    </svg>
                    <span className="text-sm">Top</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('bottom')}
                    className={`p-4 text-center rounded-md border ${
                      selectedCategory === 'bottom'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="text-sm">Bottom</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('full-body')}
                    className={`p-4 text-center rounded-md border ${
                      selectedCategory === 'full-body'
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">Full-body</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Result Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Result</h2>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center min-h-[400px] flex items-center justify-center relative">
                {resultImage ? (
                  <div className="relative w-full h-full aspect-square">
                    <Image
                      src={resultImage}
                      alt="Result"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <button 
                onClick={handleTryOn}
                disabled={!modelImage || !garmentImage || isLoading}
                className="w-full mt-4 bg-yellow-400 text-gray-900 py-3 px-4 rounded-md hover:bg-yellow-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Run (~14s)'}
              </button>
              <div className="flex justify-between mt-4">
                <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Performance</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  <span>Balanced</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>Quality</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
} 