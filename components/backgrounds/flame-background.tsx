"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"

interface Ember {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  horizontalDrift: number
  opacity: number
}

export function FlameBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate floating ember particles
  const embers = useMemo(() => {
    const generatedEmbers: Ember[] = []
    for (let i = 0; i < 50; i++) {
      generatedEmbers.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 1.5,
        duration: 6 + Math.random() * 5,
        delay: Math.random() * 10,
        horizontalDrift: (Math.random() - 0.5) * 60,
        opacity: 0.4 + Math.random() * 0.5,
      })
    }
    return generatedEmbers
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
    x: (mousePosition.x - 0.5) * 20,
    y: (mousePosition.y - 0.5) * 10,
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Background image with parallax */}
      <div 
        className="absolute inset-[-20px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.05)`,
        }}
      >
        <img
          src="/images/flame-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center bottom",
          }}
        />
      </div>

      {/* Enhanced heat glow overlay at bottom */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120% 40% at 50% 100%, rgba(255, 120, 50, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 30% 100%, rgba(255, 80, 30, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 80% 30% at 70% 100%, rgba(255, 80, 30, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle heat shimmer effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255, 100, 50, 0.06) 0%, transparent 35%)",
          animation: "heat-wave 5s ease-in-out infinite",
        }}
      />

      {/* Ember particles floating upward */}
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            bottom: "5%",
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            background: `radial-gradient(circle, 
              rgba(255, 220, 180, ${ember.opacity}) 0%, 
              rgba(255, 140, 60, ${ember.opacity * 0.7}) 40%, 
              rgba(255, 80, 30, ${ember.opacity * 0.3}) 70%,
              transparent 100%
            )`,
            boxShadow: `0 0 ${ember.size * 3}px rgba(255, 140, 60, ${ember.opacity * 0.5})`,
            animation: `ember-float ${ember.duration}s ease-out infinite`,
            animationDelay: `${ember.delay}s`,
            "--ember-drift": `${ember.horizontalDrift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Flickering glow layer */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 60% at 25% 100%, rgba(255, 100, 50, 0.15) 0%, transparent 100%),
            radial-gradient(ellipse 50% 60% at 75% 100%, rgba(255, 100, 50, 0.15) 0%, transparent 100%)
          `,
          animation: "flame-flicker 2.5s ease-in-out infinite",
        }}
      />

      {/* Darker overlay at top for contrast */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 30%, transparent 60%)",
        }}
      />

      {/* Vignette for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />

      {/* Subtle blur at very bottom to blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[5%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(20, 5, 0, 0.6) 0%, transparent 100%)",
        }}
      />
    </div>
  )
}
