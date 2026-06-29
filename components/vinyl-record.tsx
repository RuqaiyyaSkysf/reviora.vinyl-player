"use client"

import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import { useEffect, useState, useRef, useCallback } from "react"
import { X } from "lucide-react"

export function VinylRecord() {
  const { isPlaying, currentTrack, theme, currentTime, duration, seek, pause, play, audioRef, setTrackArtwork } = usePlayer()
  const [rotation, setRotation] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [scratchVelocity, setScratchVelocity] = useState(0)
  
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const vinylRef = useRef<HTMLDivElement>(null)
  const lastAngleRef = useRef<number>(0)
  const lastDragTimeRef = useRef<number>(0)
  const wasPlayingRef = useRef<boolean>(false)
  const scratchTimeRef = useRef<number>(0)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Calculate angle from center of vinyl to cursor
  const getAngleFromCenter = useCallback((clientX: number, clientY: number): number => {
    if (!vinylRef.current) return 0
    const rect = vinylRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  }, [])

  // Handle drag start
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (duration <= 0) return
    
    // Store current playback state and pause
    wasPlayingRef.current = isPlaying
    scratchTimeRef.current = currentTime
    
    // Pause the audio immediately
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    setIsDragging(true)
    lastAngleRef.current = getAngleFromCenter(clientX, clientY)
    lastDragTimeRef.current = performance.now()
    setScratchVelocity(0)
  }, [getAngleFromCenter, isPlaying, currentTime, duration, audioRef])

  // Handle drag move
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || duration <= 0 || !audioRef.current) return

    const currentAngle = getAngleFromCenter(clientX, clientY)
    let angleDelta = currentAngle - lastAngleRef.current

    // Handle angle wraparound (-180 to 180)
    if (angleDelta > 180) angleDelta -= 360
    if (angleDelta < -180) angleDelta += 360

    // Apply resistance (slower than actual drag)
    const resistance = 0.6
    const resistedDelta = angleDelta * resistance

    // Update rotation visually
    setRotation((prev) => prev + resistedDelta)

    // Convert rotation to time change
    // 360 degrees = 10 seconds of audio
    const secondsPerRotation = 10
    const timeDelta = (resistedDelta / 360) * secondsPerRotation
    
    // Update the scratch time and audio position in real-time
    scratchTimeRef.current = Math.max(0, Math.min(duration, scratchTimeRef.current + timeDelta))
    audioRef.current.currentTime = scratchTimeRef.current

    // Calculate velocity for inertia effect
    const now = performance.now()
    const dragTimeDelta = now - lastDragTimeRef.current
    if (dragTimeDelta > 0) {
      const instantVelocity = angleDelta / dragTimeDelta
      setScratchVelocity(instantVelocity * 10)
    }

    lastAngleRef.current = currentAngle
    lastDragTimeRef.current = now
  }, [isDragging, duration, getAngleFromCenter, audioRef])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    // Resume playback if it was playing before scratching
    if (wasPlayingRef.current && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore play errors (e.g., user interaction required)
      })
    }
    
    wasPlayingRef.current = false
  }, [isDragging, audioRef])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }, [handleDragStart])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleDragEnd()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      handleDragStart(touch.clientX, touch.clientY)
    }
  }, [handleDragStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      handleDragMove(touch.clientX, touch.clientY)
    }
  }, [handleDragMove])

  const handleTouchEnd = useCallback(() => {
    handleDragEnd()
  }, [handleDragEnd])

  // Realistic vinyl rotation with momentum and inertia
  useEffect(() => {
    const targetVelocity = isPlaying && !isDragging ? 1 : 0
    const friction = 0.02
    const acceleration = 0.05
    const scratchFriction = 0.08

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const delta = (timestamp - lastTimeRef.current) / 16.67 // Normalize to 60fps
      lastTimeRef.current = timestamp

      // Handle scratch inertia when not dragging
      if (!isDragging && Math.abs(scratchVelocity) > 0.01) {
        setScratchVelocity((prev) => {
          const newVel = prev * (1 - scratchFriction * delta)
          return Math.abs(newVel) < 0.01 ? 0 : newVel
        })
        setRotation((prev) => prev + scratchVelocity * delta)
      }

      if (!isDragging) {
        setVelocity((prev) => {
          if (isPlaying) {
            // Accelerate towards target velocity
            return prev + (targetVelocity - prev) * acceleration * delta
          } else {
            // Decelerate with friction
            const newVelocity = prev * (1 - friction * delta)
            return newVelocity < 0.001 ? 0 : newVelocity
          }
        })

        setRotation((prev) => prev + velocity * 2 * delta)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying, velocity, isDragging, scratchVelocity])

  const themeStyles: Record<string, {
    vinyl: string
    grooves: string
    label: string
    glow: string
    progressRing: string
    progressGlow: string
    innerShadow: string
  }> = {
    black: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-zinc-500/80",
      label: "bg-zinc-950",
      glow: "rgba(255,255,255,0.08)",
      progressRing: "rgba(255,255,255,0.9)",
      progressGlow: "rgba(255,255,255,0.4)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]",
    },
    pink: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-rose-400/80",
      label: "bg-gradient-to-br from-pink-300 to-rose-400",
      glow: "rgba(219,112,147,0.35)",
      progressRing: "rgba(219,112,147,1)",
      progressGlow: "rgba(219,112,147,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    coding: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-purple-400/80",
      label: "bg-gradient-to-br from-purple-600 to-blue-600",
      glow: "rgba(139,92,246,0.35)",
      progressRing: "rgba(34,211,238,1)",
      progressGlow: "rgba(139,92,246,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    maroon: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-amber-600/80",
      label: "bg-gradient-to-br from-amber-600 to-amber-500",
      glow: "rgba(217,119,6,0.3)",
      progressRing: "rgba(251,191,36,1)",
      progressGlow: "rgba(217,119,6,0.5)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    galaxy: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-indigo-400/80",
      label: "bg-gradient-to-br from-indigo-600 to-purple-700",
      glow: "rgba(99,102,241,0.35)",
      progressRing: "rgba(165,180,252,1)",
      progressGlow: "rgba(99,102,241,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    flame: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-orange-500/80",
      label: "bg-gradient-to-br from-orange-500 to-red-600",
      glow: "rgba(249,115,22,0.35)",
      progressRing: "rgba(251,146,60,1)",
      progressGlow: "rgba(220,38,38,0.6)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    blood: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-red-800/80",
      label: "bg-gradient-to-br from-red-800 to-red-950",
      glow: "rgba(185,28,28,0.45)",
      progressRing: "rgba(220,38,38,1)",
      progressGlow: "rgba(185,28,28,0.8)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    nightcity: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-purple-500/80",
      label: "bg-gradient-to-br from-purple-600 to-pink-600",
      glow: "rgba(147,51,234,0.4)",
      progressRing: "rgba(6,182,212,1)",
      progressGlow: "rgba(147,51,234,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    gothic: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-purple-900/80",
      label: "bg-gradient-to-br from-slate-800 to-purple-950",
      glow: "rgba(100,80,160,0.4)",
      progressRing: "rgba(168,85,247,1)",
      progressGlow: "rgba(100,80,160,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]",
    },
    vintage: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-amber-700/80",
      label: "bg-gradient-to-br from-amber-700 to-yellow-800",
      glow: "rgba(180,130,60,0.4)",
      progressRing: "rgba(251,191,36,1)",
      progressGlow: "rgba(180,130,60,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    masjid: {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-gray-500/80",
      label: "bg-gradient-to-br from-gray-200 to-gray-300",
      glow: "rgba(229,231,235,0.35)",
      progressRing: "rgba(229,231,235,1)",
      progressGlow: "rgba(229,231,235,0.7)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
    "desert-moon": {
      vinyl: "from-zinc-900 via-zinc-800 to-zinc-900",
      grooves: "border-green-600/80",
      label: "bg-gradient-to-br from-green-100 to-green-200",
      glow: "rgba(132,204,22,0.25)",
      progressRing: "rgba(132,204,22,0.85)",
      progressGlow: "rgba(132,204,22,0.55)",
      innerShadow: "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  // Calculate SVG progress ring
  const ringRadius = 52
  const ringCircumference = 2 * Math.PI * ringRadius
  const strokeDashoffset = ringCircumference - (progress / 100) * ringCircumference

  // Convert gradient classes to CSS values for production compatibility
  // All themes use the same dark vinyl gradient
  const vinylGradient = "linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)"

  // Convert inner shadow classes to box-shadow values
  const innerShadowMap: Record<string, string> = {
    "shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]": "inset 0 0 60px rgba(0,0,0,0.8)",
    "shadow-[inset_0_0_60px_rgba(0,0,0,0.7)]": "inset 0 0 60px rgba(0,0,0,0.7)",
  }
  const innerShadow = innerShadowMap[styles.innerShadow] || "inset 0 0 60px rgba(0,0,0,0.8)"

  return (
    <div className="relative flex items-center justify-center">
      {/* Progress ring container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="w-[calc(100%+24px)] h-[calc(100%+24px)] -rotate-90"
          viewBox="0 0 108 108"
        >
          {/* Background ring */}
          <circle
            cx="54"
            cy="54"
            r={ringRadius}
            fill="none"
            stroke="white"
            strokeWidth="3"
            opacity="0.1"
            className="transition-all duration-500"
          />
          {/* Progress ring */}
          <circle
            cx="54"
            cy="54"
            r={ringRadius}
            fill="none"
            stroke={styles.progressRing}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={strokeDashoffset}
            opacity="1"
            className="transition-all duration-300 ease-out"
          />
          {/* Progress indicator dot */}
          {progress > 0 && (
            <circle
              cx={54 + ringRadius * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}
              cy={54 + ringRadius * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}
              r="5"
              fill={styles.progressRing}
              className="transition-all duration-300"
            />
          )}
        </svg>
      </div>

      {/* Vinyl record */}
      <div
        ref={vinylRef}
        className={cn(
          "relative z-50 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full transition-shadow duration-700",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
          willChange: "transform",
          background: vinylGradient,
          boxShadow: innerShadow,
          backgroundClip: "border-box",
          WebkitBackgroundClip: "border-box",
          MozBackgroundClip: "border-box",
          filter: "none",
          mixBlendMode: "normal",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Vinyl texture overlay */}
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: `repeating-radial-gradient(
              circle at center,
              transparent 0px,
              transparent 1px,
              rgba(0,0,0,0.3) 1.5px,
              transparent 2px,
              transparent 4px
            )`,
          }}
        />

        {/* Vinyl grooves with varying opacity - using inline styles for production compatibility */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border transition-colors duration-500"
            style={{
              inset: `${10 + i * 6}%`,
              opacity: 0.4 + (i % 3) * 0.2,
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: "1px",
            }}
          />
        ))}

        {/* Subtle radial lines for realism */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(255,255,255,0.05) 1deg,
              transparent 2deg,
              transparent 30deg
            )`,
          }}
        />

        {/* Center label with album art */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden",
            "flex items-center justify-center transition-all duration-500 group",
            "shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.3)]"
          )}
          style={
            !currentTrack?.albumArt ? {
              background: theme === "pink" ? "linear-gradient(to bottom right, rgb(249, 168, 212), rgb(244, 63, 94))" :
                         theme === "coding" ? "linear-gradient(to bottom right, rgb(147, 51, 234), rgb(37, 99, 235))" :
                         theme === "maroon" ? "linear-gradient(to bottom right, rgb(217, 119, 6), rgb(217, 119, 6))" :
                         theme === "galaxy" ? "linear-gradient(to bottom right, rgb(79, 70, 229), rgb(109, 40, 217))" :
                         theme === "flame" ? "linear-gradient(to bottom right, rgb(249, 115, 22), rgb(220, 38, 38))" :
                         theme === "blood" ? "linear-gradient(to bottom right, rgb(153, 27, 27), rgb(59, 13, 13))" :
                         theme === "nightcity" ? "linear-gradient(to bottom right, rgb(147, 51, 234), rgb(219, 39, 119))" :
                         theme === "gothic" ? "linear-gradient(to bottom right, rgb(30, 27, 49), rgb(88, 28, 135))" :
                         theme === "vintage" ? "linear-gradient(to bottom right, rgb(180, 83, 9), rgb(120, 53, 15))" :
                         theme === "masjid" ? "linear-gradient(to bottom right, rgb(15, 23, 42), rgb(15, 23, 42))" :
                         theme === "desert-moon" ? "linear-gradient(to bottom right, rgb(30, 41, 59), rgb(30, 41, 59))" :
                         "rgb(9, 9, 11)"
            } : undefined
          }
        >
          {currentTrack?.albumArt ? (
            <>
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              {/* Remove artwork button - appears on hover */}
              <button
                onClick={() => setTrackArtwork(null)}
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100",
                  "bg-black/60 backdrop-blur-sm transition-opacity duration-200 rounded-full",
                  "hover:bg-black/80 cursor-pointer"
                )}
                title="Remove artwork"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-zinc-800 shadow-inner" />
              <span className="text-[8px] text-zinc-500 font-mono tracking-wider">
                VINYL
              </span>
            </div>
          )}
        </div>

        {/* Center spindle hole */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10"
          style={{
            background: "rgb(9, 9, 11)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)"
          }}
        />

        {/* Realistic light reflection */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none z-30"
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.18) 0%,
                rgba(255,255,255,0.08) 25%,
                transparent 45%,
                transparent 55%,
                rgba(0,0,0,0.2) 75%,
                rgba(0,0,0,0.3) 100%
              )
            `,
          }}
        />

        {/* Moving groove reflection - thin light streak across grooves */}
        <div
          className="absolute inset-[8%] rounded-full pointer-events-none overflow-hidden z-25"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  transparent 0%,
                  transparent 42%,
                  rgba(255,255,255,0.04) 45%,
                  rgba(255,255,255,0.08) 48%,
                  rgba(255,255,255,0.12) 50%,
                  rgba(255,255,255,0.08) 52%,
                  rgba(255,255,255,0.04) 55%,
                  transparent 58%,
                  transparent 100%
                )
              `,
            }}
          />
        </div>

        {/* Secondary subtle groove highlight */}
        <div
          className="absolute inset-[12%] rounded-full pointer-events-none overflow-hidden z-25"
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  -60deg,
                  transparent 0%,
                  transparent 65%,
                  rgba(255,255,255,0.03) 70%,
                  rgba(255,255,255,0.06) 75%,
                  rgba(255,255,255,0.03) 80%,
                  transparent 85%,
                  transparent 100%
                )
              `,
            }}
          />
        </div>

        {/* Edge highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      </div>
    </div>
  )
}
