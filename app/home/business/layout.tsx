import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrendyMirror for Business - Virtual Try-On Solutions for Retailers',
  description: 'Boost sales and reduce returns with TrendyMirror\'s AI-powered virtual try-on solutions for fashion retailers and businesses.',
  keywords: 'virtual try-on business, fashion tech for retailers, e-commerce solutions, reduce returns, increase conversion',
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 