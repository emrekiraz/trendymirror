import React from 'react'
import { Metadata } from 'next'
import Hero from './components/Hero'
import TryOnDemo from './components/TryOnDemo'
import Testimonials from './components/Testimonials'
import HowItWorks from './components/HowItWorks'
import ValueProposition from './components/ValueProposition'
import Features from './components/Features'
import FAQ from './components/FAQ'
import CTA from './components/CTA'

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

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TryOnDemo />
      <HowItWorks />
      <Testimonials />
      <CTA 
        title="Ready to Transform Your Shopping Experience?"
        description="Join thousands of satisfied users who are already enjoying the benefits of virtual try-on technology."
        primaryButtonText="Try For Free"
        primaryButtonAction="signup"
        secondaryButtonText="Learn More"
        secondaryButtonHref="/landing/features"
        variant="light"
      />
      <ValueProposition />
      <Features />
      <FAQ />
      <CTA 
        title="Start Your Virtual Try-On Journey Today"
        description="No credit card required. Sign up for free and experience the future of online shopping."
        primaryButtonText="Get Started"
        primaryButtonAction="signup"
        variant="dark"
      />
    </>
  )
} 