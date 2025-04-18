'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ArrowDownTrayIcon, XMarkIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { supabase } from '@/app/lib/supabase'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'

type GalleryItem = {
  id: string
  created_at: string
  name: string
  url: string
  metadata: {
    category?: string
  }
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{id: string, name: string} | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // Kullanıcı bilgisi geldiğinde galeri öğelerini yükle
    if (user) {
      loadGalleryItems()
    } else {
      // Kullanıcı yoksa yükleme durumunu kapat
      setIsLoading(false)
    }
  }, [user])

  // Function to load gallery items
  const loadGalleryItems = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    try {
      // Kullanıcıya özel klasör yolu
      const userFolder = `user_${user.id}`
      
      // Önce klasörün var olup olmadığını kontrol et
      const { data: folderCheck, error: folderError } = await supabase
        .storage
        .from('gallery')
        .list('', {
          limit: 100
        })
        
      if (folderError) {
        console.error('Error checking gallery folders:', folderError)
        throw folderError
      }
      
      // Kullanıcı klasörü var mı kontrol et
      const folderExists = folderCheck.some(item => item.name === userFolder)
      
      if (!folderExists) {
        // Kullanıcı klasörü yoksa boş galeri göster
        console.log('User gallery folder does not exist:', userFolder)
        setGalleryItems([])
        setIsLoading(false)
        return
      }
      
      // Kullanıcı klasörünün içeriğini listele
      const { data, error } = await supabase
        .storage
        .from('gallery')
        .list(userFolder, {
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) {
        throw error
      }

      if (data && data.length > 0) {
        const items: GalleryItem[] = await Promise.all(
          data.map(async (item) => {
            const { data: urlData } = await supabase
              .storage
              .from('gallery')
              .getPublicUrl(`${userFolder}/${item.name}`)

            return {
              id: item.id,
              created_at: item.created_at,
              name: item.name,
              url: urlData.publicUrl,
              metadata: item.metadata || {}
            }
          })
        )

        console.log(`Loaded ${items.length} gallery items for user ${user.id}`)
        setGalleryItems(items)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            items
              .filter(item => item.metadata?.category)
              .map(item => item.metadata?.category as string)
          )
        )
        setCategories(uniqueCategories)
      } else {
        // Klasör var ama içeriği boş
        console.log('User gallery folder exists but is empty:', userFolder)
        setGalleryItems([])
      }
    } catch (error) {
      console.error('Error loading gallery items:', error)
      toast.error('Failed to load gallery items')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    // Kullanıcı giriş yapmamışsa silme işlemi yapılamaz
    if (!user) {
      toast.error('You must be logged in to delete gallery items')
      return
    }
    
    try {
      console.log('Attempting to delete gallery item:', name)
      
      // Kullanıcıya özel klasör yolu
      const userFolder = `user_${user.id}`
      const filePath = `${userFolder}/${name}`
      
      // Silme işlemini gerçekleştir
      const { error: deleteError } = await supabase.storage
        .from('gallery')
        .remove([filePath])
        
      if (deleteError) {
        console.error('Error deleting gallery item:', deleteError)
        toast.error('Failed to delete gallery item')
        return
      }
      
      // UI'dan kaldır
      setGalleryItems(galleryItems.filter(item => item.id !== id))
      setDeleteConfirmation(null)
      toast.success('Gallery item deleted successfully')
      
    } catch (error) {
      console.error('Error in delete process:', error)
      toast.error('Failed to delete gallery item')
    }
  }

  const getCategoryEmoji = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'top': return '👕';
      case 'bottom': return '👖';
      case 'full-body': return '👗';
      default: return '👔';
    }
  }

  // Filter gallery items based on active filter
  const filteredItems = galleryItems.filter(item => {
    if (activeFilter === 'all') return true
    return item.metadata?.category === activeFilter
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <Heading level={1}>My Gallery</Heading>
          <Text color="light" className="mt-1">
            Your saved try-on experiences and generations
          </Text>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            href="/dashboard/studio"
            className="inline-flex items-center"
          >
            Create New
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      
      {/* Filter buttons */}
      {!isLoading && galleryItems.length > 0 && categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category === activeFilter ? 'all' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category
                  ? 'bg-blue-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {getCategoryEmoji(category)} {category}
            </button>
          ))}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
        </div>
      ) : galleryItems.length === 0 ? (
        <Card className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-4 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <Heading level={3}>Your gallery is empty</Heading>
              <Text className="mt-2 mb-6">
                Start creating virtual try-ons and they will appear here
              </Text>
              <Button 
                variant="primary"
                href="/dashboard/studio"
              >
                Go to Studio
              </Button>
            </div>
          </div>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="text-center py-12">
          <Text color="light" className="text-lg">No images match the selected filter</Text>
          <Button 
            variant="tertiary"
            onClick={() => setActiveFilter('all')}
            className="mt-2"
          >
            Show all images
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden relative group"
              hover={true}
            >
              <div 
                className="relative h-64 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
                {item.metadata?.category && (
                  <Badge variant="primary" className="absolute top-2 left-2">
                    {getCategoryEmoji(item.metadata.category)} {item.metadata.category}
                  </Badge>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="inline-block bg-blue-primary text-white p-2 rounded-full hover:bg-blue-600"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        toast.success("Downloading image...");
                        
                        // Fetch the image
                        const response = await fetch(item.url);
                        const blob = await response.blob();
                        
                        // Create a blob URL
                        const blobUrl = URL.createObjectURL(blob);
                        
                        // Create a temporary link element
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = `trendy-mirror-${item.id}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        
                        // Clean up
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobUrl);
                      } catch (error) {
                        console.error("Download failed:", error);
                        toast.error("Download failed. Please try again.");
                      }
                    }}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmation({ id: item.id, name: item.name });
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <Text color="light" className="text-sm">
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-[90vw] max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh]">
              <Image
                src={selectedImage.url}
                alt={selectedImage.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                className="inline-block bg-blue-primary text-white rounded-full p-2 hover:bg-blue-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    toast.success("Downloading image...");
                    
                    // Fetch the image
                    const response = await fetch(selectedImage.url);
                    const blob = await response.blob();
                    
                    // Create a blob URL
                    const blobUrl = URL.createObjectURL(blob);
                    
                    // Create a temporary link element
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `trendy-mirror-${selectedImage.id}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    
                    // Clean up
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                  } catch (error) {
                    console.error("Download failed:", error);
                    toast.error("Download failed. Please try again.");
                  }
                }}
              >
                <ArrowDownTrayIcon className="h-6 w-6" />
              </button>
              <button
                className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                onClick={() => setSelectedImage(null)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <Heading level={3}>Confirm Deletion</Heading>
              <button 
                onClick={() => setDeleteConfirmation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <Text className="mb-6">Are you sure you want to delete this image? This action cannot be undone.</Text>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (deleteConfirmation) {
                    handleDelete(deleteConfirmation.id, deleteConfirmation.name)
                    setDeleteConfirmation(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
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