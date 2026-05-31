"use client"

import { useState } from "react"
import { KatanaTitle } from "@/components/katana-title"
import { UsernameForm } from "@/components/username-form"
import { PlayerPreview } from "@/components/player-preview"
import { DojoScreen } from "@/components/dojo-screen"
import { ParticleBackground } from "@/components/particle-background"
import type { PlayerData, HashiraTitle } from "@/lib/types"

// Store hashira titles in localStorage for persistence (in production, use Firebase)
const STORAGE_KEY = "katana-requiem-hashira"

function getStoredHashira(): HashiraTitle[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHashira(titles: HashiraTitle[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(titles))
}

export default function KatanaRequiem() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [screen, setScreen] = useState<"landing" | "preview" | "dojo">("landing")
  const [hashiraTitles, setHashiraTitles] = useState<HashiraTitle[]>([])

  const handlePlayerFound = (data: PlayerData) => {
    setPlayerData(data)
    setScreen("preview")
  }

  const handleEnterDojo = () => {
    const stored = getStoredHashira()
    setHashiraTitles(stored)
    setScreen("dojo")
  }

  const handleAdminUpdate = (titles: HashiraTitle[]) => {
    setHashiraTitles(titles)
    saveHashira(titles)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0505] to-[#030303] py-8 px-4 relative overflow-hidden">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Landing Screen */}
        {screen === "landing" && (
          <div className="flex flex-col items-center gap-8 pt-12">
            <KatanaTitle />
            <p className="text-xl text-primary/80 text-center">
              ⚔️ Cut Through Fate. Rule the Board. Become Legend. ⚔️
            </p>
            <UsernameForm onPlayerFound={handlePlayerFound} />
          </div>
        )}

        {/* Preview Screen */}
        {screen === "preview" && playerData && (
          <div className="flex flex-col items-center gap-8 pt-12">
            <KatanaTitle />
            <PlayerPreview playerData={playerData} onEnterDojo={handleEnterDojo} />
          </div>
        )}

        {/* Dojo Screen */}
        {screen === "dojo" && playerData && (
          <DojoScreen
            playerData={playerData}
            hashiraTitles={hashiraTitles}
            onAdminUpdate={handleAdminUpdate}
          />
        )}
      </div>
    </main>
  )
}
