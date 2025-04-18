import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const PROMPT_SUGGESTIONS = [
  'Realistic portrait of a blonde woman model. Pink t-shirt and blue jean.',
  'Realistic portrait of a black woman model. Dark blue crop and pink short.',
  'Realistic portrait of an asian man model. Yellow t-shirt and blue short.',
  'Realistic portrait of a black man model. Light blue shirt and dark green trousers.',
]

interface AIModelPopupProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string) => Promise<string>
  onImageGenerated: (imageBase64: string) => void
}

export default function AIModelPopup({ isOpen, onClose, onGenerate, onImageGenerated }: AIModelPopupProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt) return
    setIsLoading(true)
    try {
      const base64Image = await onGenerate(prompt)
      onImageGenerated(base64Image)
      setPrompt('')
      onClose()
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 mb-4"
                >
                  Generate AI Model
                </Dialog.Title>

                <div className="mt-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the model you want to generate..."
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt}
                  className="mt-4 w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Suggestions
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {PROMPT_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setPrompt(suggestion)}
                        className="p-3 text-sm text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 