'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export default function ExtractHashPage() {
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = searchParams?.get('redirect_to') || '/dashboard';
  
  useEffect(() => {
    // Extract hash parameters from URL
    if (typeof window !== 'undefined') {
      try {
        console.log('Extracting hash parameters');
        
        // If there's a hash in the URL, extract it
        if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          console.log('Found hash:', hash);
          
          // Parse hash parameters
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          console.log('Extracted tokens from hash:', { 
            hasAccessToken: !!accessToken, 
            hasRefreshToken: !!refreshToken 
          });
          
          // If we have the necessary tokens, redirect to set-session
          if (accessToken && refreshToken) {
            // Build the URL with the tokens
            const redirectUrl = new URL(redirectTo, window.location.origin);
            redirectUrl.searchParams.set('access_token', accessToken);
            redirectUrl.searchParams.set('refresh_token', refreshToken);
            
            console.log('Redirecting to set-session with tokens');
            window.location.href = redirectUrl.toString();
            return;
          } else {
            setError('Missing required tokens in URL hash');
          }
        } else {
          setError('No hash parameters found in URL');
        }
      } catch (err) {
        console.error('Error extracting hash parameters:', err);
        setError('Failed to process authentication data');
      }
      
      setIsProcessing(false);
    }
  }, [redirectTo]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Processing Authentication
        </h1>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">
              Processing your login information, please wait...
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-block h-12 w-12 text-red-600 mb-4">
              <ExclamationTriangleIcon className="h-12 w-12" />
            </div>
            <p className="text-red-600 font-medium mb-2">
              Authentication Error
            </p>
            <p className="text-gray-600 mb-4">
              {error}
            </p>
            <Button onClick={() => window.location.href = '/home'}>
              Return to Homepage
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block h-12 w-12 text-green-600 mb-4">
              <CheckIcon className="h-12 w-12" />
            </div>
            <p className="text-green-600 font-medium mb-2">
              Authentication Successful
            </p>
            <p className="text-gray-600">
              You will be redirected shortly...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 