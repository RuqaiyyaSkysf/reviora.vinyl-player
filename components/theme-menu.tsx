"use client"

import { useState, useRef } from "react"
import { MoreHorizontal, Check, Disc, MessageSquareText, ListMusic, LayoutGrid, Music, Image, Upload, X, Plus, Minus, FolderOpen } from "lucide-react"
import { usePlayer, type Theme, type ViewMode, type VinylStyle, type Track } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import { PlaylistMergeModal } from "./playlist-merge-modal"

const themes: { id: Theme; name: string; description: string; colors: string }[] = [
  {
    id: "black",
    name: "Black",
    description: "Matte black, subtle grey",
    colors: "bg-zinc-900",
  },
  {
    id: "pink",
    name: "Baby Pink",
    description: "Soft blush to rose gradient",
    colors: "bg-gradient-to-br from-pink-200 to-rose-300",
  },
  {
    id: "coding",
    name: "Coding Vibe",
    description: "Purple/blue neon",
    colors: "bg-gradient-to-r from-purple-600 to-blue-600",
  },
  {
    id: "maroon",
    name: "Maroon",
    description: "Deep maroon, gold accents",
    colors: "bg-amber-900",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    description: "Deep space, shooting stars",
    colors: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
  },
  {
    id: "flame",
    name: "Flame",
    description: "Animated flames, embers",
    colors: "bg-gradient-to-t from-orange-600 via-red-700 to-red-900",
  },
  {
    id: "blood",
    name: "Blood Red",
    description: "Dark crimson, black accents",
    colors: "bg-gradient-to-br from-red-950 to-red-900",
  },
  {
    id: "nightcity",
    name: "Night City",
    description: "Cyberpunk skyline, neon glow",
    colors: "bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900",
  },
  {
    id: "gothic",
    name: "Gothic",
    description: "Dark castle, moonlit night",
    colors: "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Royal palace, warm candlelight",
    colors: "bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-950",
  },
]

const viewModes: { id: ViewMode; name: string; description: string; icon: typeof Disc }[] = [
  {
    id: "vinyl-only",
    name: "Vinyl Only",
    description: "Focused playback view",
    icon: Disc,
  },
  {
    id: "vinyl-lyrics",
    name: "Vinyl + Lyrics",
    description: "Show lyrics panel",
    icon: MessageSquareText,
  },
  {
    id: "vinyl-playlist",
    name: "Vinyl + Playlist",
    description: "Show playlist panel",
    icon: ListMusic,
  },
  {
    id: "vinyl-playlist-lyrics",
    name: "Full View",
    description: "Playlist and lyrics",
    icon: LayoutGrid,
  },
]

const vinylStyles: { id: VinylStyle; name: string; description: string }[] = [
  {
    id: "vinyl-blurred",
    name: "Vinyl + Blurred Background",
    description: "With glassmorphism panel",
  },
  {
    id: "vinyl-minimal",
    name: "Only Vinyl",
    description: "Minimal, immersive view",
  },
]

export function ThemeMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLyricsOptions, setShowLyricsOptions] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [pendingFolderTracks, setPendingFolderTracks] = useState<Track[]>([])
  const audioInputRef = useRef<HTMLInputElement>(null)
  const artworkInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const { theme, setTheme, viewMode, setViewMode, currentTrack, addToQueue, playTrack, setTrackArtwork, queue, setQueue, clearQueue, vinylStyle, setVinylStyle, vinylSize, setVinylSize, lyricsPanelOffset, setLyricsPanelOffset, vinylPlayerOffset, setVinylPlayerOffset } = usePlayer()

  const themeButtonStyles: Record<Theme, string> = {
    black: "text-zinc-400 hover:text-white hover:bg-zinc-800",
    pink: "text-pink-600 hover:text-pink-800 hover:bg-pink-200",
    coding: "text-purple-400 hover:text-purple-200 hover:bg-purple-900/50",
    maroon: "text-amber-400 hover:text-amber-200 hover:bg-amber-900/50",
    galaxy: "text-indigo-400 hover:text-indigo-200 hover:bg-indigo-900/50",
    flame: "text-orange-400 hover:text-orange-200 hover:bg-orange-900/50",
    blood: "text-red-400 hover:text-red-200 hover:bg-red-900/50",
    nightcity: "text-purple-400 hover:text-cyan-300 hover:bg-purple-900/50",
    gothic: "text-purple-300 hover:text-purple-100 hover:bg-purple-950/50",
    vintage: "text-amber-300 hover:text-amber-100 hover:bg-amber-900/50",
  }

  const menuStyles: Record<Theme, string> = {
    black: "bg-zinc-900 border-zinc-800",
    pink: "bg-white border-pink-200 shadow-pink-100",
    coding: "bg-zinc-900/95 border-purple-500/30 backdrop-blur-xl",
    maroon: "bg-zinc-900 border-amber-800/50",
    galaxy: "bg-indigo-950/95 border-indigo-500/30 backdrop-blur-xl",
    flame: "bg-zinc-950/95 border-orange-500/30 backdrop-blur-xl",
    blood: "bg-zinc-950/95 border-red-900/50 backdrop-blur-xl",
    nightcity: "bg-zinc-950/95 border-purple-500/30 backdrop-blur-xl",
    gothic: "bg-slate-950/95 border-purple-900/40 backdrop-blur-xl",
    vintage: "bg-amber-950/95 border-amber-700/40 backdrop-blur-xl",
  }

  const itemStyles: Record<Theme, string> = {
    black: "hover:bg-zinc-800 text-white",
    pink: "hover:bg-pink-50 text-zinc-800",
    coding: "hover:bg-purple-900/50 text-white",
    maroon: "hover:bg-amber-900/30 text-amber-100",
    galaxy: "hover:bg-indigo-900/50 text-indigo-100",
    flame: "hover:bg-orange-900/30 text-orange-100",
    blood: "hover:bg-red-900/30 text-red-100",
    nightcity: "hover:bg-purple-900/50 text-purple-100",
    gothic: "hover:bg-purple-950/50 text-purple-100",
    vintage: "hover:bg-amber-900/40 text-amber-100",
  }

  const checkColors: Record<Theme, string> = {
    black: "text-white",
    pink: "text-pink-500",
    coding: "text-cyan-400",
    maroon: "text-amber-400",
    galaxy: "text-indigo-400",
    flame: "text-orange-400",
    blood: "text-red-400",
    nightcity: "text-cyan-400",
    gothic: "text-purple-400",
    vintage: "text-amber-400",
  }

  // Helper: Check if track already exists in queue by title
  const isDuplicateTrack = (title: string, artist: string): boolean => {
    return queue.some((t) => t.title === title && t.artist === artist)
  }

  // Helper: Filter out duplicates from tracks
  const filterDuplicates = (tracks: Track[]): Track[] => {
    return tracks.filter((t) => !isDuplicateTrack(t.title, t.artist))
  }

  const handleUploadSong = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validTracks: Track[] = []
    
    files.forEach((file) => {
      if (file.type.startsWith("audio/") || file.name.endsWith(".mp3")) {
        const url = URL.createObjectURL(file)
        const title = file.name.replace(/\.[^/.]+$/, "")
        
        // Skip if this track is already in the queue
        if (isDuplicateTrack(title, "Local File")) {
          console.log(`[v0] Skipping duplicate: ${title}`)
          return
        }

        const track: Track = {
          id: `local-${Date.now()}-${Math.random()}`,
          title,
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

        validTracks.push(track)
      }
    })
    
    // Play first track, queue the rest
    if (validTracks.length > 0) {
      playTrack(validTracks[0])
      validTracks.slice(1).forEach((track) => {
        addToQueue(track)
      })
    }
    
    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
    setIsOpen(false)
  }

  const handleSelectFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Filter supported audio formats in natural folder order
    const supportedFormats = [".mp3", ".wav", ".m4a", ".ogg"]
    const audioFiles = files
      .filter((file) => {
        const ext = file.name.toLowerCase().slice(-4)
        return supportedFormats.includes(ext)
      })
      .sort((a, b) => a.name.localeCompare(b.name)) // Preserve alphabetical order

    if (audioFiles.length === 0) {
      console.log("[v0] No supported audio files found in folder")
      return
    }

    // Create Track objects from files
    const newTracks: Track[] = audioFiles.map((file) => {
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

      return track
    })

    // Filter out duplicates from new tracks
    const uniqueNewTracks = filterDuplicates(newTracks)

    if (uniqueNewTracks.length === 0) {
      console.log("[v0] All tracks are duplicates")
      return
    }

    // If playlist already exists, show merge/replace modal
    if (queue.length > 0) {
      setPendingFolderTracks(uniqueNewTracks)
      setShowMergeModal(true)
    } else {
      // If no existing playlist, just load the new one
      playTrack(uniqueNewTracks[0])
      uniqueNewTracks.slice(1).forEach((track) => {
        addToQueue(track)
      })
    }

    if (folderInputRef.current) {
      folderInputRef.current.value = ""
    }
    setIsOpen(false)
  }

  const handleMergePlaylist = () => {
    // Add unique tracks to existing queue
    pendingFolderTracks.forEach((track) => {
      if (!isDuplicateTrack(track.title, track.artist)) {
        addToQueue(track)
      }
    })
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  const handleReplacePlaylist = () => {
    // Clear existing queue and load new playlist
    clearQueue()
    if (pendingFolderTracks.length > 0) {
      playTrack(pendingFolderTracks[0])
      pendingFolderTracks.slice(1).forEach((track) => {
        addToQueue(track)
      })
    }
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  const handleCancelMerge = () => {
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  const handleUploadArtwork = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && currentTrack) {
      const url = URL.createObjectURL(file)
      setTrackArtwork(url)
      console.log("[v0] Artwork uploaded:", url)
    }
    if (artworkInputRef.current) {
      artworkInputRef.current.value = ""
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full transition-all duration-300",
          themeButtonStyles[theme]
        )}
        aria-label="Theme menu"
      >
        <MoreHorizontal className="w-6 h-6" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-12 w-64 rounded-xl border shadow-2xl z-50 overflow-hidden transition-all duration-300 max-h-[70vh] overflow-y-auto",
              menuStyles[theme]
            )}
          >
            {/* Hidden file inputs */}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*,.mp3"
              multiple
              onChange={handleUploadSong}
              className="hidden"
            />
            <input
              ref={artworkInputRef}
              type="file"
              accept="image/*"
              onChange={handleUploadArtwork}
              className="hidden"
            />
            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory="true"
              mozdirectory="true"
              multiple
              onChange={handleSelectFolder}
              className="hidden"
            />

            <div className="p-3">
              {/* View Mode Section */}
              <p className={cn(
                "text-xs font-medium mb-3 uppercase tracking-wider",
                theme === "pink" ? "text-pink-600" : "text-zinc-500"
              )}>
                View Mode
              </p>
              <div className="space-y-1 mb-4">
                {viewModes.map((v) => {
                  const Icon = v.icon
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setViewMode(v.id)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        viewMode === v.id 
                          ? theme === "pink" 
                            ? "bg-pink-200" 
                            : "bg-white/10" 
                          : theme === "pink" 
                            ? "bg-pink-50" 
                            : "bg-white/5"
                      )}>
                        <Icon className={cn("w-4 h-4", checkColors[theme])} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">{v.name}</p>
                        <p className={cn(
                          "text-xs",
                          theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          {v.description}
                        </p>
                      </div>
                      {viewMode === v.id && (
                        <Check className={cn("w-4 h-4", checkColors[theme])} />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className={cn(
                "border-t mb-4",
                theme === "pink" ? "border-pink-200" : "border-white/10"
              )} />

              {/* Lyrics & Media Controls Section */}
              {currentTrack && (
                <>
                  <p className={cn(
                    "text-xs font-medium mb-3 uppercase tracking-wider",
                    theme === "pink" ? "text-pink-600" : "text-zinc-500"
                  )}>
                    Lyrics & Media
                  </p>
                  <div className="space-y-1 mb-4">
                    <button
                      onClick={() => setShowLyricsOptions(!showLyricsOptions)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        theme === "pink" ? "bg-pink-50" : "bg-white/5"
                      )}>
                        <MessageSquareText className={cn("w-4 h-4", checkColors[theme])} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">Lyrics</p>
                        <p className={cn(
                          "text-xs",
                          theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          Upload, paste, or manage
                        </p>
                      </div>
                    </button>

                    {showLyricsOptions && (
                      <div className="pl-4 space-y-1 mt-1">
                        <button
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm",
                            itemStyles[theme]
                          )}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Lyrics
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm",
                            itemStyles[theme]
                          )}
                        >
                          <MessageSquareText className="w-4 h-4" />
                          Paste Lyrics
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => audioInputRef.current?.click()}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        theme === "pink" ? "bg-pink-50" : "bg-white/5"
                      )}>
                        <Music className={cn("w-4 h-4", checkColors[theme])} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">Upload Song</p>
                        <p className={cn(
                          "text-xs",
                          theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          Add to queue
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => folderInputRef.current?.click()}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        theme === "pink" ? "bg-pink-50" : "bg-white/5"
                      )}>
                        <FolderOpen className={cn("w-4 h-4", checkColors[theme])} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">Select Folder as Playlist</p>
                        <p className={cn(
                          "text-xs",
                          theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          Import music folder
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => artworkInputRef.current?.click()}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        theme === "pink" ? "bg-pink-50" : "bg-white/5"
                      )}>
                        <Image className={cn("w-4 h-4", checkColors[theme])} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">
                          {currentTrack?.albumArt ? "Replace Artwork" : "Add Artwork"}
                        </p>
                        <p className={cn(
                          "text-xs",
                          theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                        )}>
                          {currentTrack?.albumArt ? "Upload new album art" : "Upload album art"}
                        </p>
                      </div>
                    </button>

                    {currentTrack?.albumArt && (
                      <button
                        onClick={() => {
                          setTrackArtwork(null)
                          setIsOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                          itemStyles[theme]
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          theme === "pink" ? "bg-pink-50" : "bg-white/5"
                        )}>
                          <X className={cn("w-4 h-4", checkColors[theme])} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">Remove Artwork</p>
                          <p className={cn(
                            "text-xs",
                            theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                          )}>
                            Revert to default vinyl
                          </p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "border-t mb-4",
                    theme === "pink" ? "border-pink-200" : "border-white/10"
                  )} />

                  {/* Move Lyrics Panel Section */}
                  <p className={cn(
                    "text-xs font-medium mb-3 uppercase tracking-wider",
                    theme === "pink" ? "text-pink-600" : "text-zinc-500"
                  )}>
                    Move Lyrics Panel
                  </p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setLyricsPanelOffset(Math.max(-60, lyricsPanelOffset - 12))}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm font-medium",
                        itemStyles[theme]
                      )}
                    >
                      ← Left
                    </button>
                    <button
                      onClick={() => setLyricsPanelOffset(Math.min(60, lyricsPanelOffset + 12))}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm font-medium",
                        itemStyles[theme]
                      )}
                    >
                      Right →
                    </button>
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "border-t mb-4",
                    theme === "pink" ? "border-pink-200" : "border-white/10"
                  )} />

                  {/* Move Vinyl Player Section */}
                  <p className={cn(
                    "text-xs font-medium mb-3 uppercase tracking-wider",
                    theme === "pink" ? "text-pink-600" : "text-zinc-500"
                  )}>
                    Move Vinyl Player
                  </p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setVinylPlayerOffset(Math.max(-48, vinylPlayerOffset - 12))}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm font-medium",
                        itemStyles[theme]
                      )}
                    >
                      ← Left
                    </button>
                    <button
                      onClick={() => setVinylPlayerOffset(Math.min(48, vinylPlayerOffset + 12))}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 text-sm font-medium",
                        itemStyles[theme]
                      )}
                    >
                      Right →
                    </button>
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    "border-t mb-4",
                    theme === "pink" ? "border-pink-200" : "border-white/10"
                  )} />
                </>
              )}

              {/* Vinyl Style Section */}
              <p className={cn(
                "text-xs font-medium mb-3 uppercase tracking-wider",
                theme === "pink" ? "text-pink-600" : "text-zinc-500"
              )}>
                Choose Vinyl Type
              </p>
              <div className="space-y-1 mb-4">
                {vinylStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setVinylStyle(style.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                      itemStyles[theme]
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      vinylStyle === style.id
                        ? theme === "pink"
                          ? "bg-pink-200"
                          : "bg-white/10"
                        : theme === "pink"
                          ? "bg-pink-50"
                          : "bg-white/5"
                    )}>
                      <Disc className={cn("w-4 h-4", checkColors[theme])} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{style.name}</p>
                      <p className={cn(
                        "text-xs",
                        theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                      )}>
                        {style.description}
                      </p>
                    </div>
                    {vinylStyle === style.id && (
                      <Check className={cn("w-4 h-4", checkColors[theme])} />
                    )}
                  </button>
                ))}
              </div>

              {/* Vinyl Size Controls (only when minimal vinyl is selected) */}
              {vinylStyle === "vinyl-minimal" && (
                <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className={cn(
                    "text-xs font-medium mb-2 uppercase tracking-wider",
                    theme === "pink" ? "text-pink-600" : "text-zinc-500"
                  )}>
                    Vinyl Size
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setVinylSize(Math.max(50, vinylSize - 10))}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={cn(
                      "text-sm font-medium",
                      theme === "pink" ? "text-pink-600" : "text-white/70"
                    )}>
                      {vinylSize}%
                    </span>
                    <button
                      onClick={() => setVinylSize(Math.min(150, vinylSize + 10))}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                        itemStyles[theme]
                      )}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Divider before theme section */}
              <div className={cn(
                "border-t mb-4",
                theme === "pink" ? "border-pink-200" : "border-white/10"
              )} />

              {/* Theme Section */}
              <p className={cn(
                "text-xs font-medium mb-3 uppercase tracking-wider",
                theme === "pink" ? "text-pink-600" : "text-zinc-500"
              )}>
                Choose Theme
              </p>
              <div className="space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                      itemStyles[theme]
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-full flex-shrink-0 shadow-inner", t.colors)} />
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className={cn(
                        "text-xs",
                        theme === "pink" ? "text-zinc-500" : "text-zinc-400"
                      )}>
                        {t.description}
                      </p>
                    </div>
                    {theme === t.id && (
                      <Check className={cn("w-4 h-4", checkColors[theme])} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <PlaylistMergeModal
        isOpen={showMergeModal}
        onMerge={handleMergePlaylist}
        onReplace={handleReplacePlaylist}
        onCancel={handleCancelMerge}
        newPlaylistCount={pendingFolderTracks.length}
      />
    </div>
  )
}
