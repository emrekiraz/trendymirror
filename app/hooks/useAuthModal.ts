'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

// Global state to share across components
let globalIsModalOpen = false;
let globalAuthMode: 'login' | 'signup' = 'login';
let forceModalState = false;

// Global event listeners
const listeners: Function[] = [];

// Function to update all subscribers
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export default function useAuthModal() {
  // Local state to trigger re-renders
  const [isModalOpen, setIsModalOpen] = useState(globalIsModalOpen);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(globalAuthMode);
  const { user, session, signIn, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const canClose = searchParams?.get('canClose') === 'true';

  // Subscribe to global state changes
  useEffect(() => {
    const updateState = () => {
      setIsModalOpen(globalIsModalOpen);
      setAuthMode(globalAuthMode);
    };
    
    listeners.push(updateState);
    
    return () => {
      const index = listeners.indexOf(updateState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  const openLoginModal = () => {
    globalAuthMode = 'login';
    globalIsModalOpen = true;
    notifyListeners();
  };
  
  const openSignupModal = () => {
    globalAuthMode = 'signup';
    globalIsModalOpen = true;
    notifyListeners();
  };
  
  const closeAuthModal = () => {
    // Always allow closing the modal - removing the conditional
    globalIsModalOpen = false;
    notifyListeners();
    
    // Clear URL parameters when modal is closed
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('showLogin');
      url.searchParams.delete('canClose');
      // Don't remove returnUrl as we might need it after auth
      window.history.replaceState({}, '', url.toString());
    }
  };
  
  const handleGoogleSignIn = async (intent: 'signup' | 'login' = 'login') => {
    try {
      console.log(`Initiating Google auth with intent: ${intent}`);
      await signIn('google', {
        options: {
          queryParams: {
            // Use 'select_account' for login to allow account selection
            // and 'consent' for signup to ensure permissions are granted
            prompt: intent === 'login' ? 'select_account' : 'consent',
          },
          state: JSON.stringify({ intent })
        }
      });
      // OAuth redirect will happen here
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // The signOut function in useAuth already handles redirection
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAuthenticated = !!user;
  
  return {
    openLoginModal,
    openSignupModal,
    closeAuthModal,
    isAuthenticated,
    isModalOpen,
    authMode,
    handleGoogleSignIn,
    handleSignOut,
    user,
    session
  };
} 