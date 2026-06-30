import { motion } from "framer-motion";
import { getStreakDays } from "./StreakSystem";

export default function ProfilePage({ onBack, kisanNaam, phone, shehar, fasal, beejDate, points, streak, onLogout, onChangeFasal }) {
  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;
  const level = Math.floor(points / 100) + 1;
  const streakDays = getStreakDays(streak);

  const rewards = [
    { pts: 100, reward: "₹5 discount dawai par" },
    { pts: 500, reward: "₹30 discount" },
    { pts: 1000, reward: "₹75 discount + free mitti test" },
    { pts: 2000, reward: "Special Kisan package" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#60b8ff", fontWeight: "bold", fontSize: 16 }}>👤 Mera Profile</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "rgba(10,40,100,0.5)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 16, padding: "18px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 50, marginBottom: 8 }}>👨‍🌾</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{kisanNaam} ji</div>
          <div style={{ fontSize: 12, color: "rgba(100,180,255,0.6)", marginTop: 4 }}>📱 {phone}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>📍 {shehar}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
            <span style={{ background: "rgba(100,180,255,0.12)", border: "1px solid rgba(100,180,255,0.25)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#60b8ff", fontWeight: 600 }}>
              ⭐ Level {level} Kisan
            </span>
            <span style={{ background: "rgba(255,120,0,0.14)", border: "1px solid rgba(255,120,0,0.28)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#ff9944", fontWeight: 600 }}>
              🔥 {streak} din streak
            </span>
          </div>
        </motion.div>

        {/* Points */}
        <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ffd700" }}>⭐ Mere Points</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#ffd700" }}>{points}</div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Rewards — Hanuman Khad Bhandar</div>
          {rewards.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < rewards.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ fontSize: 11, color: points >= r.pts ? "#7dffaa" : "rgba(255,255,255,0.35)" }}>{r.reward}</div>
              <div style={{ fontSize: 10, color: points >= r.pts ? "#7dffaa" : "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                {points >= r.pts ? "✅ Unlock" : `${r.pts} pts`}
              </div>
            </div>
          ))}
        </div>

        {/* Streak */}
        <div style={{ background: "rgba(255,120,0,0.09)", border: "1px solid rgba(255,120,0,0.2)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9944", marginBottom: 8 }}>🔥 Is Hafte ki Streak</div>
          <div style={{ display: "flex", gap: 6 }}>
            {streakDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: d.isToday ? "#ff6600" : d.done ? "rgba(255,120,0,0.35)" : "rgba(255,255,255,0.07)", border: d.done ? "1px solid #ff9944" : "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {d.done ? (d.isToday ? "🔥" : "✓") : ""}
                </div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>{d.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fasal info */}
        <div style={{ background: "rgba(30,180,100,0.09)", border: "1px solid rgba(30,180,100,0.2)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#7dffaa", marginBottom: 6 }}>🌾 Meri Fasal</div>
          <div style={{ fontSize: 14, color: "#fff" }}>{fasal}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Din {din} chal raha hai</div>
          <button onClick={onChangeFasal} style={{ marginTop: 10, background: "rgba(30,180,100,0.15)", border: "1px solid rgba(30,180,100,0.3)", color: "#7dffaa", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            🔄 Nayi Fasal Badlo
          </button>
        </div>

        {/* Logout */}
        <button onClick={onLogout}
          style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff6666", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 13, fontWeight: 600, marginTop: 4 }}>
          🚪 Logout
        </button>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}