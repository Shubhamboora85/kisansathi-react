import { motion } from "framer-motion";

export default function WeatherPage({ onBack, weather, forecast, getWeatherIcon, shehar }) {
  const tips = [
    weather?.temp > 42 ? "🌡️ Bahut garmi — subah 6-9 baje ya shaam 5-7 baje khet mein kaam karo" : null,
    weather?.wind > 10 ? "💨 Tej hawa — aaj koi bhi spray mat karo" : null,
    weather?.id >= 200 && weather?.id < 600 ? "🌧️ Baarish ho rahi hai — aaj paani dene ki zaroorat nahi" : null,
    weather?.humidity > 80 ? "💧 Humidity zyada hai — fungal disease ka khatara, dhyan rakho" : null,
  ].filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#60b8ff", fontWeight: "bold", fontSize: 16 }}>🌤️ Mausam Jaankari</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {weather ? (<>
          {/* Main weather */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "rgba(10,40,100,0.5)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 16, color: "rgba(100,180,255,0.7)", marginBottom: 6 }}>📍 {weather.city || shehar}</div>
            <div style={{ fontSize: 64, lineHeight: 1 }}>{getWeatherIcon(weather.id)}</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: "#fff", marginTop: 8 }}>{weather.temp}°C</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{weather.description}</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(100,180,255,0.1)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>💧</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#60b8ff" }}>{weather.humidity}%</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Humidity</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>💨</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#60b8ff" }}>{weather.wind} m/s</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Hawa</div>
              </div>
            </div>
          </motion.div>

          {/* Tips */}
          {tips.length > 0 && (
            <div style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.2)", borderRadius: 13, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ff9999", marginBottom: 8 }}>⚠️ Aaj ke liye Salah</div>
              {tips.map((t, i) => <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>{t}</div>)}
            </div>
          )}

          {/* 3-day forecast */}
          {forecast.length > 0 && (
            <div style={{ background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.13)", borderRadius: 13, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#60b8ff", marginBottom: 10 }}>📅 Agle 3 Din</div>
              {forecast.map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < forecast.length - 1 ? "1px solid rgba(100,180,255,0.08)" : "none" }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", width: 70 }}>{f.date}</div>
                  <div style={{ fontSize: 22 }}>{getWeatherIcon(f.id)}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{f.temp}°C</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", maxWidth: 90, textAlign: "right" }}>{f.desc}</div>
                </div>
              ))}
            </div>
          )}
        </>) : (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(100,180,255,0.5)" }}>
            🌤️ Mausam load ho raha hai...
          </div>
        )}
      </div>
    </div>
  );
}