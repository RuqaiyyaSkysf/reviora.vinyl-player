"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function DesertMoonBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([])
  const [parallax, setParallax] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Generate random falling rain particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 3,
    }))
    setParticles(newParticles)
  }, [])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      setParallax({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Generate random fog layers at different depths - more subtle
  const fogLayers = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    opacity: 0.08 + (i * 0.05),
    speed: 4 + i * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main rainy forest background - clear and realistic */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/rainy-mood-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "auto",
          filter: "brightness(0.85) contrast(1.05) saturate(0.95)",
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      />

      {/* Atmospheric fog layers - minimal, subtle depth enhancement */}
      {fogLayers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(60,80,60,${layer.opacity * 0.08}) 0%, rgba(50,70,50,${layer.opacity * 0.06}) 50%, rgba(40,60,40,${layer.opacity * 0.1}) 100%)`,
            animation: `drift-fog ${layer.speed * 12}s linear infinite`,
            animationDelay: `${layer.id * 1.5}s`,
            opacity: 0.15,
          }}
        />
      ))}

      {/* Rain/moisture particles - minimal, barely visible drizzle */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "0.6px",
            height: "8px",
            left: particle.left,
            top: "-10px",
            background: "linear-gradient(180deg, rgba(150,160,150,0.25) 0%, rgba(120,130,120,0) 100%)",
            boxShadow: "0 0 1px rgba(140,150,140,0.15)",
            animation: `rain-fall ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Ambient mist - very subtle atmospheric shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(80,100,80,0.02) 0%, rgba(40,50,40,0.01) 50%, transparent 100%)",
          animation: "pulse-mist 10s ease-in-out infinite",
        }}
      />

      {/* Subtle shadow vignette - minimal focus effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes rain-fall {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
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
            transform: translateX(25px);
          }
        }

        @keyframes pulse-mist {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  )
}
