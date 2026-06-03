"use client"

import { usePlayer, type Theme } from "@/contexts/player-context"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ThemedPageWrapperProps {
  children: ReactNode
}

/**
 * Wraps the entire page in a theme-aware background so the credits section
 * below VinylPlayer inherits the same ambient atmosphere instead of sitting
 * on a plain black background.
 */
export function ThemedPageWrapper({ children }: ThemedPageWrapperProps) {
  const { theme } = usePlayer()

  const themeBg: Record<Theme, string> = {
    black:     "bg-zinc-950",
    pink:      "bg-pink-950",
    coding:    "bg-zinc-950",
    maroon:    "bg-zinc-950",
    galaxy:    "bg-indigo-950",
    flame:     "bg-zinc-950",
    blood:     "bg-zinc-950",
    nightcity: "bg-zinc-950",
    gothic:    "bg-slate-950",
    vintage:   "bg-amber-950",
  }

  return (
    <div className={cn("w-full transition-colors duration-700", themeBg[theme])}>
      {children}
    </div>
  )
}
