import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  // Clear all Spotify-related cookies
  cookieStore.delete('spotify_access_token')
  cookieStore.delete('spotify_refresh_token')
  cookieStore.delete('spotify_expires_at')
  cookieStore.delete('spotify_connected')
  cookieStore.delete('spotify_auth_state')

  return NextResponse.json({ success: true })
}
