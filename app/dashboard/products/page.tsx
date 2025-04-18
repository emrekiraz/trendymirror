'use client'

import { useState, useEffect, useRef } from 'react'
import { Tab } from '@headlessui/react'
import { PhotoIcon, TagIcon, XMarkIcon, TrashIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'

type ProductCategory = 'top' | 'bottom' | 'full-body'

interface Product {
  id: string
  url: string
  category: ProductCategory
  createdAt: string
  name?: string
  cdnUrl: string
  originalUrl: string
  isExample?: boolean
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [bucketError, setBucketError] = useState<string | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, name: string } | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const { user } = useAuth()
  
  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize storage and load products
    loadProducts()
  }, [])

  useEffect(() => {
    console.log('Products veya activeFilter değişti, filtreleme uygulanıyor...')
    applyFilters()
    // Debug için ürünleri ve filtrelenmiş ürünleri konsola yazdır
    console.log('Products state:', products)
    console.log('Filtered products:', filteredProducts)
  }, [products, activeFilter])

  // İlk yükleme sonrası ürünler geldiğinde, 'all' filtresi varsayılan olarak seçili olmalı
  useEffect(() => {
    if (products.length > 0 && filteredProducts.length === 0) {
      console.log('Ürünler yüklendi ama filteredProducts boş, all filtresi uygulanıyor')
      setActiveFilter('all')
    }
  }, [products, filteredProducts])

  // Örnek ürünler için yardımcı fonksiyon
  function getSampleProducts(): Product[] {
    return [
      {
        id: 'sample-1',
        url: '/templates/garment-1.jpg',
        category: 'top',
        createdAt: new Date().toISOString(),
        name: 'sample-top-1.jpg',
        cdnUrl: '',
        originalUrl: '',
        isExample: true
      },
      {
        id: 'sample-2',
        url: '/images/sample-generation-1.jpg',
        category: 'bottom',
        createdAt: new Date().toISOString(),
        name: 'sample-bottom-1.jpg',
        cdnUrl: '',
        originalUrl: '',
        isExample: true
      },
      {
        id: 'sample-3',
        url: '/images/sample-generation-2.jpg',
        category: 'full-body',
        createdAt: new Date().toISOString(),
        name: 'sample-full-body-1.jpg',
        cdnUrl: '',
        originalUrl: '',
        isExample: true
      },
      {
        id: 'sample-4',
        url: '/images/sample-generation-3.jpg',
        category: 'top',
        createdAt: new Date().toISOString(),
        name: 'sample-top-2.jpg',
        cdnUrl: '',
        originalUrl: '',
        isExample: true
      }
    ]
  }

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Products loading...');
      
      // Get the files from Supabase storage - user specific folder
      const userFolder = user?.id ? `user_${user.id}` : null;
      
      // If user is not logged in, show only sample products
      if (!userFolder) {
        console.log('User not logged in, showing sample products only');
        setProducts(getSampleProducts());
        setIsLoading(false);
        return;
      }
      
      // First check if user folder exists
      const { data: userFolderCheck, error: userFolderError } = await supabase
        .storage
        .from('products')
        .list('', {
          limit: 100
        });
        
      if (userFolderError) {
        console.error('Error checking user folder:', userFolderError);
        throw userFolderError;
      }
      
      // Check if user folder exists
      const userFolderExists = userFolderCheck.some(item => item.name === userFolder);
      
      // If user folder doesn't exist, show only default products
      if (!userFolderExists) {
        console.log('User folder does not exist, showing default products only');
      }
      
      // Get user's products if folder exists
      let userProducts: Product[] = [];
      if (userFolderExists) {
        const { data: userFiles, error: userFilesError } = await supabase
          .storage
          .from('products')
          .list(userFolder, {
            sortBy: { column: 'created_at', order: 'desc' }
          });
          
        if (userFilesError) {
          console.error('Error fetching user files:', userFilesError);
        } else if (userFiles) {
          console.log('User files:', userFiles);
          
          // Create products from user files
          userProducts = userFiles
            .filter(file => {
              // Check if it's a file (not a folder) and has an image extension
              return file.name && !file.name.endsWith('/') && 
                (file.name.toLowerCase().endsWith('.jpg') || 
                file.name.toLowerCase().endsWith('.jpeg') || 
                file.name.toLowerCase().endsWith('.png') || 
                file.name.toLowerCase().endsWith('.gif'));
            })
            .map(file => {
              let category: ProductCategory = 'top';
              // Beyaz şort için özel kontrol
              if (file.name === 'pc03uu9col002-1.jpg') {
                category = 'bottom';
                console.log(`User product: ${file.name} categorized as BOTTOM`);
              } else if (file.name.includes('bottom')) {
                category = 'bottom';
                console.log(`User product: ${file.name} categorized as bottom by name`);
              } else if (file.name.includes('full-body') || file.name.includes('fullbody') || file.name.includes('dress') || file.name.includes('red_dress')) {
                category = 'full-body';
                console.log(`User product: ${file.name} categorized as full-body by name`);
              } else {
                console.log(`User product: ${file.name} categorized as top (default)`);
              }
              
              // Create URLs for the image
              const publicUrlData = supabase.storage.from('products').getPublicUrl(`${userFolder}/${file.name}`);
              const originalUrl = publicUrlData.data.publicUrl;
              
              // Doğrudan Supabase URL'sini kullan, proxy kullanma
              const imageUrl = originalUrl;
              
              return {
                id: file.id || `${userFolder}-${file.name}`,
                name: file.name,
                url: imageUrl,
                originalUrl: originalUrl,
                cdnUrl: '',
                category: category,
                createdAt: file.created_at || new Date().toISOString(),
                isExample: false
              };
            });
        }
      }

      // Get the files from Supabase storage - default folder for examples
      const { data: files, error } = await supabase
        .storage
        .from('products')
        .list('', {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Supabase storage error:', error);
        throw error;
      }

      console.log('All files:', files);

      // First, check if we have a default folder
      const defaultFolder = files.find(file => file.name === 'default');
      let defaultProducts: Product[] = [];

      // If default folder exists, load example products from it
      if (defaultFolder) {
        const { data: defaultFiles, error: defaultError } = await supabase
          .storage
          .from('products')
          .list('default', {
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (!defaultError && defaultFiles) {
          console.log('Default products:', defaultFiles);
          
          // Create products from default files
          defaultProducts = defaultFiles
            .filter(file => {
              // Check if it's a file (not a folder) and has an image extension
              return file.name && !file.name.endsWith('/') && 
                (file.name.toLowerCase().endsWith('.jpg') || 
                file.name.toLowerCase().endsWith('.jpeg') || 
                file.name.toLowerCase().endsWith('.png') || 
                file.name.toLowerCase().endsWith('.gif'));
            })
            .map(file => {
              let category: ProductCategory = 'top';
              // Beyaz şort için özel kontrol
              if (file.name === 'pc03uu9col002-1.jpg') {
                category = 'bottom';
                console.log(`Default product: ${file.name} categorized as BOTTOM`);
              } else if (file.name.includes('bottom')) {
                category = 'bottom';
                console.log(`Default product: ${file.name} categorized as bottom by name`);
              } else if (file.name.includes('full-body') || file.name.includes('fullbody')) {
                category = 'full-body';
                console.log(`Default product: ${file.name} categorized as full-body by name`);
              } else {
                console.log(`Default product: ${file.name} categorized as top (default)`);
              }
              
              // Create URLs for the image
              const publicUrlData = supabase.storage.from('products').getPublicUrl(`default/${file.name}`);
              const originalUrl = publicUrlData.data.publicUrl;
              
              // Doğrudan Supabase URL'sini kullan, proxy kullanma
              const imageUrl = originalUrl;
              
              return {
                id: file.id || `default-${file.name}`,
                name: file.name,
                url: imageUrl,
                originalUrl: originalUrl,
                cdnUrl: '',
                category: category,
                createdAt: file.created_at || new Date().toISOString(),
                isExample: true
              };
            });
        }
      }
      
      // Combine user products and default products
      const allProducts = [...userProducts, ...defaultProducts];
      console.log('Created products:', allProducts);
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    console.log('applyFilters çalıştı, mevcut filtre:', activeFilter);
    console.log('Mevcut products:', products);
    
    // Debug için tüm ürünlerin kategorisini doğrula
    products.forEach(product => {
      console.log(`Product Debug - ${product.name}: category=${product.category}, isExample=${product.isExample}`);
    });
    
    // Eğer all filtresi aktif ise, tüm ürünleri göster
    if (activeFilter === 'all') {
      console.log('All filtresi aktif, tüm ürünleri gösteriyorum:', products.length);
      setFilteredProducts(products);
      return;
    }

    // Seçilen filtreye göre ürünleri filtrele
    const filtered = products.filter(product => {
      // Debug için kategorileri kontrol et
      console.log(`Product ${product.name} category: ${product.category}, filter: ${activeFilter}`);
      return product.category === activeFilter;
    });

    console.log('Number of products after filtering:', filtered.length);
    
    // If filter results are not empty, update; otherwise keep existing products
    if (filtered.length > 0) {
      setFilteredProducts(filtered);
    } else {
      console.log('No products found with filter, showing all products');
      // If the filter results are empty, do nothing but inform the user
      toast.error(`No products found in "${activeFilter}" category`);
    }
  }

  const handleFilterChange = (filterName: string) => {
    setActiveFilter(filterName);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Check if file already exists by comparing with existing products
      const checkDuplicateImage = async () => {
        try {
          // Create a temporary URL for the selected file
          const tempUrl = URL.createObjectURL(file)
          // TypeScript hatası için HTMLImageElement kullan
          const img = document.createElement('img') as HTMLImageElement
          img.width = 1
          img.height = 1
          
          // Create a promise to handle image loading
          const imageLoadPromise = new Promise((resolve, reject) => {
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = tempUrl
          })
          
          // Wait for image to load
          await imageLoadPromise
          
          // Check if an image with the same name already exists
          const similarImage = products.find(product => {
            return product.url.includes(file.name)
          })
          
          if (similarImage) {
            alert('This image or a similar one already exists in your products')
            URL.revokeObjectURL(tempUrl)
            return false
          }
          
          // Clean up the temporary URL
          URL.revokeObjectURL(tempUrl)
          return true
        } catch (error) {
          console.error('Error checking for duplicate image:', error)
          return true // Continue with upload if check fails
        }
      }
      
      checkDuplicateImage().then(shouldContinue => {
        if (shouldContinue) {
          setSelectedFile(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviewImage(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    handleFileSelect(file)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          handleFileSelect(file)
          break
        }
      }
    }
  }

  const handleUrlInput = async (url: string) => {
    try {
      setIsUploading(true)
      
      // Fetch the image from the URL
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch image from URL')
      
      const blob = await response.blob()
      const file = new File([blob], `image-from-url.${blob.type.split('/')[1] || 'jpg'}`, { type: blob.type })
      
      handleFileSelect(file)
    } catch (error) {
      console.error('Error uploading product from URL:', error)
      alert('Failed to upload product from URL')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUploadConfirm = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }
    
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }
    
    // Kullanıcı giriş yapmamışsa yükleme yapılamaz
    if (!user) {
      toast.error('You must be logged in to upload products');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Generate a unique filename with category prefix
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${selectedCategory}-${uuidv4()}.${fileExt}`;
      
      // Kullanıcıya özel klasör yolu oluştur
      const userFolder = `user_${user.id}`;
      const filePath = `${userFolder}/${fileName}`;
      
      // Dosyayı ArrayBuffer'a dönüştür
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Önce klasörün var olup olmadığını kontrol et
      const { data: folderCheck, error: folderError } = await supabase
        .storage
        .from('products')
        .list('', {
          limit: 100
        });
        
      if (folderError) {
        console.error('Error checking folders:', folderError);
        throw folderError;
      }
      
      // Kullanıcı klasörü yoksa, boş bir dosya yükleyerek klasörü oluştur
      const folderExists = folderCheck.some(item => item.name === userFolder);
      if (!folderExists) {
        console.log('Creating user folder:', userFolder);
        // Boş bir dosya yükleyerek klasörü oluştur
        const { error: createFolderError } = await supabase
          .storage
          .from('products')
          .upload(`${userFolder}/.folder`, new Uint8Array(0), {
            contentType: 'application/x-directory'
          });
          
        if (createFolderError && !createFolderError.message.includes('already exists')) {
          console.error('Error creating user folder:', createFolderError);
          // Klasör oluşturma hatası kritik değil, devam et
        }
      }
      
      // Dosyayı doğrudan Supabase'e yükle
      const { data, error } = await supabase
        .storage
        .from('products')
        .upload(filePath, buffer, {
          contentType: selectedFile.type,
          upsert: true
        });
      
      console.log('Upload result:', { data, error });
      
      if (!error) {
        // Yüklenen dosyanın public URL'ini al
        const { data: urlData } = supabase
          .storage
          .from('products')
          .getPublicUrl(filePath);
        
        // Add to products state
        const newProduct: Product = {
          id: data?.path || uuidv4(),
          name: fileName,
          url: urlData.publicUrl,
          category: selectedCategory,
          createdAt: new Date().toISOString(),
          cdnUrl: '',
          originalUrl: urlData.publicUrl,
          isExample: false
        };
        
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product uploaded successfully');
        
        // Reset the upload state
        setSelectedFile(null);
        setPreviewImage(null);
        setShowUploadModal(false);
      } else {
        // Supabase yüklemesi başarısız olursa, yerel URL oluştur ve state'e ekle
        console.warn('Supabase upload failed:', error.message);
        
        const localUrl = URL.createObjectURL(selectedFile);
        const newProduct: Product = {
          id: uuidv4(),
          name: fileName,
          url: localUrl,
          category: selectedCategory,
          createdAt: new Date().toISOString(),
          cdnUrl: '',
          originalUrl: localUrl,
          isExample: false
        };
        
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product added locally (Storage upload failed)');
        
        // Reset the upload state
        setSelectedFile(null);
        setPreviewImage(null);
        setShowUploadModal(false);
      }
    } catch (error: any) {
      console.error('Error in upload process:', error);
      toast.error(`Failed to upload product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getCategoryIcon = (category: ProductCategory) => {
    switch (category) {
      case 'top':
        return '👕'
      case 'bottom':
        return '👖'
      case 'full-body':
        return '👗'
      default:
        return '🧥'
    }
  }

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting product: ${id}`);
      
      // Find the product to delete
      const productToDelete = products.find(p => p.id === id);
      if (!productToDelete) {
        console.error(`Product with ID ${id} not found`);
        return;
      }
      
      // Prevent deletion of example products
      if (productToDelete.isExample) {
        toast.error('Example products cannot be deleted');
        setDeleteConfirmation(null);
        return;
      }
      
      // Kullanıcı giriş yapmamışsa silme yapılamaz
      if (!user) {
        toast.error('You must be logged in to delete products');
        return;
      }
      
      console.log(`Product to delete:`, productToDelete);
      
      // Remove product from local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      setFilteredProducts(prevProducts => prevProducts.filter(p => p.id !== id));
      setDeleteConfirmation(null);
      
      // Kullanıcıya özel klasör yolu oluştur
      const userFolder = `user_${user.id}`;
      const filePath = `${userFolder}/${productToDelete.name || ''}`;
      
      // Delete from Supabase
      const { error } = await supabase
        .storage
        .from('products')
        .remove([filePath]); // Kullanıcı klasörü içindeki dosya yolunu kullan
      
      if (error) {
        console.error('Supabase storage error:', error);
        toast.error('Error occurred while deleting the product');
        // UI is already updated, product will reload when user refreshes the page
      } else {
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error occurred while deleting the product');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Heading level={1}>My Products</Heading>
          <Text color="light" className="mt-1">
            Manage your clothing products for virtual try-on
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" />
            Add Product
          </Button>
          <Button
            variant="secondary"
            href="/dashboard/studio"
            className="inline-flex items-center"
          >
            Go to Studio
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {bucketError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Storage Error</p>
          <p>{bucketError}</p>
          <button 
            onClick={loadProducts} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter buttons using Models styling */}
      {!isLoading && products.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={classNames(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              activeFilter === 'all'
                ? 'bg-blue-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            All Products
          </button>
          <button
            onClick={() => handleFilterChange('top')}
            className={classNames(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
              activeFilter === 'top'
                ? 'bg-blue-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            <span>👕</span>
            Tops
          </button>
          <button
            onClick={() => handleFilterChange('bottom')}
            className={classNames(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
              activeFilter === 'bottom'
                ? 'bg-blue-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            <span>👖</span>
            Bottoms
          </button>
          <button
            onClick={() => handleFilterChange('full-body')}
            className={classNames(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1',
              activeFilter === 'full-body'
                ? 'bg-blue-primary text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            <span>👗</span>
            Full Body
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <PhotoIcon className="h-16 w-16 text-gray-400" />
          </div>
          <Heading level={3} className="mb-2">No products yet</Heading>
          <Text color="light" className="mb-6">
            Add your first product to start creating virtual try-ons
          </Text>
          <Button
            variant="primary"
            onClick={() => setShowUploadModal(true)}
          >
            Add Product
          </Button>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <Text color="light" className="text-lg">No products match the selected filter</Text>
          <Button 
            variant="secondary"
            onClick={() => setActiveFilter('all')}
            className="mt-4"
          >
            Show all products
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden relative group cursor-pointer"
              hover={true}
              onClick={() => setSelectedImage(product.url)}
            >
              <div className="relative h-64">
                <Image
                  src={product.url}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.log(`Image could not be loaded: ${(e.target as HTMLImageElement).src}`);
                    const imgElement = e.target as HTMLImageElement;
                    
                    // Eğer proxy URL ile yüklenmediyse orijinal URL'yi dene
                    if (imgElement.src === product.url && product.originalUrl) {
                      console.log(`Switching to original URL: ${product.originalUrl}`);
                      imgElement.src = product.originalUrl;
                    } else {
                      // Tüm URL'ler başarısız olursa placeholder göster
                      console.log(`All URLs failed, showing placeholder`);
                      imgElement.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                      imgElement.onerror = null; // Prevent infinite loop
                    }
                  }}
                />
                {/* Category badge - ProductSelectionPopup ile aynı stil */}
                <Badge 
                  variant="primary"
                  className="absolute top-2 right-2 font-medium text-xs py-1 px-3 shadow-sm bg-blue-100"
                >
                  {product.category === 'top' && '👕'}
                  {product.category === 'bottom' && '👖'}
                  {product.category === 'full-body' && '👗'}
                  {' '}
                  {product.category === 'top' ? 'Top' : 
                   product.category === 'bottom' ? 'Bottom' : 'Full Body'}
                </Badge>
                
                {/* Example indicator */}
                {product.isExample && (
                  <Badge 
                    variant="warning" 
                    className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 opacity-100"
                  >
                    Example
                  </Badge>
                )}
                
                {/* Actions overlay - Yeni tasarım */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-0">
                  <div className="p-3 flex justify-between items-end">
                    <Button
                      href={`/dashboard/studio?garment=${encodeURIComponent(product.url)}&category=${product.category}`}
                      className="text-sm rounded-md py-1.5 px-5"
                      size="sm"
                    >
                      Try On
                    </Button>
                    
                    {!product.isExample && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmation({ id: product.id, name: product.name || '' });
                        }}
                        className="p-2 bg-gray-200/30 hover:bg-gray-200/50 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            {/* Close button (X) in the top-right corner */}
            <button
              type="button"
              onClick={() => {
                setShowUploadModal(false)
                setPreviewImage(null)
                setSelectedFile(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-bold mb-4">Upload New Product</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Category
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('top')}
                  className={`py-2 px-4 rounded-lg border ${
                    selectedCategory === 'top' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300'
                  }`}
                >
                  👕 Top
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('bottom')}
                  className={`py-2 px-4 rounded-lg border ${
                    selectedCategory === 'bottom' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300'
                  }`}
                >
                  👖 Bottom
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('full-body')}
                  className={`py-2 px-4 rounded-lg border ${
                    selectedCategory === 'full-body' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300'
                  }`}
                >
                  👗 Full-Body
                </button>
              </div>
            </div>
            
            {previewImage ? (
              <div className="mb-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUploadConfirm}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                  >
                    <PhotoIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">
                      Click to upload or drag & drop<br/>
                      You can also paste an image
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://example.com/image.jpg"
                    onChange={(e) => {
                      const url = e.target.value.trim();
                      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                        handleUrlInput(url);
                      }
                    }}
                    onPaste={(e) => {
                      // Get pasted text
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://'))) {
                        e.preventDefault();
                        handleUrlInput(pastedText);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        e.preventDefault();
                        handleUrlInput(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full">
            <XMarkIcon 
              className="absolute top-2 right-2 h-8 w-8 text-white cursor-pointer bg-black bg-opacity-50 rounded-full p-1 z-10" 
              onClick={() => setSelectedImage(null)}
            />
            <img 
              src={selectedImage} 
              alt="Product Detail" 
              className="max-w-full max-h-[80vh] object-contain mx-auto"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.log(`Large image could not be loaded: ${selectedImage}`);
                // Resim yüklenemezse placeholder göster
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this product?</h3>
            <p className="mb-6">You are about to delete the product "{deleteConfirmation.name}". This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(deleteConfirmation.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 