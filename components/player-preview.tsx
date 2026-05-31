"use client"

import Image from "next/image"
import type { PlayerData } from "@/lib/types"

interface PlayerPreviewProps {
  playerData: PlayerData
  onEnterDojo: () => void
}

export function PlayerPreview({ playerData, onEnterDojo }: PlayerPreviewProps) {
  return (
    <div className="relative max-w-md mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-transparent rounded-2xl blur-2xl" />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-b from-[#0a0505] to-[#050202] border-2 border-primary/30 rounded-2xl p-8 backdrop-blur-sm">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/60 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/60 rounded-br-2xl" />
        
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          {playerData.profile.avatar && (
            <div className="relative">
              {/* Avatar glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-110" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-3 border-primary shadow-lg shadow-primary/30">
                <Image
                  src={playerData.profile.avatar}
                  alt={playerData.profile.username}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}
          
          {/* Username */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Warrior Identified</p>
            <h2 className="text-3xl font-bold tracking-wide" style={{
              background: "linear-gradient(180deg, #ffd700 0%, #ff6600 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {playerData.profile.username}
            </h2>
          </div>
          
          {/* Stats preview */}
          {playerData.stats && (
            <div className="flex gap-4 text-sm">
              {playerData.stats.chess_bullet?.last?.rating && (
                <div className="text-center px-3 py-1 bg-card/50 rounded-lg border border-border/30">
                  <p className="text-muted-foreground text-xs">Bullet</p>
                  <p className="text-foreground font-bold">{playerData.stats.chess_bullet.last.rating}</p>
                </div>
              )}
              {playerData.stats.chess_blitz?.last?.rating && (
                <div className="text-center px-3 py-1 bg-card/50 rounded-lg border border-border/30">
                  <p className="text-muted-foreground text-xs">Blitz</p>
                  <p className="text-foreground font-bold">{playerData.stats.chess_blitz.last.rating}</p>
                </div>
              )}
              {playerData.stats.chess_rapid?.last?.rating && (
                <div className="text-center px-3 py-1 bg-card/50 rounded-lg border border-border/30">
                  <p className="text-muted-foreground text-xs">Rapid</p>
                  <p className="text-foreground font-bold">{playerData.stats.chess_rapid.last.rating}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Enter Button */}
          <button
            onClick={onEnterDojo}
            className="group relative mt-4 overflow-hidden"
          >
            {/* Button glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
            
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-[#1a0800] via-[#2a0f00] to-[#1a0800] border-2 border-primary/50 rounded-xl px-10 py-4 group-hover:border-primary transition-all group-hover:scale-105">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative text-xl font-bold tracking-wider" style={{
                background: "linear-gradient(180deg, #ffd700 0%, #ff6600 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                ENTER THE CLAN
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
