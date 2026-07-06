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
    <main style={main} className={cinzel.className}>
      <div style={goldCore}>✦</div>
      <div style={goldGlow} />
      <div style={softMist} />

      <span className="star" style={{ top: "90px", left: "42px" }}>✦</span>
      <span className="star" style={{ top: "210px", right: "36px", animationDelay: "1.5s" }}>✧</span>
      <span className="star" style={{ top: "420px", left: "28px", animationDelay: ".7s" }}>✦</span>

      <section style={hero}>
        <div style={crest}>升</div>

        <h1 style={clubTitle}>ASCENDANT</h1>

        <p style={heroLine} className={cormorant.className}>
          Rise above. Never finished.
        </p>
      </section>

      <section style={dateCard}>
        <div style={label}>ASCENSION LOG</div>

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

        <div style={oathAuthor}>— {todayOath.author}</div>
      </section>

      <section style={compassCard}>
        <div style={logBadge}>ASCENSION RECORD</div>

        <h2 style={logTitle}>
          ✦ ASCENDANT
          <br />
          COMPASS
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
          <span className="ship">✦</span>
          <span className="wave">〜〜〜</span>
        </div>

        <div style={logInfoBox}>
          <div style={logLabel}>Destination</div>

          <div style={logValue} className={cormorant.className}>
            Rise Above
            <br />
            Yesterday
          </div>

          <div style={divider} />

          <div style={logLabel}>Direction</div>

          <div style={logValue} className={cormorant.className}>
            Always
            <br />
            Ascending
          </div>
        </div>

        <p style={logFooter} className={cormorant.className}>
          No summit is final.
          <br />
          There is always another step.
        </p>
      </section>

      <section style={tribute} className={cormorant.className}>
        Never finished. Always rising.
      </section>

      <style>{`
        @keyframes goldPulse {
          0%, 100% {
            box-shadow:
              0 0 10px rgba(214,179,106,.16),
              inset 0 0 16px rgba(214,179,106,.04);
          }

          50% {
            box-shadow:
              0 0 18px rgba(214,179,106,.28),
              inset 0 0 22px rgba(214,179,106,.07);
          }
        }

        @keyframes starPulse {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .9; transform: scale(1.22); }
        }

        @keyframes goldBreath {
          0%, 100% { opacity: .45; transform: scale(1); }
          50% { opacity: .72; transform: scale(1.06); }
        }

        @keyframes needleMove {
          0% { transform: translate(-50%, -100%) rotate(-15deg); }
          25% { transform: translate(-50%, -100%) rotate(10deg); }
          55% { transform: translate(-50%, -100%) rotate(-6deg); }
          80% { transform: translate(-50%, -100%) rotate(4deg); }
          100% { transform: translate(-50%, -100%) rotate(0deg); }
        }

        @keyframes waveMove {
          0%, 100% { transform: translateX(-5px); opacity: .55; }
          50% { transform: translateX(5px); opacity: .9; }
        }

        .star {
          position: absolute;
          z-index: 1;
          color: #d6b36a;
          text-shadow: 0 0 12px rgba(214,179,106,.55);
          animation: starPulse 4.5s ease-in-out infinite;
        }

        .needle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 5px;
          height: 45px;
          background: linear-gradient(180deg, #fff1b8, #d6b36a, #6f4f1f);
          border-radius: 10px;
          transform-origin: 50% 100%;
          animation: needleMove 4.5s infinite ease-in-out;
          box-shadow: 0 0 14px rgba(214,179,106,.55);
          z-index: 5;
        }

        .waveBox {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin: 8px 0 14px;
          color: #b89146;
          font-size: 19px;
          text-shadow: 0 0 10px rgba(214,179,106,.28);
        }

        .wave {
          display: inline-block;
          animation: waveMove 4s ease-in-out infinite;
        }

        .ship {
          color: #d6b36a;
          text-shadow: 0 0 12px rgba(214,179,106,.5);
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
  color: "#f3e6c2",
  boxSizing: "border-box",
  background:
    "linear-gradient(180deg, #070604 0%, #11100d 42%, #070604 100%)",
};

const goldGlow = {
  position: "absolute",
  top: "-80px",
  right: "-65px",
  width: "210px",
  height: "210px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(214,179,106,.24), rgba(184,145,70,.08), transparent 68%)",
  animation: "goldBreath 7s ease-in-out infinite",
  zIndex: 0,
};

const goldCore = {
  position: "absolute",
  top: "24px",
  right: "32px",
  fontSize: "34px",
  color: "#d6b36a",
  opacity: 0.8,
  zIndex: 1,
  textShadow: "0 0 18px rgba(214,179,106,.5)",
};

const softMist = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(120deg, transparent, rgba(214,179,106,.04), transparent)",
  zIndex: 0,
};

const card = {
  position: "relative",
  zIndex: 2,
  border: "1px solid rgba(214,179,106,.34)",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "14px",
  background:
    "linear-gradient(180deg, rgba(20,18,14,.84), rgba(8,7,5,.9))",
  animation: "goldPulse 5.5s ease-in-out infinite",
};

const hero = {
  ...card,
  textAlign: "center",
  borderRadius: "24px",
  padding: "18px 12px",
};

const crest = {
  width: "56px",
  height: "56px",
  margin: "0 auto 10px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  fontSize: "28px",
  color: "#f3e6c2",
  background:
    "radial-gradient(circle, rgba(214,179,106,.24), rgba(18,15,10,.96))",
  border: "1px solid rgba(214,179,106,.45)",
  boxShadow: "0 0 18px rgba(214,179,106,.24)",
};

const clubTitle = {
  fontSize: "22px",
  letterSpacing: "2.8px",
  margin: "6px 0",
  color: "#f3e6c2",
  textShadow: "0 0 12px rgba(214,179,106,.38)",
  whiteSpace: "nowrap",
};

const heroLine = {
  color: "#c9b07a",
  fontSize: "14px",
  lineHeight: "1.35",
  fontStyle: "italic",
  margin: "8px 0 0",
};

const dateCard = {
  ...card,
  textAlign: "center",
};

const label = {
  fontSize: "10px",
  color: "#d6b36a",
  letterSpacing: "3px",
};

const dateDay = {
  fontSize: "20px",
  color: "#f3e6c2",
  fontWeight: "bold",
  marginTop: "6px",
};

const dateMain = {
  fontSize: "15px",
  color: "#c9b07a",
  marginTop: "4px",
};

const oathCard = {
  ...card,
  textAlign: "center",
};

const oathText = {
  color: "#f3e6c2",
  fontSize: "17px",
  lineHeight: "1.5",
  fontStyle: "italic",
  marginTop: "10px",
};

const oathAuthor = {
  color: "#d6b36a",
  marginTop: "12px",
  fontSize: "13px",
  letterSpacing: "1px",
};

const compassCard = {
  ...card,
  textAlign: "center",
  border: "1px solid rgba(214,179,106,.45)",
  background:
    "linear-gradient(180deg, rgba(22,19,13,.9), rgba(12,10,7,.94))",
};

const logBadge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(214,179,106,.42)",
  color: "#d6b36a",
  fontSize: "9px",
  letterSpacing: "2px",
  background: "rgba(214,179,106,.07)",
  marginBottom: "8px",
};

const logTitle = {
  fontSize: "22px",
  letterSpacing: "2px",
  margin: "4px 0 12px",
  color: "#f3e6c2",
  textShadow: "0 0 14px rgba(214,179,106,.32)",
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
  borderTop: "1px solid rgba(214,179,106,.34)",
  opacity: 0.8,
};

const seaLineTwo = {
  position: "absolute",
  bottom: "10px",
  width: "170px",
  height: "42px",
  borderRadius: "50%",
  borderTop: "1px solid rgba(214,179,106,.18)",
  opacity: 0.7,
};

const logPoseCircle = {
  width: "118px",
  height: "118px",
  margin: "0 auto",
  border: "3px solid rgba(214,179,106,.78)",
  borderRadius: "50%",
  position: "relative",
  background:
    "radial-gradient(circle at 35% 30%, rgba(255,241,184,.18), rgba(214,179,106,.1), rgba(8,7,5,.9))",
  boxShadow:
    "0 0 24px rgba(214,179,106,.28), inset 0 0 20px rgba(255,255,255,.05)",
};

const glassRing = {
  position: "absolute",
  inset: "7px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.12)",
};

const innerRing = {
  position: "absolute",
  inset: "19px",
  border: "1px solid rgba(214,179,106,.26)",
  borderRadius: "50%",
};

const compassBase = {
  position: "absolute",
  color: "#d6b36a",
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
  background: "#fff8df",
  borderRadius: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: "0 0 9px rgba(255,248,223,.85)",
  zIndex: 6,
};

const logInfoBox = {
  background: "rgba(214,179,106,.045)",
  border: "1px solid rgba(214,179,106,.28)",
  borderRadius: "16px",
  padding: "12px 8px",
  margin: "8px 0",
};

const logLabel = {
  color: "#d6b36a",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
};

const logValue = {
  color: "#f3e6c2",
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
    "linear-gradient(90deg, transparent, rgba(214,179,106,.38), transparent)",
};

const logFooter = {
  color: "#c9b07a",
  fontSize: "14px",
  lineHeight: "1.35",
  fontStyle: "italic",
  margin: "10px 0 0",
};

const tribute = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  fontSize: "14px",
  color: "#c9b07a",
  opacity: 0.95,
  padding: "4px 4px 10px",
  fontStyle: "italic",
};