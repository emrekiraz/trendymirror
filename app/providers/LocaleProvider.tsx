'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'

type Locale = 'en' | 'tr' // Supported locales

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    // Get locale from cookie or browser language
    const savedLocale = Cookies.get('locale') as Locale
    const browserLocale = navigator.language.split('-')[0] as Locale
    
    if (savedLocale && ['en', 'tr'].includes(savedLocale)) {
      setLocaleState(savedLocale)
    } else if (['en', 'tr'].includes(browserLocale)) {
      setLocaleState(browserLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    Cookies.set('locale', newLocale, { expires: 365 })
    setLocaleState(newLocale)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
} 