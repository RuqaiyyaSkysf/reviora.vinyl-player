import { NextResponse } from 'next/server'
import { refreshAccessToken } from '@/lib/spotify'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token available' },
      { status: 401 }
    )
  }

  try {
    const tokens = await refreshAccessToken(refreshToken)
    const expiresAt = Date.now() + tokens.expires_in * 1000

    // Update access token cookie
    cookieStore.set('spotify_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
    })

    // Update refresh token if a new one was provided
    if (tokens.refresh_token) {
      cookieStore.set('spotify_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
    }

    cookieStore.set('spotify_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Token refresh error:', err)
    
    // Clear all Spotify cookies on refresh failure
    cookieStore.delete('spotify_access_token')
    cookieStore.delete('spotify_refresh_token')
    cookieStore.delete('spotify_expires_at')
    cookieStore.delete('spotify_connected')

    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 401 }
    )
  }
}
