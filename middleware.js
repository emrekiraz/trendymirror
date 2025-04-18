import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request) {
  try {
    // Get the host from the request
    const host = request.headers.get('host') || '';
    const { pathname, search, searchParams } = request.nextUrl;
    const fullUrl = request.url;
    
    console.log(`Middleware executing for path: ${pathname}, host: ${host}, fullUrl: ${fullUrl}`);

    // Initialize the Supabase client for session check
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Get session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Auth session error:", error);
    }
    
    const isLoggedIn = !!session;
    const user = session?.user;
    
    // Debug için artırılmış loglar
    console.log(`[${new Date().toISOString()}] Auth state for path: ${pathname}`, { 
      isLoggedIn, 
      userId: user?.id,
      email: user?.email?.substring(0, 5) + '...',
      provider: user?.app_metadata?.provider,
      cookies: request.headers.get('cookie')?.substring(0, 50) + '...',
      search,
      referer: request.headers.get('referer')
    });
    
    // ÖNEMLİ! Erişim izni vermeden önce özel yolları ayarla
    // Auth ve api yolları için erişim izni
    if (pathname.startsWith('/auth/callback') || 
        pathname.startsWith('/api/auth/') || 
        pathname.startsWith('/api/')) {
      console.log('Auth/API route erişimi engellenmedi:', pathname);
      
      // Extra debug logging for auth callback routes
      if (pathname.startsWith('/auth/callback')) {
        console.log('Auth callback params:', Object.fromEntries(searchParams.entries()));
        console.log('Auth callback headers:', {
          host: request.headers.get('host'),
          referer: request.headers.get('referer'),
          'user-agent': request.headers.get('user-agent')?.substring(0, 50) + '...'
        });
      }
      
      return res;
    }
    
    // Korunan rotalar için erişim kontrolü
    const isProtected = 
      pathname === '/dashboard' ||
      pathname === '/studio' ||
      pathname === '/generating' ||
      pathname === '/onboarding' ||
      pathname.startsWith('/dashboard/') ||
      pathname.startsWith('/onboarding/');  // Tüm dashboard ve onboarding alt sayfaları korumalı
    
    // Giriş yaptıktan sonra sadece auth/signin sayfasından ana dashboard'a yönlendirme
    if (isLoggedIn && pathname === '/auth/signin') {
      console.log('Giriş yapmış kullanıcı signin sayfasına erişmeye çalışıyor, dashboard\'a yönlendiriliyor');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Korunan rotalara erişim için login kontrolü
    if (isProtected && !isLoggedIn) {
      console.log('Korunan rota erişimi login olmadan:', pathname)
      
      // Logout sonrası home sayfasına yönlendirme için logout parametresi kontrolü
      if (searchParams.has('logout')) {
        console.log('Logout işlemi tespit edildi, ana sayfaya yönlendiriliyor')
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Döngü kontrolü
      if (pathname === '/' && search.includes('showLogin=true')) {
        console.log('Zaten home sayfasındasınız, tekrar yönlendirme yapılmıyor')
        return res
      }
      
      // Kullanıcı login olmadığı için home sayfasına yönlendir, login modal aç ve hata mesajı göster
      const homeUrl = new URL('/', request.url)
      homeUrl.searchParams.set('showLogin', 'true')
      homeUrl.searchParams.set('canClose', 'true')
      homeUrl.searchParams.set('authError', 'Bu sayfaya erişmek için giriş yapmanız gerekmektedir.')
      
      // Doğru yönlendirme için mevcut URL'yi returnUrl olarak sakla
      const rawReturnUrl = request.url
      const safeReturnUrl = encodeURIComponent(rawReturnUrl)
      homeUrl.searchParams.set('returnUrl', safeReturnUrl)
      
      console.log(`Login sayfasına yönlendiriliyor:`, homeUrl.toString())
      return NextResponse.redirect(homeUrl)
    }
    
    // Vercel önizleme URL'lerini ana domain'e yönlendir
    if (host.includes('vercel.app') && 
        !pathname.startsWith('/api/') && 
        !pathname.startsWith('/auth/')) {
      const mainDomain = 'https://www.trendymirror.com';
      const redirectUrl = `${mainDomain}${pathname}${search}`;
      console.log(`Vercel önizleme URL'si tespit edildi, ana domain'e yönlendiriliyor:`, redirectUrl);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Diğer tüm durumlarda normal devam et
    return res;
  } catch (error) {
    console.error("Middleware HATA:", error);
    // Hata durumunda normal devam et
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 