"use client"

import { PlayerProvider } from "@/contexts/player-context"
import { VinylPlayer } from "@/components/vinyl-player"
import { SupportPrompt } from "@/components/support-prompt"
import { BrandHeader } from "@/components/brand-header"

export default function Home() {
  return (
    <>
      <BrandHeader />
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
