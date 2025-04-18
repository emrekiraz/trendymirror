'use client'

import React from 'react'
import Button from '@/app/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

type CTAProps = {
  title: string
  description: string
  primaryButtonText: string
  primaryButtonHref?: string
  primaryButtonAction?: 'login' | 'signup' | null
  secondaryButtonText?: string
  secondaryButtonHref?: string
  secondaryButtonAction?: 'login' | 'signup' | null
  variant?: 'light' | 'dark'
}

export default function CTA({
  title,
  description,
  primaryButtonText,
  primaryButtonHref,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonAction,
  variant = 'light'
}: CTAProps) {
  const bgClass = variant === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  const textClass = variant === 'dark' ? 'text-white' : 'text-gray-900'
  const descriptionClass = variant === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const { openLoginModal, openSignupModal } = useAuthModal()
  
  const handlePrimaryClick = () => {
    if (primaryButtonAction === 'login') {
      openLoginModal()
    } else if (primaryButtonAction === 'signup') {
      openSignupModal()
    }
  }
  
  const handleSecondaryClick = () => {
    if (secondaryButtonAction === 'login') {
      openLoginModal()
    } else if (secondaryButtonAction === 'signup') {
      openSignupModal()
    }
  }
  
  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold ${textClass} mb-4`}>
            {title}
          </h2>
          <p className={`text-lg ${descriptionClass} mb-8`}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              href={primaryButtonAction ? undefined : primaryButtonHref} 
              onClick={primaryButtonAction ? handlePrimaryClick : undefined}
              variant={variant === 'dark' ? 'gradient' : 'primary'} 
              size="lg"
              className="relative"
            >
              <span className="pr-8">{primaryButtonText}</span>
              <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5" />
            </Button>
            
            {secondaryButtonText && (secondaryButtonHref || secondaryButtonAction) && (
              <Button 
                href={secondaryButtonAction ? undefined : secondaryButtonHref} 
                onClick={secondaryButtonAction ? handleSecondaryClick : undefined}
                variant={variant === 'dark' ? 'tertiary' : 'secondary'} 
                size="lg"
                className="inline-flex items-center justify-center"
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
} 