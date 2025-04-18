'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Check, ChevronRight } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import useAuthModal from '@/app/hooks/useAuthModal'

export default function HowItWorks() {
  const { openSignupModal } = useAuthModal()
  const [activeTab, setActiveTab] = useState(0)
  
  const steps = [
    {
      id: 'upload',
      title: 'Upload Your Product',
      description: 'Upload your clothing items with simple API calls or through our intuitive dashboard.',
      image: '/images/how-it-works/step1.jpg',
      features: [
        'Bulk upload support',
        'Automatic background removal',
        'Support for multiple product angles',
        'Smart product categorization'
      ]
    },
    {
      id: 'process',
      title: 'AI Processing',
      description: 'Our advanced AI processes your garments to create realistic digital representations.',
      image: '/images/how-it-works/step2.jpg',
      features: [
        'Texture and fabric analysis',
        'Precise 3D modeling',
        'Color and pattern recognition',
        'Shadow and lighting simulation'
      ]
    },
    {
      id: 'integrate',
      title: 'Integrate to Website',
      description: 'Add the virtual try-on widget to your e-commerce platform with minimal code.',
      image: '/images/how-it-works/step3.jpg',
      features: [
        'One-click installation',
        'Compatible with major platforms',
        'Customizable UI elements',
        'Mobile-responsive design'
      ]
    },
    {
      id: 'analyze',
      title: 'Track & Optimize',
      description: 'Monitor performance and make data-driven decisions with comprehensive analytics.',
      image: '/images/how-it-works/step4.jpg',
      features: [
        'Real-time usage statistics',
        'Conversion tracking',
        'A/B testing capabilities',
        'ROI monitoring dashboard'
      ]
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            Simple Implementation
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How TrendyMirror Works
          </h2>
          <p className="text-xl text-gray-600">
            Get up and running with virtual try-on in four simple steps. Our platform is designed for easy integration and maximum impact.
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="relative z-10 px-4 sm:px-6 flex flex-col items-center cursor-pointer"
              onClick={() => setActiveTab(index)}
            >
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-3 transition-all duration-300 ${
                  index < activeTab 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : index === activeTab 
                      ? 'border-blue-600 bg-white text-blue-600' 
                      : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {index < activeTab ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>
              <span 
                className={`text-sm font-medium hidden sm:block transition-colors ${
                  index <= activeTab ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-12">
          {/* Left side: Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={steps[activeTab].image || '/images/how-it-works/placeholder.jpg'}
                  alt={steps[activeTab].title}
                  className="object-cover"
                  fill
                />
              </div>
              
              {/* Step indicator */}
              <div className="absolute top-5 left-5 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                  {activeTab + 1}
                </div>
                <span className="text-sm font-medium">{steps[activeTab].title}</span>
              </div>
            </div>
          </div>
          
          {/* Right side: Content */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {activeTab + 1}. {steps[activeTab].title}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {steps[activeTab].description}
            </p>
            
            <div className="space-y-4 mb-8">
              {steps[activeTab].features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              {activeTab < steps.length - 1 ? (
                <Button onClick={() => setActiveTab(activeTab + 1)} variant="primary" className="relative">
                  <span className="pr-8">Next Step</span>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5" />
                </Button>
              ) : (
                <Button onClick={openSignupModal} variant="gradient" className="relative">
                  <span className="pr-8">Get Started Today</span>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5" />
                </Button>
              )}
              
              {activeTab > 0 && (
                <Button onClick={() => setActiveTab(activeTab - 1)} variant="secondary">
                  Previous Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 