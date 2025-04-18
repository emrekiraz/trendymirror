'use client'

import React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

type BadgeProps = {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'new' | 'ai' | 'trendymirror'
  className?: string
  children: React.ReactNode
}

export default function Badge({
  variant = 'default',
  className = '',
  children,
}: BadgeProps) {
  const theme = useTheme()
  
  // Base classes based on variant
  let variantClasses = ''
  
  switch (variant) {
    case 'default':
      variantClasses = 'bg-gray-100 text-gray-700'
      break
    case 'primary':
      variantClasses = 'bg-blue-100 text-blue-primary'
      break
    case 'success':
      variantClasses = 'bg-green-100 text-success'
      break
    case 'warning':
      variantClasses = 'bg-yellow-100 text-warning'
      break
    case 'error':
      variantClasses = 'bg-red-100 text-error'
      break
    case 'new':
      variantClasses = 'bg-purple-accent bg-opacity-10 text-purple-accent'
      break
    case 'ai':
      variantClasses = 'bg-indigo-600 text-white'
      break
    case 'trendymirror':
      variantClasses = 'bg-blue-primary text-white'
      break
  }
  
  // Common classes
  const commonClasses = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
  
  // Combine all classes
  const badgeClasses = `${commonClasses} ${variantClasses} ${className}`
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  )
} 