"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function PlayerControls() {
  const {
    theme,
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
  } = usePlayer()

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const themeStyles: Record<string, {
    button: string
    playButton: string
    playButtonShadow: string
    progress: string
    progressFill: string
    progressThumb: string
    volume: string
    volumeFill: string
    text: string
  }> = {
    black: {
      button: "text-white/70 hover:text-white hover:bg-white/10 active:scale-95",
      playButton: "bg-white text-zinc-900 hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(255,255,255,0.15)]",
      progress: "bg-zinc-800",
      progressFill: "bg-white",
      progressThumb: "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]",
      volume: "bg-zinc-800",
      volumeFill: "bg-white",
      text: "text-zinc-500",
    },
    pink: {
      button: "text-pink-600/80 hover:text-pink-700 hover:bg-pink-300/40 hover:shadow-[0_0_15px_rgba(219,112,147,0.25)] active:scale-95",
      playButton: "bg-gradient-to-br from-pink-400 to-rose-500 text-white hover:from-pink-500 hover:to-rose-600 hover:shadow-[0_0_40px_rgba(219,112,147,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_35px_rgba(219,112,147,0.4)]",
      progress: "bg-pink-300/60",
      progressFill: "bg-gradient-to-r from-pink-400 to-rose-500",
      progressThumb: "bg-rose-500 shadow-[0_0_12px_rgba(219,112,147,0.8)]",
      volume: "bg-pink-300/60",
      volumeFill: "bg-gradient-to-r from-pink-400 to-rose-500",
      text: "text-pink-600",
    },
    coding: {
      button: "text-purple-400/70 hover:text-cyan-400 hover:bg-purple-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(139,92,246,0.4)]",
      progress: "bg-purple-900/40",
      progressFill: "bg-gradient-to-r from-purple-500 to-cyan-500",
      progressThumb: "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]",
      volume: "bg-purple-900/40",
      volumeFill: "bg-gradient-to-r from-purple-500 to-cyan-500",
      text: "text-purple-400",
    },
    maroon: {
      button: "text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(251,191,36,0.3)]",
      progress: "bg-amber-900/30",
      progressFill: "bg-amber-500",
      progressThumb: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
      volume: "bg-amber-900/30",
      volumeFill: "bg-amber-500",
      text: "text-amber-500",
    },
    galaxy: {
      button: "text-indigo-400/70 hover:text-indigo-300 hover:bg-indigo-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(99,102,241,0.4)]",
      progress: "bg-indigo-900/40",
      progressFill: "bg-gradient-to-r from-indigo-500 to-purple-500",
      progressThumb: "bg-indigo-400 shadow-[0_0_15px_rgba(165,180,252,0.8)]",
      volume: "bg-indigo-900/40",
      volumeFill: "bg-gradient-to-r from-indigo-500 to-purple-500",
      text: "text-indigo-400",
    },
    flame: {
      button: "text-orange-400/70 hover:text-orange-300 hover:bg-orange-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(249,115,22,0.4)]",
      progress: "bg-orange-900/40",
      progressFill: "bg-gradient-to-r from-orange-500 to-red-500",
      progressThumb: "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]",
      volume: "bg-orange-900/40",
      volumeFill: "bg-gradient-to-r from-orange-500 to-red-500",
      text: "text-orange-400",
    },
    blood: {
      button: "text-red-400/70 hover:text-red-300 hover:bg-red-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-red-700 to-red-900 text-red-100 hover:from-red-600 hover:to-red-800 hover:shadow-[0_0_40px_rgba(185,28,28,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(185,28,28,0.4)]",
      progress: "bg-red-900/40",
      progressFill: "bg-red-600",
      progressThumb: "bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.8)]",
      volume: "bg-red-900/40",
      volumeFill: "bg-red-600",
      text: "text-red-400",
    },
    nightcity: {
      button: "text-purple-400/70 hover:text-cyan-400 hover:bg-purple-500/20 active:scale-95",
      playButton: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(147,51,234,0.4)]",
      progress: "bg-purple-900/40",
      progressFill: "bg-gradient-to-r from-purple-500 to-cyan-500",
      progressThumb: "bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]",
      volume: "bg-purple-900/40",
      volumeFill: "bg-gradient-to-r from-purple-500 to-cyan-500",
      text: "text-purple-400",
    },
    gothic: {
      button: "text-purple-400/70 hover:text-purple-300 hover:bg-purple-950/30 active:scale-95",
      playButton: "bg-gradient-to-r from-slate-700 to-purple-800 text-purple-100 hover:from-slate-600 hover:to-purple-700 hover:shadow-[0_0_40px_rgba(100,80,160,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(100,80,160,0.4)]",
      progress: "bg-purple-950/40",
      progressFill: "bg-gradient-to-r from-slate-500 to-purple-600",
      progressThumb: "bg-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)]",
      volume: "bg-purple-950/40",
      volumeFill: "bg-gradient-to-r from-slate-500 to-purple-600",
      text: "text-purple-400",
    },
    vintage: {
      button: "text-amber-400/70 hover:text-amber-300 hover:bg-amber-900/30 active:scale-95",
      playButton: "bg-gradient-to-r from-amber-600 to-yellow-700 text-amber-100 hover:from-amber-500 hover:to-yellow-600 hover:shadow-[0_0_40px_rgba(180,130,60,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(180,130,60,0.4)]",
      progress: "bg-amber-900/40",
      progressFill: "bg-gradient-to-r from-amber-500 to-yellow-500",
      progressThumb: "bg-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]",
      volume: "bg-amber-900/40",
      volumeFill: "bg-gradient-to-r from-amber-500 to-yellow-500",
      text: "text-amber-400",
    },
    masjid: {
      button: "text-gray-400/70 hover:text-gray-300 hover:bg-gray-900/30 active:scale-95",
      playButton: "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 hover:from-gray-500 hover:to-gray-600 hover:shadow-[0_0_40px_rgba(229,231,235,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(229,231,235,0.4)]",
      progress: "bg-gray-900/40",
      progressFill: "bg-gradient-to-r from-gray-400 to-gray-300",
      progressThumb: "bg-gray-300 shadow-[0_0_15px_rgba(229,231,235,0.8)]",
      volume: "bg-gray-900/40",
      volumeFill: "bg-gradient-to-r from-gray-400 to-gray-300",
      text: "text-gray-400",
    },
    "desert-moon": {
      button: "text-green-300/70 hover:text-green-200 hover:bg-green-900/30 active:scale-95",
      playButton: "bg-gradient-to-r from-green-600 to-green-700 text-green-100 hover:from-green-500 hover:to-green-600 hover:shadow-[0_0_40px_rgba(132,204,22,0.6)] active:scale-95",
      playButtonShadow: "shadow-[0_8px_30px_rgba(132,204,22,0.4)]",
      progress: "bg-green-900/40",
      progressFill: "bg-gradient-to-r from-green-400 to-green-300",
      progressThumb: "bg-green-300 shadow-[0_0_15px_rgba(132,204,22,0.8)]",
      volume: "bg-green-900/40",
      volumeFill: "bg-gradient-to-r from-green-400 to-green-300",
      text: "text-green-300",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seek(percent * duration)
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div
          className={cn(
            "relative h-2 rounded-full cursor-pointer group overflow-hidden",
            "transition-all duration-300",
            styles.progress
          )}
          onClick={handleProgressClick}
        >
          {/* Progress fill with glow */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-150",
              styles.progressFill
            )}
            style={{ width: `${progress}%` }}
          />
          {/* Hover expansion effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5" />
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full",
              "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
              "transition-all duration-300",
              styles.progressThumb
            )}
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>
        <div className={cn("flex justify-between text-xs font-mono transition-colors duration-500", styles.text)}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={previous}
          disabled={!currentTrack}
          className={cn(
            "p-3 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:scale-110",
            styles.button
          )}
          aria-label="Previous track"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={togglePlay}
          disabled={!currentTrack}
          className={cn(
            "relative p-5 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:scale-105",
            styles.playButton,
            styles.playButtonShadow
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {/* Ripple effect ring */}
          <span
            className={cn(
              "absolute inset-0 rounded-full",
              "animate-ping opacity-20",
              isPlaying ? "bg-current" : "hidden"
            )}
          />
          {isPlaying ? (
            <Pause className="w-7 h-7 relative z-10" />
          ) : (
            <Play className="w-7 h-7 ml-1 relative z-10" />
          )}
        </button>

        <button
          onClick={next}
          disabled={!currentTrack}
          className={cn(
            "p-3 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:scale-110",
            styles.button
          )}
          aria-label="Next track"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            "hover:scale-110",
            styles.button
          )}
          aria-label={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <div
          className={cn(
            "relative w-28 h-1.5 rounded-full cursor-pointer group",
            "transition-all duration-300 hover:h-2",
            styles.volume
          )}
          onClick={handleVolumeChange}
        >
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-150",
              styles.volumeFill
            )}
            style={{ width: `${volume * 100}%` }}
          />
          {/* Volume thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full",
              "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
              "transition-all duration-300",
              styles.progressThumb
            )}
            style={{ left: `calc(${volume * 100}% - 6px)` }}
          />
        </div>
      </div>
    </div>
  )
}
