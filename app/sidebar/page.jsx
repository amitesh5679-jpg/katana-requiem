"use client";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import { oaths } from "@/lib/oath";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Sidebar() {
  const today = new Date();
  const dayOfYear = Math.floor(
  (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
    86400000
);

const todayOath = oaths[dayOfYear % oaths.length];

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

  return (
<main style={main} className={cinzel.className}>      <div style={moonCore}>☾</div>
      <div style={oceanGlow} />
      <div style={softMist} />

      <span className="star" style={{ top: "90px", left: "42px" }}>✦</span>
      <span className="star" style={{ top: "210px", right: "36px", animationDelay: "1.5s" }}>✧</span>
      <span className="star" style={{ top: "420px", left: "28px", animationDelay: ".7s" }}>✦</span>

      <span className="petal" style={{ left: "20%", animationDelay: "1s" }}>🌸</span>
      <span className="petal" style={{ left: "72%", animationDelay: "4s" }}>🌸</span>

      <section style={hero}>
        <div style={crest}>月</div>
        <h1 style={clubTitle}>KATANA REQUIEM</h1>
        <p style={heroLine} className={cormorant.className}>
          A quiet harbor for warriors who return.
        </p>
      </section>

      <section style={dateCard}>
        <div style={label}>MOON RECORD</div>
        <div style={dateDay}>{dayName}</div>
        <div style={dateMain} className={cormorant.className}>
          {dateLine}
        </div>
      </section>
<section style={oathCard}>
  <div style={label}>📜 TODAY'S OATH</div>

  <p style={oathText} className={cormorant.className}>
    "{todayOath.text}"
  </p>

  <div style={oathAuthor}>
    — {todayOath.author}
  </div>
</section>
      <section style={logPoseCard}>
  <div style={logBadge}>GRAND LINE RECORD</div>

  <h2 style={logTitle}>
    ⚓ KATANA REQUIEM
    <br />
    LOG POSE
  </h2>

  <div style={poseStage}>
    <div style={seaLineOne} />
    <div style={seaLineTwo} />

    <div style={logPoseCircle}>
      <div style={compassN}>N</div>
      <div style={compassE}>E</div>
      <div style={compassS}>S</div>
      <div style={compassW}>W</div>

      <div style={glassRing} />
      <div style={innerRing} />
      <div className="needle" />
      <div style={needleCenter} />
    </div>
  </div>

  <div className="waveBox">
    <span className="wave">〜〜〜</span>
    <span className="ship">⛵</span>
    <span className="wave">〜〜〜</span>
  </div>

  <div style={logInfoBox}>
    <div style={logLabel}>Destination</div>
    <div style={logValue} className={cormorant.className}>
      To Live Without<br />
      Regrets
    </div>

    <div style={divider} />

    <div style={logLabel}>Direction</div>
    <div style={logValue} className={cormorant.className}>
      Still Pointing<br />
      Forward.
    </div>
  </div>

  <p style={logFooter} className={cormorant.className}>
    Even when the sea gets rough,<br />
    the needle remembers the dream.
  </p>
</section>

      <a href="/?v=title-update" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>🏯 Warrior Titles</h2>
        <p style={text} className={cormorant.className}>
          Honored roles and names carved into the hall.
        </p>
        <b style={openText}>Enter Title Hall →</b>
      </a>

      

      <a href="https://lichess.org/training" target="_blank" style={linkCard}>
        <h2 style={sectionTitle}>🧩 Tactics Dojo</h2>
        <p style={text} className={cormorant.className}>
          A silent training ground for sharper calculation.
        </p>
        <b style={openText}>Begin Training →</b>
      </a>

      <section style={tribute} className={cormorant.className}>
        🌸 Whispered_Blossom — the lantern remembers.
      </section>
      

      <style>{`
        @keyframes starPulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .95; transform: scale(1.25); }
        }

        @keyframes petalFall {
          0% { transform: translateY(-40px) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: .55; }
          100% { transform: translateY(760px) translateX(28px) rotate(240deg); opacity: 0; }
        }

        @keyframes moonBreath {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .82; transform: scale(1.06); }
        }

        @keyframes needleMove {
          0% { transform: translate(-50%, -100%) rotate(-18deg); }
          25% { transform: translate(-50%, -100%) rotate(13deg); }
          55% { transform: translate(-50%, -100%) rotate(-7deg); }
          80% { transform: translate(-50%, -100%) rotate(4deg); }
          100% { transform: translate(-50%, -100%) rotate(0deg); }
        }

        @keyframes shipRock {
          0%, 100% { transform: rotate(-4deg) translateY(1px); }
          50% { transform: rotate(4deg) translateY(-2px); }
        }

        @keyframes waveMove {
          0%, 100% { transform: translateX(-6px); opacity: .65; }
          50% { transform: translateX(6px); opacity: 1; }
        }

        .star {
          position: absolute;
          z-index: 1;
          color: #e0f2fe;
          text-shadow: 0 0 12px rgba(186,230,253,.9);
          animation: starPulse 4s ease-in-out infinite;
        }

        .petal {
          position: absolute;
          top: -35px;
          z-index: 1;
          font-size: 12px;
          opacity: .55;
          animation: petalFall 15s linear infinite;
        }

        .needle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 5px;
          height: 45px;
          background: linear-gradient(180deg, #fff3b0, #facc15, #92400e);
          border-radius: 10px;
          transform-origin: 50% 100%;
          animation: needleMove 4s infinite ease-in-out;
          box-shadow: 0 0 14px rgba(250,204,21,.8);
          z-index: 5;
        }

        .waveBox {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin: 8px 0 14px;
          color: #93c5fd;
          font-size: 19px;
          text-shadow: 0 0 10px rgba(125,211,252,.55);
        }

        .wave {
          display: inline-block;
          animation: waveMove 4s ease-in-out infinite;
        }

        .ship {
          display: inline-block;
          animation: shipRock 2.8s ease-in-out infinite;
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
  padding: "13px",
  overflow: "hidden",
  color: "white",
  boxSizing: "border-box",
  background:
    "linear-gradient(180deg, #020617 0%, #071426 42%, #020617 100%)",
};

const moonGlow = {
  position: "absolute",
  top: "-70px",
  right: "-62px",
  width: "190px",
  height: "190px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(186,230,253,.48), rgba(56,189,248,.12), transparent 68%)",
  animation: "moonBreath 7s ease-in-out infinite",
  zIndex: 0,
};

const moonCore = {
  position: "absolute",
  top: "20px",
  right: "28px",
  fontSize: "42px",
  color: "#e0f2fe",
  opacity: 0.85,
  zIndex: 1,
  textShadow: "0 0 20px rgba(186,230,253,.8)",
};

const oceanGlow = {
  position: "absolute",
  bottom: "-110px",
  left: "-80px",
  width: "460px",
  height: "230px",
  background:
    "radial-gradient(circle, rgba(14,165,233,.25), transparent 68%)",
  zIndex: 0,
};

const softMist = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(120deg, transparent, rgba(125,211,252,.045), transparent)",
  zIndex: 0,
};

const hero = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  border: "1px solid rgba(147,197,253,.48)",
  borderRadius: "24px",
  padding: "18px 12px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(15,23,42,.72), rgba(2,6,23,.82))",
  boxShadow:
    "0 0 18px rgba(56,189,248,.18), inset 0 0 18px rgba(96,165,250,.06)",
};

const crest = {
  width: "56px",
  height: "56px",
  margin: "0 auto 10px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: "29px",
  color: "#e9d5ff",
  background:
    "radial-gradient(circle, rgba(88,28,135,.72), rgba(15,23,42,.92))",
  border: "1px solid rgba(216,180,254,.5)",
  boxShadow: "0 0 20px rgba(168,85,247,.35)",
};

const clubTitle = {
  fontSize: "21px",
  letterSpacing: "2.4px",
  margin: "6px 0",
  color: "#e0f2fe",
  textShadow: "0 0 12px rgba(56,189,248,.72)",
  whiteSpace: "nowrap",
};

const heroLine = {
  color: "#c7d2fe",
  fontSize: "14px",
  lineHeight: "1.35",
  fontStyle: "italic",
  margin: "8px 0 0",
};

const card = {
  position: "relative",
  zIndex: 2,
  border: "1px solid rgba(96,165,250,.42)",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(3,7,18,.72), rgba(15,23,42,.62))",
  boxShadow:
    "0 0 14px rgba(56,189,248,.15), inset 0 0 14px rgba(125,211,252,.04)",
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
};

const dateMain = {
  fontSize: "15px",
  color: "#bfdbfe",
  marginTop: "4px",
};
const oathCard = {
  ...card,
  textAlign: "center",
  border: "1px solid rgba(216,180,254,.35)",
  background:
    "linear-gradient(180deg, rgba(18,24,45,.85), rgba(5,10,20,.9))",
};

const oathText = {
  color: "#f8fafc",
  fontSize: "17px",
  lineHeight: "1.5",
  fontStyle: "italic",
  marginTop: "10px",
};

const oathAuthor = {
  color: "#7dd3fc",
  marginTop: "12px",
  fontSize: "13px",
  letterSpacing: "1px",
};
const logPoseCard = {
  ...card,
  textAlign: "center",
  border: "1px solid rgba(125,211,252,.62)",
  background:
    "linear-gradient(180deg, rgba(4,16,34,.88), rgba(8,36,61,.76), rgba(2,6,23,.9))",
  boxShadow:
    "0 0 20px rgba(14,165,233,.22), inset 0 0 24px rgba(125,211,252,.07)",
};

const logHeader = {
  color: "#bae6fd",
  fontSize: "12px",
  letterSpacing: "1.8px",
};

const logTitle = {
  fontSize: "22px",
  letterSpacing: "2px",
  margin: "4px 0 12px",
  color: "#f0f9ff",
  textShadow: "0 0 14px rgba(56,189,248,.7)",
};

const logPoseWrap = {
  display: "grid",
  placeItems: "center",
};
const logBadge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(125,211,252,.45)",
  color: "#bae6fd",
  fontSize: "9px",
  letterSpacing: "2px",
  background: "rgba(14,165,233,.08)",
  marginBottom: "8px",
};

const poseStage = {
  position: "relative",
  width: "155px",
  height: "132px",
  margin: "0 auto 4px",
  display: "grid",
  placeItems: "center",
};

const seaLineOne = {
  position: "absolute",
  bottom: "22px",
  width: "140px",
  height: "36px",
  borderRadius: "50%",
  borderTop: "1px solid rgba(125,211,252,.45)",
  opacity: 0.8,
};

const seaLineTwo = {
  position: "absolute",
  bottom: "10px",
  width: "170px",
  height: "42px",
  borderRadius: "50%",
  borderTop: "1px solid rgba(147,197,253,.25)",
  opacity: 0.7,
};

const logPoseCircle = {
  width: "118px",
  height: "118px",
  margin: "0 auto",
  border: "3px solid rgba(186,230,253,.95)",
  borderRadius: "50%",
  position: "relative",
  background:
    "radial-gradient(circle at 35% 30%, rgba(255,255,255,.26), rgba(14,165,233,.12), rgba(2,6,23,.88))",
  boxShadow:
    "0 0 28px rgba(125,211,252,.55), inset 0 0 22px rgba(255,255,255,.09)",
};

const glassRing = {
  position: "absolute",
  inset: "7px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.18)",
};

const innerRing = {
  position: "absolute",
  inset: "19px",
  border: "1px solid rgba(186,230,253,.32)",
  borderRadius: "50%",
};

const compassBase = {
  position: "absolute",
  color: "#bae6fd",
  fontSize: "10px",
  fontWeight: "bold",
};

const compassN = {
  ...compassBase,
  top: "6px",
  left: "50%",
  transform: "translateX(-50%)",
};

const compassE = {
  ...compassBase,
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
};

const compassS = {
  ...compassBase,
  bottom: "6px",
  left: "50%",
  transform: "translateX(-50%)",
};

const compassW = {
  ...compassBase,
  left: "8px",
  top: "50%",
  transform: "translateY(-50%)",
};

const needleCenter = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "13px",
  height: "13px",
  background: "#ffffff",
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: "0 0 9px white",
  zIndex: 6,
};

const logInfoBox = {
  background: "rgba(255,255,255,.045)",
  border: "1px solid rgba(125,211,252,.34)",
  borderRadius: "16px",
  padding: "12px 8px",
  margin: "8px 0",
};

const logLabel = {
  color: "#7dd3fc",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
};

const logValue = {
  color: "#f8fafc",
  fontSize: "19px",
  lineHeight: "1.2",
  margin: "7px 0 10px",
  fontWeight: 600,
};

const divider = {
  height: "1px",
  width: "70%",
  margin: "10px auto",
  background:
    "linear-gradient(90deg, transparent, rgba(125,211,252,.45), transparent)",
};

const logFooter = {
  color: "#bae6fd",
  fontSize: "14px",
  lineHeight: "1.35",
  fontStyle: "italic",
  margin: "10px 0 0",
};

const linkCard = {
  ...card,
  display: "block",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "18px",
  margin: "0 0 6px",
  color: "#e0f2fe",
  letterSpacing: "1px",
};

const text = {
  color: "#c7d2fe",
  fontSize: "15px",
  lineHeight: "1.35",
};

const openText = {
  color: "#7dd3fc",
  fontSize: "13px",
};

const tribute = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  fontSize: "14px",
  color: "#c7d2fe",
  opacity: 0.95,
  padding: "4px 4px 10px",
  fontStyle: "italic",
};