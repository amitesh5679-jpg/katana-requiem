"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Sidebar() {
  const [newestMembers, setNewestMembers] = useState([]);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  });
  const dateLine = today.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    async function loadMembers() {
      const { data } = await supabase
        .from("members")
        .select("username, joined_at")
        .order("joined_at", { ascending: false })
        .limit(3);

      if (data) setNewestMembers(data);
    }

    loadMembers();
  }, []);

  return (
    <main style={main}>
      <div style={glowOne} />
      <div style={glowTwo} />
      <div style={petalLayer}>
        <span style={{ ...petal, left: "8%", animationDelay: "0s" }}>✧</span>
        <span style={{ ...petal, left: "28%", animationDelay: "1.2s" }}>✦</span>
        <span style={{ ...petal, left: "52%", animationDelay: "2s" }}>✧</span>
        <span style={{ ...petal, left: "75%", animationDelay: ".6s" }}>✦</span>
        <span style={{ ...petal, left: "91%", animationDelay: "3s" }}>✧</span>
      </div>

      <section style={hero}>
        
        <h1 style={clubTitle}>KATANA REQUIEM</h1>
        <p style={heroLine}>For the warriors who still return to the board.</p>
      </section>

      <section style={dateCard}>
        <div style={miniLabel}>MOON LOG</div>
        <div style={dateDay}>{dayName}</div>
        <div style={dateMain}>{dateLine}</div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>⚔️ Fresh Blades</h2>
        <p style={sectionNote}>Newest warriors at the gate.</p>

        {newestMembers.length ? (
          newestMembers.map((member) => (
            <div key={member.username} style={memberBox}>
              @{member.username}
            </div>
          ))
        ) : (
          <p style={small}>Gathering recruits...</p>
        )}
      </section>

      <a href="/?v=title-update" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>🏯 Warrior Titles</h2>
        <p style={text}>Hashira seats, honored names, and roles earned by presence.</p>
        <b style={openText}>Enter the Title Hall →</b>
      </a>

      <a href="/leaderboard" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>📈 Warrior Ranks</h2>
        <p style={text}>Track the climb, the grind, and the rating battles.</p>
        <b style={openText}>Open the Ranks →</b>
      </a>

      <a href="https://lichess.org/training" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>🧩 Tactics Dojo</h2>
        <p style={text}>A quiet training ground for sharper calculation.</p>
        <b style={openText}>Begin Puzzle Training →</b>
      </a>

      <section style={tribute}>
        🌸 Whispered_Blossom — the lantern remembers.
      </section>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: .75; }
          55% { transform: translateY(430px) translateX(-18px) rotate(120deg); opacity: .5; }
          100% { transform: translateY(900px) translateX(20px) rotate(260deg); opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.08); }
        }
      `}</style>
    </main>
  );
}

const main = {
  position: "relative",
  width: "100%",
  maxWidth: "320px",
  minHeight: "100vh",
  margin: "0 auto",
  padding: "12px",
  overflow: "hidden",
  color: "white",
  boxSizing: "border-box",
  fontFamily: "'Cinzel', Georgia, 'Times New Roman', serif",
  background:
    "linear-gradient(180deg, rgba(1,7,20,.78), rgba(5,25,54,.86), rgba(1,7,20,.92))",
};

const glowOne = {
  position: "absolute",
  top: "-70px",
  right: "-60px",
  width: "170px",
  height: "170px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(125,211,252,.42), transparent 65%)",
  animation: "pulse 5s ease-in-out infinite",
  zIndex: 0,
};

const glowTwo = {
  position: "absolute",
  bottom: "140px",
  left: "-70px",
  width: "150px",
  height: "150px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(168,85,247,.28), transparent 65%)",
  animation: "pulse 7s ease-in-out infinite",
  zIndex: 0,
};

const petalLayer = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 1,
};

const petal = {
  position: "absolute",
  top: "-24px",
  color: "rgba(221,214,254,.78)",
  fontSize: "15px",
  textShadow: "0 0 12px rgba(216,180,254,.9)",
  animation: "fall 10s linear infinite",
};

const hero = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  border: "1px solid rgba(147,197,253,.65)",
  borderRadius: "24px",
  padding: "17px 12px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(15,23,42,.74), rgba(2,6,23,.72))",
  boxShadow:
    "0 0 22px rgba(56,189,248,.28), inset 0 0 18px rgba(96,165,250,.08)",
};

const crestWrap = {
  width: "92px",
  height: "92px",
  margin: "0 auto 10px",
  padding: "4px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, rgba(125,211,252,.8), rgba(168,85,247,.45), rgba(2,6,23,.8))",
  boxShadow: "0 0 22px rgba(125,211,252,.35)",
};

const logo = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "20px",
};

const clubTitle = {
  fontSize: "21px",
  letterSpacing: "2.2px",
  margin: "6px 0",
  color: "#e0f2fe",
  textShadow: "0 0 14px rgba(56,189,248,.9)",
  whiteSpace: "nowrap",
};

const heroLine = {
  color: "#c7d2fe",
  fontSize: "12px",
  lineHeight: "1.45",
  fontStyle: "italic",
  margin: "8px 0 0",
};

const card = {
  position: "relative",
  zIndex: 2,
  border: "1px solid rgba(96,165,250,.58)",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(3,7,18,.72), rgba(15,23,42,.62))",
  boxShadow: "0 0 16px rgba(56,189,248,.20)",
};

const dateCard = {
  ...card,
  textAlign: "center",
};

const miniLabel = {
  fontSize: "10px",
  color: "#7dd3fc",
  letterSpacing: "3px",
};

const dateDay = {
  fontSize: "20px",
  color: "#f0f9ff",
  fontWeight: "bold",
  marginTop: "6px",
  textShadow: "0 0 10px rgba(125,211,252,.55)",
};

const dateMain = {
  fontSize: "14px",
  color: "#bfdbfe",
  marginTop: "4px",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "18px",
  margin: "0 0 6px",
  color: "#e0f2fe",
  textShadow: "0 0 12px rgba(56,189,248,.8)",
  letterSpacing: "1px",
};

const sectionNote = {
  textAlign: "center",
  color: "#93c5fd",
  fontSize: "12px",
  margin: "0 0 10px",
  fontStyle: "italic",
};

const memberBox = {
  background:
    "linear-gradient(90deg, rgba(2,6,23,.9), rgba(12,74,110,.55), rgba(2,6,23,.9))",
  border: "1px solid rgba(125,211,252,.72)",
  borderRadius: "15px",
  padding: "11px",
  margin: "8px 0",
  textAlign: "center",
  color: "#f0f9ff",
  fontWeight: "bold",
  boxShadow: "inset 0 0 12px rgba(56,189,248,.12)",
};

const linkCard = {
  ...card,
  display: "block",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
};

const text = {
  color: "#c7d2fe",
  fontSize: "13px",
  lineHeight: "1.45",
};

const openText = {
  color: "#7dd3fc",
  fontSize: "13px",
  textShadow: "0 0 8px rgba(125,211,252,.7)",
};

const small = {
  fontSize: "12px",
  textAlign: "center",
  color: "#93c5fd",
};

const tribute = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  fontSize: "12px",
  color: "#c7d2fe",
  opacity: 0.95,
  padding: "4px 4px 10px",
  fontStyle: "italic",
};