"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { SOCIAL_LINKS } from "@/config/social-links"

export function CreatorCredit() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = sectionRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[220px] overflow-hidden"
      aria-label="Creator credits"
    >
      {/* Dark translucent glassmorphism panel — opaque backdrop with theme showing through slightly */}
      <div
        className={cn(
          "relative w-full min-h-[200px] flex items-center justify-center",
          "backdrop-blur-[14px]",
          "bg-black/60",
          "border-t border-white/[0.08]"
        )}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease-out",
        }}
      >
        {/* Soft top fade — blends the panel edge into the theme above */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* Content */}
        <div 
          className="relative z-10 flex flex-col items-center gap-2 py-6 px-6 w-full"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(32px)",
            opacity: isVisible ? 1 : 0,
            transition: "transform 0.6s ease-out 0.1s, opacity 0.6s ease-out 0.1s",
          }}
        >
          {/* REVIORA */}
          <h2 className="text-white text-2xl md:text-3xl font-light tracking-wide">
            REVIORA
          </h2>

          {/* A Rayality Project */}
          <p className="text-white/60 text-xs md:text-sm tracking-wider font-light">
            A Rayality Project
          </p>

          {/* Created by Raya Izel */}
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">
            Created by Raya Izel
          </p>

          {/* Tagline */}
          <p className="text-white/50 text-xs tracking-wide font-light italic mt-1">
            Building ideas into experiences
          </p>

          {/* Explore more */}
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase font-light mt-3">
            Explore more
          </p>

          {/* Social links */}
          <div 
            className="flex items-center justify-center gap-8 mt-3"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(16px)",
              opacity: isVisible ? 1 : 0,
              transition: "transform 0.6s ease-out 0.2s, opacity 0.6s ease-out 0.2s",
            }}
          >
            {/* Instagram */}
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-white/50 hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-white/50 hover:text-white transition-all duration-300"
              aria-label="YouTube"
            >
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href={SOCIAL_LINKS.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-white/50 hover:text-white transition-all duration-300"
              aria-label="Pinterest"
            >
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-white/50 hover:text-white transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg
                className="w-5 h-5 transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
            </a>
          </div>

          {/* Copyright - at the very bottom */}
          <p className="text-white/30 text-xs tracking-wide font-light mt-3 pt-3 border-t border-white/[0.08]">
            © 2026 Reviora. All Rights Reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
