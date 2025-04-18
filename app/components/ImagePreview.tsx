import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ImagePreviewProps {
  imageUrl: string
  onClose: () => void
}

export default function ImagePreview({ imageUrl, onClose }: ImagePreviewProps) {
  // ESC tuşuna basıldığında kapatma işlemi
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
      onClick={onClose} // Arka plana tıklayınca kapatma
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // İçeriğe tıklayınca kapanmasını engelleme
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <XMarkIcon className="w-6 h-6 text-white" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-h-[85vh] max-w-[85vw] object-contain"
        />
      </div>
    </div>
  )
} 