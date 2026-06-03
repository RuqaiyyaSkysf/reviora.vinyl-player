"use client"

import { useMemo, useEffect, useState } from "react"

interface Building {
  id: number
  x: number
  width: number
  height: number
  layer: "back" | "front"
  windows: Window[]
}

interface Window {
  id: number
  x: number
  y: number
  width: number
  height: number
  lit: boolean
  flickerDelay: number
}

export function NightCityBackground() {
  const [windowStates, setWindowStates] = useState<Record<string, boolean>>({})

  // Generate buildings with useMemo
  const buildings = useMemo(() => {
    const generatedBuildings: Building[] = []
    let buildingId = 0
    let windowId = 0

    // Back layer - smaller, distant buildings
    for (let i = 0; i < 20; i++) {
      const x = (i * 5) + Math.random() * 2
      const width = 3 + Math.random() * 4
      const height = 15 + Math.random() * 20

      const windows: Window[] = []
      const windowCols = Math.floor(width / 1.2)
      const windowRows = Math.floor(height / 4)

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          windows.push({
            id: windowId++,
            x: (col + 0.5) * (100 / windowCols),
            y: 10 + row * (80 / windowRows),
            width: 60 / windowCols,
            height: 2,
            lit: Math.random() > 0.4,
            flickerDelay: Math.random() * 10,
          })
        }
      }

      generatedBuildings.push({
        id: buildingId++,
        x,
        width,
        height,
        layer: "back",
        windows,
      })
    }

    // Front layer - larger, closer buildings
    for (let i = 0; i < 12; i++) {
      const x = (i * 8) + Math.random() * 3
      const width = 5 + Math.random() * 6
      const height = 25 + Math.random() * 30

      const windows: Window[] = []
      const windowCols = Math.floor(width / 1.5)
      const windowRows = Math.floor(height / 5)

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          windows.push({
            id: windowId++,
            x: (col + 0.5) * (100 / windowCols),
            y: 8 + row * (85 / windowRows),
            width: 50 / windowCols,
            height: 2.5,
            lit: Math.random() > 0.35,
            flickerDelay: Math.random() * 15,
          })
        }
      }

      generatedBuildings.push({
        id: buildingId++,
        x,
        width,
        height,
        layer: "front",
        windows,
      })
    }

    return generatedBuildings
  }, [])

  // Initialize window states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {}
    buildings.forEach(building => {
      building.windows.forEach(window => {
        const key = `${building.id}-${window.id}`
        initialStates[key] = window.lit
      })
    })
    setWindowStates(initialStates)
  }, [buildings])

  // Animate windows turning on/off
  useEffect(() => {
    const interval = setInterval(() => {
      setWindowStates(prev => {
        const newStates = { ...prev }
        // Randomly toggle a few windows
        const keys = Object.keys(newStates)
        const numToToggle = Math.floor(Math.random() * 5) + 1
        
        for (let i = 0; i < numToToggle; i++) {
          const randomKey = keys[Math.floor(Math.random() * keys.length)]
          if (Math.random() > 0.7) {
            newStates[randomKey] = !newStates[randomKey]
          }
        }
        return newStates
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const backBuildings = buildings.filter(b => b.layer === "back")
  const frontBuildings = buildings.filter(b => b.layer === "front")

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Night sky gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            #020010 0%, 
            #050520 20%, 
            #0a0a30 40%, 
            #0f0f35 60%, 
            #12122a 80%, 
            #0a0a1a 100%
          )`,
        }}
      />

      {/* Stars in the sky */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Distant city glow / light pollution */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 40% at 50% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 60%),
            radial-gradient(ellipse 80% 30% at 30% 95%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 80% 30% at 70% 95%, rgba(236, 72, 153, 0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Back layer buildings */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%]">
        {backBuildings.map((building) => (
          <div
            key={building.id}
            className="absolute bottom-0"
            style={{
              left: `${building.x}%`,
              width: `${building.width}%`,
              height: `${building.height}%`,
            }}
          >
            {/* Building silhouette */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, #0a0a18 0%, #0d0d20 50%, #0f0f25 100%)`,
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
              }}
            />
            {/* Building edge highlight */}
            <div
              className="absolute top-0 left-0 w-[1px] h-full"
              style={{
                background: "linear-gradient(to bottom, rgba(100, 100, 150, 0.3), transparent)",
              }}
            />
            {/* Windows */}
            {building.windows.map((window) => {
              const key = `${building.id}-${window.id}`
              const isLit = windowStates[key] ?? window.lit
              return (
                <div
                  key={window.id}
                  className="absolute transition-all duration-1000"
                  style={{
                    left: `${window.x}%`,
                    top: `${window.y}%`,
                    width: `${window.width}%`,
                    height: `${window.height}%`,
                    background: isLit 
                      ? `linear-gradient(135deg, rgba(254, 243, 199, 0.9) 0%, rgba(253, 230, 138, 0.8) 100%)`
                      : "rgba(20, 20, 40, 0.8)",
                    boxShadow: isLit 
                      ? `0 0 8px rgba(253, 230, 138, 0.5), 0 0 15px rgba(253, 230, 138, 0.2)`
                      : "none",
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Neon reflection glow between layers */}
      <div 
        className="absolute bottom-[20%] left-0 right-0 h-[25%] pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, 
              rgba(139, 92, 246, 0.05) 0%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* Front layer buildings */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%]">
        {frontBuildings.map((building) => (
          <div
            key={building.id}
            className="absolute bottom-0"
            style={{
              left: `${building.x}%`,
              width: `${building.width}%`,
              height: `${building.height}%`,
            }}
          >
            {/* Building silhouette - darker for front layer */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, #050510 0%, #080815 50%, #0a0a1a 100%)`,
                boxShadow: "0 0 30px rgba(0,0,0,0.5)",
              }}
            />
            {/* Building edge highlights */}
            <div
              className="absolute top-0 left-0 w-[2px] h-full"
              style={{
                background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.1), transparent)",
              }}
            />
            <div
              className="absolute top-0 right-0 w-[1px] h-full"
              style={{
                background: "linear-gradient(to bottom, rgba(236, 72, 153, 0.15), transparent)",
              }}
            />
            {/* Rooftop accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: "linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.3))",
              }}
            />
            {/* Windows */}
            {building.windows.map((window) => {
              const key = `${building.id}-${window.id}`
              const isLit = windowStates[key] ?? window.lit
              // Vary window colors slightly
              const hue = Math.random() > 0.7 ? "blue" : Math.random() > 0.5 ? "purple" : "warm"
              const windowColor = isLit 
                ? hue === "blue" 
                  ? "rgba(147, 197, 253, 0.9)"
                  : hue === "purple"
                  ? "rgba(196, 181, 253, 0.85)"
                  : "rgba(254, 243, 199, 0.9)"
                : "rgba(15, 15, 30, 0.9)"
              const glowColor = isLit
                ? hue === "blue"
                  ? "rgba(147, 197, 253, 0.4)"
                  : hue === "purple"
                  ? "rgba(196, 181, 253, 0.4)"
                  : "rgba(253, 230, 138, 0.4)"
                : "none"
              
              return (
                <div
                  key={window.id}
                  className="absolute transition-all duration-700"
                  style={{
                    left: `${window.x}%`,
                    top: `${window.y}%`,
                    width: `${window.width}%`,
                    height: `${window.height}%`,
                    background: windowColor,
                    boxShadow: isLit ? `0 0 10px ${glowColor}, 0 0 20px ${glowColor}` : "none",
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* Neon sign accents on some buildings */}
      <div className="absolute bottom-[35%] left-[15%] w-[3%] h-[1%]">
        <div 
          className="w-full h-full rounded-sm animate-pulse"
          style={{
            background: "rgba(236, 72, 153, 0.8)",
            boxShadow: "0 0 15px rgba(236, 72, 153, 0.6), 0 0 30px rgba(236, 72, 153, 0.3)",
          }}
        />
      </div>
      <div className="absolute bottom-[42%] right-[20%] w-[2%] h-[0.8%]">
        <div 
          className="w-full h-full rounded-sm animate-pulse"
          style={{
            background: "rgba(59, 130, 246, 0.8)",
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3)",
            animationDelay: "1s",
          }}
        />
      </div>
      <div className="absolute bottom-[38%] left-[45%] w-[2.5%] h-[0.6%]">
        <div 
          className="w-full h-full rounded-sm animate-pulse"
          style={{
            background: "rgba(139, 92, 246, 0.8)",
            boxShadow: "0 0 15px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)",
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Ground level neon reflections */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[8%]"
        style={{
          background: `linear-gradient(to top, 
            rgba(10, 10, 25, 1) 0%,
            rgba(10, 10, 25, 0.95) 30%,
            transparent 100%
          )`,
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-[5%]"
        style={{
          background: `
            linear-gradient(90deg,
              transparent 0%,
              rgba(139, 92, 246, 0.1) 20%,
              rgba(59, 130, 246, 0.08) 40%,
              rgba(236, 72, 153, 0.1) 60%,
              rgba(139, 92, 246, 0.08) 80%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Top vignette for player visibility */}
      <div 
        className="absolute inset-x-0 top-0 h-[30%]"
        style={{
          background: "linear-gradient(to bottom, rgba(2, 0, 16, 0.9) 0%, rgba(2, 0, 16, 0.5) 50%, transparent 100%)",
        }}
      />
    </div>
  )
}
