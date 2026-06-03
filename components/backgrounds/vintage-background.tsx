"use client"

import { useEffect, useState, useRef, useCallback } from "react"

export function VintageBackground() {
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

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-[-20px]"
        style={{
          backgroundImage: "url('/images/vintage-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
          transition: "transform 0.5s ease-out",
          filter: "blur(2px)",
        }}
      />

      {/* Warm golden color overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 20%, rgba(255, 200, 100, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(180, 120, 60, 0.15) 0%, transparent 40%)
          `,
        }}
      />

      {/* Sepia/warm tint overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "rgba(40, 25, 10, 0.45)",
        }}
      />

      {/* Soft vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(20, 10, 5, 0.55) 100%)`,
        }}
      />

      {/* Film grain / old movie effect */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
