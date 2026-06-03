'use client'

import { X } from 'lucide-react'
import { usePlayer } from '@/contexts/player-context'
import { useAlbumGallery } from '@/hooks/use-album-gallery'
import { cn } from '@/lib/utils'

interface GalleryPanelProps {
  onClose: () => void
}

export function GalleryPanel({ onClose }: GalleryPanelProps) {
  const { theme, setTrackArtwork } = usePlayer()
  const { covers, removeCover } = useAlbumGallery()

  const handleCoverClick = (imageData: string) => {
    setTrackArtwork(imageData)
    onClose()
  }

  if (covers.length === 0) {
    return (
      <div className={cn(
        'fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50'
      )}>
        <div className={cn(
          'relative w-96 max-w-[90vw] rounded-2xl p-6',
          'bg-white/10 backdrop-blur-xl border border-white/20',
          'shadow-2xl'
        )}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <h2 className="text-xl font-bold text-white mb-4">Album Cover Gallery</h2>
          <p className="text-white/70 text-sm">No album covers saved yet. Upload artwork to get started.</p>
        </div>
      </div>
    )
  }

  // Only render gallery if covers exist to prevent flashing empty state
  if (!covers || covers.length === 0) {
    return null
  }

  return (
    <div className={cn(
      'fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50'
    )}>
      <div className={cn(
        'relative w-full max-w-2xl max-h-[80vh] rounded-2xl p-6',
        'bg-white/10 backdrop-blur-xl border border-white/20',
        'shadow-2xl overflow-y-auto'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sticky top-0">
          <h2 className="text-xl font-bold text-white">Album Cover Gallery</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {covers.map((cover) => (
            <div
              key={cover.id}
              className="relative group cursor-pointer"
            >
              {/* Image */}
              <div
                onClick={() => handleCoverClick(cover.imageData)}
                className={cn(
                  'aspect-square rounded-lg overflow-hidden',
                  'border-2 border-white/20 hover:border-white/40',
                  'transition-all duration-200 hover:shadow-lg',
                  'group-hover:scale-105'
                )}
              >
                <img
                  src={cover.imageData}
                  alt="Album cover"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to apply
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeCover(cover.id)
                }}
                className={cn(
                  'absolute top-1 right-1 p-1 rounded-md',
                  'bg-red-500/80 hover:bg-red-600 transition-colors',
                  'opacity-0 group-hover:opacity-100 transition-opacity'
                )}
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Counter */}
        <div className="mt-4 text-center text-white/70 text-sm">
          {covers.length} / 25 album covers
        </div>
      </div>
    </div>
  )
}
