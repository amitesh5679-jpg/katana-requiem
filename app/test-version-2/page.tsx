import { supabase } from "@/lib/supabase";

type Snapshot = {
  username: string;
  rating: number;
  games: number | null;
  recorded_at: string;
};

function getClosestSnapshotBefore(rows: Snapshot[], targetDate: Date) {
  const before = rows.filter((row) => new Date(row.recorded_at) <= targetDate);
  return before[before.length - 1] ?? rows[0];
}

export default async function TestVersion2Page() {
  const { data } = await supabase
    .from("rating_snapshots")
    .select("username,rating,games,recorded_at")
    .order("recorded_at", { ascending: true });

  const grouped: Record<string, Snapshot[]> = {};

  for (const row of (data ?? []) as Snapshot[]) {
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

  const results = Object.entries(grouped).map(([username, rows]) => {
    const latest = rows[rows.length - 1];

    const todayBase = getClosestSnapshotBefore(rows, startOfToday);
    const weekBase = getClosestSnapshotBefore(rows, sevenDaysAgo);
    const monthBase = getClosestSnapshotBefore(rows, thirtyDaysAgo);

    return {
      username,
      currentRating: latest.rating,
      dailyGain: latest.rating - todayBase.rating,
      weeklyGain: latest.rating - weekBase.rating,
      monthlyGain: latest.rating - monthBase.rating,
      gamesToday: latest.games ?? 0,
    };
  });

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Version 2 Gain Test</h1>

      <h2>🔥 Daily Gain</h2>
      <pre>{JSON.stringify([...results].sort((a, b) => b.dailyGain - a.dailyGain), null, 2)}</pre>

      <h2>⚡ Weekly Gain</h2>
      <pre>{JSON.stringify([...results].sort((a, b) => b.weeklyGain - a.weeklyGain), null, 2)}</pre>

      <h2>🌙 Monthly Gain</h2>
      <pre>{JSON.stringify([...results].sort((a, b) => b.monthlyGain - a.monthlyGain), null, 2)}</pre>

      <h2>⚔️ Games Today</h2>
      <pre>{JSON.stringify([...results].sort((a, b) => b.gamesToday - a.gamesToday), null, 2)}</pre>
    </main>
  );
}