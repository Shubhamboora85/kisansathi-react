import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkAndUpdateStreak, getLeaderboard, getStreakDays } from "./StreakSystem";

const NEARBY_MANDIS = ["Jind","Kaithal","Karnal","Hisar","Rohtak","Panipat","Ambala"];

export default function HomePage({
  db, phone, kisanNaam, shehar, fasal, beejDate,
  weather, forecast, stage, advice, din, alert,
  getWeatherIcon, onOpenChat, onOpenKhata, onOpenMandi,
  onOpenBg, onOpenQuiz, onOpenYojna, onOpenWeather, onOpenProfile, onOpenCommunity,
}) {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [streakDays, setStreakDays] = useState([]);
  const [mandiData, setMandiData] = useState([]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeNav, setActiveNav] = useState("home");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!phone) return;
    checkAndUpdateStreak(db, phone).then(res => {
      setStreak(res.streak);
      setPoints(res.points);
      setStreakDays(getStreakDays(res.streak));
    });
    getLeaderboard(db).then(setLeaderboard);
    fetchNearestMandi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, db]);

  const fetchNearestMandi = async () => {
    setMandiLoading(true);
    const districtName = shehar?.split(",")[0]?.trim() || "Jind";
    const tryMandis = [districtName, ...NEARBY_MANDIS];
    for (const mandi of tryMandis) {
      try {
        const res = await fetch(
          `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.REACT_APP_MANDI_KEY}&format=json&filters[district]=${encodeURIComponent(mandi)}&limit=5`
        );
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setMandiData(data.records.slice(0, 3));
          break;
        }
      } catch { continue; }
    }
    setMandiLoading(false);
  };

  const progressPercent = Math.min((din / 120) * 100, 100);

  function goAI() { onOpenChat(""); }
  function goMandi() { onOpenMandi(); }
  function goKhata() { onOpenKhata(); }
  function goYojna() { onOpenYojna(); }
  function goQuiz() { onOpenQuiz(); }
  function goWeather() { onOpenWeather(); }
  function goProfile() { onOpenProfile(); }
  function goBg() { onOpenBg(); }
  function goCommunity() { onOpenCommunity(); }

  function handleNavClick(key) {
    setActiveNav(key);
    if (key === "home") return;
    if (key === "ai") return goAI();
    if (key === "mandi") return goMandi();
    if (key === "profile") return goProfile();
    if (key === "center") return goCommunity();
  }

  const ringR = 22;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc - (progressPercent / 100) * ringCirc;

  const C = {
    wrap: { minHeight: "100vh", background: "#0a0f0c", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
    scroll: { flex: 1, overflowY: "auto", position: "relative", zIndex: 2 },
    pill: { borderRadius: 14, padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" },
    streakCard: { margin: "0 16px 12px", background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.2)", borderRadius: 16, padding: "12px 14px" },
    mcwrap: { margin: "0 16px 12px", display: "flex", gap: 6 },
    mc: { flex: 1, background: "#12241a", border: "1px solid rgba(120,220,150,0.13)", borderRadius: 12, padding: "8px 9px", cursor: "pointer" },
    lb: { margin: "0 16px 14px", background: "#12241a", border: "1px solid rgba(120,220,150,0.13)", borderRadius: 16, padding: "12px 14px" },
    alertBox: { margin: "0 16px 12px", background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: 12, padding: "9px 13px", fontSize: 11, color: "#ff9999" },
    bottomnav: { background: "rgba(6,10,8,0.97)", borderTop: "1px solid rgba(120,220,150,0.1)", padding: "9px 0 12px", display: "flex", justifyContent: "space-around", alignItems: "flex-end", position: "relative", zIndex: 10 },
  };

  return (
    <div style={C.wrap}>
      <div style={{ position: "relative", height: 300, overflow: "hidden", flexShrink: 0 }}>
        <div
          className="animated-bg"
          onClick={goBg}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/images/home-bg.png)",
            backgroundSize: "cover", backgroundPosition: "center",
            cursor: "pointer"
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.02) 40%, rgba(10,15,12,0.55) 82%, #0a0f0c 100%)" }} />

        <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px 0" }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              Namaste, {kisanNaam} 👋
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              AI Kisan Saathi 🌱
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🔔</div>
            <div onClick={goProfile} style={{ cursor: "pointer", width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#f4c98a,#c9863f)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>👤</div>
          </div>
        </div>

        <motion.div onClick={goWeather} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          style={{ position: "absolute", top: 62, right: 16, zIndex: 3, background: "rgba(10,15,12,0.55)", backdropFilter: "blur(6px)", borderRadius: 14, padding: "8px 12px", cursor: "pointer", minWidth: 96, textAlign: "right" }}>
          {weather ? (<>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
              <span style={{ fontSize: 16 }}>{getWeatherIcon(weather.id)}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{weather.temp}°C</span>
            </div>
            <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{weather.description}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>{weather.city}</div>
          </>) : (
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>🌤️ Load ho raha...</div>
          )}
        </motion.div>

        <motion.div onClick={goAI} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: "absolute", bottom: 14, left: 16, right: 16, zIndex: 3, background: "rgba(230,220,200,0.92)", borderRadius: 24, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ flex: 1, fontSize: 11.5, color: "#6a5a48" }}>AI Chatbot se poochhe...</span>
          <span style={{ fontSize: 15 }}>📷</span>
          <span style={{ fontSize: 15 }}>🎤</span>
        </motion.div>
      </div>

      <div style={C.scroll}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, margin: "12px 16px 12px" }}>
          <motion.div style={{ ...C.pill, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goMandi} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div style={{ fontSize: 18 }}>📈</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Mandi Bhav</div>
          </motion.div>
          <motion.div style={{ ...C.pill, background: "rgba(230,150,60,0.1)", border: "1px solid rgba(230,150,60,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goYojna} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div style={{ fontSize: 18 }}>📜</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Yojnaayein</div>
          </motion.div>
          <motion.div style={{ ...C.pill, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goCommunity} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}>
            <div style={{ fontSize: 18 }}>👥</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Community</div>
          </motion.div>
          <motion.div style={{ ...C.pill, background: "rgba(90,160,255,0.1)", border: "1px solid rgba(90,160,255,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goWeather} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <div style={{ fontSize: 18 }}>⛅</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Mausam</div>
          </motion.div>
          <motion.div style={{ ...C.pill, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goQuiz} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
            <div style={{ fontSize: 18 }}>🎯</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Quiz</div>
          </motion.div>
          <motion.div style={{ ...C.pill, background: "rgba(120,220,180,0.1)", border: "1px solid rgba(120,220,180,0.25)" }}
            whileTap={{ scale: 0.94 }} onClick={goKhata} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ fontSize: 18 }}>📒</div>
            <div style={{ fontSize: 8.5, color: "#fff", fontWeight: 600 }}>Khata</div>
          </motion.div>
        </div>

        {alert && (
          <motion.div style={C.alertBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🚨 {alert}
          </motion.div>
        )}

        <motion.div onClick={goBg} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ margin: "0 16px 12px", background: "#12241a", border: "1px solid rgba(120,220,150,0.15)", borderRadius: 18, padding: "14px 16px", position: "relative", overflow: "hidden", cursor: "pointer" }}>
          <div style={{ position: "absolute", right: -8, bottom: -6, width: 92, height: 92, backgroundImage: "url(/images/mandi-wheat.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "bottom right", opacity: 0.9 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>Aapki Fasal</div>
              <div style={{ fontSize: 13.5, color: "#fff", fontWeight: 700, marginTop: 2 }}>{fasal}</div>
              <div style={{ fontSize: 9, color: "#7fc99a", marginTop: 3 }}>{stage}</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{Math.max(0, 120 - din)} Din Baaki</div>
            </div>
            <div style={{ position: "relative", width: 54, height: 54, flexShrink: 0 }}>
              <svg width="54" height="54" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r={ringR} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                <circle cx="27" cy="27" r={ringR} fill="none" stroke="#1eb464" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={ringCirc} strokeDashoffset={ringOffset} transform="rotate(-90 27 27)"
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#7dffaa" }}>
                {Math.round(progressPercent)}%
              </div>
            </div>
          </div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.4)", marginTop: 8, maxWidth: "62%" }}>💡 {advice}</div>
        </motion.div>

        <motion.div style={C.streakCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#ffb066" }}>🔥 Daily Streak — {streak} din!</div>
            <div style={{ fontSize: 10, color: "#ffd700", fontWeight: 700 }}>+10 pts/din</div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {streakDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: d.isToday ? "#ff6600" : d.done ? "rgba(255,120,0,0.35)" : "rgba(255,255,255,0.06)",
                  border: d.done ? "1px solid #ff9944" : "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10
                }}>
                  {d.done ? (d.isToday ? "🔥" : "✓") : ""}
                </div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)" }}>{d.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {mandiData.length > 0 && (
          <div style={C.mcwrap}>
            {mandiData.map((m, i) => (
              <motion.div key={i} style={C.mc} whileTap={{ scale: 0.95 }} onClick={goMandi}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{m.commodity}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2 }}>₹{m.modal_price}</div>
                <div style={{ fontSize: 8, color: "#7dffaa" }}>📍 {m.market?.slice(0, 12)}</div>
              </motion.div>
            ))}
          </div>
        )}
        {mandiLoading && (
          <div style={{ textAlign: "center", fontSize: 11, color: "rgba(120,220,150,0.4)", marginBottom: 12 }}>
            📊 Mandi bhav dhundh raha hoon...
          </div>
        )}

        <motion.div style={C.lb} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <div style={{ fontSize: 11.5, color: "#7dffaa", fontWeight: 700, marginBottom: 8 }}>🏆 Safidon Kisan Leaderboard</div>
          {[...leaderboard, { naam: kisanNaam + " (Tu)", points, isYou: true }]
            .sort((a, b) => b.points - a.points).slice(0, 4)
            .map((l, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "4px 5px",
                borderRadius: 6, background: l.isYou ? "rgba(120,220,150,0.1)" : "transparent", marginBottom: 2
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", width: 14 }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`}
                </div>
                <div style={{ flex: 1, fontSize: 10.5, color: l.isYou ? "#7dffaa" : "rgba(255,255,255,0.6)" }}>{l.naam}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#7dffaa" }}>{l.points}</div>
              </div>
            ))}
        </motion.div>

        <div style={{ height: 10 }} />
      </div>

      <div style={C.bottomnav}>
        <div onClick={() => handleNavClick("home")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 9, color: activeNav === "home" ? "#7dffaa" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
          <div style={{
            fontSize: 19, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
            background: activeNav === "home" ? "rgba(74,222,128,0.18)" : "transparent",
            boxShadow: activeNav === "home" ? "0 0 12px 2px rgba(74,222,128,0.5)" : "none",
            transition: "all 0.3s ease"
          }}>🏠</div>
          <span>Home</span>
        </div>
        <div onClick={() => handleNavClick("ai")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 9, color: activeNav === "ai" ? "#7dffaa" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
          <div style={{
            fontSize: 19, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%",
            background: activeNav === "ai" ? "rgba(74,222,128,0.18)" : "transparent",
            boxShadow: activeNav === "ai" ? "0 0 12px 2px rgba(74,222,128,0.5)" : "none",
            transition: "all 0.3s ease"
          }}>💬</div>
          <span>Chat AI</span>
        </div>
        <div onClick={() => handleNavClick("center")} style={{ cursor: "pointer", marginTop: -18 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #4ade80, #16803c)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            boxShadow: "0 0 16px 3px rgba(74,222,128,0.5)", border: "3px solid #0a0f0c"
          }}>🌿</div>
        </div>
        <div onClick={() => handleNavClick("mandi")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 9, color: activeNav === "mandi" ? "#7dffaa" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
          <div style={{ fontSize: 19 }}>📊</div><span>Mandi</span>
        </div>
        <div onClick={() => handleNavClick("profile")}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontSize: 9, color: activeNav === "profile" ? "#7dffaa" : "rgba(255,255,255,0.35)", cursor: "pointer" }}>
          <div style={{ fontSize: 19 }}>👤</div><span>Profile</span>
        </div>
      </div>
    </div>
  );
}