"use client"

import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"

export function Tonearm() {
  const { isPlaying, theme, currentTime, duration, play, pause } = usePlayer()
  const [armAngle, setArmAngle] = useState(-45)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const progress = duration > 0 ? currentTime / duration : 0

  // Handle tonearm click to toggle play/pause
  const handleTonearmClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // Smooth tonearm movement with easing
  useEffect(() => {
    setIsTransitioning(true)

    if (isPlaying) {
      // Move from rest position to playing position, then track progress
      const baseAngle = -28
      const endAngle = -10
      const progressAngle = baseAngle + (endAngle - baseAngle) * progress
      setArmAngle(progressAngle)
    } else {
      // Return to rest position
      setArmAngle(-45)
    }

    const timeout = setTimeout(() => setIsTransitioning(false), 800)
    return () => clearTimeout(timeout)
  }, [isPlaying, progress])

  const themeColors: Record<string, {
    arm: string
    armHighlight: string
    base: string
    baseHighlight: string
    head: string
    needle: string
    needleGlow: string
    shadow: string
  }> = {
    black: {
      arm: "from-zinc-300 via-zinc-400 to-zinc-500",
      armHighlight: "rgba(255,255,255,0.3)",
      base: "from-zinc-600 to-zinc-700",
      baseHighlight: "from-zinc-500 to-zinc-600",
      head: "from-zinc-200 to-zinc-400",
      needle: "from-zinc-100 to-zinc-300",
      needleGlow: "rgba(255,255,255,0.3)",
      shadow: "rgba(0,0,0,0.5)",
    },
    pink: {
      arm: "from-zinc-300 via-zinc-400 to-zinc-500",
      armHighlight: "rgba(244,114,182,0.2)",
      base: "from-pink-300 to-pink-400",
      baseHighlight: "from-pink-200 to-pink-300",
      head: "from-zinc-200 to-zinc-400",
      needle: "from-pink-300 to-pink-500",
      needleGlow: "rgba(244,114,182,0.5)",
      shadow: "rgba(0,0,0,0.4)",
    },
    coding: {
      arm: "from-purple-300 via-purple-400 to-blue-500",
      armHighlight: "rgba(139,92,246,0.3)",
      base: "from-purple-500 to-purple-700",
      baseHighlight: "from-purple-400 to-purple-500",
      head: "from-purple-200 to-blue-300",
      needle: "from-cyan-300 to-cyan-500",
      needleGlow: "rgba(34,211,238,0.7)",
      shadow: "rgba(139,92,246,0.4)",
    },
    maroon: {
      arm: "from-amber-400 via-amber-500 to-amber-600",
      armHighlight: "rgba(251,191,36,0.3)",
      base: "from-amber-700 to-amber-900",
      baseHighlight: "from-amber-600 to-amber-700",
      head: "from-amber-300 to-amber-500",
      needle: "from-amber-200 to-amber-400",
      needleGlow: "rgba(251,191,36,0.5)",
      shadow: "rgba(0,0,0,0.5)",
    },
    galaxy: {
      arm: "from-indigo-300 via-indigo-400 to-purple-500",
      armHighlight: "rgba(99,102,241,0.3)",
      base: "from-indigo-600 to-indigo-800",
      baseHighlight: "from-indigo-500 to-indigo-600",
      head: "from-indigo-200 to-purple-300",
      needle: "from-indigo-300 to-purple-500",
      needleGlow: "rgba(165,180,252,0.7)",
      shadow: "rgba(99,102,241,0.4)",
    },
    flame: {
      arm: "from-orange-300 via-orange-400 to-red-500",
      armHighlight: "rgba(249,115,22,0.3)",
      base: "from-orange-600 to-red-700",
      baseHighlight: "from-orange-500 to-orange-600",
      head: "from-orange-200 to-red-300",
      needle: "from-orange-300 to-red-500",
      needleGlow: "rgba(251,146,60,0.7)",
      shadow: "rgba(220,38,38,0.4)",
    },
    blood: {
      arm: "from-red-300 via-red-400 to-red-600",
      armHighlight: "rgba(185,28,28,0.3)",
      base: "from-red-800 to-red-950",
      baseHighlight: "from-red-700 to-red-800",
      head: "from-red-200 to-red-400",
      needle: "from-red-400 to-red-600",
      needleGlow: "rgba(220,38,38,0.7)",
      shadow: "rgba(127,29,29,0.5)",
    },
    nightcity: {
      arm: "from-purple-300 via-purple-400 to-pink-500",
      armHighlight: "rgba(147,51,234,0.3)",
      base: "from-purple-600 to-purple-800",
      baseHighlight: "from-purple-500 to-purple-600",
      head: "from-purple-200 to-pink-300",
      needle: "from-cyan-300 to-cyan-500",
      needleGlow: "rgba(6,182,212,0.7)",
      shadow: "rgba(147,51,234,0.4)",
    },
    gothic: {
      arm: "from-slate-300 via-slate-400 to-purple-500",
      armHighlight: "rgba(100,80,160,0.3)",
      base: "from-slate-700 to-purple-900",
      baseHighlight: "from-slate-600 to-slate-700",
      head: "from-slate-200 to-purple-300",
      needle: "from-purple-300 to-purple-500",
      needleGlow: "rgba(168,85,247,0.7)",
      shadow: "rgba(100,80,160,0.4)",
    },
    vintage: {
      arm: "from-amber-300 via-amber-400 to-yellow-600",
      armHighlight: "rgba(180,130,60,0.3)",
      base: "from-amber-700 to-amber-900",
      baseHighlight: "from-amber-600 to-amber-700",
      head: "from-amber-200 to-yellow-300",
      needle: "from-amber-300 to-yellow-500",
      needleGlow: "rgba(251,191,36,0.7)",
      shadow: "rgba(180,130,60,0.4)",
    },
    masjid: {
      arm: "from-gray-300 via-gray-400 to-gray-500",
      armHighlight: "rgba(229,231,235,0.3)",
      base: "from-gray-700 to-gray-800",
      baseHighlight: "from-gray-600 to-gray-700",
      head: "from-gray-200 to-gray-400",
      needle: "from-gray-100 to-gray-300",
      needleGlow: "rgba(229,231,235,0.5)",
      shadow: "rgba(0,0,0,0.5)",
    },
    "desert-moon": {
      arm: "from-blue-300 via-blue-400 to-blue-500",
      armHighlight: "rgba(147,197,253,0.3)",
      base: "from-blue-700 to-blue-800",
      baseHighlight: "from-blue-600 to-blue-700",
      head: "from-blue-200 to-blue-400",
      needle: "from-blue-100 to-blue-300",
      needleGlow: "rgba(147,197,253,0.5)",
      shadow: "rgba(0,0,0,0.5)",
    },
  }

  const colors = themeColors[theme]

  return (
    <div 
      className="absolute right-0 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
      onClick={handleTonearmClick}
      onTouchEnd={handleTonearmClick}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? "Pause with vinyl arm" : "Play with vinyl arm"}
    >
      {/* Base mount shadow */}
      <div
        className="absolute top-2 left-2 w-10 h-10 rounded-full blur-md"
        style={{ background: colors.shadow }}
      />

      {/* Base mount */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            "w-12 h-12 rounded-full",
            "bg-gradient-to-br transition-all duration-500",
            colors.base,
            "shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1)]"
          )}
        >
          {/* Inner ring */}
          <div
            className={cn(
              "absolute inset-1.5 rounded-full",
              "bg-gradient-to-br transition-all duration-500",
              colors.baseHighlight,
              "shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]"
            )}
          />
          {/* Center pivot */}
          <div className="absolute inset-3 rounded-full bg-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Arm assembly */}
        <div
          className={cn(
            "absolute top-1/2 right-1/2 origin-right",
            isTransitioning
              ? "transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              : "transition-transform duration-100 ease-linear"
          )}
          style={{
            transform: `rotate(${armAngle}deg)`,
            transformOrigin: "right center",
          }}
        >
          {/* Arm shadow */}
          <div
            className="absolute top-2 left-0 w-36 sm:w-44 md:w-52 h-3 rounded-full blur-md opacity-50"
            style={{ background: colors.shadow }}
          />

          {/* Main arm with metallic gradient */}
          <div
            className={cn(
              "relative w-36 sm:w-44 md:w-52 h-2.5 rounded-full",
              "bg-gradient-to-b transition-all duration-500",
              colors.arm,
              "shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            )}
          >
            {/* Arm highlight */}
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-full opacity-60"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.armHighlight}, transparent)`,
              }}
            />
          </div>

          {/* Head shell */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
            {/* Cartridge mount */}
            <div
              className={cn(
                "relative w-8 h-5 rounded-sm",
                "bg-gradient-to-b transition-all duration-500",
                colors.head,
                "shadow-[0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.3)]"
              )}
            >
              {/* Cartridge details */}
              <div className="absolute inset-x-1 top-1 h-0.5 rounded-full bg-zinc-600/30" />
            </div>

            {/* Needle/Stylus with glow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              {/* Needle glow when playing */}
              {isPlaying && (
                <div
                  className="absolute inset-0 w-2 h-4 rounded-full blur-sm animate-pulse"
                  style={{ background: colors.needleGlow }}
                />
              )}
              <div
                className={cn(
                  "relative w-1.5 h-4 rounded-sm",
                  "bg-gradient-to-b transition-all duration-500",
                  colors.needle
                )}
                style={{
                  clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)",
                  filter: isPlaying ? `drop-shadow(0 0 4px ${colors.needleGlow})` : "none",
                }}
              />
            </div>
          </div>

          {/* Counter weight */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6">
            {/* Weight shadow */}
            <div
              className="absolute top-1 left-0 w-7 h-7 rounded-full blur-sm"
              style={{ background: colors.shadow }}
            />
            <div
              className={cn(
                "relative w-7 h-7 rounded-full",
                "bg-gradient-to-b transition-all duration-500",
                colors.base,
                "shadow-[0_3px_10px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(255,255,255,0.15)]"
              )}
            >
              {/* Weight rings for realism */}
              <div className="absolute inset-1 rounded-full border border-white/10" />
              <div className="absolute inset-2 rounded-full border border-black/20" />
            </div>
          </div>

          {/* Arm joint ring */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-0.5">
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                "bg-gradient-to-b transition-all duration-500",
                colors.baseHighlight,
                "shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
