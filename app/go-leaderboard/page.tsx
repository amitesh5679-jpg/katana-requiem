export default function GoLeaderboard() {
  return (
    <main style={{ background: "black", color: "white", minHeight: "100vh", padding: "40px", textAlign: "center" }}>
      <h1>⚔️ Updating Leaderboard...</h1>
      <p>Please wait a moment.</p>

      <iframe
        src="/update-ratings"
        style={{ display: "none" }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(function() {
              window.location.href = "/leaderboard";
            }, 3500);
          `,
        }}
      />
    </main>
  );
}