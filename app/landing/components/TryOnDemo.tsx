'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'
import { Upload, Shirt, User, ArrowRight } from 'lucide-react'
import useAuthModal from '@/app/hooks/useAuthModal'

export default function TryOnDemo() {
  const { openSignupModal } = useAuthModal()
  const [modelSelected, setModelSelected] = useState(false)
  const [garmentSelected, setGarmentSelected] = useState(false)

  const handleModelUpload = () => {
    // Open signup modal instead of redirecting
    openSignupModal()
  }

  const handleGarmentUpload = () => {
    // Open signup modal instead of redirecting
    openSignupModal()
  }

  const handleGenerate = () => {
    // Open signup modal instead of redirecting
    openSignupModal()
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Try It Yourself
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Upload a model and a garment to see our virtual try-on technology in action.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Upload Box */}
              <div 
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-primary ${
                  modelSelected ? 'border-blue-primary bg-blue-50' : 'border-gray-300'
                }`}
                onClick={handleModelUpload}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  modelSelected ? 'bg-blue-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {modelSelected ? 'Model Selected' : 'Upload Model'}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {modelSelected 
                    ? 'Your model is ready for virtual try-on' 
                    : 'Upload a photo or choose from our models'}
                </p>
                {!modelSelected && (
                  <div className="mt-3">
                    <div className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </div>
                  </div>
                )}
              </div>

              {/* Garment Upload Box */}
              <div 
                className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-blue-primary ${
                  garmentSelected ? 'border-blue-primary bg-blue-50' : 'border-gray-300'
                }`}
                onClick={handleGarmentUpload}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  garmentSelected ? 'bg-blue-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Shirt className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {garmentSelected ? 'Garment Selected' : 'Upload Garment'}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {garmentSelected 
                    ? 'Your garment is ready for virtual try-on' 
                    : 'Upload clothing or choose from our catalog'}
                </p>
                {!garmentSelected && (
                  <div className="mt-3">
                    <div className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Image
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={handleGenerate}
                className="px-6 inline-flex items-center"
              >
                Generate Try-On <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 