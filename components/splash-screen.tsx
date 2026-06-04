"use client"

import { useEffect, useState } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 3.2 seconds (allowing animation to complete)
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 3200)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Main logo and text container */}
      <div className="flex flex-col items-center justify-center gap-8">
        {/* SVG Logo with animated sections */}
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          className="drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]"
          style={{
            filter: "drop-shadow(0 0 40px rgba(139,92,246,0.2))",
          }}
        >
          {/* Purple section - left */}
          <path
            d="M 80 60 Q 95 60 110 75 L 110 140 Q 95 155 80 155 Q 70 155 65 145 L 65 85 Q 70 60 80 60"
            fill="url(#purpleGradient)"
            className="splash-path-purple"
            style={{
              animation: "draw-purple 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
            }}
          />

          {/* Red/Magenta section - right */}
          <path
            d="M 170 60 Q 200 75 210 110 Q 215 140 200 165 Q 180 190 160 190 Q 150 190 145 175 L 145 85 Q 155 60 170 60"
            fill="url(#redGradient)"
            className="splash-path-red"
            style={{
              animation: "draw-red 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards",
              opacity: 0,
            }}
          />

          {/* Cyan section - center lightning bolt */}
          <path
            d="M 125 90 L 115 120 L 130 120 L 110 165 L 135 135 L 120 135 L 140 90 Z"
            fill="url(#cyanGradient)"
            className="splash-path-cyan"
            style={{
              animation: "draw-cyan 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s forwards",
              opacity: 0,
            }}
          />

          {/* Gradients */}
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

        {/* REVIORA text */}
        <div className="text-center mt-4">
          <div
            className="text-4xl font-bold tracking-wider text-white"
            style={{
              animation: "fade-up-text 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.4s both",
              letterSpacing: "0.15em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            <span>REVIORA</span>
          </div>
        </div>
      </div>

      {/* Fade out animation wrapper */}
      <div
        className="absolute inset-0"
        style={{
          animation: "splash-fade-out 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 2.6s forwards",
          pointerEvents: "none",
        }}
      />

      <style jsx>{`
        @keyframes draw-purple {
          from {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.6));
          }
          to {
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.4));
          }
        }

        @keyframes draw-red {
          from {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.6));
          }
          to {
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.4));
          }
        }

        @keyframes draw-cyan {
          from {
            stroke-dasharray: 150;
            stroke-dashoffset: 150;
            opacity: 0;
            filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.6));
          }
          to {
            stroke-dasharray: 150;
            stroke-dashoffset: 0;
            opacity: 1;
            filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.4));
          }
        }

        @keyframes fade-up-text {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splash-fade-out {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
          }
        }

        .splash-path-purple,
        .splash-path-red,
        .splash-path-cyan {
          will-change: stroke-dashoffset, opacity;
        }
      `}</style>
    </div>
  )
}
