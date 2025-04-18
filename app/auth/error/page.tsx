'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const code = searchParams.get('code');
  
  const [countdown, setCountdown] = useState(3);
  
  // If it's a code verifier error, we can try to recover
  const isCodeVerifierError = error === 'code_verifier_missing' || 
    (message && message.includes('code verifier'));

  useEffect(() => {
    if (isCodeVerifierError && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isCodeVerifierError, countdown]);
  
  // Auto-redirect to login after countdown
  useEffect(() => {
    if (isCodeVerifierError && countdown === 0) {
      window.location.href = '/login?auth_error=code_verifier';
    }
  }, [isCodeVerifierError, countdown]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        
        <p className="text-xl font-medium text-slate-700 mb-2">
          {message || 'An error occurred during the login process.'}
        </p>
        
        <p className="text-sm text-slate-500 mb-4">
          Error code: {error || 'unknown'}
        </p>
        
        {isCodeVerifierError ? (
          <div className="space-y-4">
            <p className="text-orange-600">
              A security verification issue occurred during the login process.
              This is usually caused by a browser cache or cookie issue.
            </p>
            
            <p className="text-slate-600 font-medium">
              {countdown > 0 
                ? `You will be redirected to the login page in ${countdown} seconds...` 
                : 'Redirecting to login page...'}
            </p>
            
            <div className="space-x-4">
              <Button asChild variant="default">
                <Link href="/login?auth_error=code_verifier">
                  Return to login
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <Link href="/">
                  Return to home
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button asChild variant="default">
              <Link href="/login">
                Return to login
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                Return to home
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 