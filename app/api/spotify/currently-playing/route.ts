import { NextResponse } from 'next/server'
import { getCurrentlyPlaying, getRecentlyPlayed } from '@/lib/spotify'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('spotify_access_token')?.value
  const expiresAt = cookieStore.get('spotify_expires_at')?.value

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated', code: 'NOT_AUTHENTICATED' },
      { status: 401 }
    )
  }

  // Check if token is expired or about to expire
  if (expiresAt && Date.now() > parseInt(expiresAt) - 60000) {
    return NextResponse.json(
      { error: 'Token expired', code: 'TOKEN_EXPIRED' },
      { status: 401 }
    )
  }

  try {
    const currentlyPlaying = await getCurrentlyPlaying(accessToken)

    if (!currentlyPlaying || !currentlyPlaying.item) {
      // Try to get the most recently played track
      try {
        const recentlyPlayed = await getRecentlyPlayed(accessToken, 1)
        if (recentlyPlayed.items && recentlyPlayed.items.length > 0) {
          const recentTrack = recentlyPlayed.items[0].track
          return NextResponse.json({
            isPlaying: false,
            track: {
              id: recentTrack.id,
              name: recentTrack.name,
              artist: recentTrack.artists.map((a: { name: string }) => a.name).join(', '),
              album: recentTrack.album.name,
              albumArt: recentTrack.album.images[0]?.url || null,
              duration: recentTrack.duration_ms,
              progress: 0,
              spotifyUrl: recentTrack.external_urls.spotify,
            },
            source: 'recently_played',
          })
        }
      } catch {
        // Ignore errors fetching recently played
      }

      return NextResponse.json({
        isPlaying: false,
        track: null,
        source: 'none',
      })
    }

    // Only handle tracks (not episodes or ads)
    if (currentlyPlaying.currently_playing_type !== 'track') {
      return NextResponse.json({
        isPlaying: currentlyPlaying.is_playing,
        track: null,
        source: 'non_track',
      })
    }

    const track = currentlyPlaying.item

    return NextResponse.json({
      isPlaying: currentlyPlaying.is_playing,
      track: {
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(', '),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || null,
        duration: track.duration_ms,
        progress: currentlyPlaying.progress_ms,
        spotifyUrl: track.external_urls.spotify,
      },
      source: 'currently_playing',
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'TOKEN_EXPIRED') {
      return NextResponse.json(
        { error: 'Token expired', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      )
    }

    console.error('Error fetching currently playing:', err)
    return NextResponse.json(
      { error: 'Failed to fetch track' },
      { status: 500 }
    )
  }
}
