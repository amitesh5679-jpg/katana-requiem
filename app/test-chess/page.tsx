export default async function TestChessPage() {
  const username = "GOD-S-H-I-N-G-A-M-I";

  const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`, {
    headers: {
      "User-Agent": "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
    },
    next: { revalidate: 300 },
  });

  const data = await res.json();

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Chess.com Stats Test</h1>
      <pre>{JSON.stringify(data.chess_rapid ?? data.chess_blitz ?? data, null, 2)}</pre>
    </main>
  );
}