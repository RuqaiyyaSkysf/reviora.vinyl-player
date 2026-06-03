"use client"

import { usePlayer, type Theme } from "@/contexts/player-context"
import { VinylRecord } from "./vinyl-record"
import { Tonearm } from "./tonearm"
import { LyricsPanel } from "./lyrics-panel"
import { cn } from "@/lib/utils"
import { useRef, useEffect, useState } from "react"

export function VinylLyricsView() {
  const { currentTrack, vinylSize, theme, lyricsPanelOffset, vinylPlayerOffset } = usePlayer()
  const containerRef = useRef<HTMLDivElement>(null)
  const vinylRef = useRef<HTMLDivElement>(null)
  const [vinylHeight, setVinylHeight] = useState(0)

  // Measure the vinyl container at actual rendered sizes
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
  
  // STRICT SAFE SCALING SYSTEM
  // Prevent bouncing by keeping vinyl within stable rendering bounds
  // The vinyl must NEVER cause the viewport width to change
  
  // Dynamic spacing that scales with vinyl
  const spacingMultiplier = Math.max(1, scale)
  const baseVinylTitleGap = 48 // Increased from 24px to move title further below vinyl
  const dynamicVinylTitleGap = baseVinylTitleGap * spacingMultiplier * 1.3 // Stronger movement for title
  
  const baseTitleArtistGap = 8
  const dynamicTitleArtistGap = baseTitleArtistGap * spacingMultiplier

  // FIXED SAFE CONTAINER WIDTH - Never changes, prevents horizontal jitter
  const safeContainerWidth = 500 // Fixed width for stable rendering
  
  // Calculate how much vertical space we need to add as vinyl grows
  // At scale 1.0 (100%): base top padding of 120px
  // At scale 1.3+ (130%): increased to account for larger vinyl height
  // Formula ensures vertical growth instead of horizontal overflow
  const baseTopPadding = 120
  const scaledExtraTopPadding = Math.max(0, (scale - 1) * 280) // 280px extra per 0.1 scale increase
  const topSpacing = baseTopPadding + scaledExtraTopPadding

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-start"
      style={{
        paddingTop: `${topSpacing}px`,
        // Extra breathing room below content before credits (~1.5–2 inches = ~144–192px)
        paddingBottom: "160px",
        overflow: "hidden",
      }}
    >
      {/* Vinyl + lyrics section — balanced cinematic composition */}
      {/* justify-center pulls both vinyl and lyrics slightly inward from screen edges */}
      <div 
        className="flex flex-col lg:flex-row lg:justify-center items-center lg:items-start gap-6 lg:gap-16 w-full transition-all duration-500"
        style={{
          // Balanced padding: equal on both sides for symmetric viewport breathing
          paddingLeft: "clamp(2rem, 6vw, 4rem)",
          paddingRight: "clamp(2rem, 6vw, 4rem)",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        
        {/* Vinyl section — sits center-left */}
        <div 
          className="flex-shrink-0 flex flex-col items-center gap-0 transition-all duration-500"
          style={{
            transform: `translateX(${vinylPlayerOffset}px)`,
            transitionProperty: "transform",
            transitionDuration: "500ms",
            transitionTimingFunction: "ease-out",
          }}
        >
          
          {/* Vinyl and tonearm — isolated scaling layer, never affects layout width */}
          <div 
            ref={vinylRef}
            className={cn(
              "relative flex items-center justify-center flex-shrink-0",
              "drop-shadow-2xl transition-all duration-500"
            )}
            style={{
              transform: `scale(${scale})`,
              // Scale from center — does not push layout edges
              transformOrigin: "center center",
              // Fixed intrinsic size — transform:scale does not affect layout flow
              // so this element always occupies its unscaled footprint in the layout
              willChange: "transform",
            }}
          >
            <VinylRecord />
            <Tonearm />
          </div>

          {/* Title and artist — below vinyl, centered under it */}
          {currentTrack && (
            <>
              <div 
                style={{
                  height: `${dynamicVinylTitleGap}px`,
                  transition: "height 0.5s ease-out",
                }}
              />
              
              <div className="relative text-center flex-shrink-0 px-4 transition-all duration-500">
                <h2 className={cn(
                  "text-sm sm:text-base md:text-lg font-semibold text-balance line-clamp-3",
                  themeTextColors[theme],
                  "drop-shadow-lg max-w-md"
                )}>
                  {currentTrack.title}
                </h2>
              </div>

              <div 
                style={{
                  height: `${dynamicTitleArtistGap}px`,
                  transition: "height 0.5s ease-out",
                }}
              />

              <p className={cn(
                "text-xs sm:text-sm opacity-60 text-center flex-shrink-0 px-4 transition-all duration-500",
                themeTextColors[theme]
              )}>
                {currentTrack.artist}
              </p>
            </>
          )}
        </div>

        {/* Lyrics panel — sits center-right, fills remaining space */}
        {currentTrack && (
          <div 
            className="w-full lg:flex-1 h-[400px] lg:h-[540px] transition-all duration-500"
            style={{
              transform: `translateX(${lyricsPanelOffset}px)`,
              // Flex-grow fills available space; min/max keeps it readable
              flex: "1 1 auto",
              minWidth: "220px",
              maxWidth: "420px",
            }}
          >
            <LyricsPanel />
          </div>
        )}
      </div>
    </div>
  )
}
