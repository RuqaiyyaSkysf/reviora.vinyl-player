"use client"

import { useState } from "react"
import { Music, HelpCircle } from "lucide-react"
import { usePlayer } from "@/contexts/player-context"
import { MP3Upload } from "./mp3-upload"
import { HowToAddMusic } from "./how-to-add-music"
import { cn } from "@/lib/utils"

type Tab = "local" | "help"

export function SourceTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("local")
  const { theme } = usePlayer()

  const themeStyles: Record<string, {
    container: string
    tabInactive: string
    tabActive: string
  }> = {
    black: {
      container: "bg-zinc-900/50 border-zinc-800",
      tabInactive: "text-zinc-500 hover:text-zinc-300",
      tabActive: "text-white bg-zinc-800",
    },
    pink: {
      container: "bg-white/80 border-pink-200",
      tabInactive: "text-pink-400 hover:text-pink-600",
      tabActive: "text-pink-700 bg-pink-100",
    },
    coding: {
      container: "bg-zinc-900/50 border-purple-500/30",
      tabInactive: "text-purple-500 hover:text-purple-300",
      tabActive: "text-cyan-400 bg-purple-900/50",
    },
    maroon: {
      container: "bg-zinc-900/50 border-amber-800/50",
      tabInactive: "text-amber-600 hover:text-amber-400",
      tabActive: "text-amber-300 bg-amber-900/50",
    },
    galaxy: {
      container: "bg-indigo-950/50 border-indigo-500/30",
      tabInactive: "text-indigo-400 hover:text-indigo-300",
      tabActive: "text-indigo-200 bg-indigo-900/50",
    },
    flame: {
      container: "bg-zinc-900/50 border-orange-500/30",
      tabInactive: "text-orange-400 hover:text-orange-300",
      tabActive: "text-orange-200 bg-orange-900/50",
    },
    blood: {
      container: "bg-red-950/50 border-red-800/30",
      tabInactive: "text-red-400 hover:text-red-300",
      tabActive: "text-red-200 bg-red-900/50",
    },
    nightcity: {
      container: "bg-zinc-950/50 border-purple-500/30",
      tabInactive: "text-purple-400 hover:text-cyan-300",
      tabActive: "text-cyan-300 bg-purple-900/50",
    },
    gothic: {
      container: "bg-slate-950/50 border-purple-900/40",
      tabInactive: "text-purple-400 hover:text-purple-300",
      tabActive: "text-purple-200 bg-purple-950/50",
    },
    vintage: {
      container: "bg-amber-950/50 border-amber-700/40",
      tabInactive: "text-amber-400 hover:text-amber-300",
      tabActive: "text-amber-200 bg-amber-900/50",
    },
  }

  const styles = themeStyles[theme] || themeStyles.black

  return (
    <div className={cn("rounded-xl border overflow-hidden", styles.container)}>
      {/* Tab headers */}
      <div className="flex border-b border-inherit">
        <button
          onClick={() => setActiveTab("local")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200",
            activeTab === "local" ? styles.tabActive : styles.tabInactive
          )}
        >
          <Music className="w-4 h-4" />
          Local MP3
        </button>
        <button
          onClick={() => setActiveTab("help")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200",
            activeTab === "help" ? styles.tabActive : styles.tabInactive
          )}
        >
          <HelpCircle className="w-4 h-4" />
          How to Add Music
        </button>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === "local" ? <MP3Upload /> : <HowToAddMusic />}
      </div>
    </div>
  )
}
