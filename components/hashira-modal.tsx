"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import type { HashiraTitle, ChessPlayerProfile } from "@/lib/types"

interface HashiraModalProps {
  hashira: HashiraTitle | null
  onClose: () => void
}

export function HashiraModal({ hashira, onClose }: HashiraModalProps) {
  const [holderProfile, setHolderProfile] = useState<ChessPlayerProfile | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (hashira && hashira.holder !== "Pending") {
      fetch(`https://api.chess.com/pub/player/${hashira.holder}`)
        .then(res => res.json())
        .then(data => setHolderProfile(data))
        .catch(() => setHolderProfile(null))
    } else {
      setHolderProfile(null)
    }
    setImageError(false)
  }, [hashira])

  if (!hashira) return null

  const getTypeLabel = () => {
    if (hashira.type === "demon-lord") return "THE DEMON LORD"
    if (hashira.type === "upper-moon") return "TWELVE KIZUKI"
    return "DEMON SLAYER CORPS"
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with color tint */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        style={{
          background: `radial-gradient(circle at center, ${hashira.bgColor}80 0%, rgba(0,0,0,0.95) 70%)`,
        }}
      />
      
      {/* Modal */}
      <div
        className="relative max-w-2xl w-full rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${hashira.bgColor} 0%, #000000 100%)`,
          border: `2px solid ${hashira.color}50`,
          boxShadow: `0 0 80px ${hashira.color}30, 0 0 150px ${hashira.color}15`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background character image */}
        <div className="absolute inset-0 overflow-hidden">
          {!imageError && hashira.anime && (
            <Image
              src={hashira.anime}
              alt={hashira.title}
              fill
              className="object-cover opacity-15"
              style={{ objectPosition: "center top" }}
              onError={() => setImageError(true)}
              unoptimized
            />
          )}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${hashira.bgColor}40 0%, ${hashira.bgColor}95 50%, ${hashira.bgColor} 100%)`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start gap-6 mb-6">
            {/* Character portrait */}
            <div 
              className="relative w-36 h-36 rounded-xl overflow-hidden shrink-0"
              style={{
                border: `3px solid ${hashira.color}60`,
                boxShadow: `0 0 40px ${hashira.color}40`,
              }}
            >
              {!imageError && hashira.anime && (
                <Image
                  src={hashira.anime}
                  alt={hashira.title}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center top" }}
                  onError={() => setImageError(true)}
                  unoptimized
                />
              )}
            </div>

            <div className="flex-1 pt-2">
              {/* Type badge */}
              <div 
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider"
                style={{ 
                  backgroundColor: `${hashira.color}20`,
                  color: hashira.color,
                  border: `1px solid ${hashira.color}40`,
                }}
              >
                {getTypeLabel()}
              </div>

              {/* Title */}
              <h2 
                className="text-4xl font-bold mb-3"
                style={{ 
                  color: hashira.color,
                  textShadow: `0 0 50px ${hashira.color}80`,
                }}
              >
                {hashira.title}
              </h2>

              {/* Holder info */}
              {hashira.holder !== "Pending" ? (
                <div className="flex items-center gap-3">
                  {holderProfile?.avatar && (
                    <img 
                      src={holderProfile.avatar} 
                      alt={hashira.holder}
                      className="w-12 h-12 rounded-full border-2"
                      style={{ borderColor: hashira.color }}
                    />
                  )}
                  <div>
                    <p className="text-foreground font-bold text-lg">{hashira.holder}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Champion</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-lg">
                  Awaiting a worthy champion...
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div 
            className="h-[1px] w-full my-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${hashira.color}50, transparent)`,
            }}
          />

          {/* Description */}
          <div className="mb-8">
            <h3 
              className="text-xs uppercase tracking-widest mb-3 font-semibold"
              style={{ color: `${hashira.color}90` }}
            >
              About This Title
            </h3>
            <p className="text-foreground/90 leading-relaxed text-lg">
              {hashira.desc}
            </p>
          </div>

          {/* Tournament info */}
          <div 
            className="p-5 rounded-xl mb-6"
            style={{
              background: `${hashira.color}08`,
              border: `1px solid ${hashira.color}25`,
            }}
          >
            <p className="text-foreground/70 leading-relaxed">
              To claim this title, defeat the current champion or win the weekly tournament in the Katana Requiem Chess.com club.
            </p>
          </div>

          {/* Close button */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="px-10 py-3 font-bold text-base rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${hashira.color}30 0%, ${hashira.color}15 100%)`,
                border: `2px solid ${hashira.color}50`,
                color: hashira.color,
              }}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Corner decorations */}
        <div 
          className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl pointer-events-none"
          style={{ borderColor: `${hashira.color}30` }}
        />
        <div 
          className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl pointer-events-none"
          style={{ borderColor: `${hashira.color}30` }}
        />
      </div>
    </div>
  )
}
