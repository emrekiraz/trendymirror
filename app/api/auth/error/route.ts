import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const errorType = error || 'unknown';
  
  console.error(`Authentication error: ${errorType}`);
  
  // Redirect to user-friendly error page
  return NextResponse.redirect(new URL(`/auth/error?error=${errorType}`, url.origin));
} 