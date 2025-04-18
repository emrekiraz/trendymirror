import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TrendyMirror Pricing - Virtual Try-On Solutions and Plans',
  description: 'Explore TrendyMirror\'s flexible pricing plans for individuals and businesses. Find the perfect plan for your virtual try-on needs.',
  keywords: 'virtual try-on pricing, fashion tech pricing, virtual fitting room plans, e-commerce solution cost',
}

export default function PricingLayout({
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