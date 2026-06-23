import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";

// Firebase setup
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [screen, setScreen] = useState("splash");
  const [phone, setPhone] = useState("");
  const [kisanNaam, setKisanNaam] = useState("");
  const [shehar, setShehar] = useState("");
  const [sheharSuggestions, setSheharSuggestions] = useState([]);
  const [fasal, setFasal] = useState("");
  const [beejDate, setBeejDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [weather, setWeather] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Splash
  useEffect(() => {
    if (screen === "splash") {
      setTimeout(() => setScreen("phone"), 2000);
    }
  }, [screen]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Weather fetch
  useEffect(() => {
    if (shehar && screen === "main") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${shehar},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json())
        .then(data => {
          if (data.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              humidity: data.main.humidity,
              description: data.weather[0].description,
              id: data.weather[0].id,
              wind: data.wind.speed,
              city: data.name
            });
          }
        })
        .catch(() => {});
    }
  }, [shehar, screen]);

  // Location suggestions
  const fetchSuggestions = async (value) => {
    if (value.length < 2) { setSheharSuggestions([]); return; }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value},IN&limit=5&appid=${process.env.REACT_APP_WEATHER_KEY}`
      );
      const data = await res.json();
      const suggestions = data.map(d => `${d.name}, ${d.state}`);
      setSheharSuggestions([...new Set(suggestions)]);
    } catch { setSheharSuggestions([]); }
  };

  // Firebase — user data load
  const loadUserData = async (phoneNum) => {
    setDbLoading(true);
    try {
      const docRef = doc(db, "kisans", phoneNum);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setKisanNaam(data.naam || "");
        setShehar(data.shehar || "");
        setFasal(data.fasal || "");
        setBeejDate(data.beejDate || "");
        setMessages(data.messages || [{
          role: "assistant",
          content: `Namaste ${data.naam} ji! 🙏 Wapas aaye! Aapki ${data.fasal} fasal ka track chal raha hai!`
        }]);
        setScreen("main");
      } else {
        setScreen("naam");
      }
    } catch { setScreen("naam"); }
    setDbLoading(false);
  };

  // Firebase — user data save
  const saveUserData = async (data) => {
    if (!phone) return;
    try {
      await setDoc(doc(db, "kisans", phone), data, { merge: true });
    } catch (e) { console.log("Save error:", e); }
  };

  // Stage calculator
  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;

  const getStage = () => {
    if (fasal === "🌾 Chawal (Rice)") {
      if (din <= 25) return { stage: "🌱 Nursery Stage", advice: "Roz paani do. Peele patte dikhein to Zinc Sulphate spray karo", icon: "🌱" };
      if (din <= 50) return { stage: "🌿 Transplanting Stage", advice: "Khet mein 2-3 inch paani rakho", icon: "🌿" };
      if (din <= 80) return { stage: "🌾 Growth Stage", advice: "Pehli Urea khad daalne ka samay — zameen ka size batao", icon: "🌾" };
      if (din <= 110) return { stage: "🌸 Flowering Stage", advice: "Paani mat rokna — bahut zaroori hai", icon: "🌸" };
      return { stage: "✂️ Harvesting Stage", advice: "Fasal taiyaar — paani band karo", icon: "✂️" };
    }
    if (fasal === "🌿 Gehun (Wheat)") {
      if (din <= 21) return { stage: "🌱 Jamav Stage", advice: "Pehla paani do", icon: "🌱" };
      if (din <= 45) return { stage: "🌿 Tillering Stage", advice: "Urea daalo — zameen ka size batao", icon: "🌿" };
      if (din <= 75) return { stage: "🌾 Growth Stage", advice: "Doosra paani do aur potash daalo", icon: "🌾" };
      if (din <= 110) return { stage: "🌸 Bali Stage", advice: "Teesra paani do", icon: "🌸" };
      return { stage: "✂️ Harvesting Stage", advice: "Gehun taiyaar — combine harvester book karo", icon: "✂️" };
    }
    if (fasal === "🟡 Sarso (Mustard)") {
      if (din <= 20) return { stage: "🌱 Jamav Stage", advice: "Halka paani do", icon: "🌱" };
      if (din <= 45) return { stage: "🌿 Growth Stage", advice: "Urea aur keeton ki dawai spray karo", icon: "🌿" };
      if (din <= 75) return { stage: "🌸 Phool Stage", advice: "Koi spray mat karo", icon: "🌸" };
      return { stage: "✂️ Harvesting Stage", advice: "Sarso katne ka samay!", icon: "✂️" };
    }
    if (fasal === "🍬 Ganna (Sugarcane)") {
      if (din <= 30) return { stage: "🌱 Jamav Stage", advice: "Halka paani do — roz check karo", icon: "🌱" };
      if (din <= 90) return { stage: "🌿 Growth Stage", advice: "Urea daalo — zameen ka size batao", icon: "🌿" };
      if (din <= 180) return { stage: "🎋 Bhadai Stage", advice: "Potash daalo — 25kg per acre", icon: "🎋" };
      if (din <= 270) return { stage: "🍬 Ripening Stage", advice: "Paani kam karo", icon: "🍬" };
      return { stage: "✂️ Harvesting Stage", advice: "Ganna katne ka samay — mill se contact karo", icon: "✂️" };
    }
    return { stage: "Stage pata nahi", advice: "Sahi fasal chunein", icon: "🌱" };
  };

  const { stage, advice, icon } = getStage();

  // Weather helpers
  const getWeatherIcon = (id) => {
    if (!id) return "🌤️";
    if (id < 300) return "⛈️";
    if (id < 500) return "🌦️";
    if (id < 600) return "🌧️";
    if (id < 700) return "❄️";
    if (id < 800) return "🌫️";
    if (id === 800) return "☀️";
    return "⛅";
  };

  const getBackground = () => {
    const hour = new Date().getHours();
    const isDark = hour < 6 || hour > 19;
    const isRain = weather && weather.id >= 200 && weather.id < 600;
    if (isRain) return { bg: "linear-gradient(180deg, #2c3e6b 0%, #4a6fa5 40%, #7aa3cc 70%, #4a7c59 100%)", rain: true };
    if (isDark) return { bg: "linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 40%, #16213e 70%, #1a3a1a 100%)", rain: false };
    return { bg: "linear-gradient(180deg, #87CEEB 0%, #b8e4f7 40%, #d4edaa 75%, #4a7c59 100%)", rain: false };
  };

  const { bg, rain } = getBackground();
  const isNight = new Date().getHours() > 19 || new Date().getHours() < 6;
  const windSpeed = weather?.wind || 0;

  // Send message
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
Mausam: ${weather ? `${weather.temp}°C, ${weather.description}, Hawa: ${weather.wind}m/s` : "Uplabdh nahi"}
Rules:
- Hamesha Hindi mein jawab de
- Sirf 2-3 lines mein jawab do
- Aasan bhasha — koi technical shabd nahi
- Hanuman Khad Bhandar ek khad beej ki dukan hai jo Hatt(Safidon) mai hai
- Agar koi puche ki tumhe kisne banaya to batao Hanuman Khad Bhandar ne banaya hai
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
      const jawab = data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: "assistant", content: jawab }];
      setMessages(updatedMessages);
      // Save to Firebase
      await saveUserData({ naam: kisanNaam, shehar, fasal, beejDate, phone, messages: updatedMessages });
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  // Voice
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
      const text = e.results[0][0].transcript;
      setInput(text);
      setRecording(false);
    };
    recognition.onerror = () => setRecording(false);
  };

  // ========== SCREENS ==========

  if (screen === "splash") return (
    <motion.div style={styles.splash}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }} style={{ fontSize: 80 }}>🌾</motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#8B6914" }}>Kisan Saathi</motion.h1>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "#5a3e10" }}>Hanuman Khad Bhandar</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ color: "#8B6914" }}>Vill. Hatt (Safidon), Jind</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ color: "#2d8a2d" }}>Loading...</motion.p>
    </motion.div>
  );

  if (screen === "phone") return (
    <motion.div style={styles.splash}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>📱</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10" }}>Apna mobile number daalo</p>
      <p style={{ color: "#8B6914", fontSize: 12 }}>— Ek baar daalo, hamesha yaad rahega —</p>
      <motion.input
        whileFocus={{ scale: 1.02 }}
        style={styles.formInput}
        placeholder="10 digit mobile number..."
        value={phone}
        maxLength={10}
        type="number"
        onChange={(e) => setPhone(e.target.value)}
      />
      {dbLoading ? (
        <div style={{ color: "#8B6914", marginTop: 10 }}>Loading... ⏳</div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={styles.btn}
          onClick={() => { if (phone.length === 10) loadUserData(phone); }}
        >
          ✅ Aage Badho
        </motion.button>
      )}
    </motion.div>
  );

  if (screen === "naam") return (
    <motion.div style={styles.splash}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>🙏</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10" }}>Pehli baar aa rahe ho — details bharo!</p>
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput} placeholder="Apna naam likhein..." value={kisanNaam} onChange={(e) => setKisanNaam(e.target.value)} />
      <div style={{ width: "85%", position: "relative" }}>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          style={{ ...styles.formInput, width: "100%" }}
          placeholder="Apna shehar/gaon likhein..."
          value={shehar}
          onChange={(e) => {
            setShehar(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
        {sheharSuggestions.length > 0 && (
          <div style={styles.suggestions}>
            {sheharSuggestions.map((s, i) => (
              <div key={i} style={styles.suggestionItem}
                onClick={() => { setShehar(s.split(",")[0]); setSheharSuggestions([]); }}>
                📍 {s}
              </div>
            ))}
          </div>
        )}
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn}
        onClick={() => {
          if (kisanNaam && shehar) {
            saveUserData({ naam: kisanNaam, shehar, phone });
            setScreen("fasal");
          }
        }}>
        ✅ Aage Badho
      </motion.button>
    </motion.div>
  );

  if (screen === "fasal") return (
    <motion.div style={styles.splash}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ fontSize: 50 }}>🌾</div>
      <h3 style={{ color: "#8B6914" }}>Namaste {kisanNaam} ji!</h3>
      <p style={{ color: "#5a3e10" }}>Kaunsi fasal uga rahe hain?</p>
      <select style={styles.formInput} value={fasal} onChange={(e) => setFasal(e.target.value)}>
        <option value="">-- Fasal chunein --</option>
        <option>🌾 Chawal (Rice)</option>
        <option>🌿 Gehun (Wheat)</option>
        <option>🟡 Sarso (Mustard)</option>
        <option>🍬 Ganna (Sugarcane)</option>
      </select>
      <input style={styles.formInput} type="date" value={beejDate} max={new Date().toISOString().split("T")[0]} onChange={(e) => setBeejDate(e.target.value)} />
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn}
        onClick={() => {
          if (fasal && beejDate) {
            const initMsg = [{ role: "assistant", content: `Namaste ${kisanNaam} ji! 🙏 Aapki ${fasal} fasal ka track shuru ho gaya!` }];
            setMessages(initMsg);
            saveUserData({ naam: kisanNaam, shehar, fasal, beejDate, phone, messages: initMsg });
            setScreen("main");
          }
        }}>
        🚀 Tracking Shuru Karein
      </motion.button>
    </motion.div>
  );

  // ========== MAIN APP ==========
  return (
    <div style={{ ...styles.app, background: bg, position: "relative", overflow: "hidden" }}>

      {/* Rain Animation */}
      {rain && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(25)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: -20, left: `${(i * 4) % 100}%`, width: 1.5, height: 15 + (i % 3) * 5, background: "rgba(150,180,255,0.7)", borderRadius: 2 }}
              animate={{ y: ["0vh", "110vh"] }}
              transition={{ duration: 0.6 + (i % 5) * 0.08, repeat: Infinity, delay: (i % 12) * 0.15, ease: "linear" }}
            />
          ))}
        </div>
      )}

      {/* Fasal Animation — wind se lehrana */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: "absolute",
              bottom: 0,
              left: `${i * 13}%`,
              fontSize: din <= 25 ? 24 : din <= 80 ? 36 : 48,
              transformOrigin: "bottom center",
              opacity: 0.4,
            }}
            animate={{
              rotate: windSpeed > 5
                ? [0, 15, -5, 12, 0]
                : [0, 5, -2, 4, 0]
            }}
            transition={{
              duration: windSpeed > 5 ? 1.5 : 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            {din <= 25 ? "🌱" : din <= 50 ? "🌿" : din <= 110 ? "🌾" : "🌾"}
          </motion.div>
        ))}
      </div>

      {/* Stars — Raat ko */}
      {isNight && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(20)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: `${(i * 7) % 60}%`, left: `${(i * 13) % 100}%`, width: 2 + (i % 2), height: 2 + (i % 2), background: "white", borderRadius: "50%" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.4 }}
            />
          ))}
        </div>
      )}

      {/* Moon — Raat ko */}
      {isNight && (
        <motion.div
          style={{ position: "absolute", top: 15, right: 15, fontSize: 28, zIndex: 0, opacity: 0.6 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >🌙</motion.div>
      )}

      {/* Sun — Din ko */}
      {!isNight && !rain && (
        <motion.div
          style={{ position: "absolute", top: 10, right: 10, fontSize: 30, zIndex: 0, opacity: 0.5 }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >☀️</motion.div>
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
              <div style={{ fontSize: 12, color: "#5a3e10", fontWeight: "bold" }}>📍 {weather.city}</div>
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#8B6914" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
              <div style={{ fontSize: 11, color: "#5a3e10" }}>{weather.description}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "#5a3e10" }}>
              <div>💧 {weather.humidity}%</div>
              <div>💨 {weather.wind} m/s</div>
              <div style={{ fontSize: 10, color: "#8B6914", marginTop: 2 }}>⚠️ Approximate</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#8B6914", textAlign: "center" }}>🌤️ Mausam load ho raha hai...</div>
        )}
      </motion.div>

      {/* Stage Card */}
      <motion.div style={{ ...styles.stageCard, position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={styles.stageTitle}>{fasal} — Din {din}</div>
        <div style={styles.stageName}>{stage}</div>
        <div style={styles.advice}>💡 {advice}</div>
      </motion.div>

      {/* Chat */}
      <div style={{ ...styles.chatBox, position: "relative", zIndex: 1 }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div style={styles.botMsg} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
            Soch raha hoon... ⏳
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Camera */}
      {showCamera && (
        <div style={{ ...styles.cameraBox, position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 13, color: "#5a3e10", margin: "0 0 8px" }}>📸 Fasal ki photo lo — AI bimaari batayega!</p>
          <input type="file" accept="image/*" capture="environment"
            onChange={() => { setShowCamera(false); alert("Photo li! AI analysis jaldi add hoga."); }} />
          <button onClick={() => setShowCamera(false)} style={{ ...styles.closeBtn, marginTop: 8 }}>✕ Band Karo</button>
        </div>
      )}

      {/* Input Bar */}
      <div style={{ ...styles.inputBar, position: "relative", zIndex: 1 }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowCamera(!showCamera)} style={styles.iconBtn}>📷</motion.button>
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
        <span>🌾 Hanuman Khad Bhandar, Vill. Hatt (Safidon) 🌾</span>
        <br />
        <span style={{ fontSize: 10, color: "#a07030" }}>
          <button onClick={() => { setScreen("fasal"); }} style={{ background: "none", border: "none", color: "#8B6914", fontSize: 10, cursor: "pointer", textDecoration: "underline" }}>
            🔄 Nayi Fasal
          </button>
          {" | "}
          <button onClick={() => {
            setScreen("phone"); setPhone(""); setKisanNaam(""); setShehar("");
            setFasal(""); setBeejDate(""); setMessages([]);
          }} style={{ background: "none", border: "none", color: "#8B6914", fontSize: 10, cursor: "pointer", textDecoration: "underline" }}>
            👤 Logout
          </button>
        </span>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" },
  splash: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#8B6914", padding: "12px 16px", color: "white" },
  kisanNaam: { fontSize: 14, fontWeight: "bold", color: "white" },
  dukaanNaam: { fontSize: 11, color: "white" },
  weatherCard: { background: "rgba(255,248,225,0.92)", padding: "8px 14px", margin: "6px 10px", borderRadius: 12, border: "1px solid #c8a96e" },
  stageCard: { background: "rgba(255,248,225,0.92)", padding: 12, margin: "0 10px 8px", borderRadius: 15, borderLeft: "5px solid #2d8a2d" },
  stageTitle: { color: "#8B6914", fontWeight: "bold", fontSize: 13 },
  stageName: { color: "#2d8a2d", fontSize: 15, fontWeight: "bold", marginTop: 3 },
  advice: { color: "#5a3e10", fontSize: 12, marginTop: 4 },
  chatBox: { flex: 1, overflowY: "auto", padding: "0 10px", marginBottom: 5 },
  userMsg: { background: "#8B6914", color: "white", padding: "9px 13px", borderRadius: "18px 18px 4px 18px", margin: "5px 0", maxWidth: "80%", marginLeft: "auto", fontSize: 13 },
  botMsg: { background: "rgba(255,248,225,0.95)", color: "#3a2a0a", padding: "9px 13px", borderRadius: "18px 18px 18px 4px", margin: "5px 0", maxWidth: "80%", fontSize: 13, border: "1px solid #c8a96e" },
  inputBar: { display: "flex", alignItems: "center", padding: "8px 10px", background: "rgba(255,248,225,0.95)", borderTop: "2px solid #c8a96e", gap: 6 },
  input: { flex: 1, padding: "9px 13px", borderRadius: 25, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 13, outline: "none" },
  iconBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 3 },
  sendBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: "50%", width: 38, height: 38, fontSize: 16, cursor: "pointer" },
  cameraBox: { background: "rgba(255,248,225,0.95)", padding: 12, margin: "0 10px 8px", borderRadius: 15, border: "2px dashed #2d8a2d", textAlign: "center" },
  closeBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12 },
  formInput: { width: "85%", padding: "12px 16px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 15, margin: "8px 0", outline: "none" },
  btn: { background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "12px 30px", fontSize: 16, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" },
  footer: { textAlign: "center", padding: "8px 10px", fontSize: 11, color: "#8B6914", borderTop: "1px solid #c8a96e", background: "rgba(255,248,225,0.95)" },
  suggestions: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff8e1", border: "1px solid #c8a96e", borderRadius: 10, zIndex: 100, maxHeight: 150, overflowY: "auto" },
  suggestionItem: { padding: "10px 15px", fontSize: 13, color: "#5a3e10", cursor: "pointer", borderBottom: "1px solid #f0e8d0" },
};

export default App;