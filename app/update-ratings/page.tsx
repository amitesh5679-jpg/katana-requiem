async function getGamesToday(username: string) {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  const res = await fetch(
    `https://api.chess.com/pub/player/${username.toLowerCase()}/games/${year}/${month}`,
    {
      headers: {
        "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
      },
      cache: "no-store",
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