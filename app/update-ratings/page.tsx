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

function getISTDayRangeUnix() {
  const now = new Date();

  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const y = istDate.getFullYear();
  const m = istDate.getMonth();
  const d = istDate.getDate();

  const startIST = new Date(Date.UTC(y, m, d, -5, -30, 0));
  const endIST = new Date(Date.UTC(y, m, d + 1, -5, -30, 0));

  return {
    startUnix: Math.floor(startIST.getTime() / 1000),
    endUnix: Math.floor(endIST.getTime() / 1000),
  };
}

function getMonthsToCheck() {
  const now = new Date();

  return [
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)),
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
  ];
}

async function getGamesToday(username: string) {
  const { startUnix, endUnix } = getISTDayRangeUnix();
  const allGames: any[] = [];

  for (const date of getMonthsToCheck()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");

    const res = await fetch(
      `https://api.chess.com/pub/player/${username.toLowerCase()}/games/${year}/${month}`,
      {
        headers: {
          "User-Agent":
            "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) continue;

    const data = await res.json();
    allGames.push(...(data.games ?? []));
  }

  const uniqueGames = new Map<string, any>();

  for (const game of allGames) {
    uniqueGames.set(game.uuid ?? game.url, game);
  }

  return [...uniqueGames.values()].filter((game: any) => {
    if (!game.end_time) return false;
    return game.end_time >= startUnix && game.end_time < endUnix;
  }).length;
}

export default async function UpdateRatingsPage() {
  const { data: members } = await supabase.from("members").select("username");

  const results = await Promise.all(
    (members ?? []).map(async (member) => {
      const statsRes = await fetch(
        `https://api.chess.com/pub/player/${member.username.toLowerCase()}/stats`,
        {
          headers: {
            "User-Agent":
              "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
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
    <main
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <h1>Ratings Update Check ⚔️</h1>
      <p>Snapshots updated using IST day timeline.</p>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </main>
  );
}