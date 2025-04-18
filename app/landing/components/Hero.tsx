'use client'

import React from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'
import { Play, ArrowRight, BarChart } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

export default function Hero() {
  const { openLoginModal, openSignupModal } = useAuthModal()
  
  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openSignupModal()
  }
  
  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openLoginModal()
  }
  
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Background patterns/decorations */}
      <div className="absolute top-0 left-0 -translate-x-1/4 w-1/2 h-1/2 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 w-1/2 h-1/2 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="lg:col-span-5 max-w-xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium text-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Virtual Fashion Technology
            </div>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Experience Clothes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Virtually</span> Before Buying
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Our AI-powered platform helps you visualize how garments look on different body types, reducing returns and increasing confidence in your purchases.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button onClick={handleSignupClick} variant="gradient" size="lg" className="relative">
                <span className="pr-8">Try For Free</span>
                <ArrowRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5" />
              </Button>
              <Button onClick={handleLoginClick} variant="secondary" size="lg">
                Log In
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Start with our free plan today.
            </p>
            
            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
              <div>
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-500">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">40%</p>
                <p className="text-sm text-gray-500">Fewer Returns</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15K+</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </div>
          </div>

          {/* Right column - Video/Image */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <Image
                  src="/images/hero-placeholder.jpg"
                  alt="TrendyMirror Virtual Try-On Demo"
                  className="object-cover transform transition-transform hover:scale-105 duration-700"
                  fill
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-primary bg-opacity-90 text-white hover:bg-opacity-100 transition-all shadow-lg hover:scale-110 duration-300"
                    aria-label="Play demo video"
                    onClick={openSignupModal}
                  >
                    <Play className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
              
            {/* Floating badges */}
            {/* Users badge */}
            <div className="absolute -right-4 -bottom-6 bg-white rounded-full shadow-lg p-3 pr-4 flex items-center">
              <div className="flex -space-x-2 mr-2">
                <div className="w-8 h-8 rounded-full bg-blue-200"></div>
                <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
                <div className="w-8 h-8 rounded-full bg-purple-200"></div>
              </div>
              <p className="text-sm font-medium text-gray-800">Join 15k+ users</p>
            </div>
            
            {/* AI Match badge */}
            <div className="absolute top-4 -right-2 bg-white rounded-full shadow-lg p-2 pl-3 flex items-center">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800">99% Match with AI</p>
            </div>
            
            {/* Satisfaction badge */}
            <div className="absolute -left-2 bottom-20 bg-white rounded-full shadow-lg p-2 pl-3 flex items-center">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <BarChart className="h-3 w-3 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-800">98% Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 