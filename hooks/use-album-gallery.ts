'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SavedAlbumCover {
  id: string
  imageData: string // Base64 encoded image
  timestamp: number
}

const STORAGE_KEY = 'reviora_album_covers'
const MAX_COVERS = 25

export function useAlbumGallery() {
  const [covers, setCoverState] = useState<SavedAlbumCover[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load covers from localStorage on mount
  useEffect(() => {
    const loadCovers = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          setCoverState(Array.isArray(parsed) ? parsed : [])
        }
      } catch (error) {
        console.log('[v0] Failed to load album covers:', error)
      }
      setIsLoaded(true)
    }

    loadCovers()
  }, [])

  // Save covers to localStorage whenever they change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(covers))
    } catch (error) {
      console.log('[v0] Failed to save album covers:', error)
    }
  }, [covers, isLoaded])

  const addCover = useCallback((imageData: string): { success: boolean; message?: string } => {
    let canAdd = false
    let errorMessage = ''

    setCoverState((prev) => {
      if (prev.length >= MAX_COVERS) {
        errorMessage = 'Album Cover Gallery is full. Please delete an existing album cover before adding a new one.'
        return prev
      }

      canAdd = true
      const updated = [
        ...prev,
        {
          id: `cover-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          imageData,
          timestamp: Date.now(),
        },
      ]
      return updated
    })

    return {
      success: canAdd,
      message: errorMessage || undefined,
    }
  }, [])

  const removeCover = useCallback((id: string) => {
    setCoverState((prev) => prev.filter((cover) => cover.id !== id))
  }, [])

  const clearAllCovers = useCallback(() => {
    setCoverState([])
  }, [])

  return {
    covers,
    addCover,
    removeCover,
    clearAllCovers,
    isLoaded,
  }
}
