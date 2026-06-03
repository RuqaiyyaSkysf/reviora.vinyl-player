"use client"

import { useRef, useEffect, useCallback, useState, useMemo } from "react"
import { usePlayer, type LyricLine, type LyricScrollSpeed } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import { Upload, FolderOpen, Gauge } from "lucide-react"

export function LyricsPanel() {
  const { theme, currentTrack, currentTime, setTrackLyrics, lyricScrollSpeed, setLyricScrollSpeed } = usePlayer()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lyricRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  
  // Track active lyric index separately to prevent full re-renders
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)
  
  // Track if user has scrolled away from active lyric
  const userHasScrolledAway = useRef(false)
  const lastAutoScrollIndex = useRef(-1)

  const themeStyles: Record<string, {
    activeLyric: string
    inactiveLyric: string
    noLyrics: string
    title: string
    button: string
    buttonHover: string
    speedButton: string
    speedButtonActive: string
  }> = {
    black: {
      activeLyric: "text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.3)]",
      inactiveLyric: "text-zinc-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-zinc-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-white/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-white/70 border-white/20 bg-white/5",
      buttonHover: "hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
      speedButton: "text-white/50 border-white/10 bg-white/5",
      speedButtonActive: "text-white bg-white/20 border-white/30",
    },
    pink: {
      activeLyric: "text-zinc-800 [text-shadow:0_2px_8px_rgba(255,255,255,0.8),0_0_20px_rgba(219,112,147,0.3)]",
      inactiveLyric: "text-pink-400 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      noLyrics: "text-pink-400 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      title: "text-zinc-700 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      button: "text-pink-600 border-pink-300/40 bg-white/30",
      buttonHover: "hover:bg-white/50 hover:border-pink-400/50 hover:shadow-[0_0_15px_rgba(219,112,147,0.2)]",
      speedButton: "text-pink-400 border-pink-200/30 bg-white/20",
      speedButtonActive: "text-pink-700 bg-pink-200/60 border-pink-400/50",
    },
    coding: {
      activeLyric: "text-cyan-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(34,211,238,0.4)]",
      inactiveLyric: "text-purple-400/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-white/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]",
      speedButton: "text-purple-400/50 border-purple-400/20 bg-purple-900/10",
      speedButtonActive: "text-cyan-400 bg-purple-900/40 border-cyan-400/40",
    },
    maroon: {
      activeLyric: "text-amber-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.3)]",
      inactiveLyric: "text-amber-600/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-amber-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-amber-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
      speedButton: "text-amber-400/50 border-amber-500/20 bg-amber-900/10",
      speedButtonActive: "text-amber-300 bg-amber-900/40 border-amber-400/40",
    },
    galaxy: {
      activeLyric: "text-purple-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.4)]",
      inactiveLyric: "text-indigo-400/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-indigo-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-indigo-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-purple-300 border-indigo-400/30 bg-indigo-900/20",
      buttonHover: "hover:bg-indigo-900/40 hover:border-purple-400/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      speedButton: "text-indigo-400/50 border-indigo-400/20 bg-indigo-900/10",
      speedButtonActive: "text-purple-300 bg-indigo-900/40 border-purple-400/40",
    },
    flame: {
      activeLyric: "text-orange-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(251,146,60,0.4)]",
      inactiveLyric: "text-orange-500/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-orange-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-orange-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-orange-400 border-orange-500/30 bg-orange-900/20",
      buttonHover: "hover:bg-orange-900/40 hover:border-orange-400/40 hover:shadow-[0_0_15px_rgba(251,146,60,0.2)]",
      speedButton: "text-orange-400/50 border-orange-500/20 bg-orange-900/10",
      speedButtonActive: "text-orange-300 bg-orange-900/40 border-orange-400/40",
    },
    blood: {
      activeLyric: "text-red-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(248,113,113,0.4)]",
      inactiveLyric: "text-red-500/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-red-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-red-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-red-400 border-red-500/30 bg-red-900/20",
      buttonHover: "hover:bg-red-900/40 hover:border-red-400/40 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)]",
      speedButton: "text-red-400/50 border-red-500/20 bg-red-900/10",
      speedButtonActive: "text-red-300 bg-red-900/40 border-red-400/40",
    },
    nightcity: {
      activeLyric: "text-pink-300 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(244,114,182,0.4)]",
      inactiveLyric: "text-purple-400/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-purple-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(244,114,182,0.2)]",
      speedButton: "text-purple-400/50 border-purple-400/20 bg-purple-900/10",
      speedButtonActive: "text-cyan-400 bg-purple-900/40 border-cyan-400/40",
    },
    gothic: {
      activeLyric: "text-purple-200 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.4)]",
      inactiveLyric: "text-purple-500/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-purple-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-purple-300 border-purple-500/30 bg-purple-950/20",
      buttonHover: "hover:bg-purple-950/40 hover:border-purple-400/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]",
      speedButton: "text-purple-400/50 border-purple-500/20 bg-purple-950/10",
      speedButtonActive: "text-purple-200 bg-purple-950/40 border-purple-400/40",
    },
    vintage: {
      activeLyric: "text-amber-200 [text-shadow:0_2px_8px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.3)]",
      inactiveLyric: "text-amber-500/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      noLyrics: "text-amber-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      title: "text-amber-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]",
      speedButton: "text-amber-400/50 border-amber-500/20 bg-amber-900/10",
      speedButtonActive: "text-amber-200 bg-amber-900/40 border-amber-400/40",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  // Parse LRC format lyrics
  const parseLRC = useCallback((content: string): LyricLine[] => {
    const lines = content.split("\n")
    const lyrics: LyricLine[] = []
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g

    for (const line of lines) {
      const matches = [...line.matchAll(timeRegex)]
      if (matches.length > 0) {
        const text = line.replace(timeRegex, "").trim()
        if (text) {
          for (const match of matches) {
            const minutes = parseInt(match[1], 10)
            const seconds = parseInt(match[2], 10)
            const ms = match[3] ? parseInt(match[3].padEnd(3, "0"), 10) : 0
            const time = minutes * 60 + seconds + ms / 1000
            lyrics.push({ time, text })
          }
        }
      }
    }

    return lyrics.sort((a, b) => a.time - b.time)
  }, [])

  // Parse plain text lyrics (one line per second approximately)
  const parsePlainText = useCallback((content: string): LyricLine[] => {
    const lines = content.split("\n").filter((line) => line.trim())
    return lines.map((text, index) => ({
      time: index * 3, // Approximate 3 seconds per line
      text: text.trim(),
    }))
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (!content) return

        let lyrics: LyricLine[]
        const isLRC = file.name.endsWith(".lrc")
        if (isLRC) {
          lyrics = parseLRC(content)
        } else {
          lyrics = parsePlainText(content)
        }

        if (lyrics.length > 0) {
          setTrackLyrics(lyrics, isLRC ? "lrc" : "plain")
        }
      }
      reader.readAsText(file)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [parseLRC, parsePlainText, setTrackLyrics]
  )

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Check if active lyric is near the viewport center
  const isActiveLyricNearViewport = useCallback(() => {
    const container = containerRef.current
    if (!container || activeLyricIndex === -1) return false
    
    const lyricElement = lyricRefs.current.get(activeLyricIndex)
    if (!lyricElement) return false
    
    const containerRect = container.getBoundingClientRect()
    const lyricRect = lyricElement.getBoundingClientRect()
    
    // Calculate the visible area with some margin (30% of container height from center)
    const containerCenter = containerRect.top + containerRect.height / 2
    const lyricCenter = lyricRect.top + lyricRect.height / 2
    const threshold = containerRect.height * 0.4 // 40% threshold
    
    return Math.abs(lyricCenter - containerCenter) < threshold
  }, [activeLyricIndex])

  // Handle user scroll detection - detect when user scrolls away or back
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      // Check if active lyric is near viewport after scroll
      const isNearViewport = isActiveLyricNearViewport()
      
      if (isNearViewport) {
        // User scrolled back near the active lyric - re-enable auto-scroll
        userHasScrolledAway.current = false
      } else {
        // User scrolled away from active lyric - disable auto-scroll
        userHasScrolledAway.current = true
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [isActiveLyricNearViewport])

  // Calculate active lyric index based on current time (memoized)
  const calculatedActiveIndex = useMemo(() => {
    if (!currentTrack?.lyrics) return -1
    for (let i = currentTrack.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= currentTrack.lyrics[i].time) {
        return i
      }
    }
    return -1
  }, [currentTime, currentTrack?.lyrics])

  // Update active lyric index only when it actually changes
  useEffect(() => {
    if (calculatedActiveIndex !== activeLyricIndex) {
      setActiveLyricIndex(calculatedActiveIndex)
    }
  }, [calculatedActiveIndex, activeLyricIndex])

  // Get scroll duration based on speed setting
  const getScrollDuration = useCallback(() => {
    switch (lyricScrollSpeed) {
      case "slower": return 800
      case "normal": return 500
      case "faster": return 250
      default: return 500
    }
  }, [lyricScrollSpeed])

  // Auto-scroll only when active lyric changes AND user hasn't scrolled away
  // Uses scrollTop instead of scrollIntoView to prevent page-level scrolling
  useEffect(() => {
    // Don't scroll if user has scrolled away
    if (userHasScrolledAway.current) return
    
    // Don't scroll if index hasn't changed
    if (activeLyricIndex === lastAutoScrollIndex.current) return
    
    // Don't scroll if no active lyric
    if (activeLyricIndex === -1) return
    
    const lyricElement = lyricRefs.current.get(activeLyricIndex)
    const container = containerRef.current
    
    if (lyricElement && container) {
      lastAutoScrollIndex.current = activeLyricIndex
      
      // Calculate scroll position to center the lyric within the container only
      // This avoids scrollIntoView which can scroll the entire page
      const lyricOffsetTop = lyricElement.offsetTop
      const lyricHeight = lyricElement.offsetHeight
      const containerHeight = container.clientHeight
      
      // Target scroll position: center the lyric in the container
      const targetScrollTop = lyricOffsetTop - (containerHeight / 2) + (lyricHeight / 2)
      
      // Smooth scroll within container only using scrollTo
      container.scrollTo({
        top: targetScrollTop,
        behavior: "smooth"
      })
    }
  }, [activeLyricIndex, getScrollDuration])

  if (!currentTrack) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <p className={cn("text-sm", styles.noLyrics)}>No track playing</p>
      </div>
    )
  }

  if (!currentTrack.lyrics || currentTrack.lyrics.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <p className={cn("text-xs uppercase tracking-wider font-medium", styles.title)}>Lyrics</p>
        <p className={cn("text-sm text-center", styles.noLyrics)}>No lyrics available for this track</p>
        
        {/* Upload options */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".lrc,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={handleUploadClick}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm",
              "transition-all duration-300 text-sm font-medium",
              styles.button,
              styles.buttonHover
            )}
          >
            <Upload className="w-4 h-4" />
            Upload Lyrics
          </button>
          
          <button
            onClick={handleUploadClick}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm",
              "transition-all duration-300 text-sm font-medium",
              styles.button,
              styles.buttonHover
            )}
          >
            <FolderOpen className="w-4 h-4" />
            Browse Lyrics from device
          </button>
          
          <p className={cn("text-xs mt-2 opacity-60", styles.noLyrics)}>
            Supports .lrc and .txt files
          </p>
        </div>
      </div>
    )
  }

  // Format timestamp for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate opacity based on distance from active lyric
  const getLyricOpacity = (index: number) => {
    if (activeLyricIndex === -1) return "opacity-50"
    const distance = Math.abs(index - activeLyricIndex)
    if (distance === 0) return "opacity-100"
    if (distance === 1) return "opacity-70"
    if (distance === 2) return "opacity-50"
    return "opacity-35"
  }

  const speedOptions: { value: LyricScrollSpeed; label: string }[] = [
    { value: "slower", label: "Slower" },
    { value: "normal", label: "Normal" },
    { value: "faster", label: "Faster" },
  ]

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-3 flex items-center justify-between">
        <p className={cn("text-xs uppercase tracking-wider font-medium", styles.title)}>Lyrics</p>
        
        {/* Scroll Speed Controls - only show for plain text (non-LRC) lyrics */}
        {currentTrack.lyricsType !== "lrc" && (
          <div className="flex items-center gap-1">
            <Gauge className={cn("w-3.5 h-3.5 mr-1", styles.title)} />
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLyricScrollSpeed(option.value)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md border transition-all duration-200",
                  lyricScrollSpeed === option.value
                    ? styles.speedButtonActive
                    : cn(styles.speedButton, "hover:opacity-80")
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-5 pb-8 scroll-smooth backdrop-blur-[8px]"
      >
        {/* Top spacer to allow first lyrics to center */}
        <div className="h-[40%]" />
        
        <div className="space-y-6">
          {currentTrack.lyrics.map((lyric, index) => {
            const isActive = index === activeLyricIndex
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    lyricRefs.current.set(index, el)
                  } else {
                    lyricRefs.current.delete(index)
                  }
                }}
                className={cn(
                  "transition-all duration-500 ease-out",
                  getLyricOpacity(index)
                )}
              >
                {/* Timestamp */}
                <span 
                  className={cn(
                    "block text-sm mb-1 font-mono transition-all duration-300",
                    isActive ? "opacity-80" : "opacity-40",
                    styles.title
                  )}
                  style={{ fontSize: "15px" }}
                >
                  {formatTime(lyric.time)}
                </span>
                {/* Lyric text */}
                <p
                  className={cn(
                    "transition-all duration-500 ease-out",
                    isActive 
                      ? cn("font-semibold scale-[1.02] origin-left", styles.activeLyric)
                      : styles.inactiveLyric
                  )}
                  style={{ 
                    fontSize: isActive ? "21px" : "19px",
                    lineHeight: "1.5"
                  }}
                >
                  {lyric.text}
                </p>
              </div>
            )
          })}
        </div>
        
        {/* Bottom spacer to allow last lyrics to center */}
        <div className="h-[40%]" />
      </div>
    </div>
  )
}
