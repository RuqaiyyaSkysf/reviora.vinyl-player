"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 3.2 seconds (logo animation: 0.5s + 0.5s + 0.4s + text: 0.8s + hold: 1s - slight overlap)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 3200)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center gap-12">
        {/* SVG Logo with exact Reviora contours */}
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="relative"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Purple section - left curved "3" shape */}
          <path
            d="M 90 50 Q 120 40 140 60 L 140 80 Q 115 70 95 85 L 95 150 Q 110 165 135 170 L 135 190 Q 105 185 85 160 Q 70 140 70 110 Q 70 75 90 50 Z"
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="splash-path-purple"
            style={{
              animation: "draw-stroke-purple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s forwards",
              filter: "drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))",
            }}
          />

          {/* Red/Magenta section - right curved "3" shape */}
          <path
            d="M 230 50 Q 260 40 280 70 Q 295 95 295 130 Q 295 160 280 185 Q 260 210 220 220 L 220 195 Q 250 190 265 170 Q 280 150 280 125 Q 280 95 260 75 Q 245 60 230 70 L 230 50 Z"
            fill="none"
            stroke="url(#redGradient)"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="splash-path-red"
            style={{
              animation: "draw-stroke-red 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards",
              opacity: 0,
            }}
          />

          {/* Cyan lightning bolt section - center accent */}
          <path
            d="M 160 80 L 145 130 L 165 130 L 140 200 L 175 155 L 155 155 L 175 80 Z"
            fill="none"
            stroke="url(#cyanGradient)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="splash-path-cyan"
            style={{
              animation: "draw-stroke-cyan 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.6s forwards",
              opacity: 0,
              filter: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.6))",
            }}
          />

          {/* Gradients for each section */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>

        {/* REVIORA text - fades in after logo animation */}
        <div
          className="text-5xl font-bold tracking-[0.2em] text-white"
          style={{
            animation: "fade-in-text 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 2.2s both",
            fontWeight: 900,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          REVIORA
        </div>
      </div>

      {/* Fade out entire splash screen */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          animation: "splash-fade-out 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.4s forwards",
          pointerEvents: "none",
        }}
      />

      <style jsx>{`
        @keyframes draw-stroke-purple {
          from {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));
          }
          to {
            stroke-dasharray: 400;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
          }
        }

        @keyframes draw-stroke-red {
          from {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
          }
          to {
            stroke-dasharray: 400;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.5));
          }
        }

        @keyframes draw-stroke-cyan {
          from {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            opacity: 0;
            filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.3));
          }
          to {
            stroke-dasharray: 300;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.6));
          }
        }

        @keyframes fade-in-text {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splash-fade-out {
          from {
            opacity: 1;
            visibility: visible;
          }
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        .splash-path-purple,
        .splash-path-red,
        .splash-path-cyan {
          will-change: stroke-dashoffset, opacity, filter;
        }
      `}</style>
    </div>
  )
}
