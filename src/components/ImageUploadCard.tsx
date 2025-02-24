'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'

interface ImageUploadCardProps {
  image: File | null
  onImageChange: (file: File | null) => void
  label: string
}

export default function ImageUploadCard({ image, onImageChange, label }: ImageUploadCardProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onImageChange(file)
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }, [onImageChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleRemoveImage = () => {
    onImageChange(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${preview ? 'border-none p-0' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative aspect-square w-full">
            <Image
              src={preview}
              alt={label}
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveImage()
              }}
              className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Paste/drop image here</p>
            <p className="text-sm text-gray-500">OR</p>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Choose file
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 