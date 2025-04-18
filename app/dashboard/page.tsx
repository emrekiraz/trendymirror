"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  CameraIcon,
  UserGroupIcon,
  PhotoIcon,
  ArrowRightIcon,
  HeartIcon,
  ShoppingBagIcon,
  SparklesIcon,
  ShoppingCartIcon,
  HomeIcon,
  UserIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { Shirt } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { Heading, Text } from '@/app/components/ui/Typography'
import { supabase } from '@/app/lib/supabase'
import { useAuth } from '@/app/hooks/use-auth'
import { useRouter } from 'next/navigation'

interface GalleryItem {
  id: string
  name: string
  url: string
  created_at: string
  metadata?: {
    category?: string
    [key: string]: any
  }
}

const quickActions = [
  {
    title: 'Virtual Try-On',
    description: 'Try clothes on your photos with AI-powered technology',
    icon: CameraIcon,
    href: '/dashboard/studio',
    color: 'bg-blue-tertiary text-blue-primary',
    badge: 'AI'
  },
  {
    title: 'Model Selection',
    description: 'Choose from our diverse collection of virtual models',
    icon: UserGroupIcon,
    href: '/dashboard/models',
    color: 'bg-purple-accent bg-opacity-10 text-purple-accent',
    badge: 'New',
  },
  {
    title: 'My Products',
    description: 'Manage your clothing items and products collection',
    icon: ShoppingBagIcon,
    href: '/dashboard/products',
    color: 'bg-green-50 text-green-600',
    badge: null
  }
]

// Sample template data
const templates = [
  {
    model: '/api/image-proxy?bucket=models&name=default/TrendyMirror_2.png',
    garment: '/api/image-proxy?bucket=products&name=default/110000079539214.jpg',
    category: 'top',
    modelName: 'TrendyMirror_2.png',
    garmentName: '110000079539214.jpg'
  },
  {
    model: '/api/image-proxy?bucket=models&name=default/TrendyMirror_13.png',
    garment: '/api/image-proxy?bucket=products&name=default/red_dress.jpg',
    category: 'full-body',
    modelName: 'TrendyMirror_13.png',
    garmentName: 'red_dress.jpg'
  },
  {
    model: '/api/image-proxy?bucket=models&name=default/TrendyMirror_1.png',
    garment: '/api/image-proxy?bucket=products&name=default/pc03uu9col002-1.jpg',
    category: 'bottom',
    modelName: 'TrendyMirror_1.png',
    garmentName: 'pc03uu9col002-1.jpg'
  }
]

export default function DashboardHome() {
  const { user, isLoading: authLoading } = useAuth()
  const [recentGenerations, setRecentGenerations] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  // Admin email listesi - sadece bu emailleri olan kullanıcılar admin paneline erişebilir
  const adminEmails = [
    'arifemrekiraz@gmail.com', 
    // Buraya diğer admin e-posta adreslerini ekleyebilirsiniz
    // Örnek: 'ikinci.admin@gmail.com', 
    // Örnek: 'ucuncu.admin@gmail.com'
  ]
  const isAdmin = user && adminEmails.includes(user.email || '')

  // Check if user needs onboarding based on URL parameters and Supabase data
  useEffect(() => {
    if (!user || authLoading) return;
    
    const checkOnboardingStatus = async () => {
      try {
        // 1. Check URL parameters first (from auth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const needsOnboardingParam = urlParams.get('needs_onboarding');
        const newUserParam = urlParams.get('new_user');
        const authSuccess = urlParams.get('auth_success');
        
        console.log('Dashboard onboarding check - URL parameters:', {
          needsOnboardingParam,
          newUserParam,
          authSuccess
        });
        
        // Eğer URL parametreleri açıkça onboarding gerektiğini söylüyorsa
        // hızlıca yönlendir ve database sorgusunu atla
        if (needsOnboardingParam === 'true' && authSuccess === 'true') {
          console.log('URL parameters indicate onboarding needed, redirecting immediately');
          router.replace(`/onboarding?from_dashboard=true&auth_success=${authSuccess}`, { scroll: false });
          return;
        }
        
        // 2. Sadece URL parametreleri açık değilse database'e bak
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
          
        const needsOnboarding = profileData ? 
          profileData.onboarding_completed === false : true;
          
        console.log('Dashboard onboarding check - Database:', {
          profileExists: !!profileData,
          onboardingCompleted: profileData?.onboarding_completed,
          needsOnboarding
        });
        
        // 3. Eğer database onboarding gerektiğini söylüyorsa yönlendir
        if (needsOnboarding) {
          console.log('Database indicates onboarding needed, redirecting');
          router.replace('/onboarding?from_dashboard=true', { scroll: false });
          return;
        }
        
        // 4. URL parametrelerini temizle
        if (authSuccess) {
          // Remove auth parameters from URL without page reload
          const newUrl = new URL(window.location.href);
          const params = new URLSearchParams(newUrl.search);
          params.delete('auth_success');
          params.delete('needs_onboarding');
          params.delete('new_user');
          params.delete('auth_intent');
          params.delete('existing_user');
          
          const newSearch = params.toString();
          const cleanUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
          window.history.replaceState({}, '', cleanUrl);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    // Hemen çalıştır, bekleme yok
    checkOnboardingStatus();
  }, [user, authLoading, router]);

  useEffect(() => {
    // Only fetch data if we have a user
    if (!user && !authLoading) return
    
    async function fetchRecentGenerations() {
      setIsLoading(true)
      try {
        console.log('Fetching recent generations...');
        
        // Fetch gallery items from Supabase for the current user only
        const { data, error } = await supabase
          .storage
          .from('gallery')
          .list(`user_${user?.id || 'unknown'}`, {
            sortBy: { column: 'created_at', order: 'desc' },
            limit: 5 // Only get the 5 most recent items
          })

        if (error) {
          console.error('Error fetching from Supabase:', error);
          throw error;
        }

        if (data && data.length > 0) {
          // Map the data to GalleryItem objects
          const items: GalleryItem[] = await Promise.all(
            data.map(async (item) => {
              const { data: urlData } = await supabase
                .storage
                .from('gallery')
                .getPublicUrl(`user_${user?.id || 'unknown'}/${item.name}`)

              return {
                id: item.id,
                created_at: item.created_at,
                name: item.name,
                url: urlData.publicUrl,
                metadata: item.metadata || {}
              }
            })
          );
          
          console.log('Fetched gallery items:', items);
          setRecentGenerations(items);
        } else {
          console.log('No gallery items found, using sample data');
          // If no items found, use sample data
          setRecentGenerations(getSampleGenerations());
        }
      } catch (error) {
        console.error('Error fetching recent generations:', error)
        // Show sample data in case of error
        console.log('Using sample generations due to error');
        setRecentGenerations(getSampleGenerations())
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if auth is not loading anymore
    if (!authLoading) {
      fetchRecentGenerations()
    }
  }, [user, authLoading])

  // Örnek üretimler için yardımcı fonksiyon
  function getSampleGenerations(): GalleryItem[] {
    return [
      {
        id: 'sample-1',
        created_at: new Date().toISOString(),
        name: 'sample-generation-1.jpg',
        url: '/templates/model-1.jpg',
        metadata: { category: 'full-body' }
      },
      {
        id: 'sample-2',
        created_at: new Date().toISOString(),
        name: 'sample-generation-2.jpg',
        url: '/templates/garment-1.jpg',
        metadata: { category: 'top' }
      },
      {
        id: 'sample-3',
        created_at: new Date().toISOString(),
        name: 'sample-generation-3.jpg',
        url: '/images/model-guide.jpg',
        metadata: { category: 'bottom' }
      },
      {
        id: 'sample-4',
        created_at: new Date().toISOString(),
        name: 'sample-generation-4.jpg',
        url: '/images/garment-guide.jpg',
        metadata: { category: 'full-body' }
      }
    ]
  }

  // Show loading state while authentication is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If no user is found after loading completes, redirect to sign-in
  if (!user && !authLoading) {
    console.log('No user found, redirecting to sign-in')
    router.push('/home')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <LockClosedIcon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the dashboard. You will be redirected to the home page.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Check URL parameter
    const searchParams = new URLSearchParams(window.location.search);
    const isExistingUser = searchParams.get('existing_user') === 'true';
    
    if (isExistingUser) {
      // Show existing user notification
      toast("You already have an account with this email address.");
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Admin Panel Button - Sadece admin için görünür */}
      {isAdmin && (
        <section className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <Heading level={3} className="text-purple-800">Admin Kontrol Paneli</Heading>
              <Text className="text-purple-700">
                Bu bölüm sadece yöneticiler için görünür. Ürün kategorilerini ve ayarları yönetebilirsiniz.
              </Text>
            </div>
            <Button
              variant="primary"
              href="/dashboard/admin/products"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={(e) => {
                e.preventDefault();
                router.push('/dashboard/admin/products');
              }}
            >
              Ürünleri Yönet
            </Button>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <Heading level={2} className="mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.title} 
              variant="feature" 
              className="group hover:shadow-level-2 transition-all"
            >
              <Link href={action.href} className="block">
                <div className="flex items-start space-x-4">
                  <div className={`p-2.5 rounded-md ${action.color} w-10 h-10 flex items-center justify-center`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Heading level={4}>{action.title}</Heading>
                      {action.badge && (
                        <Badge variant="new">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <Text className="mt-1">{action.description}</Text>
                    <div className="mt-3 flex items-center text-sm font-medium text-blue-primary group-hover:translate-x-1 transition-transform">
                      Try now
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section>
        <Heading level={2} className="mb-2">Templates</Heading>
        <Text className="mb-4 max-w-3xl">
          Start with these templates to quickly explore and try them in the studio.
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {templates.map((template, index) => (
            <Card key={index}>
              <div className="flex flex-col mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <Text variant="body-xs" color="light" className="mb-1 font-medium">Model</Text>
                    <div className="aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center p-1">
                        <img
                          src={template.model}
                          alt="Model"
                          className="max-w-full max-h-full object-contain"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                          onError={(e) => {
                            console.log(`Model image load error: ${template.model}`);
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = 'https://via.placeholder.com/300x300?text=Model+Not+Available';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Text variant="body-xs" color="light" className="mb-1 font-medium">Garment</Text>
                    <div className="aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center p-1">
                        <img
                          src={template.garment}
                          alt="Garment"
                          className="max-w-full max-h-full object-contain"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                          onError={(e) => {
                            console.log(`Garment image load error: ${template.garment}`);
                            const imgElement = e.target as HTMLImageElement;
                            imgElement.src = 'https://via.placeholder.com/300x300?text=Garment+Not+Available';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <Text variant="body-xs" color="light" className="mb-1 font-medium">Category</Text>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      {template.category === 'top' ? 'Top' : 
                       template.category === 'bottom' ? 'Bottom' : 'Full Body'}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => {
                    // Create query parameters with the template data
                    const params = new URLSearchParams({
                      model: template.modelName,
                      garment: template.garmentName,
                      category: template.category.toLowerCase()
                    });
                    
                    // Navigate to the studio page with the parameters
                    window.location.href = `/dashboard/studio?${params.toString()}`;
                  }}
                >
                  Try in Studio
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Generations */}
      {isLoading ? (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <Heading level={2} className="mb-1">Recent Generations</Heading>
              <Text className="max-w-3xl">
                The most recent results generated through the web app.
              </Text>
            </div>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-primary"></div>
          </div>
        </section>
      ) : recentGenerations.length > 0 ? (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <Heading level={2} className="mb-1">Recent Generations</Heading>
              <Text className="max-w-3xl">
                The most recent results generated through the web app.
              </Text>
            </div>
            <Button
              variant="secondary"
              href="/dashboard/gallery"
              className="mt-3 sm:mt-0 inline-flex items-center justify-center"
            >
              <PhotoIcon className="w-4 h-4 mr-2" />
              My Gallery
            </Button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {recentGenerations.map((gen) => (
              <div key={gen.id} className="group relative aspect-square rounded-md overflow-hidden bg-gray-50 shadow-level-1 hover:shadow-level-2 transition-all">
                <img
                  src={gen.url}
                  alt={`Generation ${gen.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log(`Image load error: ${gen.url}`);
                    // Try to use the image proxy if direct URL fails
                    const imgElement = e.target as HTMLImageElement;
                    const proxyUrl = `${window.location.origin}/api/image-proxy?bucket=gallery&name=${encodeURIComponent(gen.name)}`;
                    console.log(`Trying proxy URL: ${proxyUrl}`);
                    imgElement.src = proxyUrl;
                    
                    // If proxy also fails, use placeholder
                    imgElement.onerror = () => {
                      console.log('Proxy URL also failed, using placeholder');
                      imgElement.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                      imgElement.onerror = null; // Prevent infinite loop
                    };
                  }}
                />
                <Link
                  href="/dashboard/gallery"
                  className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="bg-white rounded-md px-3 py-1 text-xs font-medium font-inter">
                    View in Gallery
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <Heading level={2} className="mb-1">Recent Generations</Heading>
              <Text className="max-w-3xl">
                The most recent results generated through the web app.
              </Text>
            </div>
          </div>
          <Card className="text-center py-10">
            <Heading level={4}>No generations yet</Heading>
            <Text className="mt-1">
              Create your first virtual try-on in the Studio
            </Text>
            <Button 
              variant="primary"
              href="/dashboard/studio"
              className="mt-4"
            >
              Go to Studio
            </Button>
          </Card>
        </section>
      )}
    </div>
  )
} 