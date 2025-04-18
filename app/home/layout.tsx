import React from 'react'
import { Metadata } from 'next'
import ClientHomeLayout from './ClientHomeLayout'

export const metadata: Metadata = {
  title: 'TrendyMirror - AI-Powered Virtual Try-On Platform for Fashion',
  description: 'Experience clothes virtually before buying with TrendyMirror\'s AI-powered virtual try-on technology. Reduce returns and shop with confidence.',
  keywords: 'virtual try-on, fashion tech, AI fashion, virtual fitting room, e-commerce solution, reduce returns, online shopping',
  openGraph: {
    title: 'TrendyMirror - AI-Powered Virtual Try-On Platform',
    description: 'Experience clothes virtually before buying with TrendyMirror\'s AI-powered virtual try-on technology.',
    url: 'https://trendymirror.com',
    siteName: 'TrendyMirror',
    images: [
      {
        url: '/images/trendymirror-og.jpg',
        width: 1200,
        height: 630,
        alt: 'TrendyMirror Virtual Try-On Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientHomeLayout>{children}</ClientHomeLayout>
} 