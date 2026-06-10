export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type Snapshot = {
  username: string;
  rating: number;
  games: number | null;
  wins_today: number | null;
  wins_this_week: number | null;
  current_win_streak: number | null;
  best_mode: string | null;
  recorded_at: string;
};

function getDateLabel() {
  const now = new Date();

  const day = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
  });

  const month = now
    .toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: "long",
    })
    .toUpperCase();

  const year = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
  });

  return `DAY ${day} • MONTH OF ${month} • YEAR ${year}`;
}

function getPlayerData(rows: Snapshot[]) {
  const grouped = new Map<string, Snapshot[]>();

  for (const row of rows) {
    const username = row.username.trim();
    if (!username) continue;

    if (!grouped.has(username)) grouped.set(username, []);
    grouped.get(username)!.push({ ...row, username });
  }

  return Array.from(grouped.entries()).map(([username, snapshots]) => {
    snapshots.sort(
      (a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    );

    const latest = snapshots[0];

    return {
      username,
      rating: latest.rating ?? 0,
      gamesToday: latest.games ?? 0,
      winsToday: latest.wins_today ?? 0,
      winsThisWeek: latest.wins_this_week ?? 0,
      currentWinStreak: latest.current_win_streak ?? 0,
      bestMode: latest.best_mode ?? "Unknown",
    };
  });
}

export default async function LeaderboardPage() {
  await fetch("https://katana-requiem.vercel.app/update-ratings?x=999", {
    cache: "no-store",
  });

  const { data: snapshots } = await supabase
    .from("rating_snapshots")
    .select(
      "username,rating,games,wins_today,wins_this_week,current_win_streak,best_mode,recorded_at"
    )
    .order("recorded_at", { ascending: false });

  const players = getPlayerData((snapshots ?? []) as Snapshot[]);

  const crownedRatingLords = [...players].sort((a, b) => b.rating - a.rating);
  const dailyGrinder = [...players].sort((a, b) => b.gamesToday - a.gamesToday);
  const demonSlayer = [...players].sort((a, b) => b.winsToday - a.winsToday);
  const consecutiveKing = [...players].sort(
    (a, b) => b.currentWinStreak - a.currentWinStreak
  );
  const moonHunter = [...players].sort(
    (a, b) => b.winsThisWeek - a.winsThisWeek
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030303] text-white p-6">
      <div className="training-bg" />

<div className="moon-orb" />

<div className="fog fog-one" />
<div className="fog fog-two" />

<div className="falling-leaves">
  {Array.from({ length: 18 }).map((_, i) => (
    <span key={i} className={`leaf leaf-${i + 1}`}>
      ❦
    </span>
  ))}
</div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0a0a_0%,transparent_35%),linear-gradient(to_bottom,#050505,#120505,#020202)]" />
      <div className="absolute top-10 right-10 h-40 w-40 rounded-full bg-yellow-200/10 blur-sm" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.04),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-950/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,.7)]">
            ⚔️ KATANA REQUIEM ⚔️
          </h1>

          <h2 className="text-2xl text-yellow-400 mt-3">
            Hashira Training Ground
          </h2>

          <p className="text-zinc-400 mt-4 italic">
            Train. Fight. Rise. Let the rankings remember your name.
          </p>

          <div className="mt-5 inline-block border border-red-700 rounded-xl px-5 py-3 bg-black/50 shadow-[0_0_25px_rgba(127,29,29,.6)]">
            <div className="text-red-400 text-sm tracking-[0.3em]">
              ⚔ CURRENT ERA ⚔
            </div>

            <div className="text-yellow-400 text-2xl font-bold mt-2">
              {getDateLabel()}
            </div>

            <div className="text-zinc-500 text-xs mt-2">
              Synced with IST timeline.
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/?v=title-update"
              prefetch={false}
              className="border border-red-500 rounded-lg px-4 py-2 hover:bg-red-950/40"
            >
              ← Return to Main Gate
            </Link>
          </div>
        </div>

        <LeaderboardSection
          title="👑 Crowned Rating Lords"
          desc="Highest current rating."
          color="yellow"
          players={crownedRatingLords}
          value={(p) => `${p.rating}`}
          sub={(p) => `Best Mode: ${p.bestMode}`}
        />

        <LeaderboardSection
          title="⚔️ Daily Grinder"
          desc="Most games played today."
          color="cyan"
          players={dailyGrinder}
          value={(p) => `${p.gamesToday} games`}
          sub={(p) => `${p.winsToday} wins today`}
        />

        <LeaderboardSection
          title="👹 Demon Slayer"
          desc="Most wins today."
          color="red"
          players={demonSlayer}
          value={(p) => `${p.winsToday} wins`}
          sub={(p) => `${p.gamesToday} games today`}
        />

        <LeaderboardSection
          title="🔥 Consecutive King"
          desc="Current active win streak."
          color="orange"
          players={consecutiveKing}
          value={(p) => `${p.currentWinStreak} streak`}
          sub={() => "Active win streak"}
        />

        <LeaderboardSection
          title="🌙 Moon Hunter"
          desc="Most wins this week."
          color="purple"
          players={moonHunter}
          value={(p) => `${p.winsThisWeek} wins`}
          sub={(p) => `${p.winsToday} wins today`}
        />
      </div>
    </main>
  );
}

type Player = ReturnType<typeof getPlayerData>[number];

function LeaderboardSection({
  title,
  desc,
  color,
  players,
  value,
  sub,
}: {
  title: string;
  desc: string;
  color: "yellow" | "cyan" | "red" | "orange" | "purple";
  players: Player[];
  value: (player: Player) => string;
  sub: (player: Player) => string;
}) {
  return (
    <Section title={title} desc={desc} color={color}>
      {players.slice(0, 3).map((player, index) => (
        <PlayerCard
          key={player.username}
          rank={index + 1}
          username={player.username}
          mainValue={value(player)}
          subValue={sub(player)}
        />
      ))}
    </Section>
  );
}

function Section({
  title,
  desc,
  color,
  children,
}: {
  title: string;
  desc: string;
  color: "yellow" | "cyan" | "red" | "orange" | "purple";
  children: ReactNode;
}) {
  const style = {
    yellow: "border-yellow-500/70 bg-yellow-950/20 text-yellow-300 shadow-yellow-500/10",
    cyan: "border-cyan-500/70 bg-cyan-950/20 text-cyan-300 shadow-cyan-500/10",
    red: "border-red-500/70 bg-red-950/20 text-red-300 shadow-red-500/10",
    orange: "border-orange-500/70 bg-orange-950/20 text-orange-300 shadow-orange-500/10",
    purple: "border-purple-500/70 bg-purple-950/20 text-purple-300 shadow-purple-500/10",
  };

  return (
    <section
      className={`relative overflow-hidden border rounded-3xl p-6 mb-8 backdrop-blur-md shadow-2xl ${style[color]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/40 pointer-events-none" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-black tracking-wide">{title}</h2>
            <p className="text-zinc-400 mt-2">{desc}</p>
          </div>

          <div className="hidden md:block text-xs tracking-[0.35em] text-zinc-500">
            TOP 3
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-5">{children}</div>
      </div>
    </section>
  );
}

function PlayerCard({
  rank,
  username,
  mainValue,
  subValue,
}: {
  rank: number;
  username: string;
  mainValue: string;
  subValue: string;
}) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  const rankStyle =
  rank === 1
    ? "md:-translate-y-4 md:scale-110 border-yellow-400/70 bg-gradient-to-b from-yellow-950/40 to-black/70 shadow-[0_0_35px_rgba(250,204,21,.25)]"
    : rank === 2
    ? "border-zinc-300/40 bg-gradient-to-b from-zinc-800/35 to-black/60"
    : "border-orange-500/40 bg-gradient-to-b from-orange-950/30 to-black/60";
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border ${rankStyle} shadow-[0_0_24px_rgba(0,0,0,.65)] transition-transform duration-300 hover:-translate-y-1`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.08),transparent)] opacity-60 pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="text-4xl">{medal}</div>

          <div className="text-xs tracking-[0.25em] text-zinc-500">
            RANK {rank}
          </div>
        </div>

        <div className="font-black mt-4 text-lg break-words text-white">
          {username}
        </div>

        <div className="text-sm text-zinc-500 mt-1">{subValue}</div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
          <div className="text-xs text-zinc-500 tracking-[0.2em]">SCORE</div>
          <div className="text-green-400 text-3xl font-black mt-1">
            {mainValue}
          </div>
        </div>
      </div>
    </div>
  );
}