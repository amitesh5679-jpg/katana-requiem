import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type Snapshot = {
  username: string;
  rating: number;
  games: number | null;
  recorded_at: string;
};

function getDateLabel() {
  const now = new Date();
  return `DAY ${now.getDate()} • MONTH OF ${now
    .toLocaleString("en-IN", { month: "long" })
    .toUpperCase()} • YEAR ${now.getFullYear()}`;
}

function getClosestSnapshotBefore(rows: Snapshot[], targetDate: Date) {
  const before = rows.filter((row) => new Date(row.recorded_at) <= targetDate);
  return before[before.length - 1] ?? rows[0];
}

function calculateV2(rows: Snapshot[]) {
  const grouped: Record<string, Snapshot[]> = {};

  for (const row of rows) {
    if (!grouped[row.username]) grouped[row.username] = [];
    grouped[row.username].push(row);
  }

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return Object.entries(grouped).map(([username, snapshots]) => {
    const latest = snapshots[snapshots.length - 1];

    const todayBase = getClosestSnapshotBefore(snapshots, startOfToday);
    const weekBase = getClosestSnapshotBefore(snapshots, sevenDaysAgo);
    const monthBase = getClosestSnapshotBefore(snapshots, thirtyDaysAgo);

    const todaySnapshots = snapshots.filter((row) => {
      const rowDate = new Date(row.recorded_at);
      return rowDate >= startOfToday;
    });

    const gamesToday = Math.max(
      0,
      ...todaySnapshots.map((row) => row.games ?? 0)
    );

    return {
      username,
      currentRating: latest.rating,
      dailyGain: latest.rating - todayBase.rating,
      weeklyGain: latest.rating - weekBase.rating,
      monthlyGain: latest.rating - monthBase.rating,
      gamesToday,
    };
  });
}


export default async function LeaderboardPage() {
  const { data: snapshots } = await supabase
    .from("rating_snapshots")
    .select("username,rating,games,recorded_at")
    .order("recorded_at", { ascending: true });

  const { data: legends } = await supabase
    .from("hall_of_legends")
    .select("username,title,month,year")
    .order("created_at", { ascending: false });

  const rankings = calculateV2((snapshots ?? []) as Snapshot[]);

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

          <h2 className="text-2xl text-yellow-400 mt-3">
            Ranking Chamber
          </h2>

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
            <p>🔥 Growth Hashira — Highest rating gain today.</p>
            <p>⚡ Ascending Hashira — Highest rating gain this week.</p>
            <p>🌙 Demon Moon Ascension — Highest rating gain this month.</p>
            <p>⚔️ Battle Frenzy — Most games played today.</p>
          </div>
        </div>

        <Section title="🔥 Growth Hashira" color="orange" desc="The warriors whose flames burned brightest today.">
          <Rank rank="🥇" name={daily[0]?.username ?? "Awaiting Slayer"} value={`+${daily[0]?.dailyGain ?? 0}`} label="rating today" />
          <Rank rank="🥈" name={daily[1]?.username ?? "Awaiting Slayer"} value={`+${daily[1]?.dailyGain ?? 0}`} label="rating today" />
          <Rank rank="🥉" name={daily[2]?.username ?? "Awaiting Slayer"} value={`+${daily[2]?.dailyGain ?? 0}`} label="rating today" />
        </Section>

        <Section title="⚡ Ascending Hashira" color="yellow" desc="The relentless slayer whose progress echoed through the week.">
          <Rank rank="⚡" name={weekly[0]?.username ?? "Awaiting Slayer"} value={`+${weekly[0]?.weeklyGain ?? 0}`} label="weekly gain" />
        </Section>

        <Section title="🌙 Demon Moon Ascension" color="purple" desc="The rise that rivaled the Upper Moons themselves.">
          <Rank rank="🌙" name={monthly[0]?.username ?? "Awaiting Slayer"} value={`+${monthly[0]?.monthlyGain ?? 0}`} label="monthly gain" />
        </Section>

        <Section title="⚔️ Battle Frenzy" color="cyan" desc="The warrior who fought the most battles today.">
          <Rank rank="⚔️" name={battle[0]?.username ?? "Awaiting Slayer"} value={`${battle[0]?.gamesToday ?? 0}`} label="games today" />
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
  children: React.ReactNode;
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
  name: string;
  value: string;
  label: string;
}) {
  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between items-center bg-black/30">
      <div>
        <div className="font-bold">
          {rank} {name}
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