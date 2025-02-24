'use client'

import Image from 'next/image'

interface ResultCardProps {
  resultImage: string | null
  isLoading: boolean
  onRun: () => void
}

export default function ResultCard({ resultImage, isLoading, onRun }: ResultCardProps) {
  return (
    <div>
      <div className="border border-gray-200 rounded bg-gray-50 h-[300px] flex items-center justify-center">
        {resultImage ? (
          <div className="relative w-full h-full">
            <Image
              src={resultImage}
              alt="Result"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            <svg className="w-5 h-5 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4m0 0L20 4m-8 8l8 8" />
            </svg>
            Result will appear here
          </div>
        )}
      </div>
      <button
        className="mt-4 w-full bg-yellow-300 hover:bg-yellow-400 py-2 rounded text-sm font-medium disabled:opacity-50"
        onClick={onRun}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Run (~14s)'}
      </button>
    </div>
  )
} 