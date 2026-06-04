"use client"

import { useEffect } from "react"
import { track } from "@vercel/analytics"
import { PlayerProvider } from "@/contexts/player-context"
import { VinylPlayer } from "@/components/vinyl-player"
import { SupportPrompt } from "@/components/support-prompt"

function VisitorTracker() {
  useEffect(() => {
    // Track new vs returning visitors using localStorage
    const VISITOR_KEY = "reviora_visited"
    
    try {
      const hasVisited = localStorage.getItem(VISITOR_KEY)
      
      if (!hasVisited) {
        // First visit
        localStorage.setItem(VISITOR_KEY, "true")
        track("new_visitor")
      } else {
        // Returning visitor
        track("returning_visitor")
      }
    } catch (error) {
      // Silently handle localStorage errors (privacy mode, etc.)
      console.log("[v0] Visitor tracking unavailable:", error)
    }
  }, [])

  return null
}

export default function Home() {
  return (
    <PlayerProvider>
      <main className="w-full">
        <VisitorTracker />
        <VinylPlayer />
        <SupportPrompt
          instagramUrl="https://www.instagram.com/raya.1ity"
          youtubeUrl="https://www.youtube.com/@raya.1ity"
        />
      </main>
    </PlayerProvider>
  )
}
