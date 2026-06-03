"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function MasjidBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 15 + Math.random() * 10,
    }))
    setParticles(newParticles)
  }, [])

  // Generate random stars
  const stars = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 60}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image - Arabic calligraphy */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/arabic-calligraphy-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "crisp-edges",
          filter: "brightness(0.98) contrast(1.15) saturate(0.92)",
        }}
      />

      {/* Moon glow effect - positioned top right */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full animate-moon-glow pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200, 210, 255, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle atmospheric haze across the bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-1/3 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(30, 58, 138, 0.4) 0%, transparent 100%)",
        }}
      />

      {/* Tiny stars scattered in the sky */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-serenity-star pointer-events-none"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            background: "rgba(220, 230, 255, 0.6)",
            boxShadow: "0 0 8px rgba(220, 230, 255, 0.4)",
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Gentle floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none animate-serenity-particle"
          style={{
            width: "2px",
            height: "2px",
            left: particle.left,
            top: "100%",
            background: "rgba(200, 220, 255, 0.5)",
            boxShadow: "0 0 4px rgba(200, 220, 255, 0.3)",
            "--particle-drift": `${(Math.random() - 0.5) * 200}px` as any,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Subtle vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
    </div>
  )
}
