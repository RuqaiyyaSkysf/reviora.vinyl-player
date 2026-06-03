"use client"

import { cn } from "@/lib/utils"
import { usePlayer, type Theme } from "@/contexts/player-context"

interface PlaylistMergeModalProps {
  isOpen: boolean
  onMerge: () => void
  onReplace: () => void
  onCancel: () => void
  newPlaylistCount: number
}

export function PlaylistMergeModal({
  isOpen,
  onMerge,
  onReplace,
  onCancel,
  newPlaylistCount,
}: PlaylistMergeModalProps) {
  const { theme } = usePlayer()

  const bgStyles: Record<Theme, string> = {
    black: "bg-zinc-900 border-zinc-800",
    pink: "bg-white border-pink-200",
    coding: "bg-zinc-900 border-purple-500/30",
    maroon: "bg-zinc-900 border-amber-800/50",
    galaxy: "bg-indigo-950 border-indigo-500/30",
    flame: "bg-zinc-950 border-orange-500/30",
    blood: "bg-zinc-950 border-red-900/50",
    nightcity: "bg-zinc-950 border-purple-500/30",
    gothic: "bg-slate-950 border-purple-900/40",
    vintage: "bg-amber-950 border-amber-700/40",
  }

  const textStyles: Record<Theme, string> = {
    black: "text-white",
    pink: "text-zinc-900",
    coding: "text-white",
    maroon: "text-amber-100",
    galaxy: "text-indigo-100",
    flame: "text-orange-100",
    blood: "text-red-100",
    nightcity: "text-purple-100",
    gothic: "text-purple-100",
    vintage: "text-amber-100",
  }

  const buttonMergeStyles: Record<Theme, string> = {
    black: "bg-zinc-700 hover:bg-zinc-600 text-white",
    pink: "bg-pink-500 hover:bg-pink-600 text-white",
    coding: "bg-purple-600 hover:bg-purple-500 text-white",
    maroon: "bg-amber-600 hover:bg-amber-500 text-white",
    galaxy: "bg-indigo-600 hover:bg-indigo-500 text-white",
    flame: "bg-orange-600 hover:bg-orange-500 text-white",
    blood: "bg-red-600 hover:bg-red-500 text-white",
    nightcity: "bg-purple-600 hover:bg-purple-500 text-white",
    gothic: "bg-purple-600 hover:bg-purple-500 text-white",
    vintage: "bg-amber-600 hover:bg-amber-500 text-white",
  }

  const buttonReplaceStyles: Record<Theme, string> = {
    black: "bg-red-600 hover:bg-red-700 text-white",
    pink: "bg-red-500 hover:bg-red-600 text-white",
    coding: "bg-red-600 hover:bg-red-700 text-white",
    maroon: "bg-red-600 hover:bg-red-700 text-white",
    galaxy: "bg-red-600 hover:bg-red-700 text-white",
    flame: "bg-red-600 hover:bg-red-700 text-white",
    blood: "bg-red-700 hover:bg-red-600 text-white",
    nightcity: "bg-red-600 hover:bg-red-700 text-white",
    gothic: "bg-red-600 hover:bg-red-700 text-white",
    vintage: "bg-red-600 hover:bg-red-700 text-white",
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={cn(
          "rounded-lg border p-6 w-96 shadow-2xl",
          bgStyles[theme],
          textStyles[theme]
        )}
      >
        <h2 className="text-xl font-semibold mb-2">Playlist Already Exists</h2>
        <p className="text-sm opacity-80 mb-6">
          You have {newPlaylistCount} songs ready. How would you like to proceed?
        </p>

        <div className="space-y-3">
          <button
            onClick={onMerge}
            className={cn(
              "w-full py-2 rounded-lg font-medium transition-all duration-200",
              buttonMergeStyles[theme]
            )}
          >
            Merge with Current Playlist
          </button>
          <button
            onClick={onReplace}
            className={cn(
              "w-full py-2 rounded-lg font-medium transition-all duration-200",
              buttonReplaceStyles[theme]
            )}
          >
            Replace Current Playlist
          </button>
          <button
            onClick={onCancel}
            className={cn(
              "w-full py-2 rounded-lg font-medium transition-all duration-200",
              theme === "pink"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                : "bg-white/10 hover:bg-white/20 text-white"
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
