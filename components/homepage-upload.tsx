"use client"

import { useRef, useState } from "react"
import { Music, FolderOpen } from "lucide-react"
import { usePlayer, type Track } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import { extractAudioMetadata } from "@/lib/audio-metadata"
import { PlaylistMergeModal } from "./playlist-merge-modal"

export function HomepageUpload() {
  const { theme, playTrack, addToQueue, setQueue, queue } = usePlayer()
  const audioInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [pendingFolderTracks, setPendingFolderTracks] = useState<Track[]>([])

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
      .sort((a, b) => a.name.localeCompare(b.name))

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
  }

  const handleMergePlaylist = () => {
    pendingFolderTracks.forEach((track) => {
      if (!isDuplicateTrack(track.title, track.artist)) {
        addToQueue(track)
      }
    })
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  const handleReplacePlaylist = () => {
    if (pendingFolderTracks.length > 0) {
      // Replace the entire queue with pending tracks
      setQueue(pendingFolderTracks, 0)
      // Ensure playback starts on first track
      if (pendingFolderTracks[0].url) {
        playTrack(pendingFolderTracks[0])
      }
    }
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  const handleCancelMerge = () => {
    setPendingFolderTracks([])
    setShowMergeModal(false)
  }

  // Theme-specific styles for cards
  const cardStyles: Record<string, {
    container: string
    border: string
    bg: string
    hover: string
    text: string
    subtext: string
    icon: string
  }> = {
    black: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-zinc-700",
      bg: "bg-zinc-800/40",
      hover: "hover:bg-zinc-800/60 hover:border-zinc-600",
      text: "text-white",
      subtext: "text-zinc-400",
      icon: "text-zinc-500",
    },
    pink: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-pink-300",
      bg: "bg-pink-50/40",
      hover: "hover:bg-pink-100/60 hover:border-pink-400",
      text: "text-pink-900",
      subtext: "text-pink-600",
      icon: "text-pink-500",
    },
    coding: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-purple-500/30",
      bg: "bg-purple-900/20",
      hover: "hover:bg-purple-900/40 hover:border-purple-500/50",
      text: "text-purple-100",
      subtext: "text-purple-400",
      icon: "text-cyan-400",
    },
    maroon: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-amber-800/50",
      bg: "bg-amber-900/20",
      hover: "hover:bg-amber-900/40 hover:border-amber-700",
      text: "text-amber-100",
      subtext: "text-amber-400",
      icon: "text-amber-500",
    },
    galaxy: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-indigo-500/30",
      bg: "bg-indigo-900/20",
      hover: "hover:bg-indigo-900/40 hover:border-indigo-500/50",
      text: "text-indigo-100",
      subtext: "text-indigo-400",
      icon: "text-indigo-300",
    },
    flame: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-orange-500/30",
      bg: "bg-orange-900/20",
      hover: "hover:bg-orange-900/40 hover:border-orange-500/50",
      text: "text-orange-100",
      subtext: "text-orange-400",
      icon: "text-orange-300",
    },
    blood: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-red-800/50",
      bg: "bg-red-900/20",
      hover: "hover:bg-red-900/40 hover:border-red-700",
      text: "text-red-100",
      subtext: "text-red-400",
      icon: "text-red-500",
    },
    nightcity: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-purple-500/30",
      bg: "bg-purple-900/20",
      hover: "hover:bg-purple-900/40 hover:border-purple-500/50",
      text: "text-cyan-100",
      subtext: "text-cyan-400",
      icon: "text-cyan-300",
    },
    gothic: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-purple-900/40",
      bg: "bg-purple-950/20",
      hover: "hover:bg-purple-950/40 hover:border-purple-700",
      text: "text-purple-100",
      subtext: "text-purple-400",
      icon: "text-purple-300",
    },
    vintage: {
      container: "rounded-xl border backdrop-blur-md",
      border: "border-amber-700/40",
      bg: "bg-amber-900/20",
      hover: "hover:bg-amber-900/40 hover:border-amber-700",
      text: "text-amber-100",
      subtext: "text-amber-400",
      icon: "text-amber-500",
    },
  }

  const styles = cardStyles[theme] || cardStyles.black

  return (
    <>
      {/* Two-card upload layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Upload MP3 Card */}
        <button
          onClick={() => audioInputRef.current?.click()}
          className={cn(
            styles.container,
            styles.border,
            styles.bg,
            styles.hover,
            "p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group"
          )}
        >
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*,.mp3"
            multiple
            onChange={handleUploadSong}
            className="hidden"
          />
          
          <div className={cn("p-4 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-300")}>
            <Music className={cn("w-10 h-10", styles.icon)} />
          </div>
          
          <div className="text-center">
            <h3 className={cn("text-lg font-semibold mb-2", styles.text)}>
              Upload MP3
            </h3>
            <p className={cn("text-sm", styles.subtext)}>
              Single song upload
            </p>
          </div>
        </button>

        {/* Select Folder Card */}
        <button
          onClick={() => folderInputRef.current?.click()}
          className={cn(
            styles.container,
            styles.border,
            styles.bg,
            styles.hover,
            "p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer group"
          )}
        >
          <input
            ref={folderInputRef}
            type="file"
            webkitdirectory="true"
            mozdirectory="true"
            multiple
            onChange={handleSelectFolder}
            className="hidden"
          />
          
          <div className={cn("p-4 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-300")}>
            <FolderOpen className={cn("w-10 h-10", styles.icon)} />
          </div>
          
          <div className="text-center">
            <h3 className={cn("text-lg font-semibold mb-2", styles.text)}>
              Select Folder as Playlist
            </h3>
            <p className={cn("text-sm", styles.subtext)}>
              Import music folder
            </p>
          </div>
        </button>
      </div>

      {/* Merge/Replace Modal */}
      <PlaylistMergeModal
        isOpen={showMergeModal}
        onMerge={handleMergePlaylist}
        onReplace={handleReplacePlaylist}
        onCancel={handleCancelMerge}
        newPlaylistCount={pendingFolderTracks.length}
      />
    </>
  )
}
