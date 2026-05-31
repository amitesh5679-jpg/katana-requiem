"use client"

import { useState } from "react"
import type { PlayerData } from "@/lib/types"

interface UsernameFormProps {
  onPlayerFound: (data: PlayerData) => void
}

export function UsernameForm({ onPlayerFound }: UsernameFormProps) {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkUsername = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${username}`),
        fetch(`https://api.chess.com/pub/player/${username}/stats`)
      ])

      if (!profileRes.ok) {
        throw new Error("Player not found")
      }

      const [profile, stats] = await Promise.all([
        profileRes.json(),
        statsRes.json()
      ])

      onPlayerFound({ profile, stats })
    } catch {
      setError("Player not found. Check the username and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative max-w-md mx-auto w-full px-4">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent rounded-2xl blur-2xl" />
      
      {/* Main form container */}
      <div className="relative bg-gradient-to-b from-[#0a0505]/90 to-[#050202]/90 border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />
        
        <div className="flex flex-col items-center gap-6">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Identify Yourself</p>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
          
          {/* Input */}
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Chess.com Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkUsername()}
              className="w-full bg-[#0a0505] border-2 border-primary/30 rounded-xl px-6 py-4 text-foreground text-center text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
            />
            {/* Input glow on focus */}
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl pointer-events-none" />
          </div>
          
          {/* Submit Button */}
          <button
            onClick={checkUsername}
            disabled={loading}
            className="group relative overflow-hidden disabled:opacity-50"
          >
            {/* Button glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />
            
            {/* Button content */}
            <div className="relative bg-gradient-to-r from-[#1a0800] via-[#2a0f00] to-[#1a0800] border-2 border-primary/40 rounded-xl px-10 py-3 group-hover:border-primary/70 transition-all group-hover:scale-105">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative text-lg font-bold tracking-wider" style={{
                background: "linear-gradient(180deg, #ffd700 0%, #ff6600 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {loading ? "SEARCHING..." : "CONFIRM IDENTITY"}
              </span>
            </div>
          </button>
          
          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
