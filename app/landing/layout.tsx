'use client'

import React from 'react'
import LandingNavbar from './components/LandingNavbar'
import LandingFooter from './components/LandingFooter'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
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