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

  const cropStages = {
    "🌾 Chawal (Rice)": ["Beej","Nursery","Transplant","Tillering","Harvest"],
    "🌿 Gehun (Wheat)": ["Beej","Jamav","Tillering","Bali","Harvest"],
    "🟡 Sarso (Mustard)": ["Beej","Jamav","Phool","Daana","Harvest"],
    "🍬 Ganna (Sugarcane)": ["Beej","Jamav","Growth","Ripening","Harvest"],
  };

  const progressPercent = Math.min((din / 120) * 100, 100);
  const stages = cropStages[fasal] || ["Beej","Jamav","Growth","Ripening","Harvest"];

  const getActiveStageIndex = () => {
    if (din <= 10) return 0;
    if (din <= 25) return 1;
    if (din <= 60) return 2;
    if (din <= 100) return 3;
    return 4;
  };
  const activeStageIdx = getActiveStageIndex();

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
    if (key === "weather") return goWeather();
    if (key === "ai") return goAI();
    if (key === "mandi") return goMandi();
    if (key === "profile") return goProfile();
  }

  const C = {
    wrap: { minHeight: "100vh", background: "#0a0f0c", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
    scroll: { flex: 1, overflowY: "auto", position: "relative", zIndex: 2 },
    gridwrap: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 16px 12px" },
    gi: { borderRadius: 16, padding: "13px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", position: "relative" },
    fasalcard: { margin: "0 16px 12px", background: "#12241a", border: "1px solid rgba(120,220,150,0.15)", borderRadius: 18, padding: "16px 16px", position: "relative", overflow: "hidden" },
    weathercard: { margin: "0 16px 12px", background: "#141b28", border: "1px solid rgba(100,160,255,0.15)", borderRadius: 16, padding: "12px 14px", cursor: "pointer" },
    alertBox: { margin: "0 16px 12px", background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: 12, padding: "9px 13px", fontSize: 11, color: "#ff9999" },
    streakCard: { margin: "0 16px 12px", background: "rgba(255,120,0,0.08)", border: "1px solid rgba(255,120,0,0.2)", borderRadius: 16, padding: "12px 14px" },
    mcwrap: { margin: "0 16px 12px", display: "flex", gap: 6 },
    mc: { flex: 1, background: "#141814", border: "1px solid rgba(120,220,150,0.13)", borderRadius: 12, padding: "8px 9px", cursor: "pointer" },
    lb: { margin: "0 16px 14px", background: "#141814", border: "1px solid rgba(120,220,150,0.13)", borderRadius: 16, padding: "12px 14px" },
    bottomnav: { background: "rgba(6,10,8,0.97)", borderTop: "1px solid rgba(120,220,150,0.1)", padding: "9px 0 12px", display: "flex", justifyContent: "space-around", position: "relative", zIndex: 10 },
  };

  return (
    <div style={C.wrap}>
      {/* ===== HERO — animated sunset background photo ===== */}
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
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, #0a0f0c 96%)" }} />

        <div style={{ position: "relative", zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 0" }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: "#c9a1ff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
              AI Kisan Saathi 🌱
            </div>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.85)", textShadow: "0 1px 4px rgba(0,0,0,0.6)", marginTop: 1 }}>
              Aapka Digital Kheti Partner
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🔔</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f4c98a,#c9863f)", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
          </div>
        </div>
      </div>

      <div style={C.scroll}>
        {/* ===== Top status pills ===== */}
        <div style={{ display: "flex", gap: 6, margin: "-8px 16px 12px", position: "relative", zIndex: 4 }}>
          <span style={{ borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 600, background: "rgba(196,181,253,0.15)", border: "1px solid rgba(196,181,253,0.3)", color: "#c9a1ff" }}>⭐ Level {Math.floor(points / 100) + 1}</span>
          <span style={{ borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 600, background: "rgba(255,150,60,0.15)", border: "1px solid rgba(255,150,60,0.3)", color: "#ffb066" }}>🔥 {streak} din</span>
          <span style={{ borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 600, background: "rgba(255,215,0,0.13)", border: "1px solid rgba(255,215,0,0.28)", color: "#ffd700" }}>{points} pts</span>
        </div>

        {/* ===== 4-color feature grid ===== */}
        <div style={C.gridwrap}>
          <motion.div style={{ ...C.gi, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.28)" }}
            whileTap={{ scale: 0.96 }} onClick={goAI} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div style={{ fontSize: 22 }}>🤖</div>
            <div><div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>AI Chatbot</div><div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.5)" }}>Ask Anything</div></div>
          </motion.div>
          <motion.div style={{ ...C.gi, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.28)" }}
            whileTap={{ scale: 0.96 }} onClick={goMandi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: 22 }}>📈</div>
            <div><div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>Mandi Bhav</div><div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.5)" }}>Live Price</div></div>
          </motion.div>
          <motion.div style={{ ...C.gi, background: "rgba(90,160,255,0.1)", border: "1px solid rgba(90,160,255,0.28)" }}
            whileTap={{ scale: 0.96 }} onClick={goWeather} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div style={{ fontSize: 22 }}>⛅</div>
            <div><div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>Mausam</div><div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.5)" }}>Live Weather</div></div>
          </motion.div>
          <motion.div style={{ ...C.gi, background: "rgba(230,150,60,0.1)", border: "1px solid rgba(230,150,60,0.28)" }}
            whileTap={{ scale: 0.96 }} onClick={goYojna} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ fontSize: 22 }}>📜</div>
            <div><div style={{ fontSize: 11.5, color: "#fff", fontWeight: 700 }}>Yojnaayein</div><div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.5)" }}>Schemes</div></div>
          </motion.div>
        </div>

        {/* ===== Fasal Tracking card ===== */}
        <motion.div style={C.fasalcard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} onClick={goBg}>
          <div style={{ position: "absolute", right: -10, top: -6, width: 90, height: 90, backgroundImage: "url(/images/mandi-wheat.png)", backgroundSize: "contain", backgroundRepeat: "no-repeat", opacity: 0.85 }} />
          <div style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>Fasal Tracking</div>
          <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginTop: 2 }}>{fasal}</div>
          <div style={{ fontSize: 10, color: "#7fc99a", marginTop: 6, marginBottom: 8 }}>{stage}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: "70%" }}>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,#1eb464,#7dffaa)", width: `${progressPercent}%`, borderRadius: 8, transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: "#7dffaa", fontWeight: 700 }}>{Math.round(progressPercent)}%</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, maxWidth: "80%" }}>
            {stages.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: i < activeStageIdx ? "#1eb464" : i === activeStageIdx ? "#60b8ff" : "rgba(255,255,255,0.15)",
                  border: i === activeStageIdx ? "2px solid #fff" : "none",
                }} />
                <div style={{ fontSize: 6.5, color: "rgba(255,255,255,0.4)" }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>💡 {advice}</div>
        </motion.div>

        {/* ===== Weather card ===== */}
        <motion.div style={C.weathercard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} onClick={goWeather}>
          {weather ? (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#7fa8ff" }}>📍 {weather.city}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{weather.description}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(100,160,255,0.1)" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>💧 {weather.humidity}%</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>💨 {weather.wind} m/s</span>
            </div>
            {forecast.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {forecast.map((f, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(90,160,255,0.06)", border: "1px solid rgba(90,160,255,0.12)", borderRadius: 8, padding: "5px 2px", textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: "#7fa8ff" }}>{f.date}</div>
                    <div style={{ fontSize: 14 }}>{getWeatherIcon(f.id)}</div>
                    <div style={{ fontSize: 9.5, color: "#fff", fontWeight: 600 }}>{f.temp}°C</div>
                  </div>
                ))}
              </div>
            )}
          </>) : (
            <div style={{ textAlign: "center", color: "rgba(100,160,255,0.5)", fontSize: 12 }}>🌤️ Mausam load ho raha hai...</div>
          )}
        </motion.div>

        {alert && (
          <motion.div style={C.alertBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🚨 {alert}
          </motion.div>
        )}

        {/* ===== Quiz + Khata + Community row ===== */}
        <div style={{ margin: "0 16px 12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <motion.div style={{ ...C.gi, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", flexDirection: "column", alignItems: "flex-start", gap: 3, padding: "11px 10px" }}
            whileTap={{ scale: 0.96 }} onClick={goQuiz} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            <div style={{ fontSize: 16 }}>🎯</div>
            <div style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>Quiz</div>
            <div style={{ fontSize: 7.5, color: "#ffd966" }}>50 pts</div>
          </motion.div>
          <motion.div style={{ ...C.gi, background: "rgba(120,220,180,0.08)", border: "1px solid rgba(120,220,180,0.2)", flexDirection: "column", alignItems: "flex-start", gap: 3, padding: "11px 10px" }}
            whileTap={{ scale: 0.96 }} onClick={goKhata} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
            <div style={{ fontSize: 16 }}>📒</div>
            <div style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>Khata</div>
            <div style={{ fontSize: 7.5, color: "#7fd8a0" }}>Hisaab</div>
          </motion.div>
          <motion.div style={{ ...C.gi, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", flexDirection: "column", alignItems: "flex-start", gap: 3, padding: "11px 10px" }}
            whileTap={{ scale: 0.96 }} onClick={goCommunity} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div style={{ fontSize: 16 }}>👥</div>
            <div style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>Samuday</div>
            <div style={{ fontSize: 7.5, color: "#c9a1ff" }}>Judo</div>
          </motion.div>
        </div>

        {/* ===== Streak ===== */}
        <motion.div style={C.streakCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
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

        {/* ===== Mandi mini cards ===== */}
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

        {/* ===== Leaderboard ===== */}
        <motion.div style={C.lb} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
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

      {/* ===== Bottom nav ===== */}
      <div style={C.bottomnav}>
        {[
          { icon: "🏠", label: "Home", key: "home" },
          { icon: "💬", label: "Chat AI", key: "ai" },
          { icon: "👥", label: "Community", key: "community" },
          { icon: "👤", label: "Profile", key: "profile" },
        ].map(n => (
          <div key={n.key}
            onClick={() => n.key === "community" ? goCommunity() : handleNavClick(n.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 3, fontSize: 9,
              color: activeNav === n.key ? "#c9a1ff" : "rgba(255,255,255,0.3)",
              cursor: "pointer"
            }}>
            <div style={{ fontSize: 19 }}>{n.icon}</div>
            <span>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}