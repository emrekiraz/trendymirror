'use client'

import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import useAuthModal from './hooks/useAuthModal'
import AuthModal from './components/auth/AuthModal'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const { isModalOpen, closeAuthModal, authMode } = useAuthModal()
  
  return (
    <>
      {children}
      
      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={isModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
      
      <Toaster position="bottom-right" />
    </>
  )
} 