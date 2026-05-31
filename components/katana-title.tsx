"use client"

import { SlashAnimation } from "./slash-animation"

export function KatanaTitle() {
  return (
    <div className="relative py-8">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[200px] bg-gradient-radial from-primary/20 via-accent/5 to-transparent blur-3xl" />
      </div>
      
      {/* Title */}
      <h1 
        className="text-5xl md:text-7xl lg:text-8xl font-bold relative inline-block tracking-[0.15em]"
        style={{
          background: "linear-gradient(180deg, #ffd700 0%, #ff8c00 40%, #ff4500 70%, #cc2200 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 40px rgba(255, 102, 0, 0.4))",
        }}
      >
        KATANA REQUIEM
        <SlashAnimation />
      </h1>
      
      {/* Subtitle line */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-primary/60" />
        <span className="text-sm text-primary/60 uppercase tracking-[0.3em]">Chess Clan</span>
        <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-primary/60" />
      </div>
    </div>
  )
}
