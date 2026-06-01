async function getGamesToday(username: string) {
  const res = await fetch(`https://api.chess.com/pub/player/${username}/games`, {
    headers: {
      "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return -1; // API failed
  }

  const data = await res.json();

  return data.games?.length ?? -2; // total recent games API gives
}