import { supabase } from "@/lib/supabase";

export default async function TestAllStatsPage() {
  const { data: members, error } = await supabase
    .from("members")
    .select("username")
    .order("id", { ascending: true });

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const results = await Promise.all(
    (members ?? []).map(async (member) => {
      const res = await fetch(
        `https://api.chess.com/pub/player/${member.username}/stats`,
        {
          headers: {
            "User-Agent":
              "Katana Requiem leaderboard contact: shinigamigodme@gmail.com",
          },
          next: { revalidate: 300 },
        }
      );

      const data = await res.json();

      return {
        username: member.username,
        rapid: data.chess_rapid?.last?.rating ?? 0,
        blitz: data.chess_blitz?.last?.rating ?? 0,
        bullet: data.chess_bullet?.last?.rating ?? 0,
      };
    })
  );

  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>All Member Stats Test</h1>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </main>
  );
}