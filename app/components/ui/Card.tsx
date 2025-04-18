'use client'

import React from 'react'
import { useTheme } from '@/app/providers/ThemeProvider'

type CardProps = {
  variant?: 'default' | 'feature'
  className?: string
  children: React.ReactNode
  onClick?: () => void
  hover?: boolean
  onDragOver?: React.DragEventHandler<HTMLDivElement>
  onDrop?: React.DragEventHandler<HTMLDivElement>
  onPaste?: React.ClipboardEventHandler<HTMLDivElement>
}

export default function Card({
  variant = 'default',
  className = '',
  children,
  onClick,
  hover = true,
  onDragOver,
  onDrop,
  onPaste,
}: CardProps) {
  const theme = useTheme()
  
  // Base classes based on variant
  let baseClasses = ''
  
  switch (variant) {
    case 'default':
      baseClasses = 'bg-white rounded-lg shadow-level-1 p-4'
      break
    case 'feature':
      baseClasses = 'bg-white rounded-lg shadow-level-1 p-6'
      break
  }
  
  // Hover effect
  const hoverClasses = hover ? 'transition-all duration-150 hover:shadow-level-2' : ''
  
  // Clickable effect
  const clickableClasses = onClick ? 'cursor-pointer' : ''
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`
  
  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPaste={onPaste}
    >
      {children}
    </div>
  )
} 