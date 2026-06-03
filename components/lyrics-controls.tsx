"use client"

import { useRef, useState, useCallback } from "react"
import { Upload, Type, FileText } from "lucide-react"
import { usePlayer, type LyricLine } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

function parseLRC(content: string): LyricLine[] {
  const lines: LyricLine[] = []
  const regex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/g
  let match

  while ((match = regex.exec(content)) !== null) {
    const minutes = parseInt(match[1], 10)
    const seconds = parseInt(match[2], 10)
    const milliseconds = match[3] ? parseInt(match[3].padEnd(3, "0"), 10) : 0
    const time = minutes * 60 + seconds + milliseconds / 1000
    const text = match[4].trim()

    if (text) {
      lines.push({ time, text })
    }
  }

  return lines.sort((a, b) => a.time - b.time)
}

function parseTXT(content: string): LyricLine[] {
  const lines = content.split("\n").filter((line) => line.trim())
  return lines.map((text, index) => ({
    time: index * 5,
    text: text.trim(),
  }))
}

interface LyricsControlsProps {
  compact?: boolean
  className?: string
}

export function LyricsControls({ compact = false, className }: LyricsControlsProps) {
  const { theme, currentTrack, setTrackLyrics } = usePlayer()
  const [showPasteArea, setShowPasteArea] = useState(false)
  const [pastedLyrics, setPastedLyrics] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const themeStyles: Record<string, {
    button: string
    buttonHover: string
    text: string
    container: string
  }> = {
    black: {
      button: "text-white/70 border-white/20 bg-white/5",
      buttonHover: "hover:bg-white/10 hover:border-white/30",
      text: "text-white/60",
      container: "bg-zinc-900/80 border-white/10",
    },
    pink: {
      button: "text-pink-600 border-pink-300/40 bg-white/30",
      buttonHover: "hover:bg-white/50 hover:border-pink-400/50",
      text: "text-pink-600",
      container: "bg-pink-50/80 border-pink-200/40",
    },
    coding: {
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40",
      text: "text-purple-400",
      container: "bg-purple-950/80 border-purple-400/20",
    },
    maroon: {
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40",
      text: "text-amber-400",
      container: "bg-amber-950/80 border-amber-500/20",
    },
    galaxy: {
      button: "text-purple-300 border-indigo-400/30 bg-indigo-900/20",
      buttonHover: "hover:bg-indigo-900/40 hover:border-purple-400/40",
      text: "text-indigo-400",
      container: "bg-indigo-950/80 border-indigo-400/20",
    },
    flame: {
      button: "text-orange-400 border-orange-500/30 bg-orange-900/20",
      buttonHover: "hover:bg-orange-900/40 hover:border-orange-400/40",
      text: "text-orange-400",
      container: "bg-orange-950/80 border-orange-500/20",
    },
    blood: {
      button: "text-red-400 border-red-500/30 bg-red-900/20",
      buttonHover: "hover:bg-red-900/40 hover:border-red-400/40",
      text: "text-red-400",
      container: "bg-red-950/80 border-red-500/20",
    },
    nightcity: {
      button: "text-cyan-400 border-purple-400/30 bg-purple-900/20",
      buttonHover: "hover:bg-purple-900/40 hover:border-cyan-400/40",
      text: "text-purple-400",
      container: "bg-purple-950/80 border-purple-400/20",
    },
    gothic: {
      button: "text-purple-300 border-purple-500/30 bg-purple-950/20",
      buttonHover: "hover:bg-purple-950/40 hover:border-purple-400/40",
      text: "text-purple-400",
      container: "bg-slate-950/80 border-purple-500/20",
    },
    vintage: {
      button: "text-amber-400 border-amber-500/30 bg-amber-900/20",
      buttonHover: "hover:bg-amber-900/40 hover:border-amber-400/40",
      text: "text-amber-400",
      container: "bg-amber-950/80 border-amber-500/20",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file || !currentTrack) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (!content) return

        const isLRC = file.name.endsWith(".lrc")
        const lyrics = isLRC ? parseLRC(content) : parseTXT(content)

        if (lyrics.length > 0) {
          setTrackLyrics(lyrics, isLRC ? "lrc" : "plain")
        }
      }
      reader.readAsText(file)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [currentTrack, setTrackLyrics]
  )

  const handlePasteLyrics = useCallback(() => {
    if (!pastedLyrics.trim() || !currentTrack) {
      console.log("[v0] Cannot paste lyrics - missing current track or empty lyrics")
      return
    }

    const isLRC = pastedLyrics.includes("[") && /\[\d{2}:\d{2}/.test(pastedLyrics)
    const lyrics = isLRC ? parseLRC(pastedLyrics) : parseTXT(pastedLyrics)

    console.log("[v0] Pasting lyrics:", { count: lyrics.length, isLRC, trackId: currentTrack.id })

    if (lyrics.length > 0) {
      setTrackLyrics(lyrics, isLRC ? "lrc" : "plain")
      setPastedLyrics("")
      setShowPasteArea(false)
    } else {
      console.log("[v0] No lyrics parsed from input")
    }
  }, [pastedLyrics, currentTrack, setTrackLyrics])

  if (!currentTrack) return null

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".lrc,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {compact ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-sm text-xs font-medium transition-all duration-200",
              styles.button,
              styles.buttonHover
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
          <button
            onClick={() => setShowPasteArea(!showPasteArea)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-sm text-xs font-medium transition-all duration-200",
              styles.button,
              styles.buttonHover
            )}
          >
            <Type className="w-3.5 h-3.5" />
            Paste
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className={cn("text-xs uppercase tracking-wider font-medium mb-2", styles.text)}>
            Lyrics Controls
          </p>
          <div className={cn("h-px w-full opacity-30", theme === "pink" ? "bg-pink-300" : "bg-white")} />
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm text-sm font-medium transition-all duration-200",
                styles.button,
                styles.buttonHover
              )}
            >
              <Upload className="w-4 h-4" />
              Upload Lyrics
            </button>
            <button
              onClick={() => setShowPasteArea(!showPasteArea)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm text-sm font-medium transition-all duration-200",
                styles.button,
                styles.buttonHover
              )}
            >
              <Type className="w-4 h-4" />
              Paste Lyrics
            </button>
          </div>
        </div>
      )}

      {showPasteArea && (
        <div className={cn(
          "p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2",
          styles.container
        )}>
          <textarea
            value={pastedLyrics}
            onChange={(e) => setPastedLyrics(e.target.value)}
            placeholder="Paste lyrics here (LRC format with [MM:SS] timestamps or plain text)..."
            className={cn(
              "w-full h-24 p-2.5 rounded-lg resize-none text-sm transition-all duration-300",
              "bg-black/20 backdrop-blur-sm border focus:outline-none focus:ring-2",
              theme === "pink"
                ? "border-pink-300/40 focus:ring-pink-400/50 text-pink-800 placeholder:text-pink-400/60"
                : "border-white/10 focus:ring-white/20 text-white placeholder:text-white/40"
            )}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handlePasteLyrics}
              disabled={!pastedLyrics.trim()}
              className={cn(
                "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300",
                pastedLyrics.trim()
                  ? theme === "pink"
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              )}
            >
              Apply Lyrics
            </button>
            <button
              onClick={() => {
                setShowPasteArea(false)
                setPastedLyrics("")
              }}
              className={cn(
                "py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300",
                theme === "pink"
                  ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              )}
            >
              Cancel
            </button>
          </div>
          <p className={cn("text-xs mt-2 opacity-60", styles.text)}>
            Supports LRC format with [MM:SS] timestamps or plain text (one line per lyric)
          </p>
        </div>
      )}
    </div>
  )
}
