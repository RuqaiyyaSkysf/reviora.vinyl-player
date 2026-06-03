"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"

interface NeonLight {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

export function NightCityBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [flickerStates, setFlickerStates] = useState<boolean[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Neon window colors
  const neonColors = useMemo(() => [
    "#a855f7", // Purple
    "#3b82f6", // Blue
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#8b5cf6", // Violet
    "#f0abfc", // Light pink
    "#7dd3fc", // Light blue
  ], [])

  // Generate scattered neon window lights
  const neonLights = useMemo(() => {
    const lights: NeonLight[] = []
    for (let i = 0; i < 80; i++) {
      lights.push({
        id: i,
        x: Math.random() * 100,
        y: 25 + Math.random() * 55, // Keep in building area
        size: 2 + Math.random() * 4,
        color: neonColors[Math.floor(Math.random() * neonColors.length)],
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      })
    }
    return lights
  }, [neonColors])

  // Initialize flicker states
  useEffect(() => {
    setFlickerStates(neonLights.map(() => Math.random() > 0.3))
  }, [neonLights])

  // Random window flickering
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setFlickerStates(prev => prev.map((state, i) => {
        if (Math.random() > 0.95) {
          return !state
        }
        return state
      }))
    }, 600)

    return () => clearInterval(flickerInterval)
  }, [])

  // Mouse parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  const parallax = {
    x: (mousePosition.x - 0.5) * 25,
    y: (mousePosition.y - 0.5) * 12,
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Background image with parallax */}
      <div 
        className="absolute inset-[-30px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.08)`,
        }}
      >
        <img
          src="/images/nightcity-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center center",
          }}
        />
      </div>

      {/* Atmospheric haze layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, 
              rgba(15, 10, 25, 0.7) 0%, 
              rgba(15, 10, 25, 0.3) 20%,
              transparent 50%
            )
          `,
        }}
      />

      {/* Scattered neon window lights overlay */}
      {neonLights.map((light, i) => (
        <div
          key={light.id}
          className="absolute rounded-sm transition-opacity duration-500"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            width: `${light.size}px`,
            height: `${light.size * 1.3}px`,
            backgroundColor: flickerStates[i] ? light.color : "transparent",
            boxShadow: flickerStates[i] 
              ? `0 0 ${light.size * 2}px ${light.color}, 0 0 ${light.size * 4}px ${light.color}60`
              : "none",
            opacity: flickerStates[i] ? 0.9 : 0,
          }}
        />
      ))}

      {/* Neon glow from buildings at horizon */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 50% at 50% 100%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 25% 100%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 60% 40% at 75% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse 40% 30% at 50% 100%, rgba(6, 182, 212, 0.12) 0%, transparent 35%)
          `,
        }}
      />

      {/* Moving traffic/vehicle lights at bottom */}
      <div className="absolute bottom-[5%] left-0 right-0 h-[15%] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const direction = i % 2 === 0 ? "left" : "right"
          const speed = 12 + Math.random() * 15
          const yPos = Math.random() * 100
          const colors = ["#ec4899", "#a855f7", "#06b6d4", "#fbbf24", "#f43f5e", "#8b5cf6"]
          const color = colors[Math.floor(Math.random() * colors.length)]
          const size = 2 + Math.random() * 3
          
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${yPos}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                boxShadow: `0 0 ${size * 4}px ${color}, 0 0 ${size * 8}px ${color}60`,
                animation: `traffic-${direction} ${speed}s linear infinite`,
                animationDelay: `${-Math.random() * speed}s`,
              }}
            />
          )
        })}
      </div>

      {/* Ground level reflections */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[4%] pointer-events-none"
        style={{
          background: "rgba(5, 3, 12, 0.9)",
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 25% 300% at 20% 0%, rgba(147, 51, 234, 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 20% 300% at 40% 0%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse 22% 300% at 60% 0%, rgba(236, 72, 153, 0.35) 0%, transparent 55%),
              radial-gradient(ellipse 20% 300% at 80% 0%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Fog layers for depth */}
      <div 
        className="absolute bottom-[15%] left-0 right-0 h-[20%] pointer-events-none"
        style={{
          background: `linear-gradient(
            to top,
            rgba(15, 10, 25, 0.5) 0%,
            rgba(15, 10, 25, 0.2) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* Upper atmosphere darkening */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(5, 3, 12, 0.5) 0%, rgba(5, 3, 12, 0.2) 20%, transparent 40%)",
        }}
      />

      {/* Vignette for cinematic depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(5, 3, 12, 0.6) 100%)",
        }}
      />

      {/* Subtle film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
