"use client"

import { useState, useEffect, useCallback } from "react"
import { Instagram, Youtube, X } from "lucide-react"
import { track } from "@vercel/analytics"
import { cn } from "@/lib/utils"
import { SOCIAL_LINKS } from "@/config/social-links"

const SESSION_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes in milliseconds

interface SupportPromptProps {
  instagramUrl?: string
  youtubeUrl?: string
}

export function SupportPrompt({
  instagramUrl = SOCIAL_LINKS.instagram,
  youtubeUrl = SOCIAL_LINKS.youtube,
}: SupportPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissedForSession, setIsDismissedForSession] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const hidePrompt = useCallback(() => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsAnimatingOut(false)
    }, 200)
  }, [])

  // Simple session timer: count elapsed time continuously
  useEffect(() => {
    if (isDismissedForSession) return

    let sessionStartTime: number | null = null
    let interval: NodeJS.Timeout | null = null

    const startTimer = () => {
      sessionStartTime = Date.now()
      
      interval = setInterval(() => {
        if (sessionStartTime !== null && !isDismissedForSession && !isVisible) {
          const elapsedMs = Date.now() - sessionStartTime
          
          // Show prompt after 30 minutes of session time
          if (elapsedMs >= SESSION_THRESHOLD_MS) {
            setIsVisible(true)
            if (interval) clearInterval(interval)
          }
        }
      }, 1000)
    }

    startTimer()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isDismissedForSession, isVisible])

  const handleFollowInstagram = () => {
    track("support_popup_instagram_click")
    window.open(instagramUrl, "_blank", "noopener,noreferrer")
    hidePrompt()
  }

  const handleSubscribeYoutube = () => {
    track("support_popup_youtube_click")
    window.open(youtubeUrl, "_blank", "noopener,noreferrer")
    hidePrompt()
  }

  const handleMaybeLater = () => {
    hidePrompt()
    // Timer continues running; popup will show again after another ~30 minutes of session time
  }

  const handleDontShowAgain = () => {
    setIsDismissedForSession(true)
    hidePrompt()
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none",
        "transition-opacity duration-300",
        isAnimatingOut ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Backdrop with blur */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isAnimatingOut ? "opacity-0" : "opacity-100"
        )}
        onClick={handleMaybeLater}
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-sm rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/2 p-8 shadow-2xl backdrop-blur-xl pointer-events-auto",
          "transition-all duration-300",
          isAnimatingOut
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100"
        )}
        style={{
          animation: isVisible && !isAnimatingOut ? "slideUp 0.4s ease-out" : "none",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)"
        }}
      >
        {/* Close button */}
        <button
          onClick={handleMaybeLater}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground/70 transition-all hover:bg-white/10 hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Content */}
        <div className="space-y-5 text-center">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-foreground leading-tight">
            Enjoying Reviora?
          </h2>

          {/* Message */}
          <div className="space-y-3 text-sm text-muted-foreground/90 leading-relaxed">
            <p>
              This music player is a free independent project.
            </p>
            <p>
              If you enjoy using it, you can support my work and follow the journey behind it.
            </p>
            <p className="pt-1 text-xs text-muted-foreground/70">
              I share content around coding, creativity, technology, STEM ideas, and immersive digital experiences.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4 space-y-2">
            <button
              onClick={handleFollowInstagram}
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-pink-600/80 px-4 py-3 text-sm font-medium text-white transition-all hover:from-pink-500 hover:via-purple-500 hover:to-pink-600 hover:shadow-lg active:scale-95"
            >
              <Instagram className="size-4" />
              Instagram
            </button>

            <button
              onClick={handleSubscribeYoutube}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600/80 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-red-600 hover:shadow-lg active:scale-95"
            >
              <Youtube className="size-4" />
              YouTube
            </button>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleMaybeLater}
                className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground active:scale-95"
              >
                Maybe Later
              </button>

              <button
                onClick={handleDontShowAgain}
                className="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/60 transition-all hover:bg-white/5 hover:text-muted-foreground active:scale-95"
              >
                Hide for Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
