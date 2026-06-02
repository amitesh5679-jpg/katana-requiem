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
  return value > 0 ? `+${value}` : String(value);
}

function calculateLeaderboard(rows: Snapshot[]) {
  const grouped: Record<string, Snapshot[]> = {};

  for (const row of rows) {
    const cleanUsername = row.username.trim();

    if (!grouped[cleanUsername]) grouped[cleanUsername] = [];

    grouped[cleanUsername].push({
      ...row,
      username: cleanUsername,
    });
  }

  const startOfToday = getISTStartOfDay();
  const startOfWeek = getISTStartOfWeek();
  const startOfMonth = getISTStartOfMonth();

  return Object.entries(grouped).map(([username, snapshots]) => {
    snapshots.sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    const latest = snapshots[snapshots.length - 1];

    const todayBase = getClosestSnapshotBefore(snapshots, startOfToday);
    const weekBase = getClosestSnapshotBefore(snapshots, startOfWeek);
    const monthBase = getClosestSnapshotBefore(snapshots, startOfMonth);

    return {
      username,
      dailyGain: latest.rating - todayBase.rating,
      weeklyGain: latest.rating - weekBase.rating,
      monthlyGain: latest.rating - monthBase.rating,
      gamesToday: latest.games ?? 0,
    };
  });
}

export default async function LeaderboardPage() {
  await fetch("https://katana-requiem.vercel.app/update-ratings?x=999", {
    cache: "no-store",
  });

  const { data: snapshots } = await supabase
    .from("rating_snapshots")
    .select("username,rating,games,recorded_at")
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
            <Link href="/" className="border border-red-500 rounded-lg px-4 py-2 hover:bg-red-950/40">
              ← Return to Main Gate
            </Link>
          </div>
        </div>

        <Section title="🔥 Growth Hashira" color="orange" desc="Highest rating gain today.">
          <Rank rank="🥇" name={daily[0]?.username} value={formatGain(daily[0]?.dailyGain ?? 0)} label="rating today" />
          <Rank rank="🥈" name={daily[1]?.username} value={formatGain(daily[1]?.dailyGain ?? 0)} label="rating today" />
          <Rank rank="🥉" name={daily[2]?.username} value={formatGain(daily[2]?.dailyGain ?? 0)} label="rating today" />
        </Section>

        <Section title="⚡ Ascending Hashira" color="yellow" desc="Highest rating gain this week.">
          <Rank rank="⚡" name={weekly[0]?.username} value={formatGain(weekly[0]?.weeklyGain ?? 0)} label="weekly gain" />
        </Section>

        <Section title="🌙 Demon Moon Ascension" color="purple" desc="Highest rating gain this month.">
          <Rank rank="🌙" name={monthly[0]?.username} value={formatGain(monthly[0]?.monthlyGain ?? 0)} label="monthly gain" />
        </Section>

        <Section title="⚔️ Battle Frenzy" color="cyan" desc="Most games played today.">
          <Rank rank="⚔️" name={battle[0]?.username} value={String(battle[0]?.gamesToday ?? 0)} label="games today" />
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
  name,
  value,
  label,
}: {
  rank: string;
  name: string | undefined;
  value: string;
  label: string;
}) {
  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between items-center bg-black/30">
      <div>
        <div className="font-bold">
          {rank} {name ?? "Awaiting Slayer"}
        </div>
        <div className="text-sm text-zinc-500">Current Holder</div>
      </div>

      <div className="text-right">
        <div className="text-green-400 text-xl font-bold">{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  );
}