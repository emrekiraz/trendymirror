'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (provider: 'google', options?: { 
    options?: { 
      redirectTo?: string,
      queryParams?: Record<string, string>,
      state?: string
    } 
  }) => Promise<{ provider: string; url: string } | undefined>
  signOut: () => Promise<void>
  refreshSession: () => Promise<Session | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to save auth data to localStorage
const saveAuthToLocalStorage = (user: User | null, session: Session | null) => {
  if (typeof window === 'undefined') return
  try {
    if (user && session) {
      localStorage.setItem('trm_user', JSON.stringify(user))
      // Only store non-sensitive session data (avoid storing tokens directly)
      localStorage.setItem('trm_session_active', 'true')
      localStorage.setItem('trm_session_expires_at', session.expires_at?.toString() || '')
    } else {
      localStorage.removeItem('trm_user')
      localStorage.removeItem('trm_session_active')
      localStorage.removeItem('trm_session_expires_at')
    }
  } catch (error) {
    console.error('Failed to save auth data to localStorage:', error)
  }
}

// Helper function to load auth data from localStorage
const loadAuthFromLocalStorage = (): { user: User | null, hasSession: boolean } => {
  if (typeof window === 'undefined') return { user: null, hasSession: false }
  try {
    const userStr = localStorage.getItem('trm_user')
    const hasSession = localStorage.getItem('trm_session_active') === 'true'
    const user = userStr ? JSON.parse(userStr) : null
    return { user, hasSession }
  } catch (error) {
    console.error('Failed to load auth data from localStorage:', error)
    return { user: null, hasSession: false }
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshSession = async () => {
    try {
      console.log('Refreshing auth session...')
      setIsLoading(true)
      
      // Get session from Supabase
      const { data: { session: supabaseSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        throw error
      }
      
      console.log('Session status from Supabase:', supabaseSession ? `Active (User ID: ${supabaseSession.user.id})` : 'Not found')
      
      // If we have a session from Supabase, use it
      if (supabaseSession) {
        setSession(supabaseSession)
        setUser(supabaseSession.user)
        saveAuthToLocalStorage(supabaseSession.user, supabaseSession)
        return supabaseSession
      }
      
      // If no session from Supabase, try to recover from localStorage
      const { user: localUser, hasSession: localHasSession } = loadAuthFromLocalStorage()
      if (localUser && localHasSession) {
        console.log('No Supabase session, but found user data in localStorage')
        setUser(localUser)
        // We don't have the full session object, but we know the user is logged in
        // This will at least allow the UI to display user data while we try to refresh
      }
      
      return null
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Get initial session
    refreshSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, updating state')
          setSession(session)
          setUser(session.user)
          saveAuthToLocalStorage(session.user, session)
          router.refresh()
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state')
          setSession(null)
          setUser(null)
          saveAuthToLocalStorage(null, null)
          router.refresh()
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed, updating session')
          setSession(session)
          setUser(session.user)
          saveAuthToLocalStorage(session.user, session)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (provider: 'google', options?: { 
    options?: { 
      redirectTo?: string,
      queryParams?: Record<string, string>,
      state?: string
    } 
  }) => {
    try {
      console.log('Initiating sign in with provider:', provider, options);
      setIsLoading(true);
      
      // Build absolute URL for authentication
      const siteUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://www.trendymirror.com';
      
      // Determine if we should redirect back to dashboard or current page
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
      
      // Oturum açma işlemi hakkında detaylı log
      console.log('Auth details for sign in:', { 
        siteUrl, 
        currentPath,
        referrer: document?.referrer,
        userAgent: navigator?.userAgent?.substring(0, 50) + '...',
        screenWidth: window?.innerWidth
      })
      
      // Özel durumlar için parametreleri kaydet
      let nextPath = '/dashboard'
      
      // Eğer returnUrl parametresi varsa, bu yönlendirme için kullanılacak
      if (options?.options?.redirectTo) {
        const rawReturnUrl = options.options.redirectTo
        
        // URL güvenli bir şekilde decode edilsin
        try {
          let decodedReturnUrl = rawReturnUrl
          if (rawReturnUrl.includes('%')) {
            decodedReturnUrl = decodeURIComponent(rawReturnUrl)
            console.log('Auth provider - ReturnUrl decoded:', decodedReturnUrl)
            
            // İki kez encode edilmiş olabilir, tekrar kontrol et
            if (decodedReturnUrl.includes('%')) {
              decodedReturnUrl = decodeURIComponent(decodedReturnUrl)
              console.log('Auth provider - ReturnUrl double-decoded:', decodedReturnUrl)
            }
          }
          
          // URL ise, mutlaka aynı domaine ait olmalı - güvenlik kontrolü
          if (decodedReturnUrl.startsWith('http')) {
            try {
              const returnUrlObj = new URL(decodedReturnUrl)
              // Sadece aynı domain'e izin ver
              if (returnUrlObj.host === window.location.host) {
                nextPath = `${returnUrlObj.pathname}${returnUrlObj.search}`
              } else {
                console.warn('ReturnUrl farklı bir domaine ait, güvenlik nedeniyle reddedildi:', returnUrlObj.host)
              }
            } catch (urlError) {
              console.error('Invalid URL in returnUrl:', urlError)
            }
          } else {
            // Path ise, doğrudan kullan
            nextPath = decodedReturnUrl
          }
        } catch (error) {
          console.error('Error processing returnUrl:', error)
        }
      }
      
      // Build the callback URL
      const redirectTo = options?.options?.redirectTo || 
        `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      
      console.log(`Redirect configured: ${redirectTo}`);
      
      // Ensure auth flow is properly configured
      // Clear any existing auth tokens to avoid conflicts
      if (typeof window !== 'undefined') {
        console.log('Clearing previous auth tokens before sign in');
        // Clear localStorage tokens
        localStorage.removeItem('sb-auth-token');
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-pkce-verifier');
        
        // Clear cookie tokens
        document.cookie = 'sb-auth-token=; path=/; max-age=0; secure; samesite=lax';
        document.cookie = 'supabase.auth.token=; path=/; max-age=0; secure; samesite=lax';
        document.cookie = 'sb-pkce-verifier=; path=/; max-age=0; secure; samesite=lax';
        
        // Check what's left after clearing
        console.log('Remaining auth cookies:', document.cookie);
        console.log('localStorage has auth token:', Boolean(localStorage.getItem('sb-auth-token')));
      }
      
      // State parametresini ekleyelim
      const state = options?.options?.state || null;
      
      // Query parametrelerini birleştirelim
      const queryParams = {
        access_type: 'offline',
        ...(options?.options?.queryParams || {}),
      };
      
      // Actually do the sign in
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams,
          skipBrowserRedirect: false,
          scopes: 'email profile',
          ...(state && { state }), // state parametresi varsa ekle
        },
      });
      
      if (error) {
        console.error('Error signing in:', error);
        throw error;
      }
      
      console.log('Sign in initiated', data);
      return data;
    } catch (error) {
      console.error('Error in signIn function:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      
      console.log('Signed out successfully')
      
      // Force refresh the auth state after sign out
      setUser(null)
      setSession(null)
      
      // Clear stored auth data
      saveAuthToLocalStorage(null, null)
      
      // Clear any stored tokens
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('auth_debug')
        
        // Clean up any other auth-related items
        localStorage.removeItem('sb-auth-token')
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('sb-pkce-verifier')
      }
      
      // Directly navigate to home page
      router.push('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}