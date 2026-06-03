// Spotify API configuration and helper functions

export const SPOTIFY_CONFIG = {
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_BASE_URL 
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/callback`
    : 'http://localhost:3000/api/spotify/callback',
  scopes: [
    'user-read-currently-playing',
    'user-read-recently-played',
  ].join(' '),
}

export const SPOTIFY_ENDPOINTS = {
  authorize: 'https://accounts.spotify.com/authorize',
  token: 'https://accounts.spotify.com/api/token',
  currentlyPlaying: 'https://api.spotify.com/v1/me/player/currently-playing',
  recentlyPlayed: 'https://api.spotify.com/v1/me/player/recently-played',
}

export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string; id: string }[]
  album: {
    name: string
    images: { url: string; width: number; height: number }[]
  }
  duration_ms: number
  external_urls: { spotify: string }
}

export interface CurrentlyPlayingResponse {
  is_playing: boolean
  progress_ms: number
  item: SpotifyTrack | null
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown'
}

export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: SPOTIFY_CONFIG.redirectUri,
    scope: SPOTIFY_CONFIG.scopes,
    state,
    show_dialog: 'true',
  })

  return `${SPOTIFY_ENDPOINTS.authorize}?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_ENDPOINTS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code: ${error}`)
  }

  return response.json()
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_ENDPOINTS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${SPOTIFY_CONFIG.clientId}:${SPOTIFY_CONFIG.clientSecret}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  return response.json()
}

export async function getCurrentlyPlaying(
  accessToken: string
): Promise<CurrentlyPlayingResponse | null> {
  const response = await fetch(SPOTIFY_ENDPOINTS.currentlyPlaying, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 204 means nothing is currently playing
  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('TOKEN_EXPIRED')
    }
    const error = await response.text()
    throw new Error(`Failed to get currently playing: ${error}`)
  }

  return response.json()
}

export async function getRecentlyPlayed(accessToken: string, limit = 1) {
  const response = await fetch(
    `${SPOTIFY_ENDPOINTS.recentlyPlayed}?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('TOKEN_EXPIRED')
    }
    const error = await response.text()
    throw new Error(`Failed to get recently played: ${error}`)
  }

  return response.json()
}
