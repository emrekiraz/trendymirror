'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/hooks/use-auth'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

export default function SignInPage() {
  const { signIn, isLoading, user, refreshSession } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  
  // Check auth status when component mounts and whenever needed
  useEffect(() => {
    const checkAuth = async () => {
      setCheckingSession(true)
      await refreshSession()
      setCheckingSession(false)
    }
    
    checkAuth()
  }, [refreshSession])
  
  // If user is already signed in, redirect to callbackUrl
  useEffect(() => {
    console.log('SignInPage - Auth state:', { 
      isLoading,
      isSignedIn: !!user,
      callbackUrl
    })
  
    if (user && !isLoading && !checkingSession) {
      console.log('User already signed in, redirecting to:', callbackUrl)
      router.push(callbackUrl)
    }
  }, [user, isLoading, router, callbackUrl, checkingSession])
  
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in from SignInPage')
      setIsSigningIn(true)
      
      // Explicitly specify login intent
      await signIn('google', {
        options: {
          queryParams: {
            prompt: 'select_account' // Allow account selection instead of skipping consent
          },
          state: JSON.stringify({ intent: 'login' })
        }
      })
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
      setIsSigningIn(false)
    }
  }
  
  if (isLoading || checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin">
          <Icons.spinner className="h-6 w-6" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to TrendyMirror</CardTitle>
          <CardDescription>
            Sign in with your account or use your social accounts
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 