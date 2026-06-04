"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 2.8 seconds (logo fade: 0.8s + hold: 1s + fade out: 1s)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 2800)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Ambient glow effect - subtle purple radiance */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.12) 0%, transparent 65%)",
          animation: "pulse-ambient 3s ease-in-out infinite",
        }}
      />

      {/* Main splash content */}
      <div
        className="relative z-10"
        style={{
          animation: "splash-fade-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        <Image
          src="/reviora-logo.png"
          alt="Reviora"
          width={300}
          height={480}
          priority
          quality={100}
          className="w-auto h-auto"
          style={{
            filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.25))",
          }}
        />
      </div>

      {/* Fade to app transition */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          animation: "splash-fade-out 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.8s forwards",
          pointerEvents: "none",
        }}
      />

      <style jsx>{`
        @keyframes splash-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        @keyframes pulse-ambient {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}
