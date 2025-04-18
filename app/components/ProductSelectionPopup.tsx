'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase'
import { toast } from 'react-hot-toast'
import { TagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import { Heading, Text } from '@/app/components/ui/Typography'
import Badge from '@/app/components/ui/Badge'
import { useAuth } from '@/app/hooks/use-auth'

interface ProductSelectionPopupProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (productUrl: string, category: ProductCategory) => void
}

type ProductCategory = 'top' | 'bottom' | 'full-body'

interface Product {
  id: string
  url: string
  category: ProductCategory
  createdAt: string
  name?: string
  isExample?: boolean
}

export default function ProductSelectionPopup({ isOpen, onClose, onSelect }: ProductSelectionPopupProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<ProductCategory | 'all'>('all')
  const { user } = useAuth()

  useEffect(() => {
    // Popup açıldığında ürünleri yükle
    if (isOpen) {
      loadProducts()
      // Popup açıldığında seçimi ve filtreyi sıfırla
      setSelectedProduct(null)
      setActiveFilter('all')
    }
  }, [isOpen])

  useEffect(() => {
    // Ürünleri filtrele
    if (products.length > 0) {
      if (activeFilter === 'all') {
        setFilteredProducts(products)
      } else {
        setFilteredProducts(products.filter(product => product.category === activeFilter))
      }
    }
  }, [products, activeFilter])

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      console.log('Products loading...');
      
      // Önce rootLevel/klasörleri kontrol et
      const { data: rootFolders, error: rootError } = await supabase
        .storage
        .from('products')
        .list('', {
          limit: 100
        });

      if (rootError) {
        console.error('Supabase storage root listing error:', rootError);
        throw rootError;
      }

      console.log('Root folders:', rootFolders);
      
      // Varsayılan ürünleri ve kullanıcı ürünlerini depolamak için diziler
      let defaultProducts: Product[] = [];
      let userProducts: Product[] = [];

      // Varsayılan ürünleri yükle
      if (rootFolders.some(folder => folder.name === 'default')) {
        const { data: defaultFiles, error: defaultError } = await supabase
          .storage
          .from('products')
          .list('default', {
            sortBy: { column: 'created_at', order: 'desc' }
          });

        if (defaultError) {
          console.error('Default products listing error:', defaultError);
        } else if (defaultFiles && defaultFiles.length > 0) {
          console.log('Default products found:', defaultFiles.length);
          
          // Dosyaları filtrele - sadece resimleri kabul et
          const imageFiles = defaultFiles.filter(file => {
            if (!file.name) return false;
            const extension = file.name.split('.').pop()?.toLowerCase();
            return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif';
          });
          
          // Ürünleri oluştur
          defaultProducts = await Promise.all(
            imageFiles.map(async file => {
              // Dosya adından kategori çıkarımı yap
              let category: ProductCategory = 'top'; // Varsayılan kategori
              const filename = file.name.toLowerCase();
              
              // Beyaz şort (pc03uu9col002-1.jpg) için özel durum
              if (filename === 'pc03uu9col002-1.jpg') {
                category = 'bottom';
              } else if (filename.includes('bottom')) {
                category = 'bottom';
              } else if (filename.includes('full-body') || filename.includes('fullbody') || filename.includes('dress')) {
                category = 'full-body';
              }
              
              // Public URL oluştur
              const { data: urlData } = supabase.storage
                .from('products')
                .getPublicUrl(`default/${file.name}`);
              
              return {
                id: file.id || `default_${file.name}`,
                name: file.name,
                url: urlData.publicUrl,
                category,
                createdAt: file.created_at || new Date().toISOString(),
                isExample: true
              };
            })
          );
        }
      }
      
      // Kullanıcı giriş yapmışsa, kullanıcı ürünlerini yükle
      if (user) {
        const userFolder = `user_${user.id}`;
        
        // Kullanıcı klasörü var mı kontrol et
        if (rootFolders.some(folder => folder.name === userFolder)) {
          console.log('User products folder found:', userFolder);
          
          const { data: userFiles, error: userError } = await supabase
            .storage
            .from('products')
            .list(userFolder, {
              sortBy: { column: 'created_at', order: 'desc' }
            });
            
          if (userError) {
            console.error('User products listing error:', userError);
          } else if (userFiles && userFiles.length > 0) {
            console.log('User products found:', userFiles.length);
            
            // Dosyaları filtrele - sadece resimleri kabul et
            const imageFiles = userFiles.filter(file => {
              if (!file.name) return false;
              const extension = file.name.split('.').pop()?.toLowerCase();
              return extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp' || extension === 'gif';
            });
            
            // Ürünleri oluştur
            userProducts = await Promise.all(
              imageFiles.map(async file => {
                // Kategoriyi dosya adından veya metadatadan çıkar
                let category: ProductCategory = 'top'; // Varsayılan kategori
                
                // Önce metadata'ya bak
                if (file.metadata?.category) {
                  if (file.metadata.category === 'bottom' || file.metadata.category === 'full-body') {
                    category = file.metadata.category as ProductCategory;
                  }
                } else {
                  // Metadata yoksa dosya adından çıkarım yap
                  const filename = file.name.toLowerCase();
                  // Beyaz şort (pc03uu9col002-1.jpg) için özel durum
                  if (filename === 'pc03uu9col002-1.jpg') {
                    category = 'bottom';
                  } else if (filename.includes('bottom')) {
                    category = 'bottom';
                  } else if (filename.includes('full-body') || filename.includes('fullbody') || filename.includes('dress')) {
                    category = 'full-body';
                  }
                }
                
                // Public URL oluştur
                const { data: urlData } = supabase.storage
                  .from('products')
                  .getPublicUrl(`${userFolder}/${file.name}`);
                
                return {
                  id: file.id || file.name,
                  name: file.name,
                  url: urlData.publicUrl,
                  category,
                  createdAt: file.created_at || new Date().toISOString(),
                  isExample: false
                };
              })
            );
          }
        } else {
          console.log('User products folder not found yet:', userFolder);
        }
      }
      
      // Tüm ürünleri birleştir ve sırala
      const allProducts = [...userProducts, ...defaultProducts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log(`Loaded ${allProducts.length} products (${userProducts.length} user, ${defaultProducts.length} default)`);
      
      if (allProducts.length === 0) {
        console.warn('No products found');
        toast.error('No products found. Please try again later.');
      }
      
      setProducts(allProducts);
      
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Could not load products');
      
      // Başarısız olursa örnek ürünleri göster
      const sampleProducts = [
        {
          id: 'sample1',
          url: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/blue-tshirt.jpg',
          category: 'top' as ProductCategory,
          createdAt: new Date().toISOString(),
          name: 'Blue T-Shirt',
          isExample: true
        },
        {
          id: 'sample2',
          url: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/black-jeans.jpg',
          category: 'bottom' as ProductCategory,
          createdAt: new Date().toISOString(),
          name: 'Black Jeans',
          isExample: true
        },
        {
          id: 'sample3',
          url: 'https://pzdupryntrhecaveielk.supabase.co/storage/v1/object/public/products/default/red-dress.jpg',
          category: 'full-body' as ProductCategory,
          createdAt: new Date().toISOString(),
          name: 'Red Dress',
          isExample: true
        }
      ];
      
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  }

  const handleProductClick = (product: Product) => {
    console.log(`Product selected: ${product.name || product.id}, category: ${product.category}`);
    setSelectedProduct(product);
    
    // Pass both the product URL and category to the parent component
    onSelect(product.url, product.category);
    
    // Close the popup
    onClose();
    
    // Show success message
    toast.success(`${product.category.charAt(0).toUpperCase() + product.category.slice(1)} selected`);
  }

  // Kategori filtreleme fonksiyonu
  const handleFilterChange = (category: ProductCategory | 'all') => {
    setActiveFilter(category)
  }

  // Create category labels
  const categoryLabels = {
    'top': 'Top',
    'bottom': 'Bottom',
    'full-body': 'Full Body'
  };

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
                    <Heading level={3}>Choose a Product</Heading>
                    <Text color="light" className="text-sm mt-1">
                      Select a garment to try on with your model
                    </Text>
                  </Dialog.Title>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Category filter buttons */}
                {!isLoading && products.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleFilterChange('all')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'all'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      All Categories
                    </button>
                    <button
                      onClick={() => handleFilterChange('top')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'top'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      👕 Tops
                    </button>
                    <button
                      onClick={() => handleFilterChange('bottom')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'bottom'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      👖 Bottoms
                    </button>
                    <button
                      onClick={() => handleFilterChange('full-body')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeFilter === 'full-body'
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      👗 Full Body
                    </button>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
                  </div>
                ) : products.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Text className="text-gray-500 mb-4">No products available</Text>
                    <Button
                      variant="primary"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </Card>
                ) : filteredProducts.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Text className="text-gray-500 mb-4">No products match the selected filter</Text>
                    <Button
                      variant="tertiary"
                      onClick={() => setActiveFilter('all')}
                    >
                      Show all products
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                    {filteredProducts.map((product) => (
                      <Card 
                        key={product.id}
                        className="overflow-hidden relative group cursor-pointer"
                        hover={true}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-64">
                          <Image
                            src={product.url}
                            alt={product.name || `Product ${product.id}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <Badge 
                            variant="primary"
                            className="absolute top-2 left-2 font-medium text-xs py-1 px-3 shadow-sm"
                          >
                            {product.category === 'top' && '👕'}
                            {product.category === 'bottom' && '👖'}
                            {product.category === 'full-body' && '👗'}
                            {' '}{categoryLabels[product.category]}
                          </Badge>
                          
                          {product.isExample && (
                            <Badge 
                              variant="warning"
                              className="absolute bottom-2 right-2 font-medium text-xs py-0.5 px-2 shadow-sm text-[10px]"
                            >
                              Example
                            </Badge>
                          )}
                          
                          {/* Selection indicator */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                            <Button
                              variant="primary"
                              size="sm"
                              className="py-2 px-4 z-10"
                            >
                              Select Product
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
  );
} 