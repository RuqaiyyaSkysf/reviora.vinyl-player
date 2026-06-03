"use client"

import { usePlayer, type Theme } from "@/contexts/player-context"
import { VinylRecord } from "./vinyl-record"
import { Tonearm } from "./tonearm"
import { cn } from "@/lib/utils"
import { useRef, useEffect, useState } from "react"

export function MinimalVinylView() {
  const { theme, currentTrack, vinylSize, vinylPlayerOffset } = usePlayer()
  const containerRef = useRef<HTMLDivElement>(null)
  const vinylRef = useRef<HTMLDivElement>(null)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })

  // Measure the container and vinyl at actual rendered sizes
  useEffect(() => {
    if (!containerRef.current || !vinylRef.current) return

    const measure = () => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      const vinylRect = vinylRef.current?.getBoundingClientRect()
      
      if (containerRect && vinylRect) {
        setContainerDimensions({
          width: containerRect.width,
          height: containerRect.height,
        })
      }
    }

    // Measure on mount
    const timer = setTimeout(measure, 0)

    // Remeasure on resize
    const resizeObserver = new ResizeObserver(measure)
    if (containerRef.current) resizeObserver.observe(containerRef.current)

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [vinylSize, currentTrack])

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

  // Calculate dimensions based on vinyl size
  const scale = vinylSize / 100
  
  // STRICT SAFE SCALING SYSTEM
  // Prevent bouncing by keeping vinyl within stable rendering bounds
  // The vinyl must NEVER cause the viewport width to change
  
  // Dynamic spacing that grows with vinyl size
  const spacingMultiplier = Math.max(1, scale)
  const baseVinylTitleGap = 48
  const dynamicVinylTitleGap = baseVinylTitleGap * spacingMultiplier * 1.2
  
  const baseTitleArtistGap = 8
  const dynamicTitleArtistGap = baseTitleArtistGap * spacingMultiplier

  // FIXED SAFE CONTAINER WIDTH - Never changes, prevents horizontal jitter
  // This is the absolute maximum safe rendering area for the scaled vinyl
  const safeContainerWidth = 500 // Fixed width that accommodates all safe scales
  
  // Calculate how much vertical space we need to add as vinyl grows
  // At scale 1.0 (100%): base top padding of 128px
  // At scale 1.5 (150%): increased to account for larger vinyl height
  // Formula ensures vertical growth instead of horizontal overflow
  const baseTopPadding = 128
  const scaledExtraTopPadding = Math.max(0, (scale - 1) * 300) // 300px extra per 0.1 scale increase
  const topPadding = baseTopPadding + scaledExtraTopPadding
  const bottomPadding = 64 + (scale - 1) * 100 // Also add bottom padding

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col items-center overflow-x-hidden",
        "transition-all duration-500 ease-out"
      )}
      style={{
        paddingTop: `${topPadding}px`,
        paddingBottom: `${bottomPadding}px`,
        // CRITICAL: Force overflow-x hidden to prevent any horizontal scrolling
        // even if content tries to exceed bounds
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* STRICT SAFE CONTAINER - prevents horizontal overflow and bouncing */}
      <div 
        className="flex flex-col items-center gap-0 transition-all duration-500 w-full"
        style={{
          // Lock width to prevent any layout recalculation
          width: "100%",
          maxWidth: `${safeContainerWidth}px`,
          marginLeft: "auto",
          marginRight: "auto",
          transform: `translateX(${vinylPlayerOffset}px)`,
          transitionProperty: "transform",
          transitionDuration: "500ms",
          transitionTimingFunction: "ease-out",
          // Ensure no overflow within this container
          overflow: "visible",
        }}
      >
        {/* Vinyl and tonearm - scaled from center with max-width constraint to prevent overflow */}
        <div 
          ref={vinylRef}
          className={cn(
            "relative flex items-center justify-center flex-shrink-0",
            "drop-shadow-2xl transition-all duration-500"
          )}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center", // Scale from center
            width: "fit-content",
            // CRITICAL: Constrain vinyl to safe bounds
            // This keeps the scaled vinyl within the safe container
            maxWidth: `${safeContainerWidth}px`,
            // Ensure vinyl scaling doesn't cause layout jitter
            willChange: "transform, opacity",
          }}
        >
          <VinylRecord />
          <Tonearm />
        </div>

        {/* Dynamically spaced title section - stays below vinyl always */}
        {currentTrack && (
          <>
            {/* Spacer that grows with vinyl */}
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
                "drop-shadow-lg max-w-md"
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
              themeTextColors[theme]
            )}>
              {currentTrack.artist}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
