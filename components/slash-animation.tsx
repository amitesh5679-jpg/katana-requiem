"use client"

import { useEffect, useState } from "react"

export function SlashAnimation() {
  const [showScar, setShowScar] = useState(false)
  const [showSlash, setShowSlash] = useState(true)

  useEffect(() => {
    const scarTimer = setTimeout(() => setShowScar(true), 400)
    const slashTimer = setTimeout(() => setShowSlash(false), 700)
    return () => {
      clearTimeout(scarTimer)
      clearTimeout(slashTimer)
    }
  }, [])

  return (
    <>
      {/* Sharp Slash effect */}
      {showSlash && (
        <div className="absolute -top-20 -left-[100px] w-[200%] h-[300%] pointer-events-none overflow-hidden">
          {/* Main slash blade */}
          <div
            className="absolute inset-0 animate-sharp-slash"
            style={{
              background: `linear-gradient(
                90deg, 
                transparent 0%, 
                transparent 35%,
                rgba(255,255,255,0.1) 38%,
                rgba(255,255,255,0.9) 45%,
                #ffffff 48%,
                #ffffff 50%,
                #ffffff 52%,
                rgba(255,200,100,0.9) 55%,
                rgba(255,100,0,0.8) 60%,
                rgba(255,0,0,0.6) 65%,
                transparent 70%,
                transparent 100%
              )`,
              clipPath: "polygon(0% 45%, 100% 40%, 100% 55%, 0% 60%)",
            }}
          />
          {/* Secondary glow trail */}
          <div
            className="absolute inset-0 animate-sharp-slash-delayed"
            style={{
              background: `linear-gradient(
                90deg, 
                transparent 0%, 
                transparent 40%,
                rgba(255,100,0,0.4) 50%,
                rgba(255,50,0,0.3) 60%,
                transparent 70%,
                transparent 100%
              )`,
              clipPath: "polygon(0% 42%, 100% 37%, 100% 58%, 0% 63%)",
              filter: "blur(3px)",
            }}
          />
        </div>
      )}
      
      {/* Clean scar line */}
      {showScar && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] pointer-events-none">
          {/* Glow layer */}
          <div
            className="absolute inset-0 h-[8px] -rotate-[15deg] animate-scar-glow"
            style={{
              background: "linear-gradient(90deg, transparent 5%, rgba(255,50,0,0.6) 20%, rgba(255,0,0,0.8) 50%, rgba(255,50,0,0.6) 80%, transparent 95%)",
              filter: "blur(4px)",
            }}
          />
          {/* Core scar line */}
          <div
            className="absolute inset-0 h-[3px] -rotate-[15deg] animate-scar"
            style={{
              background: "linear-gradient(90deg, transparent 5%, #ff3300 15%, #ff0000 30%, #cc0000 50%, #ff0000 70%, #ff3300 85%, transparent 95%)",
              boxShadow: "0 0 10px rgba(255,0,0,0.8), 0 0 20px rgba(255,50,0,0.5)",
            }}
          />
        </div>
      )}
    </>
  )
}
