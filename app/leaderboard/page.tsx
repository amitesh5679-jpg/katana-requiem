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

  const month = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    month: "long",
  }).toUpperCase();

  const year = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
  });

  return `DAY ${day} • MONTH OF ${month} • YEAR ${year}`;
}

function getISTDate() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function getISTStartOfDay() {
  const ist = getISTDate();
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), ist.getDate(), -5, -30, 0));
}

function getISTStartOfWeek() {
  const ist = getISTDate();
  const day = ist.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  return new Date(
    Date.UTC(
      ist.getFullYear(),
      ist.getMonth(),
      ist.getDate() - diffToMonday,
      -5,
      -30,
      0
    )
  );
}

function getISTStartOfMonth() {
  const ist = getISTDate();
  return new Date(Date.UTC(ist.getFullYear(), ist.getMonth(), 1, -5, -30, 0));
}

function formatDiff(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function getBaseSnapshot(snapshots: Snapshot[], target: Date) {
  const beforeTarget = snapshots.find(
    (s) => new Date(s.recorded_at).getTime() <= target.getTime()
  );

  return beforeTarget ?? snapshots[snapshots.length - 1];
}

function getPlayerData(rows: Snapshot[]) {
  const grouped = new Map<string, Snapshot[]>();

  const startOfToday = getISTStartOfDay();
  const startOfWeek = getISTStartOfWeek();
  const startOfMonth = getISTStartOfMonth();

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
    const previous = snapshots[1] ?? latest;

    const dayBase = getBaseSnapshot(snapshots, startOfToday);
    const weekBase = getBaseSnapshot(snapshots, startOfWeek);
    const monthBase = getBaseSnapshot(snapshots, startOfMonth);

    return {
      username,
      rating: latest.rating,
      games: latest.games ?? 0,
      bestMode: latest.best_mode ?? "Unknown",

      previousRating: previous.rating,
      risingDifference: latest.rating - previous.rating,

      dayBaseRating: dayBase.rating,
      todayIncrease: latest.rating - dayBase.rating,

      weekBaseRating: weekBase.rating,
      weekIncrease: latest.rating - weekBase.rating,

      monthBaseRating: monthBase.rating,
      monthIncrease: latest.rating - monthBase.rating,
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
      "username,rating,games,rapid_rating,blitz_rating,bullet_rating,best_mode,recorded_at"
    )
    .order("recorded_at", { ascending: false });

  const { data: legends } = await supabase
    .from("hall_of_legends")
    .select("username,title,month,year")
    .order("created_at", { ascending: false });

  const players = getPlayerData((snapshots ?? []) as Snapshot[]);

  const highestRating = [...players].sort((a, b) => b.rating - a.rating);
  const mostGames = [...players].sort((a, b) => b.games - a.games);
  const risingSlayer = [...players].sort((a, b) => b.risingDifference - a.risingDifference);
  const dailySurge = [...players].sort((a, b) => b.todayIncrease - a.todayIncrease);
  const weeklySurge = [...players].sort((a, b) => b.weekIncrease - a.weekIncrease);
  const monthlySurge = [...players].sort((a, b) => b.monthIncrease - a.monthIncrease);

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
              Latest data synced using IST timeline.
            </div>
          </div>

          <div className="mt-6">
            <Link href="/" className="border border-red-500 rounded-lg px-4 py-2 hover:bg-red-950/40">
              ← Return to Main Gate
            </Link>
          </div>
        </div>

        <Section
          title="👑 Crowned Rating Lords"
          desc="Top 3 warriors with the highest current rating."
          color="yellow"
        >
          {highestRating.slice(0, 3).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.rating}`}
              subValue={`Best Mode: ${player.bestMode}`}
            />
          ))}
        </Section>

        <Section
          title="⚔️ Battle Frenzy Champion"
          desc="The warrior who played the most games today."
          color="cyan"
        >
          <PlayerCard
            rank={1}
            username={mostGames[0]?.username ?? "Awaiting Warrior"}
            mainValue={`${mostGames[0]?.games ?? 0} games`}
            subValue={`Rating: ${mostGames[0]?.rating ?? 0}`}
          />
        </Section>

        <Section
          title="🔥 Rising Slayer"
          desc="Biggest rating jump from the previous update to the latest update."
          color="orange"
        >
          <PlayerCard
            rank={1}
            username={risingSlayer[0]?.username ?? "Awaiting Slayer"}
            mainValue={formatDiff(risingSlayer[0]?.risingDifference ?? 0)}
            subValue={`${risingSlayer[0]?.previousRating ?? 0} → ${risingSlayer[0]?.rating ?? 0}`}
          />
        </Section>

        <Section
          title="🌅 Dawn Breathing Surge"
          desc="Highest rating gain today, calculated from the start of the IST day."
          color="red"
        >
          <PlayerCard
            rank={1}
            username={dailySurge[0]?.username ?? "Awaiting Slayer"}
            mainValue={formatDiff(dailySurge[0]?.todayIncrease ?? 0)}
            subValue={`${dailySurge[0]?.dayBaseRating ?? 0} → ${dailySurge[0]?.rating ?? 0} today`}
          />
        </Section>

        <Section
          title="⚡ Thunder Week Ascension"
          desc="Highest rating gain this week, calculated from Monday 00:00 IST."
          color="purple"
        >
          <PlayerCard
            rank={1}
            username={weeklySurge[0]?.username ?? "Awaiting Slayer"}
            mainValue={formatDiff(weeklySurge[0]?.weekIncrease ?? 0)}
            subValue={`${weeklySurge[0]?.weekBaseRating ?? 0} → ${weeklySurge[0]?.rating ?? 0} this week`}
          />
        </Section>

        <Section
          title="🌙 Moonlit Month Rise"
          desc="Highest rating gain this month, calculated from the 1st day of the month in IST."
          color="blue"
        >
          <PlayerCard
            rank={1}
            username={monthlySurge[0]?.username ?? "Awaiting Slayer"}
            mainValue={formatDiff(monthlySurge[0]?.monthIncrease ?? 0)}
            subValue={`${monthlySurge[0]?.monthBaseRating ?? 0} → ${monthlySurge[0]?.rating ?? 0} this month`}
          />
        </Section>

        <div className="border border-zinc-700 rounded-xl p-6 mt-6 bg-black/40">
          <h2 className="text-3xl font-bold">🏛 Hall of Legends</h2>

          <p className="text-zinc-400 mt-2">
            Monthly legends and permanent title holders.
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
  desc,
  color,
  children,
}: {
  title: string;
  desc: string;
  color: "yellow" | "cyan" | "orange" | "red" | "purple" | "blue";
  children: ReactNode;
}) {
  const style = {
    yellow: "border-yellow-500 bg-yellow-950/20 text-yellow-300",
    cyan: "border-cyan-500 bg-cyan-950/20 text-cyan-300",
    orange: "border-orange-500 bg-orange-950/20 text-orange-300",
    red: "border-red-500 bg-red-950/20 text-red-300",
    purple: "border-purple-500 bg-purple-950/20 text-purple-300",
    blue: "border-blue-500 bg-blue-950/20 text-blue-300",
  };

  return (
    <section className={`border rounded-xl p-6 mb-6 animate-pulse-glow ${style[color]}`}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-zinc-400 mt-2">{desc}</p>
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
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

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