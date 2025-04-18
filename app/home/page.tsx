'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Hero from '../landing/components/Hero'
import TryOnDemo from '../landing/components/TryOnDemo'
import Testimonials from '../landing/components/Testimonials'
import HowItWorks from '../landing/components/HowItWorks'
import ValueProposition from '../landing/components/ValueProposition'
import Features from '../landing/components/Features'
import FAQ from '../landing/components/FAQ'
import CTA from '../landing/components/CTA'
import useAuthModal from '../hooks/useAuthModal'
import { useAuth } from '../hooks/use-auth'

export default function HomePage() {
  const searchParams = useSearchParams()
  const showLogin = searchParams.get('showLogin')
  const canClose = searchParams.get('canClose') === 'true'
  const returnUrl = searchParams.get('returnUrl')
  const authError = searchParams.get('authError')
  const { openLoginModal, closeAuthModal } = useAuthModal()
  const { user } = useAuth()
  const [modalOpened, setModalOpened] = useState(false)
  const redirectAttempted = useRef(false)
  const router = useRouter()
  
  useEffect(() => {
    console.log('HomePage useEffect - Auth state:', { 
      hasUser: !!user, 
      showLogin, 
      returnUrl: returnUrl || 'none',
      authError: authError || 'none',
      modalOpened,
      redirectAttempted: redirectAttempted.current
    })
    
    // Kullanıcının giriş yaptığını, henüz yönlendirme denemediğimizi ve bir dönüş URL'si olduğunu kontrol edelim
    if (user && returnUrl && !redirectAttempted.current) {
      redirectAttempted.current = true
      
      try {
        // Oturum bilgilerini localStorage'a kaydet (debug için)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_debug', JSON.stringify({ 
            isLoggedIn: true, 
            userId: user.id,
            email: user.email,
            timestamp: new Date().toISOString(),
            returnUrl,
            pathname: window.location.pathname
          }));
        }
        
        // ReturnUrl decode etme - URL güvenli bir şekilde decode edilsin
        let decodedReturnUrl = returnUrl
        if (returnUrl.includes('%')) {
          try {
            decodedReturnUrl = decodeURIComponent(returnUrl)
            console.log('ReturnUrl decoded:', decodedReturnUrl)
            
            // İki kez encode edilmiş olabilir, tekrar kontrol et
            if (decodedReturnUrl.includes('%')) {
              decodedReturnUrl = decodeURIComponent(decodedReturnUrl)
              console.log('ReturnUrl double-decoded:', decodedReturnUrl)
            }
          } catch (decodeError) {
            console.error('ReturnUrl decode error:', decodeError)
          }
        }
        
        // Dashboard yönlendirmesi için özel durum
        if (decodedReturnUrl.includes('/dashboard')) {
          console.log('Dashboard path detected in returnUrl, redirecting with force_auth')
          // Middleware'deki redirectleri önlemek için force_auth parametresi ekleyelim
          window.location.href = '/dashboard?force_auth=true&auth_source=home'; 
          return;
        }
        
        // Diğer returnUrl'ler için genel işleme
        console.log('Redirecting to:', decodedReturnUrl)
        
        // Tam URL mi yoksa sadece path mi kontrol et
        if (decodedReturnUrl.startsWith('http')) {
          // Tam URL ise, doğrudan kullan
          window.location.href = decodedReturnUrl
        } else {
          // Path ise, mevcut domain ile birleştir
          window.location.href = `${window.location.origin}${decodedReturnUrl.startsWith('/') ? '' : '/'}${decodedReturnUrl}`
        }
      } catch (error) {
        console.error('Error redirecting:', error)
        // Hata durumunda dashboard'a yönlendir
        console.log('Error occurred, going to dashboard as fallback')
        window.location.href = '/dashboard?force_auth=true&error_redirect=true';
      }
      return
    }
    
    // OTOMATİK YÖNLENDİRMEYİ KALDIR: Ana sayfada kullanıcı giriş yapmışsa bile yönlendirme yapma
    // Kullanıcının spesifik olarak giriş yapma işleminden gelip gelmediğini kontrol et
    const comingFromAuth = sessionStorage.getItem('just_authenticated') === 'true';
    
    // Kullanıcı giriş yapmışsa ve yeni giriş yapmışsa, otomatik dashboard yönlendirmesi
    if (user && comingFromAuth && !redirectAttempted.current) {
      console.log('User just logged in, redirecting to dashboard')
      redirectAttempted.current = true
      
      // Yeni giriş bayrağını temizle
      sessionStorage.removeItem('just_authenticated');
      
      // Yönlendirmeyi kısa bir gecikme ile yap (sayfa yüklenmesini önlemek için)
      setTimeout(() => {
        window.location.href = '/dashboard?force_auth=true&auto_redirect=true'
      }, 100)
      return
    }
    
    // Login modalı gösterme
    if (showLogin === 'true' && !modalOpened) {
      console.log('Opening login modal based on URL parameters')
      setModalOpened(true)
      openLoginModal()
    }
  }, [user, showLogin, returnUrl, authError, openLoginModal, modalOpened])
  
  return (
    <>
      <Hero />
      <TryOnDemo />
      <HowItWorks />
      <Testimonials />
      <CTA 
        title="Ready to Transform Your Shopping Experience?"
        description="Join thousands of satisfied users who are already enjoying the benefits of virtual try-on technology."
        primaryButtonText="Try For Free"
        primaryButtonAction="signup"
        secondaryButtonText="Learn More"
        secondaryButtonHref="/home/features"
        variant="light"
      />
      <ValueProposition />
      <Features />
      <FAQ />
      <CTA 
        title="Start Your Virtual Try-On Journey Today"
        description="No credit card required. Sign up for free and experience the future of online shopping."
        primaryButtonText="Get Started"
        primaryButtonAction="signup"
        variant="dark"
      />
    </>
  )
} 