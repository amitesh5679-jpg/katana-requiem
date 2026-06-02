export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type Snapshot = {
  username: string;
  rating: number;
  games: number | null;
  rapid_rating: number | null;
  blitz_rating: number | null;
  bullet_rating: number | null;
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

function getLatestSnapshots(rows: Snapshot[]) {
  const latestMap = new Map<string, Snapshot>();

  for (const row of rows) {
    const username = row.username.trim();
    if (!username) continue;

    const cleanRow = { ...row, username };
    const existing = latestMap.get(username);

    if (
      !existing ||
      new Date(cleanRow.recorded_at).getTime() >
        new Date(existing.recorded_at).getTime()
    ) {
      latestMap.set(username, cleanRow);
    }
  }

  return Array.from(latestMap.values());
}

export default async function LeaderboardPage() {
  await fetch("https://katana-requiem.vercel.app/update-ratings?x=999", {
    cache: "no-store",
  });

  const { data: snapshots } = await supabase
    .from("rating_snapshots")
    .select(
      "username,rating,games,rapid_rating,blitz_rating,bullet_rating,best_mode,recorded_at"
    )
    .order("recorded_at", { ascending: false });

  const { data: legends } = await supabase
    .from("hall_of_legends")
    .select("username,title,month,year")
    .order("created_at", { ascending: false });

  const latest = getLatestSnapshots((snapshots ?? []) as Snapshot[]);

  const highestRating = [...latest].sort((a, b) => b.rating - a.rating);
  const mostGames = [...latest].sort((a, b) => (b.games ?? 0) - (a.games ?? 0));

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#090303] to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-red-500 animate-pulse-glow">
            ⚔️ KATANA REQUIEM ⚔️
          </h1>

          <h2 className="text-2xl text-yellow-400 mt-3">Ranking Chamber</h2>

          <p className="text-zinc-400 mt-4 italic">
            Every Master Was Once Defeated. Every Legend Was Once Unranked.
          </p>

          <div className="mt-5 inline-block border border-red-700 rounded-xl px-5 py-3 bg-red-950/20 animate-pulse-glow">
            <div className="text-red-400 text-sm tracking-[0.3em]">
              ⚔ CURRENT ERA ⚔
            </div>

            <div className="text-yellow-400 text-2xl font-bold mt-2">
              {getDateLabel()}
            </div>

            <div className="text-zinc-500 text-xs mt-2">
              Latest data synced from the Ratings Update Chamber.
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="border border-red-500 rounded-lg px-4 py-2 hover:bg-red-950/40"
            >
              ← Return to Main Gate
            </Link>
          </div>
        </div>

        <Section title="👑 Highest Rating" color="yellow">
          {highestRating.slice(0, 5).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.rating}`}
              subValue={`Best Mode: ${player.best_mode ?? "Unknown"}`}
            />
          ))}
        </Section>

        <Section title="⚔️ Most Games Played Today" color="cyan">
          {mostGames.slice(0, 5).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.games ?? 0} games`}
              subValue={`Rating: ${player.rating}`}
            />
          ))}
        </Section>

        <Section title="📜 All Slayers" color="red">
          <div className="grid md:grid-cols-2 gap-4">
            {latest.map((player) => (
              <div
                key={player.username}
                className="border border-white/10 rounded-xl p-4 bg-black/40"
              >
                <div className="font-bold text-red-300">{player.username}</div>
                <div className="text-zinc-300 mt-2">Rating: {player.rating}</div>
                <div className="text-zinc-300">Games Today: {player.games ?? 0}</div>
                <div className="text-zinc-400 text-sm mt-2">
                  Rapid {player.rapid_rating ?? 0} • Blitz {player.blitz_rating ?? 0} • Bullet{" "}
                  {player.bullet_rating ?? 0}
                </div>
                <div className="text-zinc-500 text-xs mt-2">
                  Best Mode: {player.best_mode ?? "Unknown"}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="border border-zinc-700 rounded-xl p-6 mt-6 bg-black/40">
          <h2 className="text-3xl font-bold">🏛 Hall of Legends</h2>

          <p className="text-zinc-400 mt-2">
            Names engraved here shall never fade from the history of Katana Requiem.
          </p>

          <div className="mt-6 space-y-4">
            {(legends ?? []).length === 0 ? (
              <div className="text-zinc-500">Awaiting the first legend...</div>
            ) : (
              (legends ?? []).map((legend) => (
                <div
                  key={`${legend.username}-${legend.month}-${legend.year}`}
                  className="border-l-4 border-purple-500 pl-4"
                >
                  <div className="text-purple-300 font-bold">
                    {legend.month} {legend.year}
                  </div>

                  <div className="text-zinc-300">🌙 {legend.title}</div>

                  <div className="text-yellow-400">{legend.username}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: "yellow" | "cyan" | "red";
  children: ReactNode;
}) {
  const style = {
    yellow: "border-yellow-500 bg-yellow-950/20 text-yellow-300",
    cyan: "border-cyan-500 bg-cyan-950/20 text-cyan-300",
    red: "border-red-500 bg-red-950/20 text-red-300",
  };

  return (
    <section className={`border rounded-xl p-6 mb-6 animate-pulse-glow ${style[color]}`}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
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
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between items-center bg-black/30">
      <div>
        <div className="font-bold">
          {medal} {username}
        </div>
        <div className="text-sm text-zinc-500">{subValue}</div>
      </div>

      <div className="text-green-400 text-xl font-bold">{mainValue}</div>
    </div>
  );
}