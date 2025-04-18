'use client'

import { useState, useEffect, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { PhotoIcon, SparklesIcon, XMarkIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import ImagePreview from '@/app/components/ImagePreview'
import { generateAIModel } from '@/app/utils/api'
import { supabase } from '@/app/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'

type ModelSource = 'TrendyMirror' | 'My Model' | 'AI Generated'

interface Model {
  id: string
  url: string
  source: ModelSource
  createdAt: string
  name?: string
  category: string
  isPremium: boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{id: string, name: string} | null>(null)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedFile, setGeneratedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  
  const suggestedPrompts = [
    "Realistic portrait of a blonde woman model. Pink t-shirt and blue jean.",
    "Realistic portrait of a black woman model. Dark blue crop and pink short.",
    "Realistic portrait of an asian man model. Yellow t-shirt and blue short.",
    "Realistic portrait of a black man model. Light blue shirt and dark green trousers."
  ]

  useEffect(() => {
    loadModels()
  }, [])

  // Get unique sources for filter
  const sources = Array.from(new Set(models.map(model => model.source)))

  // Filter models based on active filter
  const filteredModels = activeFilter === 'all'
    ? models
    : models.filter(model => model.source === activeFilter)

  const loadModels = async () => {
    try {
      setIsLoading(true)
      
      // Kullanıcı bilgisini kontrol et
      const userFolder = user?.id ? `user_${user.id}` : null
      
      // Kullanıcı klasörü var mı kontrol et ve kullanıcı modellerini yükle
      let userModels: Model[] = []
      
      if (userFolder) {
        // Önce klasörün var olup olmadığını kontrol et
        const { data: folderCheck, error: folderCheckError } = await supabase.storage
          .from('models')
          .list('', {
            limit: 100
          })
        
        if (folderCheckError) {
          console.error('Error checking folders:', folderCheckError)
        } else {
          // Kullanıcı klasörü var mı kontrol et
          const folderExists = folderCheck.some(item => item.name === userFolder)
          
          if (folderExists) {
            // Kullanıcı klasörünün içeriğini listele
            const { data: userFiles, error: userError } = await supabase.storage
              .from('models')
              .list(userFolder, {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
              })

            if (userError) {
              console.error('Error loading user models:', userError)
            } else if (userFiles) {
              // Kullanıcının modellerini işle
              userModels = await Promise.all(
                userFiles
                  .filter(file => {
                    // Sadece resimleri filtrele
                    if (!file.name) return false
                    const extension = file.name.split('.').pop()?.toLowerCase()
                    return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif'
                  })
                  .map(async file => {
                    const { data: urlData } = supabase.storage
                      .from('models')
                      .getPublicUrl(`${userFolder}/${file.name}`)
                      
                    // Determine the source based on metadata or filename
                    let source: ModelSource = 'My Model'
                    
                    // Check metadata first
                    if (file.metadata?.source === 'AI Generated') {
                      source = 'AI Generated'
                    } 
                    // If no metadata source, check filename as fallback
                    else if (file.name.startsWith('ai-model-') || file.name.includes('ai-generated')) {
                      source = 'AI Generated'
                    }
                      
                    return {
                      id: file.id || file.name,
                      url: urlData.publicUrl,
                      source: source,
                      createdAt: file.created_at || new Date().toISOString(),
                      name: file.name,
                      category: file.metadata?.category || 'Uncategorized',
                      isPremium: false
                    }
                  })
              )
            }
          }
        }
      }
      
      // Fetch default models (TrendyMirror models)
      const { data: defaultFiles, error: defaultError } = await supabase.storage
        .from('models')
        .list('default', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })
        
      if (defaultError) {
        console.error('Error loading default models:', defaultError)
      }
      
      // Process default models
      const defaultModels = await Promise.all(
        (defaultFiles || [])
          .filter(file => {
            const extension = file.name.split('.').pop()?.toLowerCase()
            return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif'
          })
          .map(async file => {
            const { data: urlData } = supabase.storage
              .from('models')
              .getPublicUrl(`default/${file.name}`)
              
            return {
              id: file.id || `default_${file.name}`,
              url: urlData.publicUrl,
              source: 'TrendyMirror' as ModelSource,
              createdAt: file.created_at || new Date().toISOString(),
              name: file.name,
              category: file.metadata?.category || 'Premium',
              isPremium: true
            }
          })
      )
      
      // Combine all models and sort by date
      const allModels = [...userModels, ...defaultModels].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      
      console.log('Loaded models:', { userModelsCount: userModels.length, defaultModelsCount: defaultModels.length, totalCount: allModels.length })
      
      setModels(allModels)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      toast.error('Error loading models')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Kullanıcı giriş yapmamışsa yükleme yapılamaz
    if (!user) {
      toast.error('You must be logged in to upload models')
      return
    }

    try {
      setIsUploading(true)
      
      // Kullanıcıya özel klasör oluştur
      const userFolder = `user_${user.id}`
      
      // Önce klasörün var olup olmadığını kontrol et
      const { data: folderCheck, error: folderCheckError } = await supabase.storage
        .from('models')
        .list('', {
          limit: 100
        })
        
      if (folderCheckError) {
        console.error('Error checking folders:', folderCheckError)
        throw folderCheckError
      }
      
      // Kullanıcı klasörü yoksa oluştur
      const folderExists = folderCheck.some(item => item.name === userFolder)
      if (!folderExists) {
        // Klasörü oluştur - boş bir dosya yükleyerek
        const { error: createFolderError } = await supabase.storage
          .from('models')
          .upload(`${userFolder}/.folder`, new Uint8Array(0), {
            contentType: 'application/x-directory'
          })
          
        if (createFolderError && !createFolderError.message.includes('already exists')) {
          console.error('Error creating user folder:', createFolderError)
          // Klasör oluşturma hatası kritik değil, devam et
        }
      }
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${userFolder}/${uuidv4()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('models')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
          metadata: {
            source: 'My Model',
            category: 'Uncategorized'
          }
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('models')
        .getPublicUrl(fileName)

      const newModel: Model = {
        id: uuidv4(),
        url: publicUrl,
        source: 'My Model',
        createdAt: new Date().toISOString(),
        name: fileName,
        category: 'Uncategorized',
        isPremium: false
      }

      setModels([newModel, ...models])
      toast.success('Model uploaded successfully')
      setShowUploadModal(false)
      setUploadFile(null)
    } catch (error) {
      console.error('Error uploading model:', error)
      toast.error('Failed to upload model')
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDelete = async (id: string) => {
    const model = models.find(m => m.id === id)
    if (!model) return
    
    // Kullanıcı giriş yapmamışsa silme yapılamaz
    if (!user) {
      toast.error('You must be logged in to delete models')
      return
    }
    
    // TrendyMirror modelleri silinemez
    if (model.source === 'TrendyMirror') {
      toast.error('Default models cannot be deleted')
      setDeleteConfirmation(null)
      return
    }
    
    try {
      // Dosya adından kullanıcı klasörünü al
      const filePath = model.name || ''
      
      // Silme işlemini gerçekleştir
      const { error } = await supabase.storage
        .from('models')
        .remove([filePath])
        
      if (error) throw error
      
      // UI'dan kaldır
      setModels(models.filter(m => m.id !== id))
      toast.success('Model deleted successfully')
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting model:', error)
      toast.error('Failed to delete model')
    }
  }
  
  const handleGenerateAI = async () => {
    if (!aiPrompt) return
    
    try {
      setIsGenerating(true)
      toast.loading('Generating AI model...')
      
      // Use the actual API to generate the model
      const base64Image = await generateAIModel(aiPrompt)
      
      // Convert base64 to File object
      const byteString = atob(base64Image.split(',')[1])
      const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      
      const blob = new Blob([ab], { type: mimeString })
      const fileName = `ai-generated-${Date.now()}.png`
      const file = new File([blob], fileName, { type: mimeString })
      
      // Set the generated image and file (but don't save yet)
      setGeneratedImage(base64Image)
      setGeneratedFile(file)
      
      toast.dismiss()
      toast.success('AI Model generated successfully')
      
    } catch (error) {
      console.error('Error generating model:', error)
      toast.dismiss()
      toast.error('Failed to generate model. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSaveGeneratedModel = async () => {
    if (!generatedFile || !generatedImage) {
      toast.error('No generated model to save')
      return
    }
    
    try {
      // Check if user is logged in
      if (!user || !user.id) {
        toast.error('You must be logged in to save models')
        return
      }
      
      toast.loading('Saving model to your collection...')
      
      // Create user folder path
      const userFolder = `user_${user.id}`
      
      // Save the generated model
      const fileExt = generatedFile.name.split('.').pop()
      const storageFileName = `${userFolder}/ai-generated-${uuidv4()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('models')
        .upload(storageFileName, generatedFile, {
          upsert: true,
          contentType: generatedFile.type,
          cacheControl: '3600',
          metadata: {
            source: 'AI Generated',
            category: 'AI Generated',
            aiGenerated: 'true'
          }
        })
        
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('models')
        .getPublicUrl(storageFileName)
        
      // Add the new model to the list
      const newModel: Model = {
        id: uuidv4(),
        url: publicUrl,
        source: 'AI Generated',
        createdAt: new Date().toISOString(),
        name: storageFileName,
        category: 'AI Generated',
        isPremium: false
      }
      
      setModels([newModel, ...models])
      setGeneratedImage(null)
      setGeneratedFile(null)
      setAiPrompt('')
      
      toast.dismiss()
      toast.success('AI Model saved to your collection')
      
    } catch (error) {
      console.error('Error saving generated model:', error)
      toast.dismiss()
      toast.error('Failed to save generated model')
    }
  }
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Heading level={1}>My Models</Heading>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            className="inline-flex items-center"
            onClick={handleUploadClick}
          >
            <PhotoIcon className="w-4 h-4 mr-2" />
            Upload Model
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            variant="primary"
            href="/dashboard/studio"
            className="inline-flex items-center"
          >
            Go to Studio
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <Tab.Group onChange={setSelectedTabIndex}>
        <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white shadow text-blue-primary'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-primary'
              )
            }
          >
            Browse Models
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white shadow text-blue-primary'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-primary'
              )
            }
          >
            Generate AI Model
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="rounded-xl bg-white p-3">
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
                {sources.map(source => (
                  <button
                    key={source}
                    onClick={() => setActiveFilter(source)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === source
                        ? 'bg-blue-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
              </div>
            ) : models.length === 0 ? (
              <Card className="text-center py-12">
                <Text color="light" className="text-lg">No models available</Text>
                <Text color="light" className="mt-2">
                  Please check back later for new models
                </Text>
              </Card>
            ) : filteredModels.length === 0 ? (
              <Card className="text-center py-12">
                <Text color="light" className="text-lg">No models match the selected filter</Text>
                <Button 
                  variant="tertiary"
                  onClick={() => setActiveFilter('all')}
                  className="mt-2"
                >
                  Show all models
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredModels.map((model) => (
                  <Card 
                    key={model.id} 
                    className="overflow-hidden relative group"
                    hover={true}
                  >
                    <div className="relative h-80">
                      <Image
                        src={model.url}
                        alt={model.name || "Model image"}
                        fill
                        className="object-cover"
                      />
                      {/* Source badge with improved contrast */}
                      <Badge 
                        variant={
                          model.source === 'TrendyMirror' ? 'trendymirror' : 
                          model.source === 'My Model' ? 'success' : 
                          'ai'
                        }
                        className="absolute top-2 right-2 font-medium text-xs py-1 px-3 shadow-sm"
                      >
                        {model.source}
                      </Badge>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                        <Button
                          variant="primary"
                          href={`/dashboard/studio?modelId=${model.id}&modelUrl=${encodeURIComponent(model.url)}&model=${encodeURIComponent(model.name || '')}`}
                          size="sm"
                          className="py-2 px-4 z-10"
                        >
                          Try On
                        </Button>
                        
                        {model.source !== 'TrendyMirror' && (
                          <button
                            onClick={() => handleDelete(model.id)}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors z-10"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Tab.Panel>

          {/* AI Model Generation Tab Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6">
            <Heading level={2} className="mb-4">Generate AI Model</Heading>
            <Text className="mb-6">
              Create a custom AI-generated model by describing the appearance. Our AI will generate a realistic model based on your description.
            </Text>
            
            <div className="mb-6">
              <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe the model you want to create
              </label>
              <textarea
                id="ai-prompt"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-primary focus:border-blue-primary"
                placeholder="E.g., A professional female model with long blonde hair wearing a casual outfit, neutral expression, looking at camera, studio lighting"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            
            {/* Suggested prompts */}
            <div className="mb-6">
              <Text className="mb-2 font-medium">Suggested prompts</Text>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-primary shadow-sm hover:bg-blue-100"
                    onClick={() => setAiPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleGenerateAI}
                disabled={!aiPrompt.trim() || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Model'}
              </Button>
            </div>
            
            {generatedImage && (
              <div className="mt-8">
                <Heading level={3} className="mb-4">Generated Model</Heading>
                <div className="flex justify-center">
                  <div className="relative w-4/5 max-w-md rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={generatedImage}
                      alt="Generated AI model"
                      fill
                      className="object-contain"
                    />
                    <Badge 
                      variant="ai"
                      className="absolute top-2 right-2 font-medium text-xs py-1 px-3 shadow-sm"
                    >
                      AI Generated
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <Button variant="secondary" onClick={() => {
                    setGeneratedImage(null)
                    setGeneratedFile(null)
                  }}>
                    Discard
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveGeneratedModel}
                  >
                    Save to My Models
                  </Button>
                </div>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <Card className="max-w-md w-full p-6">
            <Heading level={3} className="mb-2">Delete Model</Heading>
            <Text className="mb-4">
              Are you sure you want to delete {deleteConfirmation.name}? This action cannot be undone.
            </Text>
            <div className="flex justify-end space-x-3">
              <Button
                variant="tertiary"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  handleDelete(deleteConfirmation.id)
                  setDeleteConfirmation(null)
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
} 