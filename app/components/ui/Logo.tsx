'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/app/providers/ThemeProvider'

type LogoProps = {
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

export default function Logo({
  showText = true,
  size = 'md',
  className = '',
  href = '/dashboard',
}: LogoProps) {
  const theme = useTheme()
  
  // Size mapping for icon
  const sizeMap = {
    sm: { width: 24, height: 24, textClass: 'text-lg' },
    md: { width: 32, height: 32, textClass: 'text-xl' },
    lg: { width: 40, height: 40, textClass: 'text-2xl' },
  }
  
  const { width, height, textClass } = sizeMap[size]
  
  return (
    <Link href={href} className={`flex items-center space-x-2 ${className}`}>
      <Image
        src="/images/trendymirror_icon.svg"
        alt="TrendyMirror"
        width={width}
        height={height}
        className="rounded"
      />
      {showText && (
        <h1 className={`logo-text font-heebo ${textClass}`}>
          TrendyMirror
        </h1>
      )}
    </Link>
  )
} 