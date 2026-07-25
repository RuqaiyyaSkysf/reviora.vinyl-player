"use client"

import { useEffect, useState, useMemo } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  twinkleDelay: number
  twinkleDuration: number
  brightness: "dim" | "normal" | "bright"
}

interface LargeStar {
  id: number
  x: number
  y: number
  size: number
  glowSize: number
  sparkleDelay: number
  color: string
}

interface ShootingStar {
  id: number
  startX: number
  startY: number
  angle: number // degrees
  duration: number
  trailLength: number
}

export function GalaxyBackground() {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  
  // Apply rendering optimizations for crisp appearance
  const containerStyle = {
    imageRendering: "crisp-edges" as const,
    WebkitFontSmoothing: "antialiased" as const,
    MozOsxFontSmoothing: "grayscale" as const,
  }

  // Generate static stars with good visibility
  const stars = useMemo(() => {
    const generatedStars: Star[] = []
    for (let i = 0; i < 180; i++) {
      const brightness = Math.random()
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Most stars are small but visible, some larger for depth
        size: brightness > 0.9 ? Math.random() * 1.5 + 1.5 : brightness > 0.6 ? Math.random() * 1 + 1 : Math.random() * 0.8 + 0.8,
        opacity: brightness > 0.9 ? 0.9 : brightness > 0.6 ? Math.random() * 0.4 + 0.5 : Math.random() * 0.3 + 0.3,
        twinkleDelay: Math.random() * 10,
        twinkleDuration: 3 + Math.random() * 5,
        brightness: brightness > 0.9 ? "bright" : brightness > 0.6 ? "normal" : "dim",
      })
    }
    return generatedStars
  }, [])

  // Generate larger glittering stars for depth
  const largeStars = useMemo(() => {
    const generatedLargeStars: LargeStar[] = []
    const colors = [
      "rgba(255, 255, 255, 1)", // White
      "rgba(220, 235, 255, 1)", // Blue-white
      "rgba(240, 230, 255, 1)", // Purple-white
      "rgba(255, 250, 240, 1)", // Warm white
    ]
    // 20 large stars for better depth
    for (let i = 0; i < 20; i++) {
      generatedLargeStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 2, // 2-4px core
        glowSize: Math.random() * 10 + 8, // 8-18px glow
        sparkleDelay: Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return generatedLargeStars
  }, [])

  // Cinematic shooting stars - one at a time, full screen diagonal travel
  useEffect(() => {
    let isAnimating = false
    
    const createShootingStar = () => {
      if (isAnimating) return
      isAnimating = true
      
      // Different spawn configurations for variety
      // Each has: startX (%), startY (%), angle (degrees from horizontal)
      const spawnConfigs = [
        // From top-left area, going down-right (angle ~30-45 degrees)
        { startX: -5, startY: -5 + Math.random() * 15, angle: 30 + Math.random() * 15 },
        { startX: Math.random() * 20, startY: -5, angle: 35 + Math.random() * 20 },
        // From top-right area, going down-left (angle ~135-150 degrees)
        { startX: 100 + Math.random() * 5, startY: -5 + Math.random() * 15, angle: 135 + Math.random() * 15 },
        { startX: 80 + Math.random() * 20, startY: -5, angle: 130 + Math.random() * 20 },
        // From top center, going diagonal either direction
        { startX: 30 + Math.random() * 40, startY: -5, angle: Math.random() > 0.5 ? 40 + Math.random() * 20 : 120 + Math.random() * 20 },
      ]
      
      const config = spawnConfigs[Math.floor(Math.random() * spawnConfigs.length)]
      
      const newStar: ShootingStar = {
        id: Date.now() + Math.random(),
        startX: config.startX,
        startY: config.startY,
        angle: config.angle,
        duration: 2.5 + Math.random() * 2, // 2.5-4.5 seconds for full screen travel
        trailLength: 120 + Math.random() * 80, // 120-200px trail
      }
      
      setShootingStars([newStar])
      
      // Remove after animation completes
      setTimeout(() => {
        setShootingStars([])
        isAnimating = false
      }, (newStar.duration + 0.5) * 1000)
    }

    // Create initial shooting star after a short delay
    const initialTimeout = setTimeout(createShootingStar, 3000)

    // Variable interval: 12-25 seconds between shooting stars
    let intervalId: NodeJS.Timeout
    
    const scheduleNext = () => {
      const nextDelay = 12000 + Math.random() * 13000
      intervalId = setTimeout(() => {
        createShootingStar()
        scheduleNext()
      }, nextDelay)
    }
    
    scheduleNext()

    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(intervalId)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden" style={containerStyle}>
      {/* Deep space base - very dark with subtle gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, #08040f 0%, #030108 50%, #010005 100%)`,
        }}
      />

      {/* Dark corners vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)
          `,
        }}
      />

      {/* Central galaxy cluster - purple and blue nebula */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(80, 40, 140, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 45% at 45% 55%, rgba(100, 50, 160, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 40% 35% at 55% 45%, rgba(60, 80, 180, 0.12) 0%, transparent 35%)
          `,
        }}
      />

      {/* Scattered nebula clouds */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 45% 35% at 25% 35%, rgba(70, 30, 120, 0.15) 0%, transparent 45%),
            radial-gradient(ellipse 50% 40% at 75% 60%, rgba(50, 40, 130, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 35% 30% at 65% 30%, rgba(40, 60, 140, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse 40% 35% at 30% 70%, rgba(90, 40, 150, 0.1) 0%, transparent 45%)
          `,
        }}
      />

      {/* Subtle deep blue cosmic accents */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30, 40, 100, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 35% 45%, rgba(20, 50, 120, 0.08) 0%, transparent 40%)
          `,
        }}
      />
      
      {/* Twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationName: star.brightness === "bright"
              ? "twinkle-bright"
              : star.brightness === "normal"
              ? "twinkle"
              : "twinkle-subtle",
            animationDuration: star.brightness === "dim" 
              ? `${star.twinkleDuration * 1.3}s` 
              : `${star.twinkleDuration}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${star.twinkleDelay}s`,
            boxShadow: star.brightness === "bright"
              ? `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.8), 0 0 ${star.size * 6}px rgba(200, 200, 255, 0.4)`
              : star.brightness === "normal"
              ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`
              : `0 0 ${star.size}px rgba(255, 255, 255, 0.3)`,
          }}
        />
      ))}

      {/* Larger glittering stars for depth */}
      {largeStars.map((star) => (
        <div
          key={`large-${star.id}`}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationName: "sparkle",
            animationDuration: `${4 + star.id * 0.15}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${star.sparkleDelay}s`,
          }}
        >
          {/* Outer glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${star.glowSize * 2}px`,
              height: `${star.glowSize * 2}px`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, rgba(180, 180, 255, 0.15) 0%, transparent 70%)`,
            }}
          />
          {/* Star core */}
          <div
            className="absolute rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: "translate(-50%, -50%)",
              background: star.color,
              boxShadow: `
                0 0 ${star.glowSize * 0.6}px rgba(255, 255, 255, 0.9),
                0 0 ${star.glowSize * 1.2}px rgba(200, 200, 255, 0.6),
                0 0 ${star.glowSize * 2}px rgba(150, 150, 255, 0.3)
              `,
            }}
          />
          {/* Cross rays */}
          <div
            className="absolute"
            style={{
              width: `${star.size * 5}px`,
              height: "1.5px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 75%, transparent 100%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: "1.5px",
              height: `${star.size * 5}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 75%, transparent 100%)",
            }}
          />
          {/* Diagonal rays for extra sparkle */}
          <div
            className="absolute"
            style={{
              width: `${star.size * 3}px`,
              height: "1px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: `${star.size * 3}px`,
              height: "1px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) rotate(-45deg)",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
            }}
          />
        </div>
      ))}

      {/* Shooting stars - full screen diagonal travel */}
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute pointer-events-none"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            // This outer container handles rotation only
            transform: `rotate(${star.angle}deg)`,
            transformOrigin: "left center",
          }}
        >
          {/* This inner container handles the translation animation */}
          <div
            className="shooting-star-mover"
            style={{
              animation: `shooting-star-move ${star.duration}s linear forwards`,
            }}
          >
            {/* Outer glow trail */}
            <div 
              className="absolute"
              style={{
                width: `${star.trailLength}px`,
                height: "14px",
                top: "-6px",
                right: "0",
                background: `linear-gradient(to left, rgba(255,255,255,0.25) 0%, rgba(180,170,255,0.15) 25%, rgba(140,130,220,0.08) 50%, transparent 100%)`,
                filter: "blur(5px)",
              }}
            />
            {/* Main bright trail */}
            <div 
              style={{
                width: `${star.trailLength}px`,
                height: "2px",
                background: `linear-gradient(to left, 
                  rgba(255,255,255,1) 0%,
                  rgba(255,255,255,0.9) 8%, 
                  rgba(230,220,255,0.6) 25%,
                  rgba(180,160,240,0.25) 50%,
                  rgba(140,120,220,0.08) 75%,
                  transparent 100%)`,
                boxShadow: `0 0 6px rgba(255,255,255,0.95), 0 0 14px rgba(180,170,255,0.5)`,
              }}
            />
            {/* Star head - bright point */}
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{
                right: `-4px`,
                width: "5px",
                height: "5px",
                boxShadow: `0 0 8px rgba(255,255,255,1), 0 0 18px rgba(255,255,255,0.95), 0 0 35px rgba(180,170,255,0.7)`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Subtle cosmic dust overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
