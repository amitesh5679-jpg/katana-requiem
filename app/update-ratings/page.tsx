async function getGamesToday(username: string) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const now = new Date();

  const months = [
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)),
  ];

  const allGames: any[] = [];

  for (const date of months) {
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