"use client"

import { useEffect, useState } from "react"
import { KatanaTitle } from "@/components/katana-title"
import { UsernameForm } from "@/components/username-form"
import { PlayerPreview } from "@/components/player-preview"
import { DojoScreen } from "@/components/dojo-screen"
import { ParticleBackground } from "@/components/particle-background"
import { supabase } from "@/lib/supabase"
import type { PlayerData, HashiraTitle } from "@/lib/types"

export default function KatanaRequiem() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [screen, setScreen] = useState<"landing" | "preview" | "dojo">("landing")
  const [hashiraTitles, setHashiraTitles] = useState<HashiraTitle[]>([])

  async function loadHashiraTitles() {
    const { data, error } = await supabase
      .from("hashira_titles")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error loading Hashira titles:", error)
      return
    }

    setHashiraTitles((data ?? []) as HashiraTitle[])
  }

  useEffect(() => {
    loadHashiraTitles()
  }, [])

  const handlePlayerFound = (data: PlayerData) => {
    setPlayerData(data)
    setScreen("preview")
  }

  const handleEnterDojo = async () => {
    await loadHashiraTitles()
    setScreen("dojo")
  }

  const handleAdminUpdate = async (titles: HashiraTitle[]) => {
    setHashiraTitles(titles)

    const { error } = await supabase
      .from("hashira_titles")
      .upsert(titles, { onConflict: "id" })

    if (error) {
      console.error("Error saving Hashira titles:", error)
      alert("Title update failed. Check Supabase table.")
      return
    }

    await loadHashiraTitles()
    alert("Titles updated for everyone.")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0505] to-[#030303] py-8 px-4 relative overflow-hidden">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {screen === "landing" && (
          <div className="flex flex-col items-center gap-8 pt-12">
            <KatanaTitle />

            <p className="text-xl text-primary/80 text-center">
              ⚔️ Cut Through Fate. Rule the Board. Become Legend. ⚔️
            </p>

            <UsernameForm onPlayerFound={handlePlayerFound} />
          </div>
        )}

        {screen === "preview" && playerData && (
          <div className="flex flex-col items-center gap-8 pt-12">
            <KatanaTitle />
            <PlayerPreview playerData={playerData} onEnterDojo={handleEnterDojo} />
          </div>
        )}

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