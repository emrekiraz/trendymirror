'use client'

import React from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'
import { ArrowRight, ShoppingBag, BarChart, Users, Zap } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

const valueProps = [
  {
    id: 'retailers',
    title: 'For Fashion Retailers',
    description: 'Boost sales and reduce returns with our AI-powered virtual try-on solution.',
    image: '/images/placeholder-image.png',
    features: [
      {
        icon: ShoppingBag,
        title: 'Reduce Return Rates',
        description: 'Customers make more confident purchases when they can see how clothes will actually look on them.'
      },
      {
        icon: BarChart,
        title: 'Increase Conversion',
        description: 'Our clients see an average 24% increase in conversion rates after implementing TrendyMirror.'
      },
      {
        icon: Users,
        title: 'Enhance Customer Experience',
        description: 'Provide an innovative shopping experience that sets you apart from competitors.'
      }
    ],
    cta: {
      text: 'Learn More',
      href: '/landing/business'
    },
    direction: 'ltr'
  },
  {
    id: 'shoppers',
    title: 'For Fashion Shoppers',
    description: 'Shop with confidence by seeing how clothes will actually look on you before buying.',
    image: '/images/placeholder-image.png',
    features: [
      {
        icon: Zap,
        title: 'Try Before You Buy',
        description: 'Virtually try on clothes from the comfort of your home before making a purchase.'
      },
      {
        icon: ShoppingBag,
        title: 'Reduce Wasted Purchases',
        description: 'Make more informed decisions and reduce the likelihood of buying clothes that don\'t fit or suit you.'
      },
      {
        icon: Users,
        title: 'Personalized Recommendations',
        description: 'Get personalized style recommendations based on your body type and preferences.'
      }
    ],
    cta: {
      text: 'Try For Free',
      action: 'signup'
    },
    direction: 'rtl'
  }
]

export default function ValueProposition() {
  const { openSignupModal } = useAuthModal()
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Virtual Try-On for Everyone
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            TrendyMirror provides value for both retailers and shoppers
          </p>
        </div>

        <div className="space-y-24">
          {valueProps.map((prop) => (
            <div 
              key={prop.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                prop.direction === 'rtl' ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image column */}
              <div className={`order-1 ${prop.direction === 'rtl' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <div className="aspect-w-4 aspect-h-3 bg-gray-100">
                    <Image
                      src={prop.image}
                      alt={prop.title}
                      className="object-cover"
                      fill
                    />
                  </div>
                </div>
              </div>

              {/* Content column */}
              <div className={`order-2 ${prop.direction === 'rtl' ? 'lg:order-1' : 'lg:order-2'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {prop.title}
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  {prop.description}
                </p>

                <div className="space-y-6">
                  {prop.features.map((feature, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-50 text-blue-primary">
                          <feature.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {feature.title}
                        </h4>
                        <p className="mt-1 text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  {prop.cta.action === 'signup' ? (
                    <Button 
                      onClick={openSignupModal} 
                      variant="gradient" 
                      size="lg" 
                      className="inline-flex items-center"
                    >
                      {prop.cta.text} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      href={prop.cta.href} 
                      variant="gradient" 
                      size="lg" 
                      className="inline-flex items-center"
                    >
                      {prop.cta.text} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 