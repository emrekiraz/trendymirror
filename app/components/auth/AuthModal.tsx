'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useAuth } from '@/app/hooks/use-auth'
import { useSearchParams } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ 
  isOpen, 
  onClose,
  initialMode = 'login'
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { signIn, user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl');
  const canClose = searchParams?.get('canClose') === 'true';
  const authError = searchParams?.get('authError');
  
  // Update mode when initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    console.log('AuthModal isOpen changed:', isOpen);
    
    // Add class to body when modal is open to prevent scrolling
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle video loading
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        setVideoError(true);
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [isOpen]);
  
  // Handle redirection when authenticated
  useEffect(() => {
    if (user && returnUrl && isOpen) {
      // Redirect to the original URL the user was trying to access
      window.location.href = decodeURIComponent(returnUrl);
    }
  }, [user, returnUrl, isOpen]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      console.log('AuthModal: Starting Google auth with mode:', mode);
      setIsLoading(true);
      
      // Map 'login'/'signup' UI modes to matching intent for consistent naming
      const authIntent = mode; // Using same naming ('login'/'signup') for clarity
      
      console.log(`AuthModal: Setting auth intent to: ${authIntent}`);
      
      await signIn('google', { 
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Use select_account for login to allow account selection
            prompt: mode === 'login' ? 'select_account' : 'consent', 
          },
          // Pass the intent with standard naming
          state: JSON.stringify({ intent: authIntent })
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Google auth error:', error);
      setIsLoading(false);
    }
  };

  const handleVideoError = () => {
    console.error('Video failed to load');
    setVideoError(true);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" 
      style={{ 
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl animate-fadeIn relative">
        {/* Close button - positioned on modal's top-right */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-white hover:text-gray-200 z-20 bg-black/30 rounded-full p-1"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Video section at the top */}
        <div className="relative w-full h-56 overflow-hidden">
          {!videoError ? (
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onError={handleVideoError}
            >
              <source src="/videos/fashion-promo.mp4" type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create your account'}
            </h2>
          </div>
        </div>
        
        {/* Auth content */}
        <div className="p-6 space-y-6">
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {authError}
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {mode === 'login' ? 'Log in to your account' : 'Start your virtual try-on experience today'}
            </h3>
            <p className="text-gray-600 text-sm">
              {mode === 'login' 
                ? 'Sign in to continue your fashion journey' 
                : 'Create an account to get started with TrendyMirror'}
            </p>
          </div>
          
          {/* Auth button with proper Google logo */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 px-4 
              text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600" />
            ) : (
              <>
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span>{mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
              </>
            )}
          </button>
          
          {/* Terms and privacy */}
          <div className="text-center text-xs text-gray-500 mt-4">
            By continuing, you agree to TrendyMirror's <a href="/terms" className="text-blue-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-blue-primary hover:underline">Privacy Policy</a>.
          </div>
          
          {/* Toggle mode */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-1 text-blue-primary hover:underline font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 