import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  console.log('Auth callback route reached')
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const error = requestUrl.searchParams.get('error')
  
  // Log all search params for debugging
  console.log('All search params:', Object.fromEntries(requestUrl.searchParams.entries()));
  
  // Gelişmiş protokol ve host tespiti
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')
  
  console.log('Auth callback details:', {
    url: request.url,
    code: code ? 'exists' : 'missing',
    next: next || 'not provided',
    forwarded: {
      proto: forwardedProto,
      host: forwardedHost
    },
    requestHost: requestUrl.host,
    requestOrigin: requestUrl.origin
  })
  
  // Create Supabase client for the server
  const cookiesObj = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookiesObj })

  // Hata kontrolü
  if (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=${error}`);
  }

  if (code) {
    // Code found
    try {
      // Log more details about the request
      console.log('About to exchange code for session. Code exists:', Boolean(code));
      
      // Check if code verifier exists in cookies
      const allCookies = cookiesObj.getAll();
      const cookieNames = allCookies.map(c => c.name);
      console.log('Available cookies:', cookieNames);
      
      // Check for critical cookie
      const hasPkceCookie = cookieNames.some(name => name.includes('pkce') || name.includes('verifier'));
      console.log('Has PKCE cookie:', hasPkceCookie);
      
      // Instead of using getSession, which might fail with PKCE,
      // we'll try directly exchanging the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        
        // If the error is about code verifier, try a workaround
        if (error.message.includes('code verifier') || error.message.includes('invalid request')) {
          console.log('Code verifier issue detected, redirecting to error page with instructions');
          return NextResponse.redirect(
            `${requestUrl.origin}/auth/error?error=code_verifier_missing&message=${encodeURIComponent(error.message)}&code=${encodeURIComponent(code || '')}`
          );
        }
        
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=code_exchange_failed&message=${encodeURIComponent(error.message)}`)
      }
      
      if (data?.session) {
        console.log('Session established successfully after code exchange')
        
        // Get auth intent (signin/signup) from state parameter
        let authIntent = 'login'; // Default intent
        const stateParam = requestUrl.searchParams.get('state');
        
        if (stateParam) {
          try {
            console.log('Raw state parameter:', stateParam);
            const stateData = JSON.parse(decodeURIComponent(stateParam));
            console.log('Parsed state data:', stateData);
            
            if (stateData.intent) {
              // Normalize intent naming variations to standard 'login'/'signup'
              // (some parts of the code might use 'signin' instead of 'login')
              if (stateData.intent === 'signin') {
                authIntent = 'login';
              } else {
                authIntent = stateData.intent;
              }
              console.log('Auth intent from state:', authIntent);
            }
          } catch (e) {
            console.error('Error parsing state parameter:', e);
          }
        }
        
        // Check if the user is new or existing
        // We'll use the metadata to determine this
        const user = data.session.user;
        
        // A new way to determine if user is new: compare created_at with last_sign_in_at timestamps
        // If they're very close (within a few seconds), this is likely the first sign-in
        let isNewUser = false;
        
        if (user.created_at && user.last_sign_in_at) {
          const createdAt = new Date(user.created_at);
          const lastSignInAt = new Date(user.last_sign_in_at);
          const timeDiffInSeconds = Math.abs((lastSignInAt.getTime() - createdAt.getTime()) / 1000);
          
          // Log exact timestamps to help with debugging
          console.log('Timestamp comparison:', {
            created_at_iso: user.created_at,
            last_sign_in_at_iso: user.last_sign_in_at,
            created_at: createdAt.toISOString(),
            last_sign_in_at: lastSignInAt.toISOString(),
            timeDiffInSeconds,
            sameTimestamp: user.created_at === user.last_sign_in_at
          });
          
          // Consider a user new if timestamps are identical (common for first-time users)
          // or if they're very close (within 5 seconds)
          isNewUser = user.created_at === user.last_sign_in_at || timeDiffInSeconds < 5;
        } else {
          // If timestamps are missing, use a fallback method
          isNewUser = !!(user.app_metadata?.provider === 'google' && 
                       user.created_at === user.last_sign_in_at);
          
          console.log('Using fallback method to determine new user status:', isNewUser);
        }
        
        console.log('User status check:', { 
          isNewUser, 
          created_at: user.created_at, 
          last_sign_in_at: user.last_sign_in_at,
          provider: user.app_metadata?.provider
        });
        
        // Also check profiles table to see if user has completed onboarding
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed, created_at')
          .eq('id', user.id)
          .single();
        
        console.log('Profile data check:', {
          found: !!profileData,
          onboarding_completed: profileData?.onboarding_completed,
          profile_error: !!profileError
        });
        
        // If no profile exists (profileData is null) or onboarding not completed, user needs onboarding
        // profileData will be null for brand new users, so this is a good indication
        const needsOnboarding = isNewUser || !profileData || 
                              (profileData && profileData.onboarding_completed === false);
        
        // FORCE SIGNUP FLOW FOR TESTING
        // This section is just for testing - you can remove it after confirmed working
        if (authIntent === 'signup') {
          console.log('SIGNUP INTENT DETECTED - Profile:', profileData);
          console.log('Needs onboarding decision:', needsOnboarding);
        }
        
        // Update the user's profile with the registration intent
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              registration_intent: authIntent,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        } catch (e) {
          console.error('Exception updating profile:', e);
        }
        
        // Determine redirect path based on intent and user status
        // NEW APPROACH: Always go to dashboard first, dashboard will check if onboarding is needed
        
        // We'll still pass information about user status as URL parameters
        let redirectPath = '/dashboard';
        
        // Add auth_success parameter by default
        const redirectParams = new URLSearchParams();
        redirectParams.set('auth_success', 'true');
        
        // Add parameters to indicate if the user is new and which intent they used
        if (isNewUser) {
          redirectParams.set('new_user', 'true');
        }
        
        if (needsOnboarding) {
          redirectParams.set('needs_onboarding', 'true');
        }
        
        // Add the auth intent
        redirectParams.set('auth_intent', authIntent);
        
        // If existing user tried to sign up, add a parameter for that
        if (authIntent === 'signup' && !isNewUser) {
          redirectParams.set('existing_user', 'true');
        }
        
        // Combine path with parameters
        redirectPath = `${redirectPath}?${redirectParams.toString()}`;
        
        // If there's a custom next path, use it instead
        if (next) {
          console.log(`Overriding with custom next path: ${next}`);
          redirectPath = next;
        }
        
        console.log(`Final redirect decision: ${redirectPath}`);
        console.log(`Auth intent: ${authIntent}, isNewUser: ${isNewUser}, needsOnboarding: ${needsOnboarding}`);
        
        // Redirect to the final destination
        return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
      } else {
        console.error('No session after code exchange')
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=no_session_after_exchange`)
      }
    } catch (callbackError) {
      console.error('Unexpected error in auth callback:', callbackError)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=callback_error&message=Unexpected+error+in+auth+callback`)
    }
  } else {
    // No code parameter found - this can happen in some auth flows
    // Let's try to recover by checking for any auth tokens in the URL
    const access_token = requestUrl.searchParams.get('access_token')
    const refresh_token = requestUrl.searchParams.get('refresh_token')
    
    if (access_token && refresh_token) {
      console.log('No code but found tokens in URL, redirecting to set-session API with tokens')
      return NextResponse.redirect(`${requestUrl.origin}/api/auth/set-session?access_token=${access_token}&refresh_token=${refresh_token}`)
    }
    
    // Let's check the hash part of the URL for tokens (some OAuth flows use hash fragments)
    // However, hash is not accessible server-side, so we'll redirect to a special page to extract it
    console.log('No code or tokens found, redirecting to extract hash parameters')
    return NextResponse.redirect(`${requestUrl.origin}/auth/extract-hash?redirect_to=${encodeURIComponent('/api/auth/set-session')}`)
  }
} 