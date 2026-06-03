"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"

export function GothicBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

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
    x: (mousePosition.x - 0.5) * 20,
    y: (mousePosition.y - 0.5) * 10,
  }

  // Floating dust/light particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.4 + 0.1,
      drift: Math.random() * 40 - 20,
    }))
  }, [])

  // Fog layers
  const fogLayers = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      duration: 40 + i * 15,
      delay: i * 8,
      yPosition: 60 + i * 10,
      opacity: 0.15 - i * 0.03,
    }))
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Background image with parallax */}
      <div 
        className="absolute inset-[-30px]"
        style={{
          backgroundImage: "url('/images/gothic-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* Moonlight beam from top right */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 80% at 85% -10%, rgba(180, 190, 220, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 80% 10%, rgba(140, 130, 180, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Distant fog/haze layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(60, 50, 90, 0.3) 0%, transparent 40%)`,
        }}
      />

      {/* Animated fog layers */}
      {fogLayers.map((fog) => (
        <div
          key={fog.id}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${fog.yPosition}%`,
            height: "30%",
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(80, 70, 120, ${fog.opacity}) 20%, 
              rgba(100, 90, 140, ${fog.opacity * 1.2}) 50%, 
              rgba(80, 70, 120, ${fog.opacity}) 80%, 
              transparent 100%
            )`,
            animation: `fog-drift ${fog.duration}s linear infinite`,
            animationDelay: `${fog.delay}s`,
            filter: "blur(20px)",
          }}
        />
      ))}

      {/* Floating light particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(200, 190, 230, ${particle.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(180, 170, 220, ${particle.opacity * 0.5})`,
            animation: `dust-float ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            transform: `translateX(${particle.drift}px)`,
          }}
        />
      ))}

      {/* Purple/blue atmospheric color overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 75% 15%, rgba(100, 80, 160, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(60, 50, 100, 0.15) 0%, transparent 40%)
          `,
        }}
      />

      {/* Ground mist glow */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(70, 60, 110, 0.25) 0%, transparent 100%)`,
          filter: "blur(10px)",
        }}
      />

      {/* Dark overlay for UI readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(8, 5, 18, 0.4)",
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(5, 2, 15, 0.7) 100%)`,
        }}
      />
    </div>
  )
}
