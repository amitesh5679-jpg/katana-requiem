export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabase";

type Snapshot = {
  username: string;
  rating: number;
  games: number | null;
  recorded_at: string;
  rapid_rating: number | null;
  blitz_rating: number | null;
  bullet_rating: number | null;
  best_mode: string | null;
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

function getClosestSnapshotBefore(rows: Snapshot[], targetDate: Date) {
  const before = rows.filter((row) => new Date(row.recorded_at) <= targetDate);
  return before[before.length - 1] ?? rows[0];
}

function formatGain(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function calculateLeaderboard(rows: Snapshot[]) {
  const grouped: Record<string, Snapshot[]> = {};

  for (const row of rows) {
    if (!grouped[row.username]) grouped[row.username] = [];
    grouped[row.username].push(row);
  }

  const startOfToday = getISTStartOfDay();
  const startOfWeek = getISTStartOfWeek();
  const startOfMonth = getISTStartOfMonth();

  return Object.entries(grouped).map(([username, snapshots]) => {
    snapshots.sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    const first = snapshots[0];
    const latest = snapshots[snapshots.length - 1];

    const todayBase = getClosestSnapshotBefore(snapshots, startOfToday);
    const weekBase = getClosestSnapshotBefore(snapshots, startOfWeek);
    const monthBase = getClosestSnapshotBefore(snapshots, startOfMonth);

    const latestGames = latest.games ?? 0;
    const todayBaseGames = todayBase.games ?? 0;

    return {
      username,
      currentRating: latest.rating,
      netRating: latest.rating - first.rating,
      dailyGain: latest.rating - todayBase.rating,
      weeklyGain: latest.rating - weekBase.rating,
      monthlyGain: latest.rating - monthBase.rating,
      gamesToday: Math.max(0, latestGames - todayBaseGames),
    };
  });
}

export default async function LeaderboardPage() {
  const { data: snapshots } = await supabase
    .from("rating_snapshots")
    .select(
      "username,rating,games,recorded_at,rapid_rating,blitz_rating,bullet_rating,best_mode"
    )
    .order("recorded_at", { ascending: true });

  const { data: legends } = await supabase
    .from("hall_of_legends")
    .select("username,title,month,year")
    .order("created_at", { ascending: false });

  const rankings = calculateLeaderboard((snapshots ?? []) as Snapshot[]);

  const daily = [...rankings].sort((a, b) => b.dailyGain - a.dailyGain);
  const weekly = [...rankings].sort((a, b) => b.weeklyGain - a.weeklyGain);
  const monthly = [...rankings].sort((a, b) => b.monthlyGain - a.monthlyGain);
  const battle = [...rankings].sort((a, b) => b.gamesToday - a.gamesToday);

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
              The Ranking Chamber resets with every new dawn.
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

        <div className="border border-zinc-700 rounded-xl p-5 mb-8 bg-black/40">
          <h3 className="text-yellow-400 font-bold text-xl mb-3">
            📜 Ranking Guide
          </h3>

          <div className="space-y-2 text-zinc-300">
            <p>🔥 Growth Hashira — Highest net rating gain today.</p>
            <p>⚡ Ascending Hashira — Highest net rating gain this week.</p>
            <p>🌙 Demon Moon Ascension — Highest net rating gain this month.</p>
            <p>⚔️ Battle Frenzy — Most games played today.</p>
          </div>
        </div>

        <Section
          title="🔥 Growth Hashira"
          color="orange"
          desc="The warriors whose flames burned brightest today."
        >
          <Rank rank="🥇" data={daily[0]} value={formatGain(daily[0]?.dailyGain ?? 0)} label="rating today" />
          <Rank rank="🥈" data={daily[1]} value={formatGain(daily[1]?.dailyGain ?? 0)} label="rating today" />
          <Rank rank="🥉" data={daily[2]} value={formatGain(daily[2]?.dailyGain ?? 0)} label="rating today" />
        </Section>

        <Section
          title="⚡ Ascending Hashira"
          color="yellow"
          desc="The relentless slayer whose progress echoed through the week."
        >
          <Rank rank="⚡" data={weekly[0]} value={formatGain(weekly[0]?.weeklyGain ?? 0)} label="weekly rating" />
        </Section>

        <Section
          title="🌙 Demon Moon Ascension"
          color="purple"
          desc="The rise that rivaled the Upper Moons themselves."
        >
          <Rank rank="🌙" data={monthly[0]} value={formatGain(monthly[0]?.monthlyGain ?? 0)} label="monthly rating" />
        </Section>

        <Section
          title="⚔️ Battle Frenzy"
          color="cyan"
          desc="The warrior who fought the most battles today."
        >
          <Rank rank="⚔️" data={battle[0]} value={String(battle[0]?.gamesToday ?? 0)} label="games today" />
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

        <div className="mt-10 border border-red-900 rounded-xl p-6 text-center bg-black/40 animate-pulse-glow">
          <h2 className="text-2xl font-bold text-red-400">
            ⚔️ SLAYER&apos;S OATH ⚔️
          </h2>

          <p className="text-zinc-300 italic mt-3">
            The battles end. The rankings reset. But legends remain.
          </p>
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
  color: "orange" | "yellow" | "purple" | "cyan";
  children: ReactNode;
}) {
  const style = {
    orange: "border-orange-500 bg-orange-950/20 text-orange-300",
    yellow: "border-yellow-500 bg-yellow-950/20 text-yellow-300",
    purple: "border-purple-500 bg-purple-950/20 text-purple-300",
    cyan: "border-cyan-500 bg-cyan-950/20 text-cyan-300",
  };

  return (
    <div className={`border rounded-xl p-6 mb-6 animate-pulse-glow ${style[color]}`}>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-zinc-300 mt-2">{desc}</p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Rank({
  rank,
  data,
  value,
  label,
}: {
  rank: string;
  data:
    | {
        username: string;
        currentRating: number;
        netRating: number;
      }
    | undefined;
  value: string;
  label: string;
}) {
  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between items-center bg-black/30">
      <div>
        <div className="font-bold">
          {rank} {data?.username ?? "Awaiting Slayer"}
        </div>

        <div className="text-sm text-zinc-500">
          Current: {data?.currentRating ?? 0} • Net: {formatGain(data?.netRating ?? 0)}
        </div>
      </div>

      <div className="text-right">
        <div className="text-green-400 text-xl font-bold">{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  );
}