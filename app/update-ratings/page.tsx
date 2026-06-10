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

function getResult(game: any, username: string) {
  const user = username.toLowerCase();

  const whiteUsername = game.white?.username?.toLowerCase();
  const blackUsername = game.black?.username?.toLowerCase();

  const player =
    whiteUsername === user
      ? game.white
      : blackUsername === user
      ? game.black
      : null;

  const result = player?.result;

  if (result === "win") return "win";

  if (
    result === "checkmated" ||
    result === "resigned" ||
    result === "timeout" ||
    result === "abandoned" ||
    result === "lose"
  ) {
    return "loss";
  }

  return "draw";
}

async function getTodayStats(username: string) {
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

  const games = [...uniqueGames.values()]
    .filter((game: any) => game.end_time)
    .sort((a: any, b: any) => b.end_time - a.end_time);

  const todayGames = games.filter(
    (game: any) => game.end_time >= startUnix && game.end_time < endUnix
  );

  const winsToday = todayGames.filter(
    (game: any) => getResult(game, username) === "win"
  ).length;

  let currentWinStreak = 0;

  for (const game of games) {
    const result = getResult(game, username);

    if (result === "win") {
      currentWinStreak++;
    } else {
      break;
    }
  }

 const weekStart = new Date();
const istNow = new Date(
  weekStart.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);

const day = istNow.getDay();
const diffToMonday = day === 0 ? 6 : day - 1;

const mondayIST = new Date(
  Date.UTC(
    istNow.getFullYear(),
    istNow.getMonth(),
    istNow.getDate() - diffToMonday,
    -5,
    -30,
    0
  )
);

const weekStartUnix = Math.floor(mondayIST.getTime() / 1000);

const weekGames = games.filter(
  (game: any) => game.end_time >= weekStartUnix
);

const winsThisWeek = weekGames.filter(
  (game: any) => getResult(game, username) === "win"
).length;

return {
  gamesToday: todayGames.length,
  winsToday,
  winsThisWeek,
  currentWinStreak,
};
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
              "User-Agent":
                "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
            },
            cache: "no-store",
          }
        );

        const stats = await statsRes.json();
        const ratings = getRatings(stats);
        const todayStats = await getTodayStats(member.username);

        const snapshot = {
          username: member.username,
          rating: ratings.bestRating,
          games: todayStats.gamesToday,
          wins_today: todayStats.winsToday,
          wins_this_week: todayStats.winsThisWeek,
          current_win_streak: todayStats.currentWinStreak,
          rapid_rating: ratings.rapid,
          blitz_rating: ratings.blitz,
          bullet_rating: ratings.bullet,
          best_mode: ratings.bestMode,
        };

        const { error } = await supabase
          .from("rating_snapshots")
          .insert(snapshot);

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
          wins_today: 0,
          current_win_streak: 0,
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

  const dailyGrinder = [...results].sort((a, b) => b.games - a.games);
  const demonSlayer = [...results].sort((a, b) => b.wins_today - a.wins_today);
  const consecutiveKing = [...results].sort(
    (a, b) => b.current_win_streak - a.current_win_streak
  );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500">
          ⚔️ Ratings Update Chamber ⚔️
        </h1>

        <p className="text-zinc-400 mt-3">
          Updated games, wins, streaks and ratings.
        </p>

        <Section title="⚔️ Daily Grinder">
          {dailyGrinder.slice(0, 3).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.games} games`}
              subValue={`${player.wins_today} wins today`}
            />
          ))}
        </Section>

        <Section title="👹 Demon Slayer">
          {demonSlayer.slice(0, 3).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.wins_today} wins`}
              subValue={`${player.games} games today`}
            />
          ))}
        </Section>

        <Section title="🔥 Consecutive King">
          {consecutiveKing.slice(0, 3).map((player, index) => (
            <PlayerCard
              key={player.username}
              rank={index + 1}
              username={player.username}
              mainValue={`${player.current_win_streak} streak`}
              subValue={`Current active win streak`}
            />
          ))}
        </Section>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-red-700 rounded-xl p-5 mt-6 bg-red-950/20">
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
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <div className="border border-white/20 rounded-lg p-4 flex justify-between bg-black/40">
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