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
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
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
      <div style={mistOne} />
      <div style={mistTwo} />
      <div style={windMark}>⌁</div>

      <span className="particle" style={{ top: "70px", left: "34px" }}>✦</span>
      <span className="particle" style={{ top: "210px", right: "34px", animationDelay: "1.5s" }}>✧</span>
      <span className="particle" style={{ top: "420px", left: "26px", animationDelay: ".8s" }}>✦</span>
      <span className="particle" style={{ top: "620px", right: "45px", animationDelay: "2.4s" }}>✧</span>

      <section style={hero} className="goldCard">
        <div style={crestWrap}>
          <div style={crestInner}>A</div>
        </div>

        <h1 style={clubTitle}>ASCENDANT</h1>

        <p style={heroLine} className={cormorant.className}>
          Rise above. Never finished.
        </p>
      </section>

      <section style={dateCard} className="goldCard">
        <div style={label}>ASCENSION LOG</div>
        <div style={dateDay}>{dayName}</div>
        <div style={dateMain} className={cormorant.className}>
          {dateLine}
        </div>
      </section>

      <section style={oathCard} className="goldCard">
        <div style={label}>📜 TODAY'S OATH</div>

        <p style={oathText} className={cormorant.className}>
          "{todayOath.text}"
        </p>

        <div style={oathAuthor}>— {todayOath.author}</div>
      </section>

      <section style={compassCard} className="goldCard">
        <div style={logBadge}>ASCENSION RECORD</div>

        <h2 style={logTitle}>
          ✦ ASCENDANT
          <br />
          COMPASS
        </h2>

        <div style={poseStage}>
          <div style={seaLineOne} />
          <div style={seaLineTwo} />

          <div style={compassCircle}>
            <div style={compassN}>N</div>
            <div style={compassE}>E</div>
            <div style={compassS}>S</div>
            <div style={compassW}>W</div>

            <div style={glassRing} />
            <div style={innerRing} />
            <div className="needle" />
            <div className="centerOrb" />
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
            box-shadow: 0 0 10px rgba(217,182,109,.14), inset 0 0 18px rgba(217,182,109,.035);
          }
          50% {
            box-shadow: 0 0 20px rgba(217,182,109,.26), inset 0 0 24px rgba(217,182,109,.06);
          }
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
          12% { opacity: .35; }
          25% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
          100% { transform: translateX(140%) skewX(-18deg); opacity: 0; }
        }

        @keyframes mistMove {
          0%, 100% { transform: translateX(-20px) translateY(0) scale(1); opacity: .08; }
          50% { transform: translateX(20px) translateY(-18px) scale(1.08); opacity: .14; }
        }

        @keyframes particlePulse {
          0%, 100% { opacity: .25; transform: scale(1); }
          50% { opacity: .85; transform: scale(1.2); }
        }

        @keyframes needleMove {
          0% { transform: translate(-50%, -100%) rotate(-14deg); }
          25% { transform: translate(-50%, -100%) rotate(10deg); }
          55% { transform: translate(-50%, -100%) rotate(-5deg); }
          80% { transform: translate(-50%, -100%) rotate(4deg); }
          100% { transform: translate(-50%, -100%) rotate(0deg); }
        }

        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 10px rgba(217,182,109,.65); }
          50% { transform: translate(-50%, -50%) scale(1.12); box-shadow: 0 0 18px rgba(217,182,109,.9); }
        }

        @keyframes waveMove {
          0%, 100% { transform: translateX(-5px); opacity: .55; }
          50% { transform: translateX(5px); opacity: .9; }
        }

        .goldCard {
          overflow: hidden;
          animation: goldPulse 6s ease-in-out infinite;
        }

        .goldCard::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 42%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,232,170,.13), transparent);
          animation: shimmerSweep 9s ease-in-out infinite;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          z-index: 1;
          color: #d9b66d;
          text-shadow: 0 0 12px rgba(217,182,109,.5);
          animation: particlePulse 4.5s ease-in-out infinite;
        }

        .needle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 5px;
          height: 45px;
          background: linear-gradient(180deg, #fff1bd, #d9b66d, #6a4a20);
          border-radius: 10px;
          transform-origin: 50% 100%;
          animation: needleMove 4.5s infinite ease-in-out;
          box-shadow: 0 0 14px rgba(217,182,109,.55);
          z-index: 5;
        }

        .centerOrb {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff1bd, #d9b66d 55%, #6a4a20);
          transform: translate(-50%, -50%);
          animation: orbPulse 3.8s ease-in-out infinite;
          z-index: 6;
        }

        .waveBox {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin: 8px 0 14px;
          color: #b89146;
          font-size: 19px;
          text-shadow: 0 0 10px rgba(217,182,109,.25);
        }

        .wave {
          display: inline-block;
          animation: waveMove 4s ease-in-out infinite;
        }

        .ship {
          color: #d9b66d;
          text-shadow: 0 0 12px rgba(217,182,109,.5);
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
  color: "#f2e4bc",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at top, rgba(217,182,109,.06), transparent 34%), linear-gradient(180deg, #050403 0%, #0b0907 42%, #050403 100%)",
};

const mistOne = {
  position: "absolute",
  top: "70px",
  left: "-80px",
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(217,182,109,.12), transparent 68%)",
  filter: "blur(30px)",
  animation: "mistMove 14s ease-in-out infinite",
  zIndex: 0,
};

const mistTwo = {
  position: "absolute",
  bottom: "140px",
  right: "-90px",
  width: "310px",
  height: "310px",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(156,114,53,.14), transparent 70%)",
  filter: "blur(36px)",
  animation: "mistMove 18s ease-in-out infinite reverse",
  zIndex: 0,
};

const windMark = {
  position: "absolute",
  top: "230px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "210px",
  color: "rgba(217,182,109,.055)",
  zIndex: 0,
  pointerEvents: "none",
};

const card = {
  position: "relative",
  zIndex: 2,
  border: "1px solid rgba(217,182,109,.34)",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "14px",
  background: "linear-gradient(180deg, rgba(22,19,13,.86), rgba(8,7,5,.93))",
};

const hero = {
  ...card,
  textAlign: "center",
  borderRadius: "24px",
  padding: "18px 12px",
};

const crestWrap = {
  width: "68px",
  height: "68px",
  margin: "0 auto 10px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "radial-gradient(circle, rgba(217,182,109,.24), rgba(8,7,5,.96))",
  border: "1px solid rgba(217,182,109,.52)",
  boxShadow: "0 0 22px rgba(217,182,109,.25)",
};

const crestInner = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  color: "#f2e4bc",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "1px",
  border: "1px solid rgba(217,182,109,.35)",
  textShadow: "0 0 12px rgba(217,182,109,.55)",
};

const clubTitle = {
  fontSize: "22px",
  letterSpacing: "2.8px",
  margin: "6px 0",
  color: "#f2e4bc",
  textShadow: "0 0 12px rgba(217,182,109,.38)",
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
  color: "#d9b66d",
  letterSpacing: "3px",
};

const dateDay = {
  fontSize: "20px",
  color: "#f2e4bc",
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
  color: "#f2e4bc",
  fontSize: "17px",
  lineHeight: "1.5",
  fontStyle: "italic",
  marginTop: "10px",
};

const oathAuthor = {
  color: "#d9b66d",
  marginTop: "12px",
  fontSize: "13px",
  letterSpacing: "1px",
};

const compassCard = {
  ...card,
  textAlign: "center",
  border: "1px solid rgba(217,182,109,.45)",
  background: "linear-gradient(180deg, rgba(24,21,15,.9), rgba(10,8,5,.95))",
};

const logBadge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "999px",
  border: "1px solid rgba(217,182,109,.42)",
  color: "#d9b66d",
  fontSize: "9px",
  letterSpacing: "2px",
  background: "rgba(217,182,109,.07)",
  marginBottom: "8px",
};

const logTitle = {
  fontSize: "22px",
  letterSpacing: "2px",
  margin: "4px 0 12px",
  color: "#f2e4bc",
  textShadow: "0 0 14px rgba(217,182,109,.32)",
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
  borderTop: "1px solid rgba(217,182,109,.34)",
  opacity: 0.8,
};

const seaLineTwo = {
  position: "absolute",
  bottom: "10px",
  width: "170px",
  height: "42px",
  borderRadius: "50%",
  borderTop: "1px solid rgba(217,182,109,.18)",
  opacity: 0.7,
};

const compassCircle = {
  width: "118px",
  height: "118px",
  margin: "0 auto",
  border: "3px solid rgba(217,182,109,.78)",
  borderRadius: "50%",
  position: "relative",
  background:
    "radial-gradient(circle at 35% 30%, rgba(255,241,189,.17), rgba(217,182,109,.1), rgba(8,7,5,.9))",
  boxShadow: "0 0 24px rgba(217,182,109,.28), inset 0 0 20px rgba(255,255,255,.05)",
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
  border: "1px solid rgba(217,182,109,.26)",
  borderRadius: "50%",
};

const compassBase = {
  position: "absolute",
  color: "#d9b66d",
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

const logInfoBox = {
  background: "rgba(217,182,109,.045)",
  border: "1px solid rgba(217,182,109,.28)",
  borderRadius: "16px",
  padding: "12px 8px",
  margin: "8px 0",
};

const logLabel = {
  color: "#d9b66d",
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
};

const logValue = {
  color: "#f2e4bc",
  fontSize: "19px",
  lineHeight: "1.2",
  margin: "7px 0 10px",
  fontWeight: 600,
};

const divider = {
  height: "1px",
  width: "70%",
  margin: "10px auto",
  background: "linear-gradient(90deg, transparent, rgba(217,182,109,.38), transparent)",
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