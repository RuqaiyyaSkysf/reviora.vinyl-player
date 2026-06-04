"use client"

import { useState } from "react"
import { PlayerProvider } from "@/contexts/player-context"
import { VinylPlayer } from "@/components/vinyl-player"
import { SupportPrompt } from "@/components/support-prompt"
import { SplashScreen } from "@/components/splash-screen"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <PlayerProvider>
        <main className="w-full">
          <VinylPlayer />
          <SupportPrompt
            instagramUrl="https://www.instagram.com/raya.1ity"
            youtubeUrl="https://www.youtube.com/@raya.1ity"
          />
        </main>
      </PlayerProvider>
    </>
  )
}
