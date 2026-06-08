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
      <div style={moonGlow} />
      <div style={bladeGlow} />

      <div style={mistLayer}>
        <span style={{ ...spark, left: "12%", animationDelay: "0s" }}>✧</span>
        <span style={{ ...spark, left: "38%", animationDelay: "1.5s" }}>✦</span>
        <span style={{ ...spark, left: "67%", animationDelay: ".7s" }}>✧</span>
        <span style={{ ...spark, left: "88%", animationDelay: "2.3s" }}>✦</span>
      </div>

      <section style={hero}>
        <div style={crest}>月</div>
        <h1 style={clubTitle}>KATANA REQUIEM</h1>
        <p style={heroLine}>For warriors who return, even after silence.</p>
      </section>

      <section style={dateCard}>
        <div style={label}>MOON RECORD</div>
        <div style={dateDay}>{dayName}</div>
        <div style={dateMain}>{dateLine}</div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>⚔ Fresh Blades</h2>
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
        <p style={text}>Hashira seats, honored roles, and names carved into the hall.</p>
        <b style={openText}>Enter Title Hall →</b>
      </a>

      <a href="/leaderboard" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>📈 Warrior Ranks</h2>
        <p style={text}>The climb, the grind, and the battles that shape the corps.</p>
        <b style={openText}>Open Ranks →</b>
      </a>

      <a href="https://lichess.org/training" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>🧩 Tactics Dojo</h2>
        <p style={text}>A silent training ground for sharper calculation.</p>
        <b style={openText}>Begin Training →</b>
      </a>

      <section style={tribute}>
        🌸 Whispered_Blossom — the lantern remembers.
      </section>

      <style>{`
        @keyframes drift {
          0% { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: .8; }
          60% { opacity: .45; }
          100% { transform: translateY(760px) translateX(24px) rotate(220deg); opacity: 0; }
        }

        @keyframes breathe {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.07); }
        }

        @keyframes blade {
          0%, 100% { opacity: .28; transform: translateX(-4px); }
          50% { opacity: .55; transform: translateX(4px); }
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
  fontFamily: "Georgia, 'Times New Roman', serif",
  background:
    "linear-gradient(180deg, rgba(1,6,18,.86), rgba(6,22,48,.88), rgba(1,6,18,.95))",
};

const moonGlow = {
  position: "absolute",
  top: "-72px",
  right: "-58px",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(125,211,252,.42), transparent 67%)",
  animation: "breathe 6s ease-in-out infinite",
  zIndex: 0,
};

const bladeGlow = {
  position: "absolute",
  top: "260px",
  left: "-60px",
  width: "220px",
  height: "2px",
  background:
    "linear-gradient(90deg, transparent, rgba(125,211,252,.55), rgba(168,85,247,.45), transparent)",
  transform: "rotate(-18deg)",
  animation: "blade 5s ease-in-out infinite",
  zIndex: 0,
};

const mistLayer = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  overflow: "hidden",
  zIndex: 1,
};

const spark = {
  position: "absolute",
  top: "-25px",
  color: "rgba(221,214,254,.82)",
  fontSize: "14px",
  textShadow: "0 0 12px rgba(216,180,254,.9)",
  animation: "drift 10s linear infinite",
};

const hero = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  border: "1px solid rgba(147,197,253,.62)",
  borderRadius: "22px",
  padding: "18px 12px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(15,23,42,.72), rgba(2,6,23,.78))",
  boxShadow:
    "0 0 20px rgba(56,189,248,.25), inset 0 0 20px rgba(96,165,250,.08)",
};

const crest = {
  width: "58px",
  height: "58px",
  margin: "0 auto 10px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: "30px",
  color: "#e9d5ff",
  background:
    "radial-gradient(circle, rgba(88,28,135,.75), rgba(15,23,42,.85))",
  border: "1px solid rgba(216,180,254,.6)",
  boxShadow: "0 0 22px rgba(168,85,247,.42)",
};

const clubTitle = {
  fontSize: "21px",
  letterSpacing: "2.4px",
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
  border: "1px solid rgba(96,165,250,.55)",
  borderRadius: "17px",
  padding: "14px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(3,7,18,.76), rgba(15,23,42,.64))",
  boxShadow:
    "0 0 15px rgba(56,189,248,.18), inset 0 0 14px rgba(125,211,252,.05)",
};

const dateCard = {
  ...card,
  textAlign: "center",
};

const label = {
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
    "linear-gradient(90deg, rgba(2,6,23,.94), rgba(12,74,110,.56), rgba(2,6,23,.94))",
  border: "1px solid rgba(125,211,252,.7)",
  borderRadius: "14px",
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