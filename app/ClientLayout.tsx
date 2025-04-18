'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'
import ThemeProvider from './providers/ThemeProvider'
import { AuthProvider } from './hooks/use-auth'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </AuthProvider>
  )
} 