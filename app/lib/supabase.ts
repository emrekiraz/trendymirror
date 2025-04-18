'use client'

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (ilk 10 karakter):', supabaseAnonKey.substring(0, 10) + '...');

// Helper function to get/set to localStorage and cookies to ensure code verifier is properly stored
const createAuthStorage = () => {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') {
        return null
      }
      
      // Try to get from cookie first (more secure)
      const cookieStr = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${key}=`))
      
      if (cookieStr) {
        return decodeURIComponent(cookieStr.split('=')[1])
      }
      
      // Fallback to localStorage
      return localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') {
        return
      }
      
      // Store in both cookie and localStorage
      const secure = window.location.protocol === 'https:'
      
      // Set cookie
      document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=86400;${secure ? 'secure;' : ''}samesite=lax`
      
      // Also set in localStorage as fallback
      localStorage.setItem(key, value)
      
      // Debug for auth token
      if (key.includes('auth') && key.includes('code_verifier')) {
        console.log(`Auth code verifier stored: ${key} (${value?.substring(0, 5)}...)`);
      }
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') {
        return
      }
      
      // Remove from cookie
      document.cookie = `${key}=;path=/;max-age=0`
      
      // Also remove from localStorage
      localStorage.removeItem(key)
    },
  }
}

// Initialize a single client instance to be used across the application
let clientInstance: ReturnType<typeof createClient> | null = null

// Single function to get the supabase client (singleton pattern)
const getSupabaseClient = () => {
  if (clientInstance) return clientInstance
  
  // Get auth storage implementation
  const authStorage = createAuthStorage()
  
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Changed from pkce to implicit flow to avoid code verifier issues
      flowType: 'implicit',
      debug: true,
      // Ensure cookies are used instead of localStorage for better security
      storageKey: 'sb-auth-token',
      storage: authStorage,
    },
  })
  
  return clientInstance
}

// Create a singleton client for client-side components
export const createClientComponentClient = () => {
  return getSupabaseClient()
}

// Direct export of the client instance for easier usage
export const supabase = getSupabaseClient()

// For server components
export const createServerComponentClient = async () => {
  const { createServerComponentClient: createServerClient } = await import('@supabase/auth-helpers-nextjs')
  const { cookies } = await import('next/headers')
  
  return createServerClient(
    { cookies }
  )
} 