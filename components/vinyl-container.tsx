"use client"

import { usePlayer, type Theme } from "@/contexts/player-context"
import { VinylRecord } from "./vinyl-record"
import { Tonearm } from "./tonearm"
import { cn } from "@/lib/utils"
import { useRef, useEffect, useState } from "react"

interface VinylContainerProps {
  includeTitle?: boolean
  titleClassName?: string
  artistClassName?: string
}

export function VinylContainer({ 
  includeTitle = false,
  titleClassName = "",
  artistClassName = "" 
}: VinylContainerProps) {
  const { theme, currentTrack, vinylSize, vinylPlayerOffset } = usePlayer()
  const containerRef = useRef<HTMLDivElement>(null)
  const vinylRef = useRef<HTMLDivElement>(null)
  const [vinylHeight, setVinylHeight] = useState(0)

  // Measure actual vinyl height for dynamic spacing
  useEffect(() => {
    if (!vinylRef.current) return

    const measureVinyl = () => {
      const rect = vinylRef.current?.getBoundingClientRect()
      if (rect) {
        // Get the unscaled height
        const scale = vinylSize / 100
        const unscaledHeight = rect.height / scale
        setVinylHeight(unscaledHeight)
      }
    }

    const timer = setTimeout(measureVinyl, 100)
    const resizeObserver = new ResizeObserver(measureVinyl)
    if (vinylRef.current) resizeObserver.observe(vinylRef.current)

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [vinylSize])

  const themeTextColors: Record<Theme, string> = {
    black: "text-white/90",
    pink: "text-zinc-100",
    coding: "text-cyan-100",
    maroon: "text-amber-100",
    galaxy: "text-indigo-100",
    flame: "text-orange-100",
    blood: "text-red-100",
    nightcity: "text-cyan-100",
    gothic: "text-purple-100",
    vintage: "text-amber-100",
  }

  const scale = vinylSize / 100
  
  // Dynamic spacing that scales with vinyl - stronger responsive behavior
  const spacingMultiplier = Math.max(1, scale)
  const baseVinylTitleGap = 32 // Increased from 24px for better separation
  const dynamicVinylTitleGap = baseVinylTitleGap * spacingMultiplier * 1.2 // 20% boost for stronger movement
  
  const baseTitleArtistGap = 8
  const dynamicTitleArtistGap = baseTitleArtistGap * spacingMultiplier

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center gap-0 transition-all duration-500"
      style={{
        transform: `translateX(${vinylPlayerOffset}px)`,
        transitionProperty: "transform",
        transitionDuration: "500ms",
        transitionTimingFunction: "ease-out",
      }}
    >
      {/* Vinyl and tonearm - scaled from center */}
      <div 
        ref={vinylRef}
        className={cn(
          "relative flex items-center justify-center flex-shrink-0",
          "drop-shadow-2xl transition-all duration-500"
        )}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: "fit-content",
        }}
      >
        <VinylRecord />
        <Tonearm />
      </div>

      {/* Title and artist - always displayed below vinyl */}
      {includeTitle && currentTrack && (
        <>
          {/* Spacer */}
          <div 
            style={{
              height: `${dynamicVinylTitleGap}px`,
              transition: "height 0.5s ease-out",
            }}
          />
          
          {/* Song title */}
          <div className="relative text-center flex-shrink-0 px-4 transition-all duration-500">
            <h2 className={cn(
              "text-sm sm:text-base md:text-lg font-semibold text-balance line-clamp-3",
              themeTextColors[theme],
              "drop-shadow-lg max-w-md",
              titleClassName
            )}>
              {currentTrack.title}
            </h2>
          </div>

          {/* Spacer between title and artist */}
          <div 
            style={{
              height: `${dynamicTitleArtistGap}px`,
              transition: "height 0.5s ease-out",
            }}
          />

          {/* Artist name */}
          <p className={cn(
            "text-xs sm:text-sm opacity-60 text-center flex-shrink-0 px-4 transition-all duration-500",
            themeTextColors[theme],
            artistClassName
          )}>
            {currentTrack.artist}
          </p>
        </>
      )}
    </div>
  )
}
