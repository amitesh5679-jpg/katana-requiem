import { supabase } from "@/lib/supabase";

function getBestRating(data: any) {
  const ratings = [
    { mode: "Rapid", rating: data.chess_rapid?.last?.rating ?? 0 },
    { mode: "Blitz", rating: data.chess_blitz?.last?.rating ?? 0 },
    { mode: "Bullet", rating: data.chess_bullet?.last?.rating ?? 0 },
  ];

  return ratings.sort((a, b) => b.rating - a.rating)[0];
}

async function getGamesToday(username: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const today = now.toISOString().slice(0, 10);

  const res = await fetch(
    `https://api.chess.com/pub/player/${username}/games/${year}/${month}`,
    {
      headers: {
        "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) return 0;

  const data = await res.json();

  return (data.games ?? []).filter((game: any) => {
    if (!game.end_time) return false;
    const gameDate = new Date(game.end_time * 1000).toISOString().slice(0, 10);
    return gameDate === today;
  }).length;
}

export default async function UpdateRatingsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: members } = await supabase
    .from("members")
    .select("username");

  const results = await Promise.all(
    (members ?? []).map(async (member) => {
      const { data: existing } = await supabase
        .from("rating_snapshots")
        .select("id")
        .eq("username", member.username)
        .gte("recorded_at", `${today}T00:00:00.000Z`)
        .lt("recorded_at", `${today}T23:59:59.999Z`)
        .limit(1);

      if (existing && existing.length > 0) {
        return {
          username: member.username,
          skipped: true,
          reason: "Already saved today",
        };
      }

      const statsRes = await fetch(
        `https://api.chess.com/pub/player/${member.username}/stats`,
        {
          headers: {
            "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
          },
          next: { revalidate: 0 },
        }
      );

      const stats = await statsRes.json();
      const best = getBestRating(stats);
      const gamesToday = await getGamesToday(member.username);

      const snapshot = {
        username: member.username,
        rating: best.rating,
        games: gamesToday,
      };

      const { error } = await supabase
        .from("rating_snapshots")
        .insert(snapshot);

      return {
        ...snapshot,
        mode: best.mode,
        saved: !error,
        error,
      };
    })
  );

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Ratings Update Check ⚔️</h1>
      <p>If a player was already saved today, they are skipped.</p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </main>
  );
}