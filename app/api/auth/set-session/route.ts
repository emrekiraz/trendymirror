import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('GET request to set-session');
    
    // Extract any tokens from URL query params (in case they're passed this way)
    const { searchParams } = new URL(request.url);
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const code = searchParams.get('code');
    
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Headers:', {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
      'user-agent': request.headers.get('user-agent')?.substring(0, 50) + '...'
    });
    
    // Get the supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // If we have a code parameter, we can try to exchange it for tokens
    let sessionEstablished = false;
    
    if (code) {
      console.log('Found code parameter, attempting to exchange for session');
      // The code needs to be exchanged by Supabase - let's check for session after a short delay
      // We don't need to do anything special here, as Supabase auth helpers should handle this automatically
    }
    
    // If we have tokens in the query, use them to set the session
    if (access_token && refresh_token) {
      console.log('Found tokens in URL, attempting to set session manually');
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: access_token.toString(),
          refresh_token: refresh_token.toString()
        });
        
        if (error) {
          console.error('Error setting session with tokens:', error);
        } else if (data?.session) {
          console.log('Session set successfully with tokens:', data.session.user.id);
          sessionEstablished = true;
        }
      } catch (tokenError) {
        console.error('Error using tokens to set session:', tokenError);
      }
    }
    
    // Try getting the session directly - this will work if the session was established
    // through other means (like the code exchange)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
    }
    
    if (session) {
      console.log('Found active session, user authenticated:', session.user.id);
      sessionEstablished = true;
    }
    
    // If we successfully established a session, redirect to dashboard
    if (sessionEstablished || session) {
      console.log('Authentication successful, redirecting to dashboard');
      return NextResponse.redirect(`${request.nextUrl.origin}/dashboard?auth_success=true`);
    }
    
    // Fallback: Try to redirect to Supabase's auth callback with path
    // This will complete the auth flow if we're missing the code exchange step
    const supabaseAuthCallbackUrl = `${request.nextUrl.origin}/auth/callback`;
    console.log('No session established, redirecting to Supabase auth callback:', supabaseAuthCallbackUrl);
    return NextResponse.redirect(supabaseAuthCallbackUrl);
  } catch (error) {
    console.error('Unexpected error in GET set-session:', error);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/auth/error?error=unexpected&message=An+unexpected+error+occurred`
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const access_token = formData.get('access_token')
    const refresh_token = formData.get('refresh_token')
    const origin = request.headers.get('origin') || ''
    
    // Debug için form verilerini ve header bilgilerini logla
    console.log('Set-session formData keys:', Array.from(formData.keys()))
    console.log('Request origin:', origin)
    console.log('Headers:', {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
      'user-agent': request.headers.get('user-agent')?.substring(0, 50) + '...'
    })

    // Token'ların varlığını kontrol et
    if (!access_token || !refresh_token) {
      console.error('Missing tokens in request', { 
        hasAccessToken: !!access_token, 
        hasRefreshToken: !!refresh_token 
      })
      return NextResponse.redirect(
        `${request.nextUrl.origin}/auth/error?error=missing_tokens`
      )
    }

    // Parse cookies from the request
    const cookieStore = cookies()
    const redirectPath = request.cookies.get('auth_callback_redirect')?.value || '/dashboard?auth_success=true'
    
    // Supabase client oluştur
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Set session with provided tokens
    const { data, error } = await supabase.auth.setSession({
      access_token: access_token.toString(),
      refresh_token: refresh_token.toString()
    })
    
    if (error) {
      console.error('Error setting session', error)
      return NextResponse.redirect(
        `${request.nextUrl.origin}/auth/error?error=set_session_failed&message=${encodeURIComponent(error.message)}`
      )
    }
    
    console.log('Session set successfully:', { user: data?.user?.id, redirectPath })
    
    // Yönlendirme için URL oluştur - güvenli URL parsing
    let baseUrl: string
    
    // Öncelikle domain güvenliği - aynı domain'e yönlendir
    if (origin && origin.includes(request.nextUrl.host)) {
      // Aynı origin'den geliyorsa, origin'i kullan
      baseUrl = origin
    } else {
      // Farklı origin'den geliyorsa, mevcut host'u kullan
      baseUrl = request.nextUrl.origin
    }
    
    // Yönlendirme yolunu kontrol et - URL olup olmadığını (http/https içerip içermediğini) kontrol et
    let finalRedirectUrl = ''
    if (redirectPath.startsWith('http')) {
      // Tam URL ise, doğrudan kullan
      finalRedirectUrl = redirectPath
    } else {
      // Sadece path ise, base URL ile birleştir
      finalRedirectUrl = `${baseUrl}${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`
    }
    
    // Yönlendirme URL'sinin doğru şekillendirildiğinden emin ol
    console.log('Redirecting to:', finalRedirectUrl)
    
    // Yönlendirme response'unu oluştur
    const response = NextResponse.redirect(finalRedirectUrl)
    
    // Cookie ile authentication başarı durumunu işaretle
    response.cookies.set('auth_success', 'true', {
      path: '/',
      maxAge: 60 * 60,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    
    // Başarılı giriş işlemine özel HTML sayfası döndür
    const authSuccessHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authenticating...</title>
        <script>
          // Kullanıcının yeni giriş yaptığını işaretle
          sessionStorage.setItem('just_authenticated', 'true');
          // Sonra hedef sayfaya yönlendir
          window.location.href = "${finalRedirectUrl}";
        </script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
          }
          h1 {
            color: #333;
          }
          .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Login Successful!</h1>
          <p>You are being redirected...</p>
          <div class="loader"></div>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(authSuccessHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Unexpected error in set-session:', error)
    return NextResponse.redirect(
      `${request.nextUrl.origin}/auth/error?error=unexpected&message=An+unexpected+error+occurred`
    )
  }
} 