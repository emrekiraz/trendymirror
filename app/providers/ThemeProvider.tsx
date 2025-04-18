'use client'

import React, { createContext, useContext } from 'react'
import theme from '@/app/styles/theme'

// Create a context for the theme
const ThemeContext = createContext(theme)

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext)

// Theme provider component
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
} 