"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DesertMoonBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random floating dust particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 20 + Math.random() * 15,
    }))
    setParticles(newParticles)
  }, [])

  // Generate random stars in the night sky
  const stars = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 70}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 0.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Desert landscape background image - positioned to show most of sky */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/desert-moon-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          backgroundRepeat: "no-repeat",
          imageRendering: "high-quality",
          filter: "brightness(1.02) contrast(1.1) saturate(0.98)",
        }}
      />

      {/* Moonlight glow effect - positioned to match the crescent moon */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full animate-moon-glow pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200, 190, 160, 0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Atmospheric haze - desert dust and horizon shimmer */}
      <div
        className="absolute bottom-0 inset-x-0 h-2/5 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(25, 40, 70, 0.5) 0%, rgba(50, 80, 120, 0.3) 30%, transparent 100%)",
        }}
      />

      {/* Stars scattered in the night sky - subtle twinkle */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-serenity-star pointer-events-none"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            background: "rgba(220, 210, 190, 0.7)",
            boxShadow: "0 0 6px rgba(220, 210, 190, 0.5)",
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Gentle drifting sand particles - moonlit dust */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-serenity-particle"
          style={{
            width: "1.5px",
            height: "1.5px",
            left: particle.left,
            top: "60%",
            background: "rgba(200, 180, 140, 0.4)",
            boxShadow: "0 0 3px rgba(200, 180, 140, 0.3)",
            "--particle-drift": `${(Math.random() - 0.5) * 150}px` as any,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Subtle vignette - darker edges, focus on center landscape */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)",
        }}
      />
    </div>
  )
}
