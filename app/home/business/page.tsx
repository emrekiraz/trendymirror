'use client'

import React from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'
import CTA from '../../landing/components/CTA'
import { BarChart, ShoppingBag, TrendingUp, Users, Shield, Zap, Globe, Smartphone, Server } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

export default function BusinessPage() {
  const { openSignupModal } = useAuthModal()
  
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('calendar-section');
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const businessFeatures = [
    {
      icon: BarChart,
      title: 'Reduce Return Rates',
      description: 'Our clients see an average 35% reduction in returns when customers can virtually try before they buy.'
    },
    {
      icon: ShoppingBag,
      title: 'Increase Conversion',
      description: 'Boost your conversion rates by up to 24% by giving customers the confidence to make purchases.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Gain valuable insights into customer preferences and behaviors with our comprehensive analytics.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamlessly collaborate with your team members on campaigns and virtual showrooms.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Advanced security features including SSO, role-based access, and data encryption.'
    },
    {
      icon: Zap,
      title: 'API Integration',
      description: 'Easily integrate with your existing e-commerce platform or website using our powerful API.'
    },
    {
      icon: Globe,
      title: 'Multi-channel Support',
      description: 'Deploy try-on experiences across web, mobile, and in-store touchpoints.'
    },
    {
      icon: Smartphone,
      title: 'White Label Option',
      description: 'Brand the experience as your own with our customizable white label solution.'
    },
    {
      icon: Server,
      title: 'Dedicated Infrastructure',
      description: 'Enterprise plans include dedicated servers for optimal performance.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Revolutionize Your <span className="text-blue-primary">Fashion Retail</span> Experience
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                Transform your customer shopping journey with TrendyMirror's enterprise-grade virtual try-on technology. Reduce returns, increase conversions, and provide an unmatched shopping experience.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="gradient" 
                  size="lg"
                  onClick={scrollToCalendar}
                >
                  Schedule A Demo
                </Button>
                <Button onClick={openSignupModal} variant="secondary" size="lg">
                  Start Free Trial
                </Button>
              </div>
            </div>

            {/* Right column - Video/Image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                <Image
                  src="/images/business-demo.jpg"
                  alt="TrendyMirror Business Virtual Try-On Demo"
                  className="object-cover"
                  fill
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-primary bg-opacity-90 text-white hover:bg-opacity-100 transition-all shadow-lg"
                    aria-label="Play demo video"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Calendly Section */}
      <section id="calendar-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Schedule a Personalized Demo
            </h2>
            <p className="text-lg text-gray-600">
              Book a 30-minute call with our team to see how TrendyMirror can work for your business
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-md">
            <div className="h-[750px]">
              <iframe 
                src="https://calendly.com/trendymirror/30min?hide_gdpr_banner=1" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Schedule a demo with TrendyMirror"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
      
      {/* Business Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-lg text-gray-600">
              Designed specifically for retail businesses and fashion brands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {businessFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-3">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 text-blue-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Case Studies Section (placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how top brands are transforming their business with TrendyMirror
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto text-center bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h3>
            <p className="text-gray-600">
              We're currently preparing detailed case studies from our enterprise clients. Check back soon for real-world success stories.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
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