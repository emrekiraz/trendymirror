'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase'
import { useAuth } from '@/app/hooks/use-auth'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import toast from 'react-hot-toast'
import { ArrowLeftIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline'

// Ürün kategorisi tipleri
type ProductCategory = 'top' | 'bottom' | 'full-body'

// Ürün tipi
interface Product {
  id: string
  name: string
  url: string
  path: string
  category: ProductCategory
  createdAt: string
  isUpdating: boolean
}

// Admin email listesi
const adminEmails = [
  'arifemrekiraz@gmail.com', 
  // Buraya diğer admin e-posta adreslerini ekleyebilirsiniz
  // Örnek: 'ikinci.admin@gmail.com', 
  // Örnek: 'ucuncu.admin@gmail.com'
]

export default function AdminProductsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  // Kullanıcının admin olup olmadığını kontrol et
  const isAdmin = user && adminEmails.includes(user.email || '')
  
  // Sayfa yüklendiğinde admin kontrolü yap ve ürünleri getir
  useEffect(() => {
    // Kullanıcı yükleniyor
    if (authLoading) return
    
    // Kullanıcı yok veya admin değil
    if (!isAdmin) {
      toast.error('Bu sayfaya erişim yetkiniz yok')
      router.push('/dashboard')
      return
    }
    
    // Admin kullanıcı ise ürünleri getir
    loadProducts()
  }, [user, authLoading, router])
  
  // Ürünleri yükle
  const loadProducts = async () => {
    setIsLoading(true)
    try {
      console.log('Ürünler yükleniyor...')
      
      // Default products klasörünü listele
      const { data: defaultFiles, error: defaultError } = await supabase
        .storage
        .from('products')
        .list('default', {
          sortBy: { column: 'created_at', order: 'desc' }
        })
        
      if (defaultError) {
        console.error('Ürünler listelenirken hata:', defaultError)
        toast.error('Ürünler yüklenirken bir hata oluştu')
        return
      }
      
      // Resim dosyalarını filtrele
      const imageFiles = defaultFiles.filter(file => {
        if (!file.name) return false
        const extension = file.name.split('.').pop()?.toLowerCase()
        return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif'
      })
      
      // Ürünleri oluştur
      const productItems = await Promise.all(
        imageFiles.map(async file => {
          // Kategoriyi metadata'dan al veya tahmin et
          let category: ProductCategory = 'top' // Varsayılan kategori
          
          // Önce metadata'ya bak
          if (file.metadata?.category) {
            // Metadata'daki kategori geçerliyse al
            if (['top', 'bottom', 'full-body'].includes(file.metadata.category)) {
              category = file.metadata.category as ProductCategory
            }
          } else {
            // Metadata yoksa dosya adından tahmin et
            const filename = file.name.toLowerCase()
            if (filename.includes('bottom') || filename.includes('shorts') || filename.includes('pant')) {
              category = 'bottom'
            } else if (filename.includes('full-body') || filename.includes('fullbody') || filename.includes('dress')) {
              category = 'full-body'
            }
          }
          
          // Public URL oluştur
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(`default/${file.name}`)
          
          return {
            id: file.id,
            name: file.name,
            path: `default/${file.name}`,
            url: urlData.publicUrl,
            category,
            createdAt: file.created_at || new Date().toISOString(),
            isUpdating: false
          }
        })
      )
      
      console.log(`${productItems.length} ürün bulundu`)
      setProducts(productItems)
      
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
      toast.error('Ürünler yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Kategori seçildiğinde
  const handleCategoryChange = async (product: Product, newCategory: ProductCategory) => {
    // Ürünün güncelleme durumunu işaretleyelim
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, isUpdating: true } : p
    ))
    
    try {
      console.log(`Ürün kategorisi güncelleniyor: ${product.name} → ${newCategory}`)
      
      // Dosyayı indir ve metadata ile birlikte yeniden yükle
      const tempResponse = await fetch(product.url)
      const fileBlob = await tempResponse.blob()
      
      // Dosyayı yükleyelim, bu işlem aynı zamanda metadata'yı da güncelleyecek
      const { data, error } = await supabase
        .storage
        .from('products')
        .upload(product.path, fileBlob, {
          upsert: true,
          contentType: fileBlob.type,
          cacheControl: '3600',
          metadata: {
            category: newCategory
          }
        })
      
      if (error) {
        throw error
      }
      
      // Başarılı olursa, ürün listesini güncelle
      setProducts(prev => prev.map(p => 
        p.id === product.id 
          ? { ...p, category: newCategory, isUpdating: false } 
          : p
      ))
      
      toast.success(`"${product.name}" ürünü "${newCategory}" olarak güncellendi`)
      
    } catch (error) {
      console.error('Kategori güncellenirken hata:', error)
      toast.error('Kategori güncellenirken bir hata oluştu')
      
      // Hata durumunda güncelleme durumunu sıfırla
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, isUpdating: false } : p
      ))
    }
  }
  
  // Kategori badge'i için stil ve emoji
  const getCategoryBadge = (category: ProductCategory) => {
    switch (category) {
      case 'top':
        return { icon: '👕', label: 'Top', variant: 'primary' };
      case 'bottom':
        return { icon: '👖', label: 'Bottom', variant: 'success' };
      case 'full-body':
        return { icon: '👗', label: 'Full Body', variant: 'warning' };
      default:
        return { icon: '👔', label: 'Unknown', variant: 'neutral' };
    }
  }
  
  // Admin değilse veya yükleme devam ediyorsa
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Admin değilse
  if (!isAdmin && !authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md w-full text-center">
          <Heading level={2} className="text-red-600 mb-4">Yetkisiz Erişim</Heading>
          <Text className="mb-6">Bu sayfaya erişim yetkiniz bulunmamaktadır.</Text>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Dashboard'a Dön
          </Button>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Heading level={1}>Ürün Yönetimi</Heading>
          <Text color="light" className="mt-1">
            Ürünlerin kategorilerini ve detaylarını buradan yönetebilirsiniz
          </Text>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Dashboard'a Dön
          </Button>
          <Button
            variant="primary"
            onClick={loadProducts}
            className="inline-flex items-center"
            disabled={isLoading}
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const categoryInfo = getCategoryBadge(product.category)
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={product.url}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                  <Badge
                    variant={categoryInfo.variant as any}
                    className="absolute top-2 left-2 font-medium"
                  >
                    {categoryInfo.icon} {categoryInfo.label}
                  </Badge>
                </div>
                <div className="p-4">
                  <div title={product.name}>
                    <Text className="font-medium mb-2 truncate">
                      {product.name}
                    </Text>
                  </div>
                  
                  <div className="mt-4">
                    <Text className="text-sm font-medium mb-2">Kategori Değiştir:</Text>
                    <div className="flex flex-wrap gap-2">
                      {product.isUpdating ? (
                        <div className="w-full py-2 text-center">
                          <div className="animate-spin inline-block w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                          <span className="ml-2 text-sm">Güncelleniyor...</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleCategoryChange(product, 'top')}
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                              product.category === 'top'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            disabled={product.isUpdating}
                          >
                            👕 Top
                            {product.category === 'top' && <CheckIcon className="w-4 h-4 ml-1 text-white" />}
                          </button>
                          <button
                            onClick={() => handleCategoryChange(product, 'bottom')}
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                              product.category === 'bottom'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            disabled={product.isUpdating}
                          >
                            👖 Bottom
                            {product.category === 'bottom' && <CheckIcon className="w-4 h-4 ml-1 text-white" />}
                          </button>
                          <button
                            onClick={() => handleCategoryChange(product, 'full-body')}
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                              product.category === 'full-body'
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            disabled={product.isUpdating}
                          >
                            👗 Full Body
                            {product.category === 'full-body' && <CheckIcon className="w-4 h-4 ml-1 text-white" />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 