"use client"

import { usePlayer, type Theme } from "@/contexts/player-context"
import { useState, useEffect, useRef } from "react"
import { VinylRecord } from "./vinyl-record"
import { Tonearm } from "./tonearm"
import { PlayerControls } from "./player-controls"
import { TrackInfo } from "./track-info"
import { ThemeMenu } from "./theme-menu"
import { HelpOverlay } from "./help-overlay"
import { SourceTabs } from "./source-tabs"
import { HomepageUpload } from "./homepage-upload"
import { LyricsPanel } from "./lyrics-panel"
import { PlaylistPanel } from "./playlist-panel"
import { MinimalVinylView } from "./minimal-vinyl-view"
import { VinylLyricsView } from "./vinyl-lyrics-view"
import { VinylContainer } from "./vinyl-container"
import { GalaxyBackground } from "./backgrounds/galaxy-background"
import { FlameBackground } from "./backgrounds/flame-background"
import { PinkBackground } from "./backgrounds/pink-background"
import { NightCityBackground } from "./backgrounds/night-city-background"
import { GothicBackground } from "./backgrounds/gothic-background"
import { VintageBackground } from "./backgrounds/vintage-background"
import { MasjidBackground } from "./backgrounds/masjid-background"
import { CreatorCredit } from "./creator-credit"
import { cn } from "@/lib/utils"

export function VinylPlayer() {
  const { theme, viewMode, currentTrack, queue, vinylStyle, vinylSize, lyricsPanelOffset, setLyricsPanelOffset, vinylPlayerOffset } = usePlayer()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayTheme, setDisplayTheme] = useState(theme)

  // Reset lyrics panel offset and clear state when entering Only Vinyl mode
  useEffect(() => {
    if (viewMode === "vinyl-only" && vinylStyle === "vinyl-minimal") {
      // Force reset lyrics panel offset to prevent any hidden layout shifts
      if (lyricsPanelOffset !== 0) {
        setLyricsPanelOffset(0)
      }
      // Force layout recalculation by triggering a repaint
      // This ensures no ghost spacing or bouncing from hidden lyrics state
      window.dispatchEvent(new Event('resize'))
    }
  }, [viewMode, vinylStyle, lyricsPanelOffset, setLyricsPanelOffset])

  // Handle smooth theme transitions
  useEffect(() => {
    if (theme !== displayTheme) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayTheme(theme)
        setIsTransitioning(false)
      }, 250) // Half of total transition for crossfade effect
      return () => clearTimeout(timer)
    }
  }, [theme, displayTheme])

  const themeStyles: Record<Theme, {
    bg: string
    gradient: string
    overlay: string
  }> = {
    black: {
      bg: "bg-zinc-950",
      gradient: "bg-[radial-gradient(ellipse_at_center,rgba(30,30,30,1)_0%,rgba(10,10,10,1)_100%)]",
      overlay: "",
    },
    pink: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    coding: {
      bg: "bg-zinc-950",
      gradient: "bg-[radial-gradient(ellipse_at_top_left,rgba(88,28,135,0.3)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(30,58,138,0.3)_0%,transparent_50%)]",
      overlay: "before:absolute before:inset-0 before:bg-zinc-950 before:-z-10",
    },
    maroon: {
      bg: "bg-zinc-950",
      gradient: "bg-[radial-gradient(ellipse_at_top,rgba(127,29,29,0.2)_0%,transparent_50%),radial-gradient(ellipse_at_bottom,rgba(120,53,15,0.15)_0%,transparent_50%)]",
      overlay: "before:absolute before:inset-0 before:bg-zinc-950 before:-z-10",
    },
    galaxy: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    flame: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    blood: {
      bg: "bg-zinc-950",
      gradient: "bg-[radial-gradient(ellipse_at_center,rgba(127,29,29,0.3)_0%,transparent_60%)]",
      overlay: "before:absolute before:inset-0 before:bg-[linear-gradient(to_bottom,#0a0000_0%,#150505_50%,#0a0000_100%)] before:-z-10",
    },
    nightcity: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    gothic: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    vintage: {
      bg: "",
      gradient: "",
      overlay: "",
    },
    masjid: {
      bg: "bg-blue-950",
      gradient: "bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_50%)]",
      overlay: "before:absolute before:inset-0 before:bg-blue-950 before:-z-10",
    },
  }

  const styles = themeStyles[theme]

  // Get sidebar styling based on theme
  const getSidebarStyles = () => {
    switch (theme) {
      case "pink":
        return "bg-white/60 shadow-[0_20px_60px_-15px_rgba(190,130,150,0.25)] backdrop-blur-sm border border-pink-200/40"
      case "blood":
        return "bg-red-950/30 shadow-[0_20px_60px_-15px_rgba(127,29,29,0.3)] backdrop-blur-sm border border-red-900/20"
      case "flame":
        return "bg-zinc-950/50 shadow-[0_20px_60px_-15px_rgba(220,38,38,0.2)] backdrop-blur-sm border border-orange-900/20"
      case "galaxy":
        return "bg-indigo-950/30 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)] backdrop-blur-sm border border-indigo-500/20"
      case "nightcity":
        return "bg-zinc-950/60 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.25)] backdrop-blur-sm border border-purple-500/20"
      case "gothic":
        return "bg-slate-950/60 shadow-[0_20px_60px_-15px_rgba(100,80,160,0.25)] backdrop-blur-sm border border-purple-900/30"
      case "vintage":
        return "bg-amber-950/50 shadow-[0_20px_60px_-15px_rgba(180,130,60,0.25)] backdrop-blur-sm border border-amber-700/30"
      case "masjid":
        return "bg-blue-950/50 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] backdrop-blur-sm border border-blue-400/20"
      default:
        return "bg-zinc-900/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-sm"
    }
  }

  return (
    <div
      className={cn(
        "relative min-h-screen w-full transition-all duration-700 ease-out overflow-x-hidden",
        styles.bg,
        styles.gradient,
        styles.overlay
      )}
    >
      {/* Animated backgrounds for special themes with fade transitions */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "galaxy" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "galaxy" || theme === "galaxy") && <GalaxyBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "flame" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "flame" || theme === "flame") && <FlameBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "pink" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "pink" || theme === "pink") && <PinkBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "nightcity" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "nightcity" || theme === "nightcity") && <NightCityBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "gothic" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "gothic" || theme === "gothic") && <GothicBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "vintage" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "vintage" || theme === "vintage") && <VintageBackground />}
      </div>
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-500 ease-in-out",
          displayTheme === "masjid" ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {(displayTheme === "masjid" || theme === "masjid") && <MasjidBackground />}
      </div>

      {/* Blood red ambient glow */}
      {theme === "blood" && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(185, 28, 28, 0.6) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Theme menu and help button in corner */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <HelpOverlay />
        <ThemeMenu />
      </div>

      {/* Ambient visualizer mode - full screen immersive view with scrolling enabled */}
      {(viewMode === "vinyl-only") && currentTrack && vinylStyle === "vinyl-minimal" && (
        <MinimalVinylView />
      )}

      {/* Only Vinyl + Lyrics mode - minimal style with lyrics panel and scrolling enabled */}
      {(viewMode === "vinyl-lyrics") && currentTrack && vinylStyle === "vinyl-minimal" && (
        <VinylLyricsView />
      )}

      {/* Standard player mode with controls and panels */}
      {!((viewMode === "vinyl-only") && currentTrack && vinylStyle === "vinyl-minimal") && !((viewMode === "vinyl-lyrics") && currentTrack && vinylStyle === "vinyl-minimal") && (
      <div className={cn(
        "relative z-10 container mx-auto px-4 min-h-screen flex flex-col transition-all duration-500 overflow-hidden",
        // Layout varies based on view mode and whether we're showing source tabs
        !currentTrack && queue.length === 0
          ? "justify-center py-8 lg:flex-row gap-8 lg:gap-16"
          : viewMode === "vinyl-only"
            ? "justify-center py-8"
            : viewMode === "vinyl-lyrics"
              ? "justify-center items-center lg:flex-row gap-8 lg:gap-12"
              : "justify-start lg:justify-center lg:flex-row gap-8 lg:gap-12"
      )}>
        {/* Vinyl section wrapper - handles top padding for all modes */}
        <div 
          className={cn(
            "relative transition-all duration-500 flex flex-col items-center",
            viewMode !== "vinyl-only" && currentTrack && vinylStyle === "vinyl-blurred" ? "lg:flex-shrink-0" : ""
          )}
          style={{
            paddingTop: currentTrack && vinylStyle === "vinyl-minimal" ? `${Math.max(96, 64 * (vinylSize / 100))}px` : undefined,
            transform: `translateX(${vinylPlayerOffset}px)`,
            transitionProperty: "transform, padding-top",
            transitionDuration: "500ms",
            transitionTimingFunction: "ease-out",
          }}
        >
          {/* Frosted glass panel background - only show when vinyl-blurred style is selected */}
          {vinylStyle === "vinyl-blurred" && (
            <div 
              className={cn(
                "absolute inset-0 rounded-3xl transition-all duration-500",
                "backdrop-blur-[12px]",
                theme === "pink" 
                  ? "bg-white/25 shadow-[0_8px_40px_rgba(190,130,150,0.15),0_2px_12px_rgba(0,0,0,0.05)]"
                  : "bg-black/30 shadow-[0_8px_40px_rgba(0,0,0,0.3),0_2px_12px_rgba(0,0,0,0.2)]",
                "border",
                theme === "pink" ? "border-white/30" : "border-white/[0.08]"
              )}
            >
              {/* Subtle inner highlight at top */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-3xl" />
            </div>
          )}

          {/* Content container - mode-specific spacing */}
          <div className={cn(
            "relative flex flex-col items-center transition-all duration-500",
            vinylStyle === "vinyl-blurred" ? "p-6 lg:p-8" : "p-4",
            // Adjust padding for minimal vinyl
            vinylStyle === "vinyl-minimal" ? "py-4" : "",
            // Mode-specific gap spacing
            viewMode === "vinyl-lyrics" ? "gap-4" : "gap-6"
          )}>
            {/* Vinyl container with dynamic spacing */}
            {vinylStyle === "vinyl-minimal" && viewMode === "vinyl-only" ? (
              <VinylContainer includeTitle={true} />
            ) : (
              <>
                {/* Standard vinyl display for blurred mode and View All modes */}
                <div 
                  className={cn(
                    "relative flex items-center justify-center",
                    "drop-shadow-2xl transition-all duration-500",
                    viewMode === "vinyl-only" && currentTrack 
                      ? "w-full max-w-lg" 
                      : "w-full max-w-md"
                  )}
                  style={
                    vinylStyle === "vinyl-minimal" ? {
                      transform: `scale(${vinylSize / 100})`,
                      transformOrigin: "center",
                    } : undefined
                  }
                >
                  <VinylRecord />
                  <Tonearm />
                </div>

                {/* Track info - with dynamic spacing for minimal vinyl in View All modes */}
                <div
                  style={
                    vinylStyle === "vinyl-minimal" && viewMode !== "vinyl-only"
                      ? {
                          marginTop: `${Math.max(48, 48 * (vinylSize / 100))}px`,
                        }
                      : undefined
                  }
                >
                  <TrackInfo />
                </div>
              </>
            )}

            {/* Player controls */}
            <div className="player-controls">
              <PlayerControls />
            </div>
          </div>
        </div>

        {/* Right side panel - conditional based on state - completely removed from DOM when in Only Vinyl mode */}
        {!((viewMode === "vinyl-only") && currentTrack && vinylStyle === "vinyl-minimal") && (
        <div 
          className={cn(
            "transition-all duration-500 ease-in-out flex flex-col",
            // Show source tabs when no track is playing
            !currentTrack && queue.length === 0
              ? "w-full max-w-sm opacity-100"
              : viewMode === "vinyl-only"
                ? "w-0 opacity-0 overflow-hidden"
                : "w-full lg:w-[45%] lg:max-w-lg opacity-100 justify-start"
          )}
          style={{
            // Keep lyrics panel aligned to right and vertically centered with vinyl
            alignItems: viewMode === "vinyl-lyrics" ? "flex-end" : "stretch",
            // Add top margin to lower panels when in minimal vinyl View All modes
            marginTop: vinylStyle === "vinyl-minimal" && viewMode !== "vinyl-only" ? "64px" : undefined,
          }}
        >
          {/* Homepage upload (only when no track playing) */}
          {!currentTrack && queue.length === 0 && (
            <div className="w-full">
              <HomepageUpload />
            </div>
          )}



          {/* Lyrics panel (vinyl-lyrics mode) - displayed in right content area, aligned right */}
          {viewMode === "vinyl-lyrics" && currentTrack && (
            <div 
              className="h-[480px] lg:h-[540px] transition-all duration-500 w-full lg:w-auto"
              style={{
                transform: `translateX(${lyricsPanelOffset}px)`,
              }}
            >
              <LyricsPanel />
            </div>
          )}

          {/* Playlist panel (vinyl-playlist mode) */}
          {viewMode === "vinyl-playlist" && currentTrack && (
            <div className="h-[420px] lg:h-[480px] transition-all duration-500">
              <PlaylistPanel />
            </div>
          )}

          {/* Lyrics + Playlist mode - lyrics above playlist */}
          {viewMode === "vinyl-playlist-lyrics" && currentTrack && (
            <div className="flex flex-col gap-4 h-[580px] lg:h-[620px] transition-all duration-500">
              {/* Lyrics section - takes priority at top */}
              <div 
                className="h-[340px] lg:h-[380px] flex-shrink-0"
                style={{
                  transform: `translateX(${lyricsPanelOffset}px)`,
                }}
              >
                <LyricsPanel />
              </div>
              {/* Playlist section below */}
              <div className="flex-1 min-h-0">
                <PlaylistPanel />
              </div>
            </div>
          )}
        </div>
        )}
      </div>
      )}

      {/* Creator credits — rendered inside the themed background so the same
          gradient/animated-bg extends naturally behind the glassmorphism panel */}
      <CreatorCredit />

    </div>
  )
}
