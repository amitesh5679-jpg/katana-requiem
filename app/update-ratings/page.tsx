async function getGamesToday(username: string) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const urls = [
    `https://api.chess.com/pub/player/${username}/games`,
    `https://api.chess.com/pub/player/${username}/games/${year}/${month}`,
  ];

  const allGames: any[] = [];

  for (const url of urls) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) continue;

    const data = await res.json();
    allGames.push(...(data.games ?? []));
  }

  const uniqueGames = new Map();

  for (const game of allGames) {
    uniqueGames.set(game.uuid ?? game.url, game);
  }

  return [...uniqueGames.values()].filter((game: any) => {
    if (!game.end_time) return false;

    const gameDate = new Date(game.end_time * 1000).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    return gameDate === today;
  }).length;
}