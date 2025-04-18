import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'
import Image from 'next/image'

interface InfoPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  imageUrl?: string
  content?: ReactNode
}

export default function InfoPopup({ isOpen, onClose, imageUrl, title, content }: InfoPopupProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                
                <div className="mt-6">
                  {imageUrl && (
                    <div className="flex justify-center">
                      <div className="w-[90%]">
                        <Image
                          src={imageUrl}
                          alt={title}
                          width={1500}
                          height={1200}
                          className="rounded-lg mb-4 w-full h-auto object-contain"
                          priority
                        />
                      </div>
                    </div>
                  )}
                  
                  {content && (
                    <div className="text-gray-700">
                      {content}
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-6 py-3 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 