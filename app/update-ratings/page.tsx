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
  const istDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

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
          "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
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

  const cleanMembers = (members ?? [])
    .map((m) => ({ username: String(m.username).trim() }))
    .filter((m) => m.username.length > 0);

  const results = await Promise.all(
    cleanMembers.map(async (member) => {
      try {
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
          error: error?.message ?? null,
        };
      } catch (err: any) {
        return {
          username: member.username,
          rating: 0,
          games: 0,
          rapid_rating: 0,
          blitz_rating: 0,
          bullet_rating: 0,
          best_mode: "Unknown",
          saved: false,
          error: err?.message ?? "Unknown error",
        };
      }
    })
  );

  const mostGames = [...results].sort((a, b) => b.games - a.games);
  const highestRating = [...results].sort((a, b) => b.rating - a.rating);
  const failed = results.filter((r) => !r.saved);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#090303] to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-red-500">⚔️ Ratings Update Chamber ⚔️</h1>
          <p className="text-zinc-400 mt-4">
            Snapshots updated using IST day timeline.
          </p>
        </div>

        <Section title="⚔️ Most Games Played Today" color="cyan">
          {mostGames.slice(0, 5).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.games} games`}
              subValue={`Best: ${player.rating} ${player.best_mode}`}
            />
          ))}
        </Section>

        <Section title="👑 Highest Current Rating" color="yellow">
          {highestRating.slice(0, 5).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.rating}`}
              subValue={`Mode: ${player.best_mode}`}
            />
          ))}
        </Section>

        <Section title="📜 All Updated Players" color="red">
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((player) => (
              <div
                key={player.username}
                className="border border-white/10 rounded-xl p-4 bg-black/40"
              >
                <div className="font-bold text-red-300">{player.username}</div>
                <div className="text-zinc-300 mt-2">Rating: {player.rating}</div>
                <div className="text-zinc-300">Games Today: {player.games}</div>
                <div className="text-zinc-400 text-sm mt-2">
                  Rapid {player.rapid_rating} • Blitz {player.blitz_rating} • Bullet {player.bullet_rating}
                </div>
                <div className="text-xs mt-2">
                  {player.saved ? (
                    <span className="text-green-400">Saved successfully</span>
                  ) : (
                    <span className="text-red-400">Failed: {player.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {failed.length > 0 && (
          <Section title="⚠️ Failed Updates" color="purple">
            {failed.map((player) => (
              <div key={player.username} className="text-red-300">
                {player.username}: {player.error}
              </div>
            ))}
          </Section>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: "cyan" | "yellow" | "red" | "purple";
  children: React.ReactNode;
}) {
  const style = {
    cyan: "border-cyan-500 bg-cyan-950/20",
    yellow: "border-yellow-500 bg-yellow-950/20",
    red: "border-red-500 bg-red-950/20",
    purple: "border-purple-500 bg-purple-950/20",
  };

  return (
    <section className={`border rounded-xl p-6 mb-6 ${style[color]}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function PlayerCard({
  rank,
  username,
  mainValue,
  subValue,
}: {
  rank: number;
  username: string;
  mainValue: string;
  subValue: string;
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between items-center bg-black/40">
      <div>
        <div className="font-bold">
          {medal} {username}
        </div>
        <div className="text-sm text-zinc-500">{subValue}</div>
      </div>

      <div className="text-green-400 text-xl font-bold">{mainValue}</div>
    </div>
  );
}