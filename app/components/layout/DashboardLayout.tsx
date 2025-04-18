'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  HomeIcon,
  CameraIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  PhotoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import Logo from '@/app/components/ui/Logo'
import Button from '@/app/components/ui/Button'
import { Text } from '@/app/components/ui/Typography'
import { useAuth } from '@/app/hooks/use-auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, isLoading } = useAuth()
  const redirectAttempted = useRef(false)
  
  // Redirect if not authenticated
  useEffect(() => {
    // Only attempt redirect once to prevent infinite loops
    if (!isLoading && !user && !redirectAttempted.current) {
      console.log("DashboardLayout: User not authenticated, redirecting to home");
      redirectAttempted.current = true;
      
      // Simply redirect to home page
      router.push('/');
    }
  }, [user, router, isLoading]);
  
  // Hide sidebar on pricing page
  const hideSidebar = pathname === '/dashboard/pricing'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: pathname === '/dashboard' },
    { name: 'Studio', href: '/dashboard/studio', icon: SparklesIcon, current: pathname === '/dashboard/studio' },
    { name: 'My Gallery', href: '/dashboard/gallery', icon: PhotoIcon, current: pathname === '/dashboard/gallery' },
    { name: 'My Models', href: '/dashboard/models', icon: UserIcon, current: pathname === '/dashboard/models' },
    { name: 'My Products', href: '/dashboard/products', icon: ShoppingBagIcon, current: pathname === '/dashboard/products' },
    { name: 'Pricing', href: '/dashboard/pricing', icon: CurrencyDollarIcon, current: pathname === '/dashboard/pricing' },
  ]

  const profileMenu = [
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    { name: 'Usage', href: '/dashboard/usage', icon: ChartBarIcon },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCardIcon },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U'
    
    const fullName = user.user_metadata.full_name as string
    const nameParts = fullName.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - hidden on pricing page */}
      {!hideSidebar && (
        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-level-2 transition-all duration-300 ${
            isCollapsed ? 'w-[60px]' : 'w-[240px]'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed ? (
              <Logo showText={true} size="md" />
            ) : (
              <div className="w-full"></div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors ${isCollapsed ? 'absolute right-2' : ''}`}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-6 h-6" />
              ) : (
                <ChevronLeftIcon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${!isCollapsed ? 'space-x-2' : ''} p-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-tertiary bg-opacity-20 text-blue-primary'
                      : 'hover:bg-gray-100 text-gray-700'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : ''}
                >
                  <div className={`flex items-center justify-center ${isCollapsed ? 'min-w-[28px] min-h-[28px]' : ''}`}>
                    <item.icon className={`${isActive ? 'text-blue-primary' : ''} ${isCollapsed ? 'w-8 h-8' : 'w-6 h-6'}`} />
                  </div>
                  {!isCollapsed && <span className="font-inter font-medium text-sm">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
            {/* Member Profile */}
            <div className="relative group">
              <button
                className={`flex items-center ${!isCollapsed ? 'space-x-3' : ''} w-full p-2 rounded-md hover:bg-gray-100 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title={isCollapsed ? "User Profile" : ""}
              >
                {user?.user_metadata?.avatar_url ? (
                  <div className="min-w-[40px] w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="min-w-[40px] w-10 h-10 rounded-full bg-blue-primary text-white flex items-center justify-center font-semibold text-lg overflow-hidden"
                  >
                    <span>{getUserInitials()}</span>
                  </div>
                )}
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <Text color="dark" className="truncate">{user?.user_metadata?.full_name || user?.email}</Text>
                    <Text variant="body-xs" color="light">Basic Plan</Text>
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute ${isCollapsed ? 'left-full ml-2' : 'bottom-full left-0 mb-2'} w-48 bg-white rounded-md shadow-level-2 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}>
                {profileMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 p-3 hover:bg-gray-100 text-gray-700 font-inter"
                  >
                    <item.icon className="w-6 h-6 text-gray-500" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 p-3 w-full text-error hover:bg-gray-100 font-inter"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          !hideSidebar ? (isCollapsed ? 'ml-[60px]' : 'ml-[240px]') : 'ml-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
} 