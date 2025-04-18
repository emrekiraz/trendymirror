'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase'
import { toast } from 'react-hot-toast'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import { Heading, Text } from '@/app/components/ui/Typography'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'

interface ModelSelectionPopupProps {
  isOpen: boolean
  onClose: () => void
  onSelectModel: (modelUrl: string) => void
}

type ModelSource = 'TrendyMirror' | 'AI Generated' | 'My Model'

interface Model {
  id: string
  url: string
  source: ModelSource
  createdAt: string
  name?: string
}

export default function ModelSelectionPopup({ isOpen, onClose, onSelectModel }: ModelSelectionPopupProps) {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const { user } = useAuth()

  useEffect(() => {
    // Popup açıldığında modelleri yükle
    if (isOpen) {
      loadModels()
    }
  }, [isOpen])

  const loadModels = async () => {
    try {
      setIsLoading(true)
      
      console.log('Models loading...')
      
      let userModels: Model[] = []
      let defaultModels: Model[] = []
      
      // Önce klasörleri kontrol et
      const { data: rootFolders, error: rootError } = await supabase.storage
        .from('models')
        .list('', {
          limit: 100
        })
        
      if (rootError) {
        console.error('Error listing model root folders:', rootError)
        throw rootError
      }
      
      // Varsayılan modelleri yükle
      if (rootFolders && rootFolders.some(folder => folder.name === 'default')) {
        const { data: defaultFiles, error: defaultError } = await supabase.storage
          .from('models')
          .list('default', {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' }
          })
          
        if (defaultError) {
          console.error('Error loading default models:', defaultError)
        } else if (defaultFiles) {
          // İşlem öncesi filtreleme yap
          const validFiles = defaultFiles.filter(file => {
            if (!file.name) return false
            const extension = file.name.split('.').pop()?.toLowerCase()
            return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif'
          })
          
          // Dosyaları işle
          defaultModels = await Promise.all(
            validFiles.map(async file => {
              const { data: urlData } = supabase.storage
                .from('models')
                .getPublicUrl(`default/${file.name}`)
                
              return {
                id: file.id || `default_${file.name}`,
                url: urlData.publicUrl,
                source: 'TrendyMirror' as ModelSource,
                createdAt: file.created_at || new Date().toISOString(),
                name: file.name
              }
            })
          )
        }
      }
      
      // Kullanıcı giriş yapmışsa, kullanıcının modellerini yükle
      if (user) {
        const userFolder = `user_${user.id}`
        
        // Kullanıcının klasörü var mı kontrol et
        if (rootFolders && rootFolders.some(folder => folder.name === userFolder)) {
          const { data: userFiles, error: userError } = await supabase.storage
            .from('models')
            .list(userFolder, {
              limit: 100,
              sortBy: { column: 'created_at', order: 'desc' }
            })
            
          if (userError) {
            console.error('Error loading user models:', userError)
          } else if (userFiles) {
            // İşlem öncesi filtreleme yap
            const validFiles = userFiles.filter(file => {
              if (!file.name) return false
              const extension = file.name.split('.').pop()?.toLowerCase()
              return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif'
            })
            
            // Dosyaları işle
            userModels = await Promise.all(
              validFiles.map(async file => {
                const { data: urlData } = supabase.storage
                  .from('models')
                  .getPublicUrl(`${userFolder}/${file.name}`)
                  
                // Determine the source based on metadata or filename
                let source: ModelSource = 'My Model'
                
                // Check metadata or filename
                if (file.metadata?.source === 'AI Generated' || file.name.startsWith('ai-') || file.name.includes('ai-generated')) {
                  source = 'AI Generated'
                }
                  
                return {
                  id: file.id || file.name,
                  url: urlData.publicUrl,
                  source: source,
                  createdAt: file.created_at || new Date().toISOString(),
                  name: file.name
                }
              })
            )
          }
        } else {
          console.log('User folder does not exist yet:', userFolder)
        }
      }
      
      // Tüm modelleri birleştir
      const allModels = [...userModels, ...defaultModels]
      
      console.log(`Loaded models: ${allModels.length} (${userModels.length} user, ${defaultModels.length} default)`)
      
      setModels(allModels)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      toast.error('An error occurred while loading models')
    } finally {
      setIsLoading(false)
    }
  }

  const handleModelClick = (modelUrl: string) => {
    // Directly select the model and close the popup
    onSelectModel(modelUrl)
    onClose()
  }

  // Filter models based on active filter
  const filteredModels = activeFilter === 'all' 
    ? models 
    : models.filter(model => model.source === activeFilter)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="div">
                    <Heading level={3}>Choose a Model</Heading>
                  </Dialog.Title>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Filter buttons */}
                {!isLoading && models.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'all'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      All Models
                    </button>
                    <button
                      onClick={() => setActiveFilter('TrendyMirror')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'TrendyMirror'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      TrendyMirror
                    </button>
                    <button
                      onClick={() => setActiveFilter('AI Generated')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'AI Generated'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      AI Generated
                    </button>
                    <button
                      onClick={() => setActiveFilter('My Model')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'My Model'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      My Models
                    </button>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
                  </div>
                ) : models.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Text className="text-gray-500 mb-4">No models available</Text>
                    <Button
                      variant="primary"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </Card>
                ) : filteredModels.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Text className="text-gray-500 mb-4">No models match the selected filter</Text>
                    <Button
                      variant="tertiary"
                      onClick={() => setActiveFilter('all')}
                    >
                      Show all models
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                    {filteredModels.map((model) => (
                      <Card 
                        key={model.id}
                        className="overflow-hidden relative group cursor-pointer"
                        hover={true}
                        onClick={() => handleModelClick(model.url)}
                      >
                        <div className="relative h-80">
                          <Image
                            src={model.url}
                            alt={model.name || `Model ${model.id}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                          />
                          {/* Source badge with improved contrast */}
                          <Badge 
                            variant={
                              model.source === 'TrendyMirror' ? 'trendymirror' : 
                              model.source === 'AI Generated' ? 'ai' : 
                              'success'
                            }
                            className="absolute top-2 right-2 font-medium text-xs py-1 px-3 shadow-sm"
                          >
                            {model.source}
                          </Badge>
                          
                          {/* Selection indicator */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                            <Button
                              variant="primary"
                              size="sm"
                              className="py-2 px-4 z-10"
                            >
                              Select Model
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 