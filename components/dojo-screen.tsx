"use client"

import { useState, useEffect } from "react"
import { HashiraCard } from "./hashira-card"
import { HashiraModal } from "./hashira-modal"
import type { PlayerData, HashiraTitle } from "@/lib/types"

type TitleWithId = HashiraTitle & { id: string }

const DEFAULT_HASHIRA: TitleWithId[] = [
  {
    id: "flame",
    title: "Flame Hashira",
    holder: "Pending",
    desc: "Kyojuro Rengoku - Master of Flame Breathing. An aggressive warrior who burns through opponents with relentless, passionate attacks. His unwavering courage and burning determination inspire all who witness his battles. 'Set your heart ablaze!'",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-g1ueMfchGGdSGpXV6KvZYQb5IdhftO.png",
    color: "#ff6b00",
    bgColor: "#3d1a00",
    type: "hashira",
  },
  {
    id: "water",
    title: "Water Hashira",
    holder: "Pending",
    desc: "Giyu Tomioka - Master of Water Breathing. Calm and precise, flowing through the game with elegant, adaptable moves. The foundation of all breathing styles. His stoic demeanor hides immense skill and deep loyalty.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Qlz0R7eGio0ipJUHOgTa5Cb7i69VqK.png",
    color: "#00bfff",
    bgColor: "#001a2e",
    type: "hashira",
  },
  {
    id: "thunder",
    title: "Thunder Hashira",
    holder: "Pending",
    desc: "Zenitsu Agatsuma - Master of Thunder Breathing. Lightning-fast strikes and explosive speed. Defeats opponents before they can react with devastating single blows. When he sleeps, his true power awakens!",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sV5NFqaJes8PDWkKBjBZe9gmaalhdE.png",
    color: "#ffd700",
    bgColor: "#3d3200",
    type: "hashira",
  },
  {
    id: "beast",
    title: "Beast Hashira",
    holder: "Pending",
    desc: "Inosuke Hashibira - Master of Beast Breathing. A self-taught warrior with wild, unpredictable movements. Raised by boars, he fights with primal instincts and dual serrated blades. 'I am the king of the mountains!'",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ADjfIoI25vLZGTxw2lrvImXjpCT8rs.png",
    color: "#4169e1",
    bgColor: "#0a1428",
    type: "hashira",
  },
  {
    id: "stone",
    title: "Stone Hashira",
    holder: "Pending",
    desc: "Gyomei Himejima - Master of Stone Breathing. The strongest Hashira with overwhelming power and unshakeable defense. An immovable force who wields a spiked flail and axe with devastating precision.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-izjWY8WOWPShjM79sZY7kIu8PGmgRi.png",
    color: "#a0a0a0",
    bgColor: "#1a1a1a",
    type: "hashira",
  },
  {
    id: "mist",
    title: "Mist Hashira",
    holder: "Pending",
    desc: "Muichiro Tokito - Master of Mist Breathing. Elusive and mysterious, confusing opponents with subtle, obscuring play. A prodigy who achieved Hashira rank at just 14 years old. His detached demeanor hides incredible talent.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gBIcBtejRKXrPF2F4p6CpWYLQ25FV0.png",
    color: "#b0c4de",
    bgColor: "#141a22",
    type: "hashira",
  },
  {
    id: "love",
    title: "Love Hashira",
    holder: "Pending",
    desc: "Mitsuri Kanroji - Master of Love Breathing. Flexible and unpredictable with whip-like attacks. Combines incredible strength with graceful, flowing movements. Her unique muscle composition grants superhuman power.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BsZOgJqw6EWuCz7VBAo2DaDmxwqtUM.png",
    color: "#ff69b4",
    bgColor: "#2a0f1e",
    type: "hashira",
  },
  {
    id: "serpent",
    title: "Serpent Hashira",
    holder: "Pending",
    desc: "Obanai Iguro - Master of Serpent Breathing. Sinuous and unpredictable movements that twist around enemy defenses. Strikes with deadly precision from impossible angles with his twisted blade.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ia37hE4IekiQoGSbcjzsOKHFhUwTyu.png",
    color: "#9370db",
    bgColor: "#1a1028",
    type: "hashira",
  },
  {
    id: "sound",
    title: "Sound Hashira",
    holder: "Pending",
    desc: "Tengen Uzui - Master of Sound Breathing. Flamboyant and explosive, reading opponent rhythms to create devastating counter-attacks. A former shinobi who fights with flashy, overwhelming power. 'Flamboyantly!'",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k4LPlH3jFYBZM4v0KeTWicrLvh4uP5.png",
    color: "#00ffff",
    bgColor: "#002828",
    type: "hashira",
  },
  {
    id: "insect",
    title: "Insect Hashira",
    holder: "Pending",
    desc: "Shinobu Kocho - Master of Insect Breathing. Compensates for lack of strength with speed, precision, and deadly wisteria poison. Every small cut leads to inevitable victory. A gentle smile hiding lethal intent.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-m4SsFEgv05rFCRSyCtUod0UcKHYnAx.png",
    color: "#da70d6",
    bgColor: "#281028",
    type: "hashira",
  },
]

const DEFAULT_UPPER_MOONS: TitleWithId[] = [
  {
    id: "upper1",
    title: "Upper Moon One",
    holder: "Pending",
    desc: "Kokushibo - The strongest Upper Moon and twin brother of the original Sun Breather. A former demon slayer who mastered Moon Breathing. Over 400 years of combat experience makes him nearly invincible.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xGlKqGF5fNjsnuRLGNhm8zX6n2h7m4.png",
    color: "#9400d3",
    bgColor: "#140014",
    type: "upper-moon",
  },
  {
    id: "upper2",
    title: "Upper Moon Two",
    holder: "Pending",
    desc: "Doma - Master of cryokinesis and Blood Demon Art. A manipulative fighter who freezes opponents with ice techniques while maintaining an unsettling calm demeanor. Leader of a religious cult, devoid of human emotion.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VmN9SMXmsgGySQtLEwgFYAAQheRmMx.png",
    color: "#00ced1",
    bgColor: "#001414",
    type: "upper-moon",
  },
  {
    id: "upper3",
    title: "Upper Moon Three",
    holder: "Pending",
    desc: "Akaza - Pure martial arts master. Refuses to use tricks, fighting with raw power and technique. Respects strength and seeks the ultimate battle. His Compass Needle technique detects fighting spirit.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jbCE7lTy26Ch59mMgaPkxmr5u5gNq7.png",
    color: "#ff4500",
    bgColor: "#1a0500",
    type: "upper-moon",
  },
]

const DEFAULT_DEMON_LORD: TitleWithId[] = [
  {
    id: "demon",
    title: "Demon Lord",
    holder: "Pending",
    desc: "Muzan Kibutsuji - The Demon King and progenitor of all demons. Over 1000 years old with absolute power. Controls the board with overwhelming presence and adapts to destroy any opponent. The ultimate predator.",
    anime: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CiyFtpYKgwrX3uhldiVSqZkRHKWLGX.png",
    color: "#dc143c",
    bgColor: "#140005",
    type: "demon-lord",
  },
]

interface DojoScreenProps {
  playerData: PlayerData
  hashiraTitles: any[]
  onAdminUpdate: (titles: any[]) => void
}

function mergeSaved(defaultList: TitleWithId[], savedTitles: any[]) {
  const byId = new Map(savedTitles.map((t) => [t.id, t.holder]))
  const byTitle = new Map(savedTitles.map((t) => [t.title, t.holder]))

  return defaultList.map((item) => ({
    ...item,
    holder: byId.get(item.id) || byTitle.get(item.title) || item.holder,
  }))
}

function toSupabaseRows(titles: TitleWithId[]) {
  return titles.map((t) => ({
    id: t.id,
    title: t.title,
    holder: t.holder,
    color: t.color,
    image: t.anime,
  }))
}

export function DojoScreen({ playerData, hashiraTitles, onAdminUpdate }: DojoScreenProps) {
  const [selectedHashira, setSelectedHashira] = useState<HashiraTitle | null>(null)

  const [hashiraList, setHashiraList] = useState<TitleWithId[]>(DEFAULT_HASHIRA)
  const [upperMoonList, setUpperMoonList] = useState<TitleWithId[]>(DEFAULT_UPPER_MOONS)
  const [demonLordList, setDemonLordList] = useState<TitleWithId[]>(DEFAULT_DEMON_LORD)

  useEffect(() => {
    setHashiraList(mergeSaved(DEFAULT_HASHIRA, hashiraTitles))
    setUpperMoonList(mergeSaved(DEFAULT_UPPER_MOONS, hashiraTitles))
    setDemonLordList(mergeSaved(DEFAULT_DEMON_LORD, hashiraTitles))
  }, [hashiraTitles])

  const blitzRating = playerData.stats.chess_blitz?.last?.rating || "N/A"
  const rapidRating = playerData.stats.chess_rapid?.last?.rating || "N/A"
  const bulletRating = playerData.stats.chess_bullet?.last?.rating || "N/A"

  const handleAdminAccess = async () => {
    const password = prompt("Enter admin password:")

    if (password !== "56790") {
      alert("Access denied.")
      return
    }

    const allTitles = [...hashiraList, ...upperMoonList, ...demonLordList]

    const input = prompt(
      "Edit titles like this: Title:Username | Title:Username",
      allTitles.map((h) => `${h.title}:${h.holder}`).join(" | ")
    )

    if (!input) return

    const updates = new Map(
      input.split("|").map((x) => {
        const firstColon = x.indexOf(":")
        if (firstColon === -1) return ["", "Pending"]

        const title = x.slice(0, firstColon).trim()
        const holder = x.slice(firstColon + 1).trim() || "Pending"

        return [title, holder]
      })
    )

    const newHashira = hashiraList.map((h) => ({
      ...h,
      holder: updates.get(h.title) || h.holder,
    }))

    const newUpperMoons = upperMoonList.map((h) => ({
      ...h,
      holder: updates.get(h.title) || h.holder,
    }))

    const newDemonLord = demonLordList.map((h) => ({
      ...h,
      holder: updates.get(h.title) || h.holder,
    }))

    setHashiraList(newHashira)
    setUpperMoonList(newUpperMoons)
    setDemonLordList(newDemonLord)

    const rowsForSupabase = [
      ...toSupabaseRows(newHashira),
      ...toSupabaseRows(newUpperMoons),
      ...toSupabaseRows(newDemonLord),
    ]

    await onAdminUpdate(rowsForSupabase)

    alert("Saved. Everyone will see the updated title holders now.")
  }

  return (
    <div className="text-center relative z-10">
      <div className="mb-8">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-[0.15em] mb-2"
          style={{
            background: "linear-gradient(180deg, #ffd700 0%, #ff6600 50%, #cc3300 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 60px rgba(255,102,0,0.5)",
            filter: "drop-shadow(0 0 30px rgba(255,102,0,0.3))",
          }}
        >
          KATANA REQUIEM
        </h1>
        <div className="h-[2px] w-48 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto mb-12 px-4">
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-orange-600/30 to-red-900/30 animate-pulse" />
          <div className="relative bg-gradient-to-b from-[#1a0800] via-[#200a00] to-[#1a0800] border-2 border-primary/60 p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-2xl text-primary">&#9876;</span>
              <h2 className="text-xl md:text-2xl font-bold text-primary tracking-wider">
                THE HALL OF FAME : KATANA REQUIEM
              </h2>
              <span className="text-2xl text-primary">&#9876;</span>
            </div>

            <p className="text-foreground/90 text-base leading-relaxed mb-4">
              Every title carries a story. Below are the Hashira and Demon Title Holders who have carved their names into legend through determination, skill, and sacrifice.
            </p>

            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-bold text-primary mb-2">
                "Don't just move the pieces. Command the blade. Set your heart ablaze and cut through the fog of the opening!"
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mb-16">
        <div className="relative bg-card/60 backdrop-blur-md border border-primary/30 rounded-xl p-6 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            {playerData.profile.avatar && (
              <img
                src={playerData.profile.avatar}
                alt={playerData.profile.username}
                className="w-16 h-16 rounded-full border-2 border-primary/50"
              />
            )}
            <h2 className="text-2xl font-bold text-primary">{playerData.profile.username}</h2>
          </div>

          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bullet</div>
              <div className="text-xl font-bold text-yellow-400">{bulletRating}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Blitz</div>
              <div className="text-xl font-bold text-orange-400">{blitzRating}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rapid</div>
              <div className="text-xl font-bold text-blue-400">{rapidRating}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-12" style={{ color: "#8b0000" }}>
          DEMONS
        </h2>

        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold tracking-wider mb-8" style={{ color: "#dc143c" }}>
            DEMON LORD
          </h3>

          <div className="max-w-xl mx-auto px-4">
            {demonLordList.map((demon) => (
              <HashiraCard
                key={demon.id}
                hashira={demon}
                onClick={() => setSelectedHashira(demon)}
                size="large"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-wider mb-8" style={{ color: "#ff4500" }}>
            UPPER MOONS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
            {upperMoonList.map((demon) => (
              <HashiraCard
                key={demon.id}
                hashira={demon}
                onClick={() => setSelectedHashira(demon)}
                size="large"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-12" style={{ color: "#ffd700" }}>
          HASHIRA PILLARS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
          {hashiraList.map((hashira) => (
            <HashiraCard
              key={hashira.id}
              hashira={hashira}
              onClick={() => setSelectedHashira(hashira)}
              size="large"
            />
          ))}
        </div>
      </div>

      <div className="mt-8 pb-8">
        <button
          onClick={handleAdminAccess}
          className="text-muted-foreground/40 hover:text-muted-foreground/70 text-xs tracking-wider uppercase transition-all duration-300"
        >
          Admin Access
        </button>
      </div>

      <HashiraModal hashira={selectedHashira} onClose={() => setSelectedHashira(null)} />
    </div>
  )
}