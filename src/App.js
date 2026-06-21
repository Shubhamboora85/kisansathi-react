import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("splash");
  const [kisanNaam, setKisanNaam] = useState("");
  const [shehar, setShehar] = useState("");
  const [fasal, setFasal] = useState("");
  const [beejDate, setBeejDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [weather, setWeather] = useState(null);

  if (screen === "splash") {
    setTimeout(() => setScreen("naam"), 2000);
  }

  // Weather fetch
  useEffect(() => {
    if (shehar && screen === "main") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${shehar}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json())
        .then(data => {
          if (data.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              humidity: data.main.humidity,
              description: data.weather[0].description,
              id: data.weather[0].id,
              wind: data.wind.speed
            });
          }
        })
        .catch(() => setWeather(null));
    }
  }, [shehar, screen]);

  if (screen === "splash") return <SplashScreen />;
  if (screen === "naam") return (
    <NaamScreen onSubmit={(naam, sh) => {
      setKisanNaam(naam);
      setShehar(sh);
      setScreen("fasal");
    }} />
  );
  if (screen === "fasal") return (
    <FasalScreen kisanNaam={kisanNaam} onSubmit={(f, date) => {
      setFasal(f);
      setBeejDate(date);
      setMessages([{ role: "assistant", content: `Namaste ${kisanNaam} ji! 🙏 Aapki ${f} fasal ka track shuru ho gaya!` }]);
      setScreen("main");
    }} />
  );

  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;

  const getStage = () => {
    if (fasal === "🌾 Chawal (Rice)") {
      if (din <= 25) return { stage: "🌱 Nursery Stage", advice: "Roz paani do. Peele patte dikhein to Zinc Sulphate spray karo" };
      if (din <= 50) return { stage: "🌿 Transplanting Stage", advice: "Khet mein 2-3 inch paani rakho" };
      if (din <= 80) return { stage: "🌾 Growth Stage", advice: "Urea khad daalo — 25kg per acre" };
      if (din <= 110) return { stage: "🌸 Flowering Stage", advice: "Paani mat rokna — bahut zaroori hai" };
      return { stage: "✂️ Harvesting Stage", advice: "Fasal taiyaar — paani band karo" };
    }
    if (fasal === "🌿 Gehun (Wheat)") {
      if (din <= 21) return { stage: "🌱 Jamav Stage", advice: "Pehla paani do" };
      if (din <= 45) return { stage: "🌿 Tillering Stage", advice: "Urea daalo — 30kg per acre" };
      if (din <= 75) return { stage: "🌾 Growth Stage", advice: "Doosra paani do aur potash daalo" };
      if (din <= 110) return { stage: "🌸 Bali Stage", advice: "Teesra paani do" };
      return { stage: "✂️ Harvesting Stage", advice: "Gehun taiyaar — combine harvester book karo" };
    }
    if (fasal === "🟡 Sarso (Mustard)") {
      if (din <= 20) return { stage: "🌱 Jamav Stage", advice: "Halka paani do" };
      if (din <= 45) return { stage: "🌿 Growth Stage", advice: "Urea aur keeton ki dawai spray karo" };
      if (din <= 75) return { stage: "🌸 Phool Stage", advice: "Koi spray mat karo" };
      return { stage: "✂️ Harvesting Stage", advice: "Sarso katne ka samay!" };
    }
    if (fasal === "🍬 Ganna (Sugarcane)") {
      if (din <= 30) return { stage: "🌱 Jamav Stage", advice: "Halka paani do — roz check karo" };
      if (din <= 90) return { stage: "🌿 Growth Stage", advice: "Urea daalo — 50kg per acre" };
      if (din <= 180) return { stage: "🎋 Bhadai Stage", advice: "Potash daalo — 25kg per acre" };
      if (din <= 270) return { stage: "🍬 Ripening Stage", advice: "Paani kam karo" };
      return { stage: "✂️ Harvesting Stage", advice: "Ganna katne ka samay — mill se contact karo" };
    }
    return { stage: "Stage pata nahi", advice: "Sahi fasal chunein" };
  };

  const { stage, advice } = getStage();

  // Weather icon
  const getWeatherIcon = (id) => {
    if (!id) return "🌤️";
    if (id < 300) return "⛈️";
    if (id < 500) return "🌧️";
    if (id < 600) return "🌧️";
    if (id < 700) return "❄️";
    if (id < 800) return "🌫️";
    if (id === 800) return "☀️";
    return "⛅";
  };

  // Background
  const getBackground = () => {
    const hour = new Date().getHours();
    const isDark = hour < 6 || hour > 19;
    const isRain = weather && weather.id < 600;
    if (isRain) return { bg: "linear-gradient(180deg, #4a6fa5 0%, #7aa3cc 50%, #c8deb5 100%)", rain: true };
    if (isDark) return { bg: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #2d5a27 100%)", rain: false };
    return { bg: "linear-gradient(180deg, #87CEEB 0%, #b8e4f7 40%, #c8deb5 100%)", rain: false };
  };

  const { bg, rain } = getBackground();
  const isNight = new Date().getHours() > 19 || new Date().getHours() < 6;

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 150,
          messages: [
            {
              role: "system",
              content: `Tu ek experienced Indian agriculture expert hai.
Kisan ka naam: ${kisanNaam}
Fasal: ${fasal}
Stage: ${stage}
Din: ${din}
Mausam: ${weather ? `${weather.temp}°C, ${weather.description}` : "Uplabdh nahi"}
Rules:
- Hamesha Hindi mein jawab de
- Sirf 2-3 lines mein jawab do
- Aasan bhasha — koi technical shabd nahi
- tumhe Hanuman Khad Bhandar ne banaya hai kisan ki madad ke liye
- research karke jawab do ki jo dawai kisaan daalne ki puch raha hai kya vo dawai kisaan dal sakta hai ya nahi
- agar pata nahi hai kisi dawai ya salt ka to kisaan se uski or jaankari lo ya us dawai ki research karo
- Pehle poora sawaal samjho — phir jawab do
- Agar kisan ne zameen ka size nahi bataya to PEHLE poochho
- Kabhi bhi bina zameen ka size jaane matra mat batao
- Nursery stage mein sirf paani aur Zinc Sulphate — koi urea ya khad nahi
- Transplanting ke 10-15 din baad pehli urea dete hain
- Galat advice mat do`
            },
            ...newMessages
          ]
        })
      });
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Chrome use karo mic ke liye!");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.start();
    setRecording(true);
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
  };

  return (
    <div style={{ ...styles.app, background: bg, position: "relative", overflow: "hidden" }}>

      {/* Rain */}
      {rain && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(20)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: -20, left: `${(i * 5) % 100}%`, width: 2, height: 20, background: "rgba(100,150,255,0.6)", borderRadius: 2 }}
              animate={{ y: ["0vh", "110vh"] }}
              transition={{ duration: 0.8 + (i % 5) * 0.1, repeat: Infinity, delay: (i % 10) * 0.2, ease: "linear" }}
            />
          ))}
        </div>
      )}

      {/* Fasal Animation */}
      <motion.div
        style={{ position: "absolute", bottom: 60, right: 10, fontSize: din <= 25 ? 30 : din <= 80 ? 50 : 70, opacity: 0.15, zIndex: 0, pointerEvents: "none" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {din <= 25 ? "🌱" : din <= 50 ? "🌿" : din <= 110 ? "🌾" : "✂️"}
      </motion.div>

      {/* Stars */}
      {isNight && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 200, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(15)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: `${(i * 7) % 100}%`, left: `${(i * 13) % 100}%`, width: 3, height: 3, background: "white", borderRadius: "50%" }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: (i % 5) * 0.6 }}
            />
          ))}
        </div>
      )}

      {/* Top Bar */}
      <motion.div style={{ ...styles.topBar, position: "relative", zIndex: 1 }}
        initial={{ y: -60 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 120 }}>
        <span style={styles.kisanNaam}>🙏 Namaste, {kisanNaam} ji!</span>
        <span style={styles.dukaanNaam}>🏪 Hanuman Khad Bhandar</span>
      </motion.div>

      {/* Weather Card */}
      <motion.div style={{ ...styles.weatherCard, position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {weather ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#5a3e10", fontWeight: "bold" }}>📍 {shehar}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#8B6914" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
              <div style={{ fontSize: 12, color: "#5a3e10" }}>{weather.description}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: "#5a3e10" }}>
              <div>💧 {weather.humidity}%</div>
              <div>💨 {weather.wind} m/s</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "#8B6914", textAlign: "center" }}>🌤️ Mausam load ho raha hai...</div>
        )}
      </motion.div>

      {/* Stage Card */}
      <motion.div style={{ ...styles.stageCard, position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={styles.stageTitle}>{fasal} — Din {din}</div>
        <div style={styles.stageName}>{stage}</div>
        <div style={styles.advice}>💡 {advice}</div>
      </motion.div>

      {/* Chat */}
      <div style={{ ...styles.chatBox, position: "relative", zIndex: 1 }}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.botMsg}>Soch raha hoon... ⏳</div>}
      </div>

      {/* Camera */}
      {showCamera && (
        <div style={{ ...styles.cameraBox, position: "relative", zIndex: 1 }}>
          <input type="file" accept="image/*" capture="environment"
            onChange={() => { setShowCamera(false); alert("Photo li!"); }} />
          <button onClick={() => setShowCamera(false)} style={styles.closeBtn}>✕ Band Karo</button>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ ...styles.inputBar, position: "relative", zIndex: 1 }}>
        <button onClick={() => setShowCamera(true)} style={styles.iconBtn}>📷</button>
        <input style={styles.input} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Sawaal likhein..." />
        <motion.button whileTap={{ scale: 0.8 }} onClick={startVoice} style={styles.iconBtn}>
          {recording ? "🔴" : "🎤"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => sendMessage(input)} style={styles.sendBtn}>➤</motion.button>
      </div>

      {/* Footer */}
      <div style={{ ...styles.footer, position: "relative", zIndex: 1 }}>
        🌾 Greetings from Hanuman Khad Bhandar, Vill. Hatt (Safidon) 🌾
      </div>
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div style={styles.splash} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }} style={{ fontSize: 80 }}>🌾</motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#8B6914" }}>Kisan Saathi</motion.h1>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "#5a3e10" }}>Hanuman Khad Bhandar</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ color: "#8B6914" }}>Vill. Hatt (Safidon), Jind</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ color: "#2d8a2d" }}>Loading...</motion.p>
    </motion.div>
  );
}

function NaamScreen({ onSubmit }) {
  const [naam, setNaam] = useState("");
  const [shehar, setShehar] = useState("");
  return (
    <motion.div style={styles.splash} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>🙏</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10" }}>Main aapka Kisan Saathi hoon</p>
      <p style={{ color: "#8B6914", fontSize: 13 }}>— Hanuman Khad Bhandar ki taraf se —</p>
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput} placeholder="Apna naam likhein..." value={naam} onChange={(e) => setNaam(e.target.value)} />
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput} placeholder="Apna shehar likhein..." value={shehar} onChange={(e) => setShehar(e.target.value)} />
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn} onClick={() => { if (naam && shehar) onSubmit(naam, shehar); }}>
        ✅ Aage Badho
      </motion.button>
    </motion.div>
  );
}

function FasalScreen({ kisanNaam, onSubmit }) {
  const [fasal, setFasal] = useState("🌾 Chawal (Rice)");
  const [date, setDate] = useState("");
  return (
    <div style={styles.splash}>
      <div style={{ fontSize: 50 }}>🌾</div>
      <h3 style={{ color: "#8B6914" }}>Namaste {kisanNaam} ji!</h3>
      <p style={{ color: "#5a3e10" }}>Kaunsi fasal uga rahe hain?</p>
      <select style={styles.formInput} value={fasal} onChange={(e) => setFasal(e.target.value)}>
        <option>🌾 Chawal (Rice)</option>
        <option>🌿 Gehun (Wheat)</option>
        <option>🟡 Sarso (Mustard)</option>
        <option>🍬 Ganna (Sugarcane)</option>
      </select>
      <input style={styles.formInput} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button style={styles.btn} onClick={() => { if (fasal && date) onSubmit(fasal, date); }}>
        🚀 Tracking Shuru Karein
      </button>
    </div>
  );
}

const styles = {
  app: { fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" },
  splash: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#8B6914", padding: "12px 16px", color: "white" },
  kisanNaam: { fontSize: 15, fontWeight: "bold", color: "white" },
  dukaanNaam: { fontSize: 12, color: "white" },
  weatherCard: { background: "rgba(255,248,225,0.95)", padding: "10px 15px", margin: "8px 10px", borderRadius: 12, border: "1px solid #c8a96e" },
  stageCard: { background: "rgba(255,248,225,0.9)", padding: 15, margin: "0 10px 10px", borderRadius: 15, borderLeft: "5px solid #2d8a2d" },
  stageTitle: { color: "#8B6914", fontWeight: "bold", fontSize: 14 },
  stageName: { color: "#2d8a2d", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  advice: { color: "#5a3e10", fontSize: 13, marginTop: 6 },
  chatBox: { flex: 1, overflowY: "auto", padding: "0 10px", marginBottom: 10 },
  userMsg: { background: "#8B6914", color: "white", padding: "10px 14px", borderRadius: "18px 18px 4px 18px", margin: "6px 0", maxWidth: "80%", marginLeft: "auto", fontSize: 14 },
  botMsg: { background: "rgba(255,248,225,0.95)", color: "#3a2a0a", padding: "10px 14px", borderRadius: "18px 18px 18px 4px", margin: "6px 0", maxWidth: "80%", fontSize: 14, border: "1px solid #c8a96e" },
  inputBar: { display: "flex", alignItems: "center", padding: "10px", background: "rgba(255,248,225,0.95)", borderTop: "2px solid #c8a96e", gap: 8 },
  input: { flex: 1, padding: "10px 14px", borderRadius: 25, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 14, outline: "none" },
  iconBtn: { background: "none", border: "none", fontSize: 24, cursor: "pointer", padding: 4 },
  sendBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: "50%", width: 40, height: 40, fontSize: 18, cursor: "pointer" },
  cameraBox: { background: "rgba(255,248,225,0.95)", padding: 15, margin: 10, borderRadius: 15, border: "2px dashed #2d8a2d", textAlign: "center" },
  closeBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "6px 12px", marginTop: 8, cursor: "pointer" },
  formInput: { width: "85%", padding: "12px 16px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 15, margin: "8px 0", outline: "none" },
  btn: { background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "12px 30px", fontSize: 16, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" },
  footer: { textAlign: "center", padding: 10, fontSize: 11, color: "#8B6914", borderTop: "1px solid #c8a96e", background: "rgba(255,248,225,0.95)" },
};

export default App;