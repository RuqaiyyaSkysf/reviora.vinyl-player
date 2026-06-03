"use client"

import { useEffect, useState, useRef } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  duration: number
}

interface CloudLayer {
  id: number
  x: number
  y: number
  width: number
  height: number
  opacity: number
  blur: number
  layer: "back" | "front"
}

interface FloatingPetal {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotation: number
  opacity: number
}

interface GlowOrb {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export function PinkBackground() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [clouds, setClouds] = useState<CloudLayer[]>([])
  const [petals, setPetals] = useState<FloatingPetal[]>([])
  const [glowOrbs, setGlowOrbs] = useState<GlowOrb[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate delicate sparkle particles (scattered stars equivalent)
    const newSparkles: Sparkle[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
    }))
    setSparkles(newSparkles)

    // Generate cloud layers (back and front for depth like buildings)
    const backClouds: CloudLayer[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      y: 60 + Math.random() * 35,
      width: 150 + Math.random() * 100,
      height: 40 + Math.random() * 30,
      opacity: 0.15 + Math.random() * 0.1,
      blur: 30 + Math.random() * 20,
      layer: "back" as const,
    }))

    const frontClouds: CloudLayer[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 10,
      x: Math.random() * 120 - 10,
      y: 70 + Math.random() * 25,
      width: 100 + Math.random() * 80,
      height: 30 + Math.random() * 25,
      opacity: 0.2 + Math.random() * 0.15,
      blur: 20 + Math.random() * 15,
      layer: "front" as const,
    }))

    setClouds([...backClouds, ...frontClouds])

    // Generate floating petals (moving light reflections like traffic)
    const newPetals: FloatingPetal[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 15,
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
      opacity: 0.3 + Math.random() * 0.4,
    }))
    setPetals(newPetals)

    // Generate glow orbs (neon-like soft glows)
    const newGlowOrbs: GlowOrb[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      size: 80 + Math.random() * 120,
      color: ["rgba(244,180,200,0.3)", "rgba(255,182,193,0.25)", "rgba(219,112,147,0.2)", "rgba(255,192,203,0.3)", "rgba(248,200,220,0.25)"][i],
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 3,
    }))
    setGlowOrbs(newGlowOrbs)
  }, [])

  // Parallax effect on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const parallaxOffset = {
    back: {
      x: (mousePosition.x - 0.5) * 8,
      y: (mousePosition.y - 0.5) * 5,
    },
    front: {
      x: (mousePosition.x - 0.5) * 15,
      y: (mousePosition.y - 0.5) * 10,
    },
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - soft blush to rose */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            145deg,
            rgb(253, 242, 248) 0%,
            rgb(251, 232, 243) 25%,
            rgb(252, 225, 238) 50%,
            rgb(251, 218, 233) 75%,
            rgb(249, 210, 227) 100%
          )`,
        }}
      />

      {/* Soft radial glow - center light effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 80% 60% at 50% 40%,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 245, 250, 0.3) 30%,
            transparent 70%
          )`,
        }}
      />

      {/* Secondary rose accent glow - bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 100% 50% at 50% 100%,
            rgba(244, 180, 200, 0.35) 0%,
            rgba(248, 190, 210, 0.15) 40%,
            transparent 70%
          )`,
        }}
      />

      {/* Tertiary accent - top corner warmth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 60% 40% at 80% 10%,
            rgba(255, 220, 235, 0.4) 0%,
            transparent 60%
          )`,
        }}
      />

      {/* Animated glow orbs with slow pulse (neon-like effect) */}
      {glowOrbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-pink-glow"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animationDelay: `${orb.delay}s`,
            animationDuration: `${orb.duration}s`,
            transform: `translate(${parallaxOffset.back.x}px, ${parallaxOffset.back.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
      ))}

      {/* Back layer clouds (fog/haze between layers) */}
      {clouds
        .filter((c) => c.layer === "back")
        .map((cloud) => (
          <div
            key={cloud.id}
            className="absolute"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
              background: `radial-gradient(ellipse, rgba(255,255,255,${cloud.opacity}) 0%, transparent 70%)`,
              filter: `blur(${cloud.blur}px)`,
              transform: `translate(${parallaxOffset.back.x}px, ${parallaxOffset.back.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}

      {/* Subtle fog layer between back and front */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background: `linear-gradient(to top, rgba(255,240,245,0.4) 0%, transparent 100%)`,
          filter: "blur(20px)",
          transform: `translateY(${parallaxOffset.back.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Front layer clouds */}
      {clouds
        .filter((c) => c.layer === "front")
        .map((cloud) => (
          <div
            key={cloud.id}
            className="absolute"
            style={{
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              width: `${cloud.width}px`,
              height: `${cloud.height}px`,
              background: `radial-gradient(ellipse, rgba(255,255,255,${cloud.opacity}) 0%, rgba(255,220,235,${cloud.opacity * 0.5}) 50%, transparent 70%)`,
              filter: `blur(${cloud.blur}px)`,
              transform: `translate(${parallaxOffset.front.x}px, ${parallaxOffset.front.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}

      {/* Floating petals (moving light reflections like distant traffic) */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            animation: `pink-petal-float ${petal.duration}s ease-in-out infinite`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${petal.rotation}deg)` }}
          >
            <ellipse
              cx="12"
              cy="12"
              rx="6"
              ry="10"
              fill="url(#petalGradient)"
            />
            <defs>
              <radialGradient id="petalGradient" cx="50%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,182,193,0.8)" />
                <stop offset="100%" stopColor="rgba(219,112,147,0.3)" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}

      {/* Subtle texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft ambient glow behind vinyl area */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px]"
        style={{
          background: `radial-gradient(
            circle,
            rgba(244, 180, 200, 0.25) 0%,
            rgba(248, 200, 218, 0.15) 30%,
            rgba(252, 220, 235, 0.08) 50%,
            transparent 70%
          )`,
          filter: "blur(40px)",
        }}
      />

      {/* Delicate sparkle particles (scattered stars) */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full animate-pink-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(244,180,200,0.5) 100%)`,
            opacity: sparkle.opacity,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}

      {/* Light reflection streaks (edge glows) */}
      <div
        className="absolute top-0 left-1/4 w-[1px] h-full opacity-25"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.7) 20%,
            rgba(255,182,193,0.4) 50%,
            rgba(255,255,255,0.7) 80%,
            transparent 100%
          )`,
        }}
      />
      <div
        className="absolute top-0 right-1/3 w-[1px] h-full opacity-20"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.5) 30%,
            rgba(219,112,147,0.3) 60%,
            transparent 100%
          )`,
        }}
      />
      <div
        className="absolute top-0 left-[60%] w-[1px] h-full opacity-15"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,192,203,0.6) 40%,
            rgba(255,255,255,0.4) 70%,
            transparent 100%
          )`,
        }}
      />

      {/* Soft billboard-like glow patches */}
      <div
        className="absolute top-[15%] left-[10%] w-20 h-12 rounded-lg opacity-30"
        style={{
          background: `linear-gradient(135deg, rgba(255,182,193,0.5) 0%, rgba(255,105,180,0.3) 100%)`,
          filter: "blur(15px)",
          animation: "pink-billboard-flicker 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-[25%] right-[15%] w-16 h-10 rounded-lg opacity-25"
        style={{
          background: `linear-gradient(135deg, rgba(219,112,147,0.4) 0%, rgba(255,182,193,0.3) 100%)`,
          filter: "blur(12px)",
          animation: "pink-billboard-flicker 5s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />
    </div>
  )
}
