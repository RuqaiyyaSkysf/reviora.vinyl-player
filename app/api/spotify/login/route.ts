import { NextResponse } from 'next/server'
import { getAuthorizationUrl } from '@/lib/spotify'
import { cookies } from 'next/headers'

export async function GET() {
  // Generate a random state for CSRF protection
  const state = crypto.randomUUID()
  
  // Store state in cookie for verification
  const cookieStore = await cookies()
  cookieStore.set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })

  const authUrl = getAuthorizationUrl(state)
  
  return NextResponse.redirect(authUrl)
}
