"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 2.6 seconds (logo fade: 0.6s + hold: 1s + fade out: 1s)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2600)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Splash content - centered logo and text */}
      <div
        className="relative z-10 flex flex-col items-center justify-center gap-6"
        style={{
          animation: "splash-fade-in 0.6s ease-out forwards",
        }}
      >
        {/* Reviora logo - properly sized and centered */}
        <div className="w-64 h-auto">
          <Image
            src="/reviora-logo.png"
            alt="Reviora Logo"
            width={280}
            height={450}
            priority
            quality={100}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Fade to app transition */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          animation: "splash-fade-out 1s ease-in 1.6s forwards",
          pointerEvents: "none",
        }}
      />

      <style jsx>{`
        @keyframes splash-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes splash-fade-out {
          from {
            opacity: 0;
            visibility: visible;
          }
          to {
            opacity: 1;
            visibility: visible;
          }
        }
      `}</style>
    </div>
  )
}
