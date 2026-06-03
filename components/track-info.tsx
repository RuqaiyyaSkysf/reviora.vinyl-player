"use client"

import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

export function TrackInfo() {
  const { theme, currentTrack } = usePlayer()

  const themeStyles: Record<string, {
    title: string
    artist: string
  }> = {
    black: {
      title: "text-white",
      artist: "text-zinc-400",
    },
    pink: {
      title: "text-zinc-800",
      artist: "text-rose-600",
    },
    coding: {
      title: "text-white",
      artist: "text-purple-400",
    },
    maroon: {
      title: "text-amber-100",
      artist: "text-amber-400",
    },
    galaxy: {
      title: "text-indigo-100",
      artist: "text-indigo-400",
    },
    flame: {
      title: "text-orange-100",
      artist: "text-orange-400",
    },
    blood: {
      title: "text-red-100",
      artist: "text-red-400",
    },
    nightcity: {
      title: "text-purple-100",
      artist: "text-cyan-400",
    },
    gothic: {
      title: "text-purple-100",
      artist: "text-purple-400",
    },
    vintage: {
      title: "text-amber-100",
      artist: "text-amber-400",
    },
    masjid: {
      title: "text-green-100",
      artist: "text-green-400",
    },
  }

  const styles = themeStyles[theme]

  if (!currentTrack) {
    return (
      <div className="text-center space-y-2">
        <h2 className={cn("text-xl font-semibold", styles.title)}>
          No track playing
        </h2>
        <p className={cn("text-sm", styles.artist)}>
          Upload an MP3 to get started
        </p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-2">
      <h2 className={cn("text-xl sm:text-2xl font-semibold text-balance", styles.title)}>
        {currentTrack.title}
      </h2>
      <p className={cn("text-sm sm:text-base", styles.artist)}>
        {currentTrack.artist}
      </p>
    </div>
  )
}
