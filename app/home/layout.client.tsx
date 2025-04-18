'use client'

import React from 'react'
import LandingNavbar from '../landing/components/LandingNavbar'
import LandingFooter from '../landing/components/LandingFooter'
import { useLocale } from '../providers/LocaleProvider'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale } = useLocale();
  
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <LandingFooter />
    </div>
  )
} 