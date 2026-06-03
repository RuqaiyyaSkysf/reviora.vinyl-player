"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  albumArt: string | null
  duration: number
  progress: number
  spotifyUrl: string
}

interface SpotifyContextType {
  isConnected: boolean
  isPlaying: boolean
  track: SpotifyTrack | null
  isLoading: boolean
  error: string | null
  connect: () => void
  disconnect: () => Promise<void>
  refresh: () => Promise<void>
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)

const POLL_INTERVAL = 5000 // Poll every 5 seconds

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCurrentlyPlaying = useCallback(async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setIsLoading(true)
      }

      const response = await fetch('/api/spotify/currently-playing')

      if (response.status === 401) {
        const data = await response.json()
        
        if (data.code === 'TOKEN_EXPIRED') {
          // Try to refresh the token
          const refreshResponse = await fetch('/api/spotify/refresh', {
            method: 'POST',
          })

          if (refreshResponse.ok) {
            // Retry fetching after refresh
            const retryResponse = await fetch('/api/spotify/currently-playing')
            if (retryResponse.ok) {
              const retryData = await retryResponse.json()
              setIsPlaying(retryData.isPlaying)
              setTrack(retryData.track)
              setError(null)
              return
            }
          }

          // If refresh failed, user needs to reconnect
          setIsConnected(false)
          setTrack(null)
          setError('Session expired. Please reconnect to Spotify.')
          return
        }

        // Not authenticated
        setIsConnected(false)
        setTrack(null)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch track')
      }

      const data = await response.json()
      setIsPlaying(data.isPlaying)
      setTrack(data.track)
      setIsConnected(true)
      setError(null)
    } catch (err) {
      console.error('Error fetching Spotify data:', err)
      setError('Failed to fetch track data')
    } finally {
      if (isInitialLoad) {
        setIsLoading(false)
      }
    }
  }, [])

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = () => {
      // Check for the spotify_connected cookie
      const cookies = document.cookie.split(';')
      const connectedCookie = cookies.find(c => c.trim().startsWith('spotify_connected='))
      return connectedCookie?.includes('true') ?? false
    }

    const connected = checkConnection()
    setIsConnected(connected)

    if (connected) {
      fetchCurrentlyPlaying(true)
    } else {
      setIsLoading(false)
    }

    // Check for URL params from callback
    const urlParams = new URLSearchParams(window.location.search)
    const spotifyConnected = urlParams.get('spotify_connected')
    const spotifyError = urlParams.get('spotify_error')

    if (spotifyConnected === 'true') {
      setIsConnected(true)
      fetchCurrentlyPlaying(true)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (spotifyError) {
      setError(`Spotify connection failed: ${spotifyError}`)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
      setIsLoading(false)
    }
  }, [fetchCurrentlyPlaying])

  // Poll for currently playing when connected
  useEffect(() => {
    if (isConnected) {
      // Clear any existing interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }

      // Start polling
      pollIntervalRef.current = setInterval(() => {
        fetchCurrentlyPlaying(false)
      }, POLL_INTERVAL)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    }
  }, [isConnected, fetchCurrentlyPlaying])

  const connect = useCallback(() => {
    // Redirect to Spotify login
    window.location.href = '/api/spotify/login'
  }, [])

  const disconnect = useCallback(async () => {
    try {
      await fetch('/api/spotify/logout', { method: 'POST' })
      setIsConnected(false)
      setTrack(null)
      setIsPlaying(false)
      setError(null)
    } catch (err) {
      console.error('Error disconnecting:', err)
      setError('Failed to disconnect')
    }
  }, [])

  const refresh = useCallback(async () => {
    await fetchCurrentlyPlaying(true)
  }, [fetchCurrentlyPlaying])

  return (
    <SpotifyContext.Provider
      value={{
        isConnected,
        isPlaying,
        track,
        isLoading,
        error,
        connect,
        disconnect,
        refresh,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  )
}

export function useSpotify() {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider')
  }
  return context
}
