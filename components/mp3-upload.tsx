"use client"

import { useRef, useState, useCallback } from "react"
import { Upload, Music, FileText, X, Type } from "lucide-react"
import { usePlayer, type Track, type LyricLine } from "@/contexts/player-context"
import { useAlbumGallery } from "@/hooks/use-album-gallery"
import { cn } from "@/lib/utils"
import { extractAudioMetadata } from "@/lib/audio-metadata"

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
  // For plain text, we'll just return static lyrics without timestamps
  return lines.map((text, index) => ({
    time: index * 5, // Rough timing, 5 seconds per line
    text: text.trim(),
  }))
}

export function MP3Upload() {
  const { theme, addToQueue, queue, currentTrack, setTrackLyrics, setTrackArtwork } = usePlayer()
  const { addCover } = useAlbumGallery()
  const [isDragging, setIsDragging] = useState(false)
  const [pendingTrack, setPendingTrack] = useState<Track | null>(null)
  const [pastedLyrics, setPastedLyrics] = useState("")
  const [showPasteArea, setShowPasteArea] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const lyricsInputRef = useRef<HTMLInputElement>(null)

  const themeStyles: Record<string, {
    container: string
    containerDrag: string
    text: string
    textHighlight: string
    icon: string
    queueItem: string
  }> = {
    black: {
      container: "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600",
      containerDrag: "border-white bg-zinc-800",
      text: "text-zinc-400",
      textHighlight: "text-white",
      icon: "text-zinc-500",
      queueItem: "bg-zinc-800 hover:bg-zinc-700",
    },
    pink: {
      container: "border-pink-300 bg-pink-50 hover:bg-pink-100 hover:border-pink-400",
      containerDrag: "border-pink-500 bg-pink-100",
      text: "text-pink-600",
      textHighlight: "text-pink-700",
      icon: "text-pink-400",
      queueItem: "bg-pink-50 hover:bg-pink-100",
    },
    coding: {
      container: "border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 hover:border-purple-500/50",
      containerDrag: "border-cyan-400 bg-purple-900/50",
      text: "text-purple-400",
      textHighlight: "text-cyan-400",
      icon: "text-purple-500",
      queueItem: "bg-purple-900/30 hover:bg-purple-900/50",
    },
    maroon: {
      container: "border-amber-800/50 bg-amber-900/20 hover:bg-amber-900/40 hover:border-amber-700",
      containerDrag: "border-amber-400 bg-amber-900/50",
      text: "text-amber-400",
      textHighlight: "text-amber-300",
      icon: "text-amber-600",
      queueItem: "bg-amber-900/20 hover:bg-amber-900/40",
    },
    galaxy: {
      container: "border-indigo-500/30 bg-indigo-900/20 hover:bg-indigo-900/40 hover:border-indigo-500/50",
      containerDrag: "border-indigo-400 bg-indigo-900/50",
      text: "text-indigo-400",
      textHighlight: "text-indigo-200",
      icon: "text-indigo-500",
      queueItem: "bg-indigo-900/30 hover:bg-indigo-900/50",
    },
    flame: {
      container: "border-orange-500/30 bg-orange-900/20 hover:bg-orange-900/40 hover:border-orange-500/50",
      containerDrag: "border-orange-400 bg-orange-900/50",
      text: "text-orange-400",
      textHighlight: "text-orange-200",
      icon: "text-orange-500",
      queueItem: "bg-orange-900/30 hover:bg-orange-900/50",
    },
    blood: {
      container: "border-red-800/30 bg-red-900/20 hover:bg-red-900/40 hover:border-red-700/50",
      containerDrag: "border-red-500 bg-red-900/50",
      text: "text-red-400",
      textHighlight: "text-red-200",
      icon: "text-red-500",
      queueItem: "bg-red-900/30 hover:bg-red-900/50",
    },
    nightcity: {
      container: "border-purple-500/30 bg-purple-900/20 hover:bg-purple-900/40 hover:border-purple-500/50",
      containerDrag: "border-cyan-400 bg-purple-900/50",
      text: "text-purple-400",
      textHighlight: "text-cyan-300",
      icon: "text-purple-500",
      queueItem: "bg-purple-900/30 hover:bg-purple-900/50",
    },
    gothic: {
      container: "border-purple-900/40 bg-purple-950/20 hover:bg-purple-950/40 hover:border-purple-800/50",
      containerDrag: "border-purple-400 bg-purple-950/50",
      text: "text-purple-400",
      textHighlight: "text-purple-200",
      icon: "text-purple-600",
      queueItem: "bg-purple-950/30 hover:bg-purple-950/50",
    },
    vintage: {
      container: "border-amber-700/40 bg-amber-900/20 hover:bg-amber-900/40 hover:border-amber-600/50",
      containerDrag: "border-amber-400 bg-amber-900/50",
      text: "text-amber-400",
      textHighlight: "text-amber-200",
      icon: "text-amber-600",
      queueItem: "bg-amber-900/30 hover:bg-amber-900/50",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }, [])

  const processAudioFile = useCallback(
    async (file: File) => {
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

      // Extract metadata from audio file
      try {
        const metadata = await extractAudioMetadata(file)
        if (metadata.title) track.title = metadata.title
        if (metadata.artist) track.artist = metadata.artist
        if (metadata.artwork) track.albumArt = metadata.artwork
      } catch (error) {
        console.log("[v0] Could not extract metadata:", error)
      }

      // Always use addToQueue for consistency — it handles playback and persistence
      addToQueue(track)
      
      // If artwork was extracted, update it in the context and save to gallery
      if (track.albumArt) {
        setTrackArtwork(track.albumArt)
        addCover(track.albumArt)
      }
    },
    [addToQueue, setTrackArtwork, addCover]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const audioFiles = files.filter((file) =>
        file.type.startsWith("audio/") || file.name.endsWith(".mp3")
      )

      audioFiles.forEach(processAudioFile)
    },
    [processAudioFile]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      files.forEach(processAudioFile)
      if (audioInputRef.current) {
        audioInputRef.current.value = ""
      }
    },
    [processAudioFile]
  )

  const handleLyricsSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !pendingTrack) return

      const content = await file.text()
      let lyrics: LyricLine[]

      if (file.name.endsWith(".lrc")) {
        lyrics = parseLRC(content)
      } else {
        lyrics = parseTXT(content)
      }

      const trackWithLyrics: Track = {
        ...pendingTrack,
        lyrics,
      }

      playTrack(trackWithLyrics)
      setPendingTrack(null)

      if (lyricsInputRef.current) {
        lyricsInputRef.current.value = ""
      }
    },
    [pendingTrack, addToQueue, setTrackArtwork]
  )

  // Handle pasted lyrics
  const handlePasteLyrics = useCallback(() => {
    if (!pastedLyrics.trim()) return
    if (!currentTrack) {
      console.log("[v0] No current track to add lyrics to")
      return
    }

    // Check if it looks like LRC format
    const isLRC = pastedLyrics.includes("[") && /\[\d{2}:\d{2}/.test(pastedLyrics)
    const lyrics = isLRC ? parseLRC(pastedLyrics) : parseTXT(pastedLyrics)

    console.log("[v0] Applying lyrics:", { count: lyrics.length, isLRC, trackId: currentTrack.id })

    if (lyrics.length > 0) {
      setTrackLyrics(lyrics, isLRC ? "lrc" : "plain")
      setPastedLyrics("")
      setShowPasteArea(false)
    }
  }, [pastedLyrics, setTrackLyrics, currentTrack])

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => audioInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300",
          isDragging ? styles.containerDrag : styles.container
        )}
      >
        <Upload className={cn("w-8 h-8", styles.icon)} />
        <div className="text-center">
          <p className={cn("font-medium", styles.textHighlight)}>
            Drop MP3 files here
          </p>
          <p className={cn("text-sm", styles.text)}>
            or click to browse
          </p>
        </div>
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*,.mp3"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Lyrics upload */}
      <div
        onClick={() => lyricsInputRef.current?.click()}
        className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed cursor-pointer transition-all duration-300",
          styles.container
        )}
      >
        <FileText className={cn("w-4 h-4", styles.icon)} />
        <p className={cn("text-sm", styles.text)}>
          Upload LRC or TXT lyrics
        </p>
        <input
          ref={lyricsInputRef}
          type="file"
          accept=".lrc,.txt"
          onChange={handleLyricsSelect}
          className="hidden"
        />
      </div>

      {/* Paste Your Lyrics section */}
      <div className="space-y-2">
        <button
          onClick={() => setShowPasteArea(!showPasteArea)}
          className={cn(
            "w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed cursor-pointer transition-all duration-300",
            styles.container
          )}
        >
          <Type className={cn("w-4 h-4", styles.icon)} />
          <p className={cn("text-sm", styles.text)}>
            Paste Your Lyrics
          </p>
        </button>

        {showPasteArea && (
          <div className={cn(
            "space-y-3 p-4 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-top-2",
            styles.container.replace("border-dashed", "")
          )}>
            <textarea
              value={pastedLyrics}
              onChange={(e) => setPastedLyrics(e.target.value)}
              placeholder="Paste lyrics here..."
              className={cn(
                "w-full h-32 p-3 rounded-lg resize-none text-sm transition-all duration-300",
                "bg-black/20 backdrop-blur-sm border focus:outline-none focus:ring-2",
                theme === "pink" 
                  ? "border-pink-300/40 focus:ring-pink-400/50 text-pink-800 placeholder:text-pink-400/60"
                  : "border-white/10 focus:ring-white/20 text-white placeholder:text-white/40"
              )}
            />
            <div className="flex gap-2">
              <button
                onClick={handlePasteLyrics}
                disabled={!pastedLyrics.trim()}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300",
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
                  "py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300",
                  theme === "pink"
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                )}
              >
                Cancel
              </button>
            </div>
            <p className={cn("text-xs opacity-60", styles.text)}>
              Supports plain text or LRC format with timestamps
            </p>
          </div>
        )}
      </div>

      {/* Queue preview with upload another song button */}
      {queue.length > 0 && (
        <div className="space-y-2">
          <p className={cn("text-xs uppercase tracking-wider font-medium", styles.text)}>
            Queue ({queue.length})
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {queue.slice(0, 5).map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg transition-colors",
                  styles.queueItem
                )}
              >
                <Music className={cn("w-4 h-4 flex-shrink-0", styles.icon)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate", styles.textHighlight)}>
                    {track.title}
                  </p>
                  <p className={cn("text-xs truncate", styles.text)}>
                    {track.artist}
                  </p>
                </div>
                <span className={cn("text-xs", styles.text)}>
                  #{index + 1}
                </span>
              </div>
            ))}
            {queue.length > 5 && (
              <p className={cn("text-xs text-center py-1", styles.text)}>
                +{queue.length - 5} more
              </p>
            )}
          </div>

          {/* Upload Another Song button */}
          <button
            onClick={() => audioInputRef.current?.click()}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed cursor-pointer transition-all duration-300 mt-3",
              styles.container
            )}
          >
            <Upload className={cn("w-4 h-4", styles.icon)} />
            <p className={cn("text-sm", styles.text)}>
              Upload Another Song
            </p>
          </button>
        </div>
      )}
    </div>
  )
}
