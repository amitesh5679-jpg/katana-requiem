"use client"

import { useState } from "react"
import Image from "next/image"
import type { HashiraTitle } from "@/lib/types"

interface HashiraCardProps {
  hashira: HashiraTitle
  onClick: () => void
  size?: "normal" | "large"
}

export function HashiraCard({ hashira, onClick, size = "normal" }: HashiraCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isLarge = size === "large"

  const getTypeLabel = () => {
    if (hashira.type === "demon-lord") return "DEMON LORD"
    if (hashira.type === "upper-moon") return "UPPER MOON"
    return "HASHIRA"
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all duration-500 rounded-xl overflow-hidden group ${
        isLarge ? "min-h-[320px]" : "min-h-[200px]"
      }`}
      style={{
        border: `2px solid ${hashira.color}40`,
        background: `linear-gradient(145deg, ${hashira.bgColor} 0%, #000000 100%)`,
        boxShadow: isHovered 
          ? `0 0 40px ${hashira.color}40, 0 0 80px ${hashira.color}20, inset 0 0 60px ${hashira.color}10`
          : `0 0 15px ${hashira.color}15`,
        transform: isHovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        {!imageError && hashira.anime && (
          <Image
            src={hashira.anime}
            alt={hashira.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered ? "scale-105 opacity-50" : "scale-100 opacity-35"
            }`}
            style={{
              objectPosition: "center 20%",
              filter: `saturate(${isHovered ? 1.3 : 1}) contrast(${isHovered ? 1.1 : 1.05})`,
              imageRendering: "auto",
            }}
            onError={() => setImageError(true)}
            unoptimized
            priority
          />
        )}
        {/* Sharper gradient overlay */}
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(180deg, ${hashira.bgColor}40 0%, ${hashira.bgColor}70 40%, ${hashira.bgColor}95 70%, ${hashira.bgColor} 100%)`,
          }}
        />
        {/* Vignette effect for cleaner look */}
        <div 
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 60px ${hashira.bgColor}`,
          }}
        />
      </div>

      {/* Type badge */}
      <div 
        className="absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full z-10 backdrop-blur-sm"
        style={{ 
          backgroundColor: `${hashira.color}25`,
          color: hashira.color,
          border: `1px solid ${hashira.color}40`,
        }}
      >
        {getTypeLabel()}
      </div>

      {/* Animated glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center bottom, ${hashira.color}30 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col justify-end ${isLarge ? "p-6" : "p-4"}`}>
        {/* Title */}
        <h3 
          className={`font-bold transition-all duration-300 ${isLarge ? "text-2xl" : "text-lg"}`}
          style={{ 
            color: hashira.color,
            textShadow: isHovered 
              ? `0 0 30px ${hashira.color}, 0 2px 10px rgba(0,0,0,0.8)` 
              : `0 2px 8px rgba(0,0,0,0.6)`,
          }}
        >
          {hashira.title}
        </h3>

        {/* Holder */}
        <p className={`text-foreground/70 mt-1 ${isLarge ? "text-base" : "text-sm"}`}>
          {hashira.holder === "Pending" ? (
            <span className="italic text-muted-foreground">Awaiting Champion...</span>
          ) : (
            <span className="font-semibold">{hashira.holder}</span>
          )}
        </p>

        {/* Description preview on hover */}
        <div 
          className={`mt-3 leading-relaxed transition-all duration-500 overflow-hidden ${
            isHovered ? (isLarge ? "max-h-28 opacity-100" : "max-h-20 opacity-100") : "max-h-0 opacity-0"
          } ${isLarge ? "text-sm" : "text-xs"}`}
          style={{ color: `${hashira.color}dd` }}
        >
          {hashira.desc.slice(0, isLarge ? 200 : 120)}...
        </div>

        {/* Click hint */}
        <div 
          className={`mt-2 text-xs uppercase tracking-wider transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          style={{ color: `${hashira.color}80` }}
        >
          Click for details
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 h-1 transition-all duration-700"
        style={{ 
          width: isHovered ? "100%" : "0%",
          background: `linear-gradient(90deg, ${hashira.color}, ${hashira.color}80, transparent)`,
          boxShadow: isHovered ? `0 0 20px ${hashira.color}` : "none",
        }}
      />

      {/* Corner accents */}
      <div 
        className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl transition-all duration-500"
        style={{ 
          borderColor: isHovered ? hashira.color : `${hashira.color}30`,
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl transition-all duration-500"
        style={{ 
          borderColor: isHovered ? hashira.color : `${hashira.color}30`,
        }}
      />
    </div>
  )
}
