"use client"

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from "react"

export type Theme = "black" | "pink" | "coding" | "maroon" | "galaxy" | "flame" | "blood" | "nightcity" | "gothic" | "vintage" | "masjid" | "rainy-mood"

export type ViewMode = "vinyl-only" | "vinyl-lyrics" | "vinyl-playlist" | "vinyl-playlist-lyrics"

export type VinylStyle = "vinyl-blurred" | "vinyl-minimal"

export interface Track {
  id: string
  title: string
  artist: string
  albumArt?: string
  duration: number
  source: "local"
  url?: string
  lyrics?: LyricLine[]
  lyricsType?: "lrc" | "plain" // Track if lyrics have timestamps (lrc) or not (plain)
}

export interface LyricLine {
  time: number
  text: string
}

export type LyricScrollSpeed = "slower" | "normal" | "faster"

interface PlayerContextType {
  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // View Mode
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  // Vinyl Style
  vinylStyle: VinylStyle
  setVinylStyle: (style: VinylStyle) => void

  // Vinyl Size (for minimal vinyl only)
  vinylSize: number
  setVinylSize: (size: number) => void

  // Playback state
  isPlaying: boolean
  currentTrack: Track | null
  currentTime: number
  duration: number
  volume: number

  // Queue
  queue: Track[]
  queueIndex: number

  // Lyrics
  lyricScrollSpeed: LyricScrollSpeed
  setLyricScrollSpeed: (speed: LyricScrollSpeed) => void
  lyricsPanelOffset: number
  setLyricsPanelOffset: (offset: number) => void
  vinylPlayerOffset: number
  setVinylPlayerOffset: (offset: number) => void

  // Actions
  play: () => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  addToQueue: (track: Track) => void
  playTrack: (track: Track) => void
  setQueue: (tracks: Track[], startIndex?: number) => void
  clearQueue: () => void
  setTrackLyrics: (lyrics: LyricLine[], lyricsType?: "lrc" | "plain") => void
  setTrackArtwork: (artworkUrl: string | null) => void
  onArtworkSet?: (artworkUrl: string) => void

  // Audio ref for external access
  audioRef: React.RefObject<HTMLAudioElement | null>

  // Current lyric
  currentLyric: string
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  // Initialize theme and viewMode from localStorage with defaults
  const [theme, setThemeState] = useState<Theme>("black")
  const [viewMode, setViewModeState] = useState<ViewMode>("vinyl-only")
  const [isInitialized, setIsInitialized] = useState(false)
  
  const [vinylStyle, setVinylStyle] = useState<VinylStyle>("vinyl-blurred")
  const [vinylSize, setVinylSize] = useState(100) // Percentage
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [queue, setQueueState] = useState<Track[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [currentLyric, setCurrentLyric] = useState("")
  const [lyricScrollSpeed, setLyricScrollSpeed] = useState<LyricScrollSpeed>("normal")
  const [lyricsPanelOffset, setLyricsPanelOffset] = useState(0) // Horizontal offset in pixels
  const [vinylPlayerOffset, setVinylPlayerOffset] = useState(0) // Horizontal vinyl player offset in pixels

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize theme and viewMode from localStorage on component mount
  useEffect(() => {
    if (typeof window === "undefined") return
    
    try {
      const savedTheme = localStorage.getItem("vinyl-player-theme") as Theme | null
      const savedViewMode = localStorage.getItem("vinyl-player-view-mode") as ViewMode | null
      
      if (savedTheme) {
        setThemeState(savedTheme)
      }
      if (savedViewMode) {
        setViewModeState(savedViewMode)
      }
    } catch (error) {
      console.log("[v0] Failed to load persisted settings:", error)
    }
    
    setIsInitialized(true)
  }, [])

  // Wrapper functions that save to localStorage when theme or viewMode changes
  const setTheme = (theme: Theme) => {
    setThemeState(theme)
    try {
      localStorage.setItem("vinyl-player-theme", theme)
    } catch (error) {
      console.log("[v0] Failed to save theme:", error)
    }
  }

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    try {
      localStorage.setItem("vinyl-player-view-mode", mode)
    } catch (error) {
      console.log("[v0] Failed to save view mode:", error)
    }
  }

  // Update current lyric based on time
  useEffect(() => {
    if (!currentTrack?.lyrics || currentTrack.lyrics.length === 0) {
      setCurrentLyric("")
      return
    }

    const lyrics = currentTrack.lyrics
    let activeLyric = ""

    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        activeLyric = lyrics[i].text
        break
      }
    }

    setCurrentLyric(activeLyric)
  }, [currentTime, currentTrack])

  // Audio event handlers for local playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }
    const handleDurationChange = () => {
      setDuration(audio.duration)
    }
    const handleEnded = () => {
      if (queueIndex < queue.length - 1) {
        next()
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [queueIndex, queue.length])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const play = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
        // Ignore play errors
      })
      setIsPlaying(true)
    }
  }

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const next = () => {
    if (queueIndex < queue.length - 1) {
      const newIndex = queueIndex + 1
      setQueueIndex(newIndex)
      setCurrentTrack(queue[newIndex])
      setCurrentTime(0)
      if (audioRef.current && queue[newIndex].url) {
        audioRef.current.src = queue[newIndex].url
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const previous = () => {
    if (currentTime > 3) {
      seek(0)
    } else if (queueIndex > 0) {
      const newIndex = queueIndex - 1
      setQueueIndex(newIndex)
      setCurrentTrack(queue[newIndex])
      setCurrentTime(0)
      if (audioRef.current && queue[newIndex].url) {
        audioRef.current.src = queue[newIndex].url
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const setVolume = (vol: number) => {
    setVolumeState(Math.max(0, Math.min(1, vol)))
  }

  const addToQueue = (track: Track) => {
    setQueueState((prev) => [...prev, track])
    // If no track is currently playing, immediately start playing this one
    if (!currentTrack) {
      const newIndex = queue.length // Index of the track we just added
      setQueueIndex(newIndex)
      setCurrentTrack(track)
      setCurrentTime(0)
      if (audioRef.current && track.url) {
        audioRef.current.src = track.url
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const playTrack = (track: Track) => {
    // Check if track exists in the current queue
    const trackIndex = queue.findIndex(t => t.id === track.id)
    
    if (trackIndex !== -1) {
      // Track exists in queue, just update the current track and index
      setCurrentTrack(track)
      setCurrentTime(0)
      setQueueIndex(trackIndex)
    } else {
      // Track doesn't exist in queue, add it and play
      setQueueState((prev) => [...prev, track])
      setCurrentTrack(track)
      setCurrentTime(0)
      setQueueIndex(queue.length)
    }
    
    // Auto-switch to Full View when music starts playing
    setViewMode("vinyl-playlist-lyrics")
    
    if (audioRef.current && track.url) {
      audioRef.current.src = track.url
      // Delay play to ensure src is set before playing
      setTimeout(() => {
        audioRef.current?.play().catch((err) => {
          if (err.name !== 'NotAllowedError') {
            console.log('[v0] Play error:', err)
          }
        })
      }, 0)
      setIsPlaying(true)
    }
  }

  const setQueue = (tracks: Track[], startIndex = 0) => {
    setQueueState(tracks)
    setQueueIndex(startIndex)
    if (tracks.length > 0) {
      setCurrentTrack(tracks[startIndex])
      if (audioRef.current && tracks[startIndex].url) {
        audioRef.current.src = tracks[startIndex].url
      }
    }
  }

  const clearQueue = () => {
    pause()
    setQueueState([])
    setQueueIndex(0)
    setCurrentTrack(null)
    setCurrentTime(0)
    setDuration(0)
  }

  const setTrackLyrics = (lyrics: LyricLine[], lyricsType: "lrc" | "plain" = "plain") => {
    if (currentTrack) {
      const updatedTrack = { ...currentTrack, lyrics, lyricsType }
      setCurrentTrack(updatedTrack)
      // Also update in queue
      setQueueState((prev) =>
        prev.map((track, index) =>
          index === queueIndex ? updatedTrack : track
        )
      )
    }
  }

  const setTrackArtwork = (artworkUrl: string | null) => {
    if (currentTrack) {
      const updatedTrack = { ...currentTrack, albumArt: artworkUrl || undefined }
      setCurrentTrack(updatedTrack)
      // Also update in queue
      setQueueState((prev) =>
        prev.map((track, index) =>
          index === queueIndex ? updatedTrack : track
        )
      )
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        theme,
        setTheme,
        viewMode,
        setViewMode,
        vinylStyle,
        setVinylStyle,
        vinylSize,
        setVinylSize,
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        queue,
        queueIndex,
        lyricScrollSpeed,
        setLyricScrollSpeed,
        lyricsPanelOffset,
        setLyricsPanelOffset,
        vinylPlayerOffset,
        setVinylPlayerOffset,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        addToQueue,
        playTrack,
        setQueue,
        clearQueue,
        setTrackLyrics,
        setTrackArtwork,
        audioRef,
        currentLyric,
      }}
    >
      <audio ref={audioRef} />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}
