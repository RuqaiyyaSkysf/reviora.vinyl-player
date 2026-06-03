'use client'

import { usePlayer } from '@/contexts/player-context'
import { useAlbumGallery } from '@/hooks/use-album-gallery'
import { Trash2, Grid3x3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function RecentAlbumGallery() {
  const { theme, setTrackArtwork, currentTrack } = usePlayer()
  const { covers, removeCover, isLoaded } = useAlbumGallery()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isLoaded || covers.length === 0) {
    return null
  }

  const themeStyles: Record<
    string,
    {
      container: string
      header: string
      text: string
      subtext: string
      galleryBg: string
      coverBg: string
      coverHover: string
      buttonBg: string
      buttonText: string
      deleteBtn: string
      expandBtn: string
    }
  > = {
    black: {
      container: 'border-zinc-700 bg-zinc-800/40 backdrop-blur-md',
      header: 'text-white',
      text: 'text-zinc-300',
      subtext: 'text-zinc-500',
      galleryBg: 'bg-zinc-900/40',
      coverBg: 'border-zinc-600 bg-zinc-800/80',
      coverHover: 'hover:border-zinc-500 hover:bg-zinc-700/80',
      buttonBg: 'bg-white/10 hover:bg-white/20',
      buttonText: 'text-white',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-white/10 hover:bg-white/20 text-white',
    },
    pink: {
      container: 'border-pink-300/50 bg-pink-50/30 backdrop-blur-md',
      header: 'text-pink-900',
      text: 'text-pink-700',
      subtext: 'text-pink-600',
      galleryBg: 'bg-pink-100/20',
      coverBg: 'border-pink-200 bg-pink-50/60',
      coverHover: 'hover:border-pink-300 hover:bg-pink-100/80',
      buttonBg: 'bg-pink-200/30 hover:bg-pink-200/50',
      buttonText: 'text-pink-700',
      deleteBtn: 'bg-red-300/30 hover:bg-red-300/50 text-red-700',
      expandBtn: 'bg-pink-200/30 hover:bg-pink-200/50 text-pink-700',
    },
    coding: {
      container: 'border-purple-500/30 bg-purple-900/20 backdrop-blur-md',
      header: 'text-purple-100',
      text: 'text-purple-300',
      subtext: 'text-purple-400',
      galleryBg: 'bg-purple-900/30',
      coverBg: 'border-purple-500/50 bg-purple-900/50',
      coverHover: 'hover:border-purple-400 hover:bg-purple-900/70',
      buttonBg: 'bg-cyan-500/20 hover:bg-cyan-500/40',
      buttonText: 'text-cyan-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300',
    },
    maroon: {
      container: 'border-amber-800/50 bg-amber-900/20 backdrop-blur-md',
      header: 'text-amber-100',
      text: 'text-amber-300',
      subtext: 'text-amber-400',
      galleryBg: 'bg-amber-900/30',
      coverBg: 'border-amber-700/50 bg-amber-900/50',
      coverHover: 'hover:border-amber-600 hover:bg-amber-900/70',
      buttonBg: 'bg-amber-600/20 hover:bg-amber-600/40',
      buttonText: 'text-amber-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300',
    },
    galaxy: {
      container: 'border-indigo-500/30 bg-indigo-900/20 backdrop-blur-md',
      header: 'text-indigo-100',
      text: 'text-indigo-300',
      subtext: 'text-indigo-400',
      galleryBg: 'bg-indigo-900/30',
      coverBg: 'border-indigo-500/50 bg-indigo-900/50',
      coverHover: 'hover:border-indigo-400 hover:bg-indigo-900/70',
      buttonBg: 'bg-indigo-500/20 hover:bg-indigo-500/40',
      buttonText: 'text-indigo-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300',
    },
    flame: {
      container: 'border-orange-500/30 bg-orange-900/20 backdrop-blur-md',
      header: 'text-orange-100',
      text: 'text-orange-300',
      subtext: 'text-orange-400',
      galleryBg: 'bg-orange-900/30',
      coverBg: 'border-orange-500/50 bg-orange-900/50',
      coverHover: 'hover:border-orange-400 hover:bg-orange-900/70',
      buttonBg: 'bg-orange-500/20 hover:bg-orange-500/40',
      buttonText: 'text-orange-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-300',
    },
    blood: {
      container: 'border-red-800/30 bg-red-900/20 backdrop-blur-md',
      header: 'text-red-100',
      text: 'text-red-300',
      subtext: 'text-red-400',
      galleryBg: 'bg-red-900/30',
      coverBg: 'border-red-700/50 bg-red-900/50',
      coverHover: 'hover:border-red-600 hover:bg-red-900/70',
      buttonBg: 'bg-red-600/20 hover:bg-red-600/40',
      buttonText: 'text-red-300',
      deleteBtn: 'bg-red-600/40 hover:bg-red-600/60 text-red-200',
      expandBtn: 'bg-red-600/20 hover:bg-red-600/40 text-red-300',
    },
    nightcity: {
      container: 'border-purple-500/30 bg-purple-900/20 backdrop-blur-md',
      header: 'text-cyan-100',
      text: 'text-cyan-300',
      subtext: 'text-cyan-400',
      galleryBg: 'bg-purple-900/30',
      coverBg: 'border-purple-500/50 bg-purple-900/50',
      coverHover: 'hover:border-purple-400 hover:bg-purple-900/70',
      buttonBg: 'bg-cyan-500/20 hover:bg-cyan-500/40',
      buttonText: 'text-cyan-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300',
    },
    gothic: {
      container: 'border-purple-900/40 bg-purple-950/20 backdrop-blur-md',
      header: 'text-purple-100',
      text: 'text-purple-300',
      subtext: 'text-purple-400',
      galleryBg: 'bg-purple-950/30',
      coverBg: 'border-purple-800/50 bg-purple-950/50',
      coverHover: 'hover:border-purple-700 hover:bg-purple-950/70',
      buttonBg: 'bg-purple-700/20 hover:bg-purple-700/40',
      buttonText: 'text-purple-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-purple-700/20 hover:bg-purple-700/40 text-purple-300',
    },
    vintage: {
      container: 'border-amber-700/40 bg-amber-900/20 backdrop-blur-md',
      header: 'text-amber-100',
      text: 'text-amber-300',
      subtext: 'text-amber-400',
      galleryBg: 'bg-amber-900/30',
      coverBg: 'border-amber-700/50 bg-amber-900/50',
      coverHover: 'hover:border-amber-600 hover:bg-amber-900/70',
      buttonBg: 'bg-amber-600/20 hover:bg-amber-600/40',
      buttonText: 'text-amber-300',
      deleteBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-400',
      expandBtn: 'bg-amber-600/20 hover:bg-amber-600/40 text-amber-300',
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const displayCovers = isExpanded ? covers : covers.slice(-4)

  return (
    <div
      className={cn(
        'rounded-xl border p-4 space-y-3 transition-all duration-300',
        styles.container
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className={cn('w-5 h-5', styles.text)} />
          <h3 className={cn('text-sm font-semibold uppercase tracking-wide', styles.header)}>
            Recent Album Covers
          </h3>
          <span className={cn('text-xs px-2 py-1 rounded-full', styles.buttonBg, styles.buttonText)}>
            {covers.length}/15
          </span>
        </div>
        {covers.length > 4 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'text-xs px-2 py-1 rounded transition-all duration-200',
              styles.expandBtn
            )}
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div
        className={cn(
          'p-3 rounded-lg grid grid-cols-4 gap-2 transition-all duration-300',
          isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-24',
          styles.galleryBg
        )}
      >
        {displayCovers.length > 0 ? (
          displayCovers.map((cover) => (
            <div
              key={cover.id}
              className="relative group"
            >
              <button
                onClick={() => {
                  if (currentTrack) {
                    setTrackArtwork(cover.imageData)
                  }
                }}
                className={cn(
                  'w-full aspect-square rounded-lg border-2 overflow-hidden transition-all duration-200 group cursor-pointer relative',
                  styles.coverBg,
                  styles.coverHover
                )}
              >
                <img
                  src={cover.imageData}
                  alt="Album cover"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Delete button - appears on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeCover(cover.id)
                }}
                className={cn(
                  'absolute top-1 right-1 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                  styles.deleteBtn
                )}
                title="Delete cover"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        ) : (
          <p className={cn('col-span-4 text-xs text-center py-2', styles.subtext)}>
            No saved covers yet
          </p>
        )}
      </div>
    </div>
  )
}
