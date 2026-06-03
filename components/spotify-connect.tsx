"use client"

import { Music2, ExternalLink, Info, LogOut, RefreshCw, Loader2 } from "lucide-react"
import { usePlayer } from "@/contexts/player-context"
import { useSpotify } from "@/contexts/spotify-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function SpotifyConnect() {
  const { theme } = usePlayer()
  const { isConnected, isLoading, error, connect, disconnect, refresh, track, isPlaying } = useSpotify()
  const [showInstructions, setShowInstructions] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }

  const themeStyles: Record<string, {
    container: string
    button: string
    buttonSecondary: string
    text: string
    textHighlight: string
    instructions: string
    code: string
    error: string
    success: string
  }> = {
    black: {
      container: "bg-zinc-800/50 border-zinc-700",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
      text: "text-zinc-400",
      textHighlight: "text-white",
      instructions: "bg-zinc-800 border-zinc-700",
      code: "bg-zinc-900 text-zinc-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    pink: {
      container: "bg-pink-50 border-pink-200",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-pink-200 hover:bg-pink-300 text-pink-800",
      text: "text-pink-600",
      textHighlight: "text-zinc-800",
      instructions: "bg-white border-pink-200",
      code: "bg-pink-100 text-pink-700",
      error: "text-red-500",
      success: "text-green-600",
    },
    coding: {
      container: "bg-purple-900/30 border-purple-500/30",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-purple-800 hover:bg-purple-700 text-white",
      text: "text-purple-400",
      textHighlight: "text-white",
      instructions: "bg-zinc-900 border-purple-500/30",
      code: "bg-purple-950 text-cyan-400",
      error: "text-red-400",
      success: "text-green-400",
    },
    maroon: {
      container: "bg-amber-900/20 border-amber-800/50",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-amber-800 hover:bg-amber-700 text-white",
      text: "text-amber-400",
      textHighlight: "text-amber-100",
      instructions: "bg-zinc-900 border-amber-800/50",
      code: "bg-amber-950 text-amber-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    galaxy: {
      container: "bg-indigo-900/30 border-indigo-500/30",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-indigo-800 hover:bg-indigo-700 text-white",
      text: "text-indigo-400",
      textHighlight: "text-indigo-100",
      instructions: "bg-zinc-900 border-indigo-500/30",
      code: "bg-indigo-950 text-indigo-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    flame: {
      container: "bg-orange-900/30 border-orange-500/30",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-orange-800 hover:bg-orange-700 text-white",
      text: "text-orange-400",
      textHighlight: "text-orange-100",
      instructions: "bg-zinc-900 border-orange-500/30",
      code: "bg-orange-950 text-orange-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    blood: {
      container: "bg-red-900/30 border-red-800/30",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-red-800 hover:bg-red-700 text-white",
      text: "text-red-400",
      textHighlight: "text-red-100",
      instructions: "bg-zinc-900 border-red-800/30",
      code: "bg-red-950 text-red-300",
      error: "text-red-300",
      success: "text-green-400",
    },
    nightcity: {
      container: "bg-purple-900/30 border-purple-500/30",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-purple-800 hover:bg-purple-700 text-white",
      text: "text-purple-400",
      textHighlight: "text-cyan-300",
      instructions: "bg-zinc-900 border-purple-500/30",
      code: "bg-purple-950 text-cyan-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    gothic: {
      container: "bg-purple-950/30 border-purple-900/40",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-purple-900 hover:bg-purple-800 text-white",
      text: "text-purple-400",
      textHighlight: "text-purple-200",
      instructions: "bg-slate-950 border-purple-900/40",
      code: "bg-slate-900 text-purple-300",
      error: "text-red-400",
      success: "text-green-400",
    },
    vintage: {
      container: "bg-amber-900/30 border-amber-700/40",
      button: "bg-[#1DB954] hover:bg-[#1ed760] text-black",
      buttonSecondary: "bg-amber-800 hover:bg-amber-700 text-white",
      text: "text-amber-400",
      textHighlight: "text-amber-100",
      instructions: "bg-amber-950 border-amber-700/40",
      code: "bg-amber-900 text-amber-200",
      error: "text-red-400",
      success: "text-green-400",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  if (isLoading) {
    return (
      <div className={cn("rounded-xl border p-4", styles.container)}>
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className={cn("w-5 h-5 animate-spin", styles.text)} />
          <span className={styles.text}>Connecting to Spotify...</span>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className={cn("rounded-xl border p-4 space-y-4", styles.container)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
            <Music2 className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1">
            <h3 className={cn("font-semibold", styles.textHighlight)}>
              Spotify Connected
            </h3>
            <p className={cn("text-sm", styles.success)}>
              {isPlaying ? "Now Playing" : track ? "Paused" : "No track playing"}
            </p>
          </div>
        </div>

        {track && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
            {track.albumArt && (
              <img
                src={track.albumArt}
                alt={track.album}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium truncate", styles.textHighlight)}>
                {track.name}
              </p>
              <p className={cn("text-sm truncate", styles.text)}>
                {track.artist}
              </p>
            </div>
            {track.spotifyUrl && (
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("p-2 rounded-full transition-colors", styles.buttonSecondary)}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200",
              styles.buttonSecondary
            )}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={disconnect}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200",
              "bg-red-600 hover:bg-red-500 text-white"
            )}
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-xl border p-4 space-y-4", styles.container)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
          <Music2 className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className={cn("font-semibold", styles.textHighlight)}>
            Spotify Connect
          </h3>
          <p className={cn("text-sm", styles.text)}>
            Display your currently playing track
          </p>
        </div>
      </div>

      {error && (
        <p className={cn("text-sm p-2 rounded bg-red-500/10", styles.error)}>
          {error}
        </p>
      )}

      <button
        onClick={connect}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200",
          styles.button
        )}
      >
        <Music2 className="w-5 h-5" />
        Connect with Spotify
        <ExternalLink className="w-4 h-4" />
      </button>

      <button
        onClick={() => setShowInstructions(!showInstructions)}
        className={cn(
          "flex items-center gap-1 text-sm transition-colors",
          styles.text,
          "hover:opacity-80"
        )}
      >
        <Info className="w-4 h-4" />
        {showInstructions ? "Hide" : "Show"} setup instructions
      </button>

      {showInstructions && (
        <div className={cn("rounded-lg border p-4 space-y-3", styles.instructions)}>
          <h4 className={cn("font-medium", styles.textHighlight)}>
            Setup Instructions
          </h4>
          <ol className={cn("text-sm space-y-2 list-decimal list-inside", styles.text)}>
            <li>
              Create a Spotify Developer account at{" "}
              <a
                href="https://developer.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                developer.spotify.com
              </a>
            </li>
            <li>Create a new application in the dashboard</li>
            <li>
              Add your redirect URI:
              <code className={cn("block mt-1 p-2 rounded text-xs", styles.code)}>
                http://localhost:3000/api/spotify/callback
              </code>
            </li>
            <li>Copy your Client ID and Client Secret</li>
            <li>
              Add the environment variables to your project:
              <code className={cn("block mt-1 p-2 rounded text-xs whitespace-pre-wrap", styles.code)}>
{`SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret`}
              </code>
            </li>
            <li>Click the Connect button above to authorize</li>
          </ol>
          <p className={cn("text-xs", styles.text)}>
            Note: This displays your currently playing track from any Spotify client (desktop, mobile, or web).
          </p>
        </div>
      )}
    </div>
  )
}
