import { supabase } from "@/lib/supabase";

export default async function TestGainsPage() {
  const { data } = await supabase
    .from("rating_snapshots")
    .select("username,rating,games,recorded_at")
    .order("recorded_at", { ascending: true });

  const grouped: Record<string, any[]> = {};

  for (const row of data ?? []) {
    if (!grouped[row.username]) grouped[row.username] = [];
    grouped[row.username].push(row);
  }

  const gains = Object.entries(grouped).map(([username, rows]) => {
    const first = rows[0];
    const latest = rows[rows.length - 1];

    return {
      username,
      rating: latest.rating,
      gain: latest.rating - first.rating,
      gamesToday: latest.games ?? 0,
    };
  });

  const growth = [...gains].sort((a, b) => b.gain - a.gain);
  const battle = [...gains].sort((a, b) => b.gamesToday - a.gamesToday);

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Growth Hashira Test</h1>

      <h2>🔥 Rating Gain</h2>
      <pre>{JSON.stringify(growth, null, 2)}</pre>

      <h2>⚔️ Games Today</h2>
      <pre>{JSON.stringify(battle, null, 2)}</pre>
    </main>
  );
}