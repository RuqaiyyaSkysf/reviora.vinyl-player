import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@/lib/spotify'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const cookieStore = await cookies()
  const storedState = cookieStore.get('spotify_auth_state')?.value

  // Clear the state cookie
  cookieStore.delete('spotify_auth_state')

  // Handle errors from Spotify
  if (error) {
    return NextResponse.redirect(
      new URL(`/?spotify_error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // Validate state to prevent CSRF
  if (!state || state !== storedState) {
    return NextResponse.redirect(
      new URL('/?spotify_error=state_mismatch', request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?spotify_error=no_code', request.url)
    )
  }

  try {
    const tokens = await exchangeCodeForTokens(code)

    // Calculate expiration time
    const expiresAt = Date.now() + tokens.expires_in * 1000

    // Store tokens in secure HTTP-only cookies
    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    })

    cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    cookieStore.set('spotify_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Set a non-httpOnly cookie to indicate auth status to client
    cookieStore.set('spotify_connected', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return NextResponse.redirect(new URL('/?spotify_connected=true', request.url))
  } catch (err) {
    console.error('Spotify callback error:', err)
    return NextResponse.redirect(
      new URL('/?spotify_error=token_exchange_failed', request.url)
    )
  }
}
