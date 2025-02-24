'use client'

import { useState } from 'react'

interface CategorySelectorProps {
  category: 'top' | 'bottom' | 'full-body'
  onCategoryChange: (category: 'top' | 'bottom' | 'full-body') => void
}

export default function CategorySelector({ category, onCategoryChange }: CategorySelectorProps) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">Category</div>
      <div className="flex gap-2">
        {[
          { id: 'top', icon: <TopIcon /> },
          { id: 'bottom', icon: <BottomIcon /> },
          { id: 'full-body', icon: <FullBodyIcon /> }
        ].map((item) => (
          <button
            key={item.id}
            className={`flex-1 p-2 rounded ${
              category === item.id ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onCategoryChange(item.id as any)}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

const TopIcon = () => (
  <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 4H9L3 10v4h18v-4l-6-6z" />
  </svg>
)

const BottomIcon = () => (
  <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 4H9L3 10v4h18v-4l-6-6z" />
  </svg>
)

const FullBodyIcon = () => (
  <svg className="w-5 h-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 4H9L3 10v4h18v-4l-6-6z" />
  </svg>
) 