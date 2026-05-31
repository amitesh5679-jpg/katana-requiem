import { supabase } from "@/lib/supabase";

type Mode = "Rapid" | "Blitz" | "Bullet" | "None";

type PlayerRanking = {
  username: string;
  rating: number;
  mode: Mode;
};

function getBestRating(data: any): { rating: number; mode: Mode } {
  const ratings: { mode: Mode; rating: number }[] = [
    { mode: "Rapid", rating: data.chess_rapid?.last?.rating ?? 0 },
    { mode: "Blitz", rating: data.chess_blitz?.last?.rating ?? 0 },
    { mode: "Bullet", rating: data.chess_bullet?.last?.rating ?? 0 },
  ];

  const best = ratings.sort((a, b) => b.rating - a.rating)[0];

  if (!best || best.rating === 0) {
    return { rating: 0, mode: "None" };
  }

  return best;
}

export default async function TestRankingPage() {
  const { data: members, error } = await supabase
    .from("members")
    .select("username")
    .order("id", { ascending: true });

  if (error) {
    return (
      <main style={{ background: "black", color: "red", minHeight: "100vh", padding: "40px" }}>
        <h1>Supabase Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  const rankings = await Promise.all(
    (members ?? []).map(async (member) => {
      const res = await fetch(`https://api.chess.com/pub/player/${member.username}/stats`, {
        headers: {
          "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
        },
        next: { revalidate: 300 },
      });

      const stats = await res.json();
      const best = getBestRating(stats);

      return {
        username: member.username,
        rating: best.rating,
        mode: best.mode,
      };
    })
  );

  const sorted: PlayerRanking[] = rankings.sort((a, b) => b.rating - a.rating);

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>⚔️ Overall Club Ranking Test</h1>

      <ol>
        {sorted.map((player) => (
          <li key={player.username} style={{ marginBottom: "12px" }}>
            <strong>{player.username}</strong> — {player.rating} ({player.mode})
          </li>
        ))}
      </ol>
    </main>
  );
}