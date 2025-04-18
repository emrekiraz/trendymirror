'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Logo from '@/app/components/ui/Logo'
import Button from '@/app/components/ui/Button'
import { Menu, X, Globe, LogOut, User, Settings } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

const navItems = [
  { name: 'Home', href: '/home' },
  { name: 'Business', href: '/home/business' },
  { name: 'Pricing', href: '/home/pricing' },
]

export default function LandingNavbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { openLoginModal, openSignupModal, isModalOpen, authMode, closeAuthModal, isAuthenticated, user, handleGoogleSignIn, handleSignOut } = useAuthModal()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo href="/home" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-primary ${
                  pathname === item.href
                    ? 'text-blue-primary'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-primary"
            >
              <Globe className="h-4 w-4 mr-1" />
              EN
            </button>
          </div>
          
          {isAuthenticated ? (
            // Show profile menu if logged in
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                {user?.user_metadata?.avatar_url ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <Image 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-blue-primary text-white rounded-full flex items-center justify-center">
                    <span>{user?.email?.charAt(0) || 'U'}</span>
                  </div>
                )}
              </button>
              
              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.full_name || user?.email}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-2" /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show login/signup buttons if not logged in
            <>
              <Button 
                onClick={() => {
                  // Sadece login modalını aç, otomatik yönlendirme yapma
                  openLoginModal();
                  // setTimeout ile otomatik Google yönlendirmesini kaldırdık
                }} 
                variant="tertiary" 
                size="sm"
              >
                Log In
              </Button>
              <Button 
                onClick={() => {
                  // Sadece signup modalını aç, otomatik yönlendirme yapma
                  openSignupModal();
                  // Otomatik Google yönlendirmesini kaldırdık
                }} 
                variant="gradient" 
                size="sm"
              >
                Try For Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-primary"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'text-blue-primary bg-blue-50'
                    : 'text-gray-700 hover:text-blue-primary hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 mb-3">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-primary"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  English
                </button>
              </div>
              
              {isAuthenticated ? (
                // User profile in mobile menu
                <div className="px-3 space-y-2">
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-gray-50">
                    {user?.user_metadata?.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                        <Image 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-primary text-white rounded-full flex items-center justify-center">
                        <span>{user?.email?.charAt(0) || 'U'}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="block w-full py-2 px-3 rounded bg-blue-primary text-white text-center text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full py-2 px-3 rounded border border-gray-300 text-gray-700 text-center text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                // Login/Signup buttons in mobile menu
                <div className="flex items-center px-3 space-x-3">
                  <Button 
                    onClick={() => {
                      // Sadece login modalını aç, otomatik yönlendirme yapma
                      openLoginModal();
                      // setTimeout ile otomatik Google yönlendirmesini kaldırdık
                    }} 
                    variant="tertiary" 
                    size="sm" 
                    fullWidth
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => {
                      // Sadece signup modalını aç, otomatik yönlendirme yapma
                      openSignupModal();
                      // Otomatik Google yönlendirmesini kaldırdık
                    }} 
                    variant="gradient" 
                    size="sm" 
                    fullWidth
                  >
                    Try For Free
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 