'use client'

import React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'
import Link from 'next/link'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  href?: string
  isExternal?: boolean
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  isExternal = false,
  className = '',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const theme = useTheme()
  
  // Log when onClick is called
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked', { variant, size });
    if (onClick) onClick(e);
  }
  
  // Base classes based on variant
  let baseClasses = ''
  
  switch (variant) {
    case 'primary':
      baseClasses = 'bg-blue-primary text-white hover:bg-[#2563EB] focus:ring-2 focus:ring-blue-primary focus:ring-opacity-50'
      break
    case 'secondary':
      baseClasses = 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:ring-opacity-50'
      break
    case 'tertiary':
      baseClasses = 'bg-transparent text-blue-primary hover:bg-blue-tertiary hover:bg-opacity-20 focus:ring-2 focus:ring-blue-primary focus:ring-opacity-30'
      break
    case 'gradient':
      baseClasses = 'bg-gradient-to-r from-blue-primary to-purple-accent text-white hover:shadow-md focus:ring-2 focus:ring-purple-accent focus:ring-opacity-50'
      break
  }
  
  // Size classes
  let sizeClasses = ''
  
  switch (size) {
    case 'sm':
      sizeClasses = 'text-xs py-1.5 px-3'
      break
    case 'md':
      sizeClasses = 'text-sm py-2 px-4'
      break
    case 'lg':
      sizeClasses = 'text-base py-2.5 px-5'
      break
  }
  
  // Common classes
  const commonClasses = `
    font-inter font-medium rounded-md transition-all duration-150 
    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses} ${commonClasses}`
  
  // If href is provided, render as Link
  if (href) {
    return isExternal ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }
  
  // Otherwise render as button
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  )
} 