import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkAndUpdateStreak, getLeaderboard, getStreakDays } from "./StreakSystem";

const NEARBY_MANDIS = ["Jind","Kaithal","Karnal","Hisar","Rohtak","Panipat","Ambala"];

export default function HomePage({
  db, phone, kisanNaam, shehar, fasal, beejDate,
  weather, forecast, stage, advice, din, alert,
  getWeatherIcon, onOpenChat, onOpenKhata, onOpenMandi,
  onOpenBg, onOpenQuiz, onOpenYojna, onOpenWeather, onOpenProfile,
}) {
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [streakDays, setStreakDays] = useState([]);
  const [mandiData, setMandiData] = useState([]);
  const [mandiLoading, setMandiLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    if (!phone) return;
    checkAndUpdateStreak(db, phone).then(res => {
      setStreak(res.streak);
      setPoints(res.points);
      setStreakDays(getStreakDays(res.streak));
    });
    getLeaderboard(db).then(setLeaderboard);
    fetchNearestMandi();
  }, [phone]);

  const fetchNearestMandi = async () => {
    setMandiLoading(true);
    const districtName = shehar?.split(",")[0]?.trim() || "Jind";
    const tryMandis = [districtName, ...NEARBY_MANDIS];
    for (const mandi of tryMandis) {
      try {
        const res = await fetch(
          `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.REACT_APP_MANDI_KEY}&format=json&filters[State.keyword]=Haryana&filters[District]=${mandi}&limit=5`
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

  const features = [
    { icon: "🤖", label: "AI Salah", fn: goAI },
    { icon: "📊", label: "Mandi Live", fn: goMandi, badge: true },
    { icon: "📋", label: "Khata", fn: goKhata },
    { icon: "🏛️", label: "Yojna", fn: goYojna, badge: true },
    { icon: "🎯", label: "Quiz", fn: goQuiz },
  ];

  function handleNavClick(key) {
    setActiveNav(key);
    if (key === "home") return;
    if (key === "weather") return goWeather();
    if (key === "ai") return goAI();
    if (key === "mandi") return goMandi();
    if (key === "profile") return goProfile();
  }

  const C = {
    wrap: { minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
    topbar: { background: "rgba(7,21,40,0.97)", borderBottom: "1px solid rgba(100,180,255,0.12)", padding: "8px 14px", position: "relative", zIndex: 10 },
    scroll: { flex: 1, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 7, position: "relative", zIndex: 2 },
    wcard: { background: "rgba(10,40,100,0.55)", border: "1px solid rgba(100,180,255,0.18)", borderRadius: 14, padding: "10px 12px", cursor: "pointer" },
    alertBox: { background: "rgba(255,50,50,0.12)", border: "1px solid rgba(255,50,50,0.25)", borderRadius: 9, padding: "6px 10px", fontSize: 11, color: "#ff9999" },
    cropCard: { background: "rgba(30,180,100,0.1)", border: "1px solid rgba(30,180,100,0.22)", borderRadius: 13, padding: "9px 11px" },
    pbarWrap: { height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", margin: "6px 0 4px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 },
    gi: { background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.13)", borderRadius: 11, padding: "8px 5px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", position: "relative" },
    streakCard: { background: "rgba(255,120,0,0.1)", border: "1px solid rgba(255,120,0,0.22)", borderRadius: 12, padding: "8px 11px" },
    mc: { flex: 1, background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.13)", borderRadius: 9, padding: "6px 7px", cursor: "pointer" },
    lb: { background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.15)", borderRadius: 12, padding: "8px 10px" },
    bottomnav: { background: "rgba(4,14,29,0.97)", borderTop: "1px solid rgba(100,180,255,0.1)", padding: "7px 0 6px", display: "flex", justifyContent: "space-around", position: "relative", zIndex: 10 },
  };

  return (
    <div style={C.wrap}>
      <div onClick={goBg} style={{ position: "absolute", inset: 0, zIndex: 0 }} />

      <div style={C.topbar}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#60b8ff" }}>❄️ Hanuman Khad Bhandar</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", cursor: "pointer" }} onClick={goProfile}>
            👤 {kisanNaam} ji
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
          <span style={{ borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600, background: "rgba(100,180,255,0.12)", border: "1px solid rgba(100,180,255,0.25)", color: "#60b8ff" }}>⭐ Level {Math.floor(points / 100) + 1}</span>
          <span style={{ borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600, background: "rgba(255,120,0,0.14)", border: "1px solid rgba(255,120,0,0.28)", color: "#ff9944" }}>🔥 {streak} din</span>
          <span style={{ borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 600, background: "rgba(255,200,0,0.12)", border: "1px solid rgba(255,200,0,0.25)", color: "#ffd700" }}>{points} pts</span>
        </div>
      </div>

      <div style={C.scroll}>
        <motion.div style={C.wcard} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onClick={goWeather}>
          {weather ? (<>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "rgba(100,180,255,0.7)" }}>📍 {weather.city}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{weather.description}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 5, paddingTop: 5, borderTop: "1px solid rgba(100,180,255,0.1)" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>💧 {weather.humidity}%</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>💨 {weather.wind} m/s</span>
            </div>
            {forecast.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                {forecast.map((f, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(100,180,255,0.06)", border: "1px solid rgba(100,180,255,0.1)", borderRadius: 6, padding: "4px 2px", textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: "rgba(100,180,255,0.5)" }}>{f.date}</div>
                    <div style={{ fontSize: 13 }}>{getWeatherIcon(f.id)}</div>
                    <div style={{ fontSize: 9, color: "#fff", fontWeight: 600 }}>{f.temp}°C</div>
                  </div>
                ))}
              </div>
            )}
          </>) : (
            <div style={{ textAlign: "center", color: "rgba(100,180,255,0.5)", fontSize: 12 }}>🌤️ Mausam load ho raha hai...</div>
          )}
        </motion.div>

        {alert && (
          <motion.div style={C.alertBox} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            🚨 {alert}
          </motion.div>
        )}

        <motion.div style={C.cropCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={goBg}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7dffaa" }}>{fasal}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Din {din}</div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Abhi: {stage}</div>
          <div style={C.pbarWrap}>
            <div style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#1eb464,#7dffaa)", width: `${progressPercent}%`, transition: "width 1s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
            <span>Start</span><span>{Math.round(progressPercent)}%</span><span>Harvest</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {stages.map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{
                  width: 9, height: 9, borderRadius: "50%",
                  background: i < activeStageIdx ? "#1eb464" : i === activeStageIdx ? "#60b8ff" : "rgba(255,255,255,0.1)",
                  border: i === activeStageIdx ? "2px solid #fff" : "1px solid rgba(255,255,255,0.15)",
                  boxShadow: i === activeStageIdx ? "0 0 5px #60b8ff88" : "none"
                }} />
                <div style={{ fontSize: 7, color: i === activeStageIdx ? "#60b8ff" : "rgba(255,255,255,0.25)", textAlign: "center", maxWidth: 30 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 5 }}>💡 {advice}</div>
        </motion.div>

        <div style={C.grid}>
          {features.map((f, i) => (
            <motion.div key={i} style={C.gi} whileTap={{ scale: 0.93 }} onClick={f.fn}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              {f.badge && <div style={{ position: "absolute", top: 4, right: 5, width: 6, height: 6, borderRadius: "50%", background: "#ff4444" }} />}
              <div style={{ fontSize: 20 }}>{f.icon}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", textAlign: "center", fontWeight: 500 }}>{f.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div style={C.streakCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#ff9944" }}>🔥 Daily Streak — {streak} din!</div>
            <div style={{ fontSize: 10, color: "#ffd700", fontWeight: 700 }}>+10 pts/din</div>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {streakDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: d.isToday ? "#ff6600" : d.done ? "rgba(255,120,0,0.35)" : "rgba(255,255,255,0.07)",
                  border: d.done ? "1px solid #ff9944" : "1px solid rgba(255,255,255,0.12)",
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
          <div style={{ display: "flex", gap: 5 }}>
            {mandiData.map((m, i) => (
              <motion.div key={i} style={C.mc} whileTap={{ scale: 0.95 }} onClick={goMandi}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.38)" }}>{m.commodity}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2 }}>₹{m.modal_price}</div>
                <div style={{ fontSize: 8, color: "#7dffaa" }}>📍 {m.market?.slice(0, 12)}</div>
              </motion.div>
            ))}
          </div>
        )}
        {mandiLoading && (
          <div style={{ textAlign: "center", fontSize: 11, color: "rgba(100,180,255,0.4)" }}>
            📊 Mandi bhav dhundh raha hoon...
          </div>
        )}

        <motion.div style={C.lb} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ fontSize: 11, color: "#60b8ff", fontWeight: 700, marginBottom: 6 }}>🏆 Safidon Kisan Leaderboard</div>
          {[...leaderboard, { naam: kisanNaam + " (Tu)", points, isYou: true }]
            .sort((a, b) => b.points - a.points).slice(0, 4)
            .map((l, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "3px 5px",
                borderRadius: 6, background: l.isYou ? "rgba(100,180,255,0.1)" : "transparent", marginBottom: 2
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", width: 14 }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i+1}.`}
                </div>
                <div style={{ flex: 1, fontSize: 10, color: l.isYou ? "#60b8ff" : "rgba(255,255,255,0.6)" }}>{l.naam}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#60b8ff" }}>{l.points}</div>
              </div>
            ))}
        </motion.div>

        <div style={{ height: 8 }} />
      </div>

      <div style={C.bottomnav}>
        {[
          { icon: "🏠", label: "Home", key: "home" },
          { icon: "🌤️", label: "Weather", key: "weather" },
          { icon: "💬", label: "AI", key: "ai" },
          { icon: "📊", label: "Mandi", key: "mandi" },
          { icon: "👤", label: "Profile", key: "profile" },
        ].map(n => (
          <div key={n.key}
            onClick={() => handleNavClick(n.key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, fontSize: 9,
              color: activeNav === n.key ? "#60b8ff" : "rgba(255,255,255,0.28)",
              cursor: "pointer"
            }}>
            <div style={{ fontSize: 18 }}>{n.icon}</div>
            <span>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}