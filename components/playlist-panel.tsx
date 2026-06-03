"use client"

import { usePlayer } from "@/contexts/player-context"
import { Play, Pause, Music } from "lucide-react"
import { cn } from "@/lib/utils"

export function PlaylistPanel() {
  const { theme, queue, queueIndex, currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const themeStyles: Record<string, {
    title: string
    trackItem: string
    trackItemActive: string
    trackTitle: string
    trackArtist: string
    playButton: string
    emptyText: string
    albumArt: string
  }> = {
    black: {
      title: "text-white/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-white/5",
      trackItemActive: "bg-white/10",
      trackTitle: "text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-zinc-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-white hover:bg-white/10",
      emptyText: "text-zinc-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-zinc-800/80",
    },
    pink: {
      title: "text-zinc-700 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      trackItem: "hover:bg-pink-100/30",
      trackItemActive: "bg-pink-200/40",
      trackTitle: "text-zinc-800 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      trackArtist: "text-pink-500 [text-shadow:0_2px_4px_rgba(255,255,255,0.5)]",
      playButton: "text-pink-600 hover:bg-pink-100/50",
      emptyText: "text-pink-400 [text-shadow:0_2px_6px_rgba(255,255,255,0.6)]",
      albumArt: "bg-pink-100/80",
    },
    coding: {
      title: "text-white/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-purple-900/30",
      trackItemActive: "bg-purple-900/50",
      trackTitle: "text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-purple-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-cyan-400 hover:bg-purple-900/30",
      emptyText: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-purple-900/80",
    },
    maroon: {
      title: "text-amber-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-amber-900/30",
      trackItemActive: "bg-amber-900/50",
      trackTitle: "text-amber-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-amber-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-amber-400 hover:bg-amber-900/30",
      emptyText: "text-amber-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-amber-900/80",
    },
    galaxy: {
      title: "text-indigo-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-indigo-900/30",
      trackItemActive: "bg-indigo-900/50",
      trackTitle: "text-indigo-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-indigo-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-indigo-400 hover:bg-indigo-900/30",
      emptyText: "text-indigo-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-indigo-900/80",
    },
    flame: {
      title: "text-orange-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-orange-900/30",
      trackItemActive: "bg-orange-900/50",
      trackTitle: "text-orange-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-orange-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-orange-400 hover:bg-orange-900/30",
      emptyText: "text-orange-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-orange-900/80",
    },
    blood: {
      title: "text-red-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-red-900/30",
      trackItemActive: "bg-red-900/50",
      trackTitle: "text-red-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-red-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-red-400 hover:bg-red-900/30",
      emptyText: "text-red-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-red-900/80",
    },
    nightcity: {
      title: "text-purple-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-purple-900/30",
      trackItemActive: "bg-purple-900/50",
      trackTitle: "text-purple-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-cyan-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-cyan-400 hover:bg-purple-900/30",
      emptyText: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-purple-900/80",
    },
    gothic: {
      title: "text-purple-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-purple-950/30",
      trackItemActive: "bg-purple-950/50",
      trackTitle: "text-purple-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-purple-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-purple-400 hover:bg-purple-950/30",
      emptyText: "text-purple-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-purple-950/80",
    },
    vintage: {
      title: "text-amber-200/60 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackItem: "hover:bg-amber-900/30",
      trackItemActive: "bg-amber-900/50",
      trackTitle: "text-amber-100 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      trackArtist: "text-amber-400 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]",
      playButton: "text-amber-400 hover:bg-amber-900/30",
      emptyText: "text-amber-400 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]",
      albumArt: "bg-amber-900/80",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (queue.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2 p-6">
        <p className={cn("text-xs uppercase tracking-wider font-medium", styles.title)}>Playlist</p>
        <p className={cn("text-sm", styles.emptyText)}>No tracks in queue</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3">
        <p className={cn("text-xs uppercase tracking-wider font-medium", styles.title)}>
          Playlist ({queue.length} {queue.length === 1 ? "track" : "tracks"})
        </p>
      </div>
      <div className="flex-1 overflow-y-auto backdrop-blur-[8px]">
        {queue.map((track, index) => {
          const isActive = index === queueIndex
          const isCurrentlyPlaying = isActive && isPlaying

          return (
            <button
              key={track.id}
              onClick={() => {
                if (isActive) {
                  togglePlay()
                } else {
                  playTrack(track)
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 p-3 transition-all duration-200",
                styles.trackItem,
                isActive && styles.trackItemActive
              )}
            >
              {/* Album art or placeholder */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden",
                styles.albumArt
              )}>
                {track.albumArt ? (
                  <img 
                    src={track.albumArt} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className={cn("w-5 h-5", styles.trackArtist)} />
                )}
              </div>

              {/* Track info */}
              <div className="flex-1 text-left min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  styles.trackTitle,
                  isActive && "font-semibold"
                )}>
                  {track.title}
                </p>
                <p className={cn("text-xs truncate", styles.trackArtist)}>
                  {track.artist}
                </p>
              </div>

              {/* Duration */}
              <span className={cn("text-xs", styles.trackArtist)}>
                {formatDuration(track.duration)}
              </span>

              {/* Play/Pause indicator for active track */}
              {isActive && (
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  styles.playButton
                )}>
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
