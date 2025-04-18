"use client";

import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", { 
        callbackUrl,
        redirect: true 
      });
      
      if (!result?.ok) {
        console.error("Google ile giriş hatası:", result);
      }
    } catch (error) {
      console.error("Google ile giriş hatası:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="group relative flex w-full justify-center items-center gap-3 rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-indigo-600" />
          ) : (
            <>
              <Image
                src="/google-logo.svg"
                alt="Google logo"
                width={20}
                height={20}
              />
              Google ile giriş yap
            </>
          )}
        </button>
      </div>
    </div>
  );
} 