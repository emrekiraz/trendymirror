'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { Heading, Text } from '@/app/components/ui/Typography'
import Button from '@/app/components/ui/Button'
import Card from '@/app/components/ui/Card'
import Badge from '@/app/components/ui/Badge'
import { CheckIcon } from '@heroicons/react/24/outline'

export default function GeneratingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Initializing...')
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)

  useEffect(() => {
    // Simulate a generation process with progress updates
    const statusMessages = [
      'Analyzing model...',
      'Processing garment...',
      'Preparing virtual try-on...',
      'Generating preview...',
      'Applying AI enhancements...',
      'Finalizing result...',
      'Almost done...'
    ]

    let currentProgress = 0
    let upgradeShown = false
    const interval = setInterval(() => {
      // Increment progress
      currentProgress += Math.random() * 5 + 1
      
      // Show upgrade popup between 70-90%
      if (currentProgress >= 70 && currentProgress <= 90 && !upgradeShown) {
        upgradeShown = true
        setShowUpgradePopup(true)
        // Pause the progress
        return
      }
      
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        
        // Only redirect if upgrade popup is not shown
        if (!showUpgradePopup) {
          // Redirect to a mock result page after a short delay
          setTimeout(() => {
            router.push('/dashboard/gallery')
          }, 1500)
        }
      }
      
      // Update progress state
      setProgress(Math.min(Math.round(currentProgress), 100))
      
      // Update status message occasionally
      if (currentProgress > 0 && currentProgress % 15 < 5) {
        const messageIndex = Math.min(
          Math.floor(currentProgress / 15),
          statusMessages.length - 1
        )
        setStatusMessage(statusMessages[messageIndex])
      }
    }, 500)

    return () => clearInterval(interval)
  }, [router, showUpgradePopup])

  const handleUpgradeClick = () => {
    router.push('/dashboard/pricing')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-3 py-3">
      <Card className="w-full max-w-md p-5 text-center">
        <Heading level={1} className="mb-3">Generating Your Virtual Try-On</Heading>
        
        {/* Animation container */}
        <div className="relative w-full h-48 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* You can replace this with a more sophisticated animation */}
            <div className="w-28 h-28 border-t-4 border-blue-primary border-solid rounded-full animate-spin"></div>
          </div>
          
          {/* Overlay with progress percentage */}
          <div className="z-10 text-3xl font-bold text-blue-primary">
            {progress}%
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className="bg-blue-primary h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Status message */}
        <Text color="light" className="mb-3">{statusMessage}</Text>
        
        {/* Info text */}
        <div className="mt-3">
          <Text variant="body-sm" color="light">This process typically takes 15-30 seconds.</Text>
          <Text variant="body-sm" color="light">Please don't close this window.</Text>
        </div>
      </Card>
      
      {/* Tips section */}
      <Card className="w-full max-w-md mt-4 bg-blue-50 p-4 border border-blue-100">
        <Heading level={2} className="text-blue-800 mb-2 text-lg">While you wait...</Heading>
        <ul className="space-y-1 text-blue-700">
          <li className="flex items-start">
            <span className="mr-2">💡</span>
            <Text variant="body-sm">Our AI combines your model and garment to create a realistic virtual try-on.</Text>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💡</span>
            <Text variant="body-sm">You can save your favorite results to your gallery for future reference.</Text>
          </li>
          <li className="flex items-start">
            <span className="mr-2">💡</span>
            <Text variant="body-sm">Try different combinations of models and garments to see various looks.</Text>
          </li>
        </ul>
      </Card>

      {/* Upgrade Popup */}
      <Transition appear show={showUpgradePopup} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-5 shadow-xl transition-all">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <SparklesIcon className="h-10 w-10 text-blue-primary" />
                    </div>
                  </div>
                  
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900 mb-2"
                  >
                    Upgrade Required
                  </Dialog.Title>
                  
                  <div className="mt-3">
                    <Text color="light" className="mb-3">
                      You need to upgrade your account to continue generating high-quality virtual try-ons.
                    </Text>
                    
                    <Card className="bg-gray-50 p-3 mb-3">
                      <Heading level={4} className="text-gray-800 mb-1 text-base">Premium Features Include:</Heading>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="h-5 w-5 text-blue-primary" />
                          <Text variant="body-sm">Unlimited high-resolution generations</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="h-5 w-5 text-blue-primary" />
                          <Text variant="body-sm">Advanced customization options</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="h-5 w-5 text-blue-primary" />
                          <Text variant="body-sm">Priority processing</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckIcon className="h-5 w-5 text-blue-primary" />
                          <Text variant="body-sm">Save and organize your results</Text>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="primary"
                      onClick={handleUpgradeClick}
                      className="w-full px-4 py-2"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
} 