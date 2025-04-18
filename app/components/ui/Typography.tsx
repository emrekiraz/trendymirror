'use client'

import React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  children: React.ReactNode
}

export function Heading({
  level = 1,
  className = '',
  children,
}: HeadingProps) {
  const theme = useTheme()
  
  // Base classes based on heading level
  let baseClasses = 'font-inter text-gray-900'
  
  switch (level) {
    case 1:
      baseClasses += ' text-2xl font-bold leading-loose'
      break
    case 2:
      baseClasses += ' text-xl font-bold leading-relaxed'
      break
    case 3:
      baseClasses += ' text-lg font-semibold leading-normal'
      break
    case 4:
      baseClasses += ' text-base font-semibold leading-normal'
      break
    case 5:
      baseClasses += ' text-sm font-semibold leading-tight'
      break
    case 6:
      baseClasses += ' text-xs font-semibold leading-tight'
      break
  }
  
  // Combine all classes
  const headingClasses = `${baseClasses} ${className}`
  
  // Render the appropriate heading element
  const Component = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Component className={headingClasses}>
      {children}
    </Component>
  )
}

type TextProps = {
  variant?: 'body' | 'body-sm' | 'body-xs' | 'caption'
  color?: 'default' | 'light' | 'dark' | 'primary' | 'success' | 'warning' | 'error'
  className?: string
  children: React.ReactNode
}

export function Text({
  variant = 'body',
  color = 'default',
  className = '',
  children,
}: TextProps) {
  const theme = useTheme()
  
  // Base classes based on variant
  let variantClasses = 'font-inter'
  
  switch (variant) {
    case 'body':
      variantClasses += ' text-sm leading-normal'
      break
    case 'body-sm':
      variantClasses += ' text-xs leading-tight'
      break
    case 'body-xs':
      variantClasses += ' text-xs leading-tight'
      break
    case 'caption':
      variantClasses += ' text-xs leading-tight'
      break
  }
  
  // Color classes
  let colorClasses = ''
  
  switch (color) {
    case 'default':
      colorClasses = 'text-gray-700'
      break
    case 'light':
      colorClasses = 'text-gray-500'
      break
    case 'dark':
      colorClasses = 'text-gray-900'
      break
    case 'primary':
      colorClasses = 'text-blue-primary'
      break
    case 'success':
      colorClasses = 'text-success'
      break
    case 'warning':
      colorClasses = 'text-warning'
      break
    case 'error':
      colorClasses = 'text-error'
      break
  }
  
  // Combine all classes
  const textClasses = `${variantClasses} ${colorClasses} ${className}`
  
  return (
    <p className={textClasses}>
      {children}
    </p>
  )
}

export default { Heading, Text } 