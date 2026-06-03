"use client"

import { useRef, useCallback } from "react"
import { Plus, Upload } from "lucide-react"
import { usePlayer, type Track } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

interface AddSongButtonProps {
  compact?: boolean
  className?: string
}

export function AddSongButton({ compact = false, className }: AddSongButtonProps) {
  const { theme, addToQueue, playTrack, queue } = usePlayer()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const themeStyles: Record<string, {
    button: string
    buttonHover: string
  }> = {
    black: {
      button: "text-white/70 border-white/20 bg-white/5",
      buttonHover: "hover:bg-white/10 hover:border-white/30",
    },
    pink: {
      button: "text-pink-600 border-pink-300/40 bg-white/30",
      buttonHover: "hover:bg-white/50 hover:border-pink-400/50",
    },
    coding: {
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40",
    },
    maroon: {
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40",
    },
    galaxy: {
      button: "text-purple-300 border-indigo-400/30 bg-indigo-900/20",
      buttonHover: "hover:bg-indigo-900/40 hover:border-purple-400/40",
    },
    flame: {
      button: "text-orange-400 border-orange-500/30 bg-orange-900/20",
      buttonHover: "hover:bg-orange-900/40 hover:border-orange-400/40",
    },
    blood: {
      button: "text-red-400 border-red-500/30 bg-red-900/20",
      buttonHover: "hover:bg-red-900/40 hover:border-red-400/40",
    },
    nightcity: {
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40",
    },
    gothic: {
      button: "text-purple-300 border-purple-500/30 bg-purple-950/20",
      buttonHover: "hover:bg-purple-950/40 hover:border-purple-400/40",
    },
    vintage: {
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const processAudioFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      const track: Track = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local File",
        duration: 0,
        source: "local",
        url,
      }

      // Try to get audio duration
      const audio = new Audio(url)
      audio.addEventListener("loadedmetadata", () => {
        track.duration = audio.duration
      })

      if (queue.length === 0) {
        playTrack(track)
      } else {
        addToQueue(track)
      }
    },
    [playTrack, addToQueue, queue.length]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      const audioFiles = files.filter((file) =>
        file.type.startsWith("audio/") || file.name.endsWith(".mp3")
      )
      audioFiles.forEach(processAudioFile)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [processAudioFile]
  )

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex items-center gap-2 rounded-lg border backdrop-blur-sm font-medium transition-all duration-200",
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          styles.button,
          styles.buttonHover,
          className
        )}
      >
        <Plus className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        {compact ? "Add Song" : "Upload Another Song"}
      </button>
    </>
  )
}
