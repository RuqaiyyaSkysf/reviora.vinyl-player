"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DesertMoonBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([])

  useEffect(() => {
    // Generate random falling rain particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 8 + Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  // Generate random fog layers at different depths
  const fogLayers = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    opacity: 0.15 + (i * 0.1),
    speed: 3 + i * 1.5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Rainy nature background image - realistic forest with rain and fog */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/rainy-mood-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "high-quality",
          filter: "brightness(0.95) contrast(1.05) saturate(0.9)",
        }}
      />

      {/* Atmospheric moisture / fog effect - multiple layers */}
      {fogLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(150,160,140,${layer.opacity * 0.4}) 0%, rgba(120,140,110,${layer.opacity * 0.3}) 50%, rgba(100,120,90,${layer.opacity * 0.5}) 100%)`,
            animation: `drift-fog ${layer.speed * 10}s linear infinite`,
            animationDelay: `${layer.id * 2}s`,
          }}
        />
      ))}

      {/* Rain/moisture particles falling - soft drizzle effect */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "1px",
            height: "8px",
            left: particle.left,
            top: "-10px",
            background: "linear-gradient(180deg, rgba(200,210,200,0.6) 0%, rgba(150,160,150,0) 100%)",
            boxShadow: "0 0 2px rgba(180,190,180,0.4)",
            animation: `rain-fall ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Mist/haze overlay - creates moody atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(180,190,170,0.15) 0%, transparent 50%)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      {/* Rain droplet streaks on viewer - wet glass effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(200,210,200,0.05) 2px,
              rgba(200,210,200,0.05) 4px
            ),
            repeating-linear-gradient(
              180deg,
              transparent,
              transparent 1px,
              rgba(180,190,180,0.03) 1px,
              rgba(180,190,180,0.03) 2px
            )
          `,
        }}
      />

      {/* Soft vignette - darker edges, focus on center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes rain-fall {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes drift-fog {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
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
