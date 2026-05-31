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

export default async function SaveLegendPage() {
  const now = new Date();
  const month = now.toLocaleString("en-IN", { month: "long" });
  const year = now.getFullYear();

  const { data: existing } = await supabase
    .from("hall_of_legends")
    .select("id")
    .eq("title", "Demon Moon Ascension")
    .eq("month", month)
    .eq("year", year)
    .limit(1);

  if (existing && existing.length > 0) {
    return (
      <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
        <h1>Legend already saved for {month} {year} 🏛️</h1>
      </main>
    );
  }

  const { data } = await supabase
    .from("rating_snapshots")
    .select("username,rating,games,recorded_at")
    .order("recorded_at", { ascending: true });

  const grouped: Record<string, Snapshot[]> = {};

  for (const row of (data ?? []) as Snapshot[]) {
    if (!grouped[row.username]) grouped[row.username] = [];
    grouped[row.username].push(row);
  }

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const monthly = Object.entries(grouped).map(([username, rows]) => {
    const latest = rows[rows.length - 1];
    const base = getClosestSnapshotBefore(rows, thirtyDaysAgo);

    return {
      username,
      monthlyGain: latest.rating - base.rating,
    };
  });

  monthly.sort((a, b) => b.monthlyGain - a.monthlyGain);

  const champion = monthly[0];

  if (!champion) {
    return (
      <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
        <h1>No champion found.</h1>
      </main>
    );
  }

  const { error } = await supabase.from("hall_of_legends").insert({
    username: champion.username,
    title: "Demon Moon Ascension",
    month,
    year,
  });

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Legend Saved 🏛️</h1>
      <p>
        {month} {year} Demon Moon Ascension Champion:
      </p>
      <h2>{champion.username}</h2>
      <p>Monthly Gain: +{champion.monthlyGain}</p>
      <pre>{JSON.stringify({ error }, null, 2)}</pre>
    </main>
  );
}