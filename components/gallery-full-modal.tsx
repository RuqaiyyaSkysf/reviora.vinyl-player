'use client'

import { X } from 'lucide-react'
import { usePlayer, type Theme } from '@/contexts/player-context'
import { cn } from '@/lib/utils'

interface GalleryFullModalProps {
  isOpen: boolean
  onClose: () => void
  onUseWithoutSaving: () => void
  onOpenGallery: () => void
  theme: Theme
}

export function GalleryFullModal({
  isOpen,
  onClose,
  onUseWithoutSaving,
  onOpenGallery,
  theme,
}: GalleryFullModalProps) {
  if (!isOpen) return null

  const themeClasses = {
    black: 'bg-black border-white/20',
    pink: 'bg-pink-50 border-pink-200',
    coding: 'bg-gray-900 border-green-500/30',
    galaxy: 'bg-purple-900/50 border-purple-500/50',
    flame: 'bg-red-950/50 border-orange-500/50',
    gothic: 'bg-gray-950 border-gray-700',
    vintage: 'bg-amber-900/30 border-amber-700/50',
    night_city: 'bg-blue-950/50 border-cyan-500/30',
    minimal: 'bg-zinc-900 border-zinc-700',
    synthwave: 'bg-indigo-950/50 border-pink-500/50',
  }

  const buttonStyles = {
    black: 'bg-white hover:bg-gray-200 text-black',
    pink: 'bg-pink-600 hover:bg-pink-700 text-white',
    coding: 'bg-green-600 hover:bg-green-700 text-white',
    galaxy: 'bg-purple-600 hover:bg-purple-700 text-white',
    flame: 'bg-orange-600 hover:bg-orange-700 text-white',
    gothic: 'bg-gray-700 hover:bg-gray-800 text-white',
    vintage: 'bg-amber-700 hover:bg-amber-800 text-white',
    night_city: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    minimal: 'bg-zinc-700 hover:bg-zinc-800 text-white',
    synthwave: 'bg-pink-600 hover:bg-pink-700 text-white',
  }

  const secondaryButtonStyles = {
    black: 'border border-white/30 text-white hover:bg-white/10',
    pink: 'border border-pink-300 text-pink-700 hover:bg-pink-100',
    coding: 'border border-green-500/50 text-green-400 hover:bg-green-900/30',
    galaxy: 'border border-purple-500/50 text-purple-200 hover:bg-purple-900/30',
    flame: 'border border-orange-500/50 text-orange-200 hover:bg-orange-900/30',
    gothic: 'border border-gray-600 text-gray-300 hover:bg-gray-800/50',
    vintage: 'border border-amber-700/50 text-amber-200 hover:bg-amber-900/30',
    night_city: 'border border-cyan-500/50 text-cyan-200 hover:bg-cyan-900/30',
    minimal: 'border border-zinc-600 text-zinc-300 hover:bg-zinc-800/50',
    synthwave: 'border border-pink-500/50 text-pink-200 hover:bg-pink-900/30',
  }

  const textColors = {
    black: 'text-white',
    pink: 'text-pink-900',
    coding: 'text-green-100',
    galaxy: 'text-purple-100',
    flame: 'text-orange-100',
    gothic: 'text-gray-100',
    vintage: 'text-amber-100',
    night_city: 'text-cyan-100',
    minimal: 'text-zinc-100',
    synthwave: 'text-pink-100',
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={cn(
          'w-full max-w-md rounded-lg border p-6 shadow-2xl',
          themeClasses[theme]
        )}
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className={cn('text-lg font-semibold', textColors[theme])}>
            Artwork Gallery Full
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-1 rounded-lg transition-all duration-200',
              theme === 'pink'
                ? 'text-pink-600 hover:bg-pink-100'
                : 'text-white/60 hover:bg-white/10'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className={cn('text-sm mb-6 leading-relaxed', textColors[theme])}>
          Your Artwork Gallery has reached the 15-image limit.
        </p>
        <p
          className={cn(
            'text-sm mb-6 leading-relaxed',
            theme === 'pink' ? 'text-pink-700' : 'text-white/70'
          )}
        >
          You can continue using this artwork without saving it, or delete older
          artwork to free up space.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onUseWithoutSaving()
              onClose()
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              buttonStyles[theme]
            )}
          >
            Use Without Saving
          </button>
          <button
            onClick={() => {
              onOpenGallery()
              onClose()
            }}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              secondaryButtonStyles[theme]
            )}
          >
            Open Gallery
          </button>
          <button
            onClick={onClose}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200',
              secondaryButtonStyles[theme]
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
