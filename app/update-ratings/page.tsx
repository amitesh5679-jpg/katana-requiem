import { supabase } from "@/lib/supabase";

function getRatings(data: any) {
  const rapid = data.chess_rapid?.last?.rating ?? 0;
  const blitz = data.chess_blitz?.last?.rating ?? 0;
  const bullet = data.chess_bullet?.last?.rating ?? 0;

  const ratings = [
    { mode: "Rapid", rating: rapid },
    { mode: "Blitz", rating: blitz },
    { mode: "Bullet", rating: bullet },
  ];

  const best = ratings.sort((a, b) => b.rating - a.rating)[0];

  return {
    rapid,
    blitz,
    bullet,
    bestRating: best.rating,
    bestMode: best.mode,
  };
}

async function getGamesToday(username: string) {
  const res = await fetch(
    `https://api.chess.com/pub/player/${username.toLowerCase()}/games`,
    {
      headers: {
        "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return -1;

  const data = await res.json();
  return data.games?.length ?? -2;
}

export default async function UpdateRatingsPage() {
  const { data: members } = await supabase.from("members").select("username");

  const results = await Promise.all(
    (members ?? []).map(async (member) => {
      const statsRes = await fetch(
        `https://api.chess.com/pub/player/${member.username.toLowerCase()}/stats`,
        {
          headers: {
            "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
          },
          cache: "no-store",
        }
      );

      const stats = await statsRes.json();
      const ratings = getRatings(stats);
      const gamesToday = await getGamesToday(member.username);

      const snapshot = {
        username: member.username,
        rating: ratings.bestRating,
        games: gamesToday,
        rapid_rating: ratings.rapid,
        blitz_rating: ratings.blitz,
        bullet_rating: ratings.bullet,
        best_mode: ratings.bestMode,
      };

      const { error } = await supabase.from("rating_snapshots").insert(snapshot);

      return {
        ...snapshot,
        saved: !error,
        error,
      };
    })
  );

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>DEBUG VERSION ACTIVE ⚔️</h1>
      <p>If you see this line, the new code deployed.</p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </main>
  );
}