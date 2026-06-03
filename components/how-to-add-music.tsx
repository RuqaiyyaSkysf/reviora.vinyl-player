"use client"

import { Upload, Smartphone, FileText, Palette, Instagram } from "lucide-react"
import { usePlayer } from "@/contexts/player-context"
import { cn } from "@/lib/utils"

export function HowToAddMusic() {
  const { theme } = usePlayer()

  const themeStyles: Record<string, {
    text: string
    textMuted: string
    icon: string
    border: string
    highlight: string
  }> = {
    black: {
      text: "text-white",
      textMuted: "text-zinc-400",
      icon: "text-zinc-500",
      border: "border-zinc-800",
      highlight: "text-zinc-300",
    },
    pink: {
      text: "text-pink-900",
      textMuted: "text-pink-600",
      icon: "text-pink-400",
      border: "border-pink-200",
      highlight: "text-pink-700",
    },
    coding: {
      text: "text-cyan-300",
      textMuted: "text-purple-400",
      icon: "text-cyan-500",
      border: "border-purple-500/30",
      highlight: "text-cyan-400",
    },
    maroon: {
      text: "text-amber-200",
      textMuted: "text-amber-500",
      icon: "text-amber-600",
      border: "border-amber-800/50",
      highlight: "text-amber-400",
    },
    galaxy: {
      text: "text-indigo-200",
      textMuted: "text-indigo-400",
      icon: "text-indigo-500",
      border: "border-indigo-500/30",
      highlight: "text-indigo-300",
    },
    flame: {
      text: "text-orange-200",
      textMuted: "text-orange-400",
      icon: "text-orange-500",
      border: "border-orange-500/30",
      highlight: "text-orange-300",
    },
    blood: {
      text: "text-red-200",
      textMuted: "text-red-400",
      icon: "text-red-500",
      border: "border-red-800/30",
      highlight: "text-red-300",
    },
    nightcity: {
      text: "text-cyan-300",
      textMuted: "text-purple-400",
      icon: "text-cyan-500",
      border: "border-purple-500/30",
      highlight: "text-cyan-400",
    },
    gothic: {
      text: "text-purple-200",
      textMuted: "text-purple-400",
      icon: "text-purple-500",
      border: "border-purple-900/40",
      highlight: "text-purple-300",
    },
    vintage: {
      text: "text-amber-200",
      textMuted: "text-amber-400",
      icon: "text-amber-500",
      border: "border-amber-700/40",
      highlight: "text-amber-300",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  const instructions = [
    {
      icon: Upload,
      text: "Upload MP3 files from your local device storage",
    },
    {
      icon: Smartphone,
      text: "Supported on desktop, tablet, and mobile devices",
    },
    {
      icon: FileText,
      text: "Add lyrics using TXT/LRC upload or manual paste",
    },
    {
      icon: Palette,
      text: "Customize your vinyl artwork for a personalized experience",
    },
    {
      icon: Instagram,
      text: "Need help importing music files? Check the tutorial section on Instagram highlights",
    },
  ]

  return (
    <div className="space-y-4">
      <p className={cn("text-sm", styles.textMuted)}>
        Quick guide to get your music playing:
      </p>
      
      <ul className="space-y-3">
        {instructions.map((item, index) => (
          <li 
            key={index}
            className={cn(
              "flex items-start gap-3 text-sm",
              styles.text
            )}
          >
            <item.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", styles.icon)} />
            <span className={styles.textMuted}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
