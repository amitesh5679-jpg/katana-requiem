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
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const res = await fetch(
    `https://api.chess.com/pub/player/${username}/games`,
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

    const gameDate = new Date(game.end_time * 1000).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    return gameDate === today;
  }).length;
}

export default async function UpdateRatingsPage() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: members } = await supabase.from("members").select("username");

  const results = await Promise.all(
    (members ?? []).map(async (member) => {
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
      const ratings = getRatings(stats);
      const gamesToday = await getGamesToday(member.username);

      const { data: latestToday } = await supabase
        .from("rating_snapshots")
        .select("id,rating,games,rapid_rating,blitz_rating,bullet_rating,best_mode")
        .eq("username", member.username)
        .gte("recorded_at", `${today}T00:00:00.000Z`)
        .lt("recorded_at", `${today}T23:59:59.999Z`)
        .order("recorded_at", { ascending: false })
        .limit(1);

      const latest = latestToday?.[0];

     
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
      <h1>Ratings Update Check ⚔️</h1>
      <p>New snapshot saved only if rating, mode, or games changed.</p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </main>
  );
}