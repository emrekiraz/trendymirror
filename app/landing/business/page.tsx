import React from 'react'
import { Metadata } from 'next'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'TrendyMirror for Business - Virtual Try-On Solutions for Retailers',
  description: 'Boost sales and reduce returns with TrendyMirror\'s AI-powered virtual try-on solutions for fashion retailers and businesses.',
  keywords: 'virtual try-on business, fashion tech for retailers, e-commerce solutions, reduce returns, increase conversion',
}

export default function BusinessPage() {
  return (
    <div className="pt-16">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              TrendyMirror for Business
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Transform your fashion retail experience with our AI-powered virtual try-on technology
            </p>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-600">
                We're currently building this page. Please check back soon for comprehensive information about our business solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <CTA 
        title="Ready to Transform Your Fashion Retail Experience?"
        description="Join leading brands that are already using TrendyMirror to boost sales and reduce returns."
        primaryButtonText="Schedule A Demo"
        primaryButtonHref="#calendar-section"
        secondaryButtonText="Start Free Trial"
        secondaryButtonAction="signup"
        variant="dark"
      />
    </div>
  )
} 