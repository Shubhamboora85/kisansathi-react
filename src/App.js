import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import "./App.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== FASAL GROWING BACKGROUND =====
function FasalBackground({ din, windSpeed, isRain, isNight }) {
  const fasalIcon = din <= 10 ? "🌱" : din <= 30 ? "🌿" : din <= 80 ? "🌾" : "🌾";
  const fasalSize = din <= 10 ? 16 : din <= 30 ? 24 : din <= 60 ? 34 : din <= 100 ? 44 : 52;
  const rowCount = 3;
  const colCount = 8;

  return (
    <div style={{ position: "absolute", bottom: 40, left: 0, right: 0, pointerEvents: "none", zIndex: 0 }}>
      {[...Array(rowCount)].map((_, row) => (
        <div key={row} style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", marginBottom: row * 4 }}>
          {[...Array(colCount)].map((_, col) => (
            <motion.div key={col}
              style={{ fontSize: fasalSize - row * 5, transformOrigin: "bottom center", opacity: 0.3 + row * 0.1 }}
              animate={{ rotate: windSpeed > 8 ? [0, 20, -8, 16, 0] : windSpeed > 4 ? [0, 10, -4, 8, 0] : [0, 4, -1, 3, 0] }}
              transition={{ duration: windSpeed > 8 ? 1 : windSpeed > 4 ? 1.8 : 3, repeat: Infinity, delay: col * 0.12 + row * 0.3, ease: "easeInOut" }}>
              {fasalIcon}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [kisanNaam, setKisanNaam] = useState("");
  const [shehar, setShehar] = useState("");
  const [sheharSuggestions, setSheharSuggestions] = useState([]);
  const [fasal, setFasal] = useState("");
  const [beejDate, setBeejDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("phone"), 2500);
      return () => clearTimeout(t);
    }
  }, [screen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (shehar && screen === "main") {
      const city = shehar.split(",")[0].trim();
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json())
        .then(data => {
          if (data?.main) {
            setWeather({
              temp: Math.round(data.main.temp),
              humidity: data.main.humidity,
              description: data.weather[0].description,
              id: data.weather[0].id,
              wind: Math.round(data.wind.speed),
              city: data.name
            });
          }
        }).catch(() => {});
    }
  }, [shehar, screen]);

  const fetchSuggestions = async (val) => {
    if (val.length < 2) { setSheharSuggestions([]); return; }
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${val},IN&limit=5&appid=${process.env.REACT_APP_WEATHER_KEY}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSheharSuggestions([...new Set(data.map(d => `${d.name}${d.state ? ", " + d.state : ""}`))]);
      }
    } catch { setSheharSuggestions([]); }
  };

  const handlePhoneSubmit = async () => {
    setError("");
    if (phone.length !== 10) { setError("10 digit number daalo!"); return; }
    setDbLoading(true);
    try {
      const docSnap = await getDoc(doc(db, "kisans", phone));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsNewUser(false);
        setKisanNaam(data.naam || "");
        setShehar(data.shehar || "");
        setFasal(data.fasal || "");
        setBeejDate(data.beejDate || "");
        setMessages(data.messages || []);
      } else {
        setIsNewUser(true);
      }
      setScreen("pin");
    } catch { setError("Internet check karo!"); }
    setDbLoading(false);
  };

  const handlePinSubmit = async () => {
    setError("");
    if (pin.length !== 4) { setError("4 digit PIN daalo!"); return; }
    setDbLoading(true);
    try {
      if (isNewUser) {
        if (pin !== pinConfirm) { setError("PIN match nahi hua!"); setDbLoading(false); return; }
        await setDoc(doc(db, "kisans", phone), { phone, pin, naam: "", shehar: "", fasal: "", beejDate: "", messages: [] });
        setScreen("naam");
      } else {
        const docSnap = await getDoc(doc(db, "kisans", phone));
        if (docSnap.data()?.pin !== pin) { setError("Galat PIN! Dobara try karo."); setDbLoading(false); return; }
        if (fasal && beejDate) {
          if (messages.length === 0) {
            setMessages([{ role: "assistant", content: `Namaste ${kisanNaam} ji! 🙏 Wapas aaye! Aapki ${fasal} fasal track ho rahi hai!` }]);
          }
          setScreen("main");
        } else {
          setScreen("naam");
        }
      }
    } catch { setError("Kuch gadbad hui!"); }
    setDbLoading(false);
  };

  const saveData = async (extra = {}) => {
    if (!phone) return;
    try {
      await setDoc(doc(db, "kisans", phone), { phone, pin, naam: kisanNaam, shehar, fasal, beejDate, messages, ...extra }, { merge: true });
    } catch (e) { console.log(e); }
  };

  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;

  const getStage = () => {
    if (fasal === "🌾 Chawal (Rice)") {
      if (din <= 25) return { stage: "🌱 Nursery Stage", advice: "Roz paani do. Peele patte dikhein to Zinc Sulphate spray karo" };
      if (din <= 50) return { stage: "🌿 Transplanting Stage", advice: "Khet mein 2-3 inch paani rakho" };
      if (din <= 80) return { stage: "🌾 Growth Stage", advice: "Pehli Urea — zameen ka size batao" };
      if (din <= 110) return { stage: "🌸 Flowering Stage", advice: "Paani mat rokna — bahut zaroori hai" };
      return { stage: "✂️ Harvesting Stage", advice: "Fasal taiyaar — paani band karo" };
    }
    if (fasal === "🌿 Gehun (Wheat)") {
      if (din <= 21) return { stage: "🌱 Jamav Stage", advice: "Pehla paani do" };
      if (din <= 45) return { stage: "🌿 Tillering Stage", advice: "Urea — zameen ka size batao" };
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
      if (din <= 90) return { stage: "🌿 Growth Stage", advice: "Urea — zameen ka size batao" };
      if (din <= 180) return { stage: "🎋 Bhadai Stage", advice: "Potash daalo — 25kg per acre" };
      if (din <= 270) return { stage: "🍬 Ripening Stage", advice: "Paani kam karo" };
      return { stage: "✂️ Harvesting Stage", advice: "Ganna katne ka samay — mill se contact karo" };
    }
    return { stage: "Stage pata nahi", advice: "Sahi fasal chunein" };
  };

  const { stage, advice } = getStage();

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

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 19;
  const isRain = weather && weather.id >= 200 && weather.id < 600;
  const windSpeed = weather?.wind || 0;

  const getBg = () => {
    if (isRain) return "linear-gradient(180deg, #2c3e6b 0%, #4a6fa5 35%, #7aa3cc 65%, #3a5c3a 100%)";
    if (isNight) return "linear-gradient(180deg, #080818 0%, #1a1a2e 35%, #16213e 65%, #0d1f0d 100%)";
    return "linear-gradient(180deg, #6ec6f0 0%, #a8d8f0 35%, #d4edaa 70%, #3a7a3a 100%)";
  };

  // FIXED VOICE - proper start/stop
  const handleVoice = () => {
    if (recording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Chrome browser use karo mic ke liye!");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (e) => {
      console.log("Voice error:", e.error);
      setRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}` },
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
- Aasan bhasha
- Hanuman Khad Bhandar ki dukan Hatt(Safidon) mein hai
- Agar kisne banaya puche to batao Hanuman Khad Bhandar ne
- Zameen ka size poochhe bina matra mat batao
- Nursery stage mein sirf paani aur Zinc Sulphate
- Transplanting ke 10-15 din baad urea
- Galat advice mat do`
            },
            ...newMsgs
          ]
        })
      });
      const data = await res.json();
      const jawab = data.choices[0].message.content;
      const updatedMsgs = [...newMsgs, { role: "assistant", content: jawab }];
      setMessages(updatedMsgs);
      await saveData({ messages: updatedMsgs });
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  // ===== SPLASH =====
  if (screen === "splash") return (
    <motion.div style={styles.splash} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }} style={{ fontSize: 80 }}>🌾</motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#8B6914" }}>Kisan Saathi</motion.h1>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "#5a3e10" }}>Hanuman Khad Bhandar</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ color: "#8B6914" }}>Vill. Hatt (Safidon), Jind</motion.p>
      <div style={{ width: 200, height: 4, background: "#e0d0b0", borderRadius: 2, margin: "15px auto 0" }}>
        <motion.div style={{ height: 4, background: "#8B6914", borderRadius: 2 }}
          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.1, duration: 1.2 }} />
      </div>
    </motion.div>
  );

  // ===== PHONE =====
  if (screen === "phone") return (
    <motion.div style={styles.splash} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>📱</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10", fontSize: 14 }}>Apna mobile number daalo</p>
      <p style={{ color: "#8B6914", fontSize: 11 }}>— Ek baar daalo, hamesha yaad rahega —</p>
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput}
        placeholder="10 digit mobile number" value={phone} maxLength={10} type="tel"
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()} />
      {error && <p style={{ color: "red", fontSize: 12, margin: "4px 0" }}>{error}</p>}
      {dbLoading
        ? <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: "#8B6914", marginTop: 12 }}>⏳ Loading...</motion.div>
        : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn} onClick={handlePhoneSubmit}>✅ Aage Badho</motion.button>
      }
    </motion.div>
  );

  // ===== PIN =====
  if (screen === "pin") return (
    <motion.div style={styles.splash} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: 50 }}>🔐</motion.div>
      <h3 style={{ color: "#8B6914" }}>{isNewUser ? "Naya PIN banao" : `Wapas Aaye, ${kisanNaam || "Dost"} ji!`}</h3>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>{isNewUser ? "4 digit PIN choose karo — yaad rakhna!" : "Apna PIN daalo"}</p>
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput}
        placeholder="4 digit PIN" value={pin} maxLength={4} type="password"
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()} />
      {isNewUser && (
        <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput}
          placeholder="PIN dobara daalo" value={pinConfirm} maxLength={4} type="password"
          onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ""))} />
      )}
      {error && <p style={{ color: "red", fontSize: 12, margin: "4px 0" }}>{error}</p>}
      {dbLoading
        ? <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: "#8B6914" }}>⏳ Checking...</motion.div>
        : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn} onClick={handlePinSubmit}>
            {isNewUser ? "✅ PIN Set Karo" : "🔓 Login Karo"}
          </motion.button>
      }
      <button onClick={() => { setScreen("phone"); setPin(""); setPinConfirm(""); setError(""); }}
        style={{ background: "none", border: "none", color: "#8B6914", marginTop: 10, cursor: "pointer", fontSize: 13 }}>← Wapas Jao</button>
    </motion.div>
  );

  // ===== NAAM =====
  if (screen === "naam") return (
    <motion.div style={styles.splash} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>🙏</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>Thodi si jaankari do</p>
      <motion.input whileFocus={{ scale: 1.02 }} style={styles.formInput}
        placeholder="Apna naam likhein..." value={kisanNaam}
        onChange={(e) => setKisanNaam(e.target.value)} />
      <div style={{ width: "85%", position: "relative" }}>
        <motion.input whileFocus={{ scale: 1.02 }}
          style={{ ...styles.formInput, width: "100%", boxSizing: "border-box" }}
          placeholder="Apna shehar/gaon likhein..." value={shehar}
          onChange={(e) => { setShehar(e.target.value); fetchSuggestions(e.target.value); }} />
        <AnimatePresence>
          {sheharSuggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={styles.suggestions}>
              {sheharSuggestions.map((s, i) => (
                <div key={i} style={styles.suggestionItem}
                  onClick={() => { setShehar(s.split(",")[0].trim()); setSheharSuggestions([]); }}>
                  📍 {s}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn}
        onClick={async () => {
          if (kisanNaam && shehar) {
            await saveData({ naam: kisanNaam, shehar });
            setScreen("fasal");
          } else {
            setError("Naam aur shehar dono bharo!");
          }
        }}>✅ Aage Badho</motion.button>
    </motion.div>
  );

  // ===== FASAL =====
  if (screen === "fasal") return (
    <motion.div style={styles.splash} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ fontSize: 50 }}>🌾</div>
      <h3 style={{ color: "#8B6914" }}>Namaste {kisanNaam} ji!</h3>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>Kaunsi fasal uga rahe hain?</p>
      <select style={styles.formInput} value={fasal} onChange={(e) => setFasal(e.target.value)}>
        <option value="">-- Fasal chunein --</option>
        <option>🌾 Chawal (Rice)</option>
        <option>🌿 Gehun (Wheat)</option>
        <option>🟡 Sarso (Mustard)</option>
        <option>🍬 Ganna (Sugarcane)</option>
      </select>
      <input style={styles.formInput} type="date" value={beejDate}
        max={new Date().toISOString().split("T")[0]}
        onChange={(e) => setBeejDate(e.target.value)} />
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btn}
        onClick={async () => {
          if (fasal && beejDate) {
            const initMsgs = [{ role: "assistant", content: `Namaste ${kisanNaam} ji! 🙏 Aapki ${fasal} fasal ka track shuru ho gaya!` }];
            setMessages(initMsgs);
            await saveData({ fasal, beejDate, messages: initMsgs });
            setScreen("main");
          }
        }}>🚀 Tracking Shuru Karein</motion.button>
    </motion.div>
  );

  // ===== MAIN APP =====
  return (
    <div style={{ ...styles.app, background: getBg(), position: "relative", overflow: "hidden" }}>

      {/* Rain */}
      {isRain && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          {[...Array(35)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: -20, left: `${(i * 2.9) % 100}%`, width: 1.5, height: 10 + (i % 5) * 3, background: "rgba(160,200,255,0.65)", borderRadius: 2 }}
              animate={{ y: ["0vh", "110vh"] }}
              transition={{ duration: 0.45 + (i % 6) * 0.06, repeat: Infinity, delay: (i % 18) * 0.08, ease: "linear" }} />
          ))}
        </div>
      )}

      {/* Stars */}
      {isNight && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", pointerEvents: "none", zIndex: 0 }}>
          {[...Array(30)].map((_, i) => (
            <motion.div key={i}
              style={{ position: "absolute", top: `${(i * 7) % 85}%`, left: `${(i * 13) % 100}%`, width: 1.5 + (i % 2), height: 1.5 + (i % 2), background: "white", borderRadius: "50%", opacity: 0.7 }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 1.5 + (i % 4), repeat: Infinity, delay: (i % 8) * 0.25 }} />
          ))}
          <motion.div style={{ position: "absolute", top: 8, right: 12, fontSize: 22, opacity: 0.75 }}
            animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity }}>🌙</motion.div>
        </div>
      )}

      {/* Sun */}
      {!isNight && !isRain && (
        <motion.div style={{ position: "absolute", top: 8, right: 8, fontSize: 26, opacity: 0.55, zIndex: 0 }}
          animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>☀️</motion.div>
      )}

      {/* Fasal Growing Background */}
      <FasalBackground din={din} windSpeed={windSpeed} isRain={isRain} isNight={isNight} />

      {/* Top Bar */}
      <motion.div style={{ ...styles.topBar, position: "relative", zIndex: 2 }}
        initial={{ y: -60 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 120 }}>

        {/* LEFT — Dukaan ka naam — click pe address */}
        <motion.div whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddress(!showAddress)}
          style={{ cursor: "pointer" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>🏪 Tap for address</div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>Hanuman Khad Bhandar</div>
        </motion.div>

        {/* RIGHT — Kisan naam — click pe profile/logout */}
        <motion.div whileTap={{ scale: 0.95 }}
          onClick={() => setShowProfile(!showProfile)}
          style={{ cursor: "pointer", textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>👤 Tap for profile</div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{kisanNaam} ji</div>
        </motion.div>
      </motion.div>

      {/* Address Popup */}
      <AnimatePresence>
        {showAddress && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ ...styles.popupCard, zIndex: 3 }}>
            <div style={{ fontWeight: "bold", color: "#8B6914", marginBottom: 4 }}>🏪 Hanuman Khad Bhandar</div>
            <div style={{ fontSize: 13, color: "#5a3e10" }}>📍 Vill. Hatt (Safidon)</div>
            <div style={{ fontSize: 13, color: "#5a3e10" }}>Jind, Haryana</div>
            <div style={{ fontSize: 12, color: "#2d8a2d", marginTop: 4 }}>🌾 Khad, Beej aur Dawaiyan uplabdh hain</div>
            <button onClick={() => setShowAddress(false)}
              style={{ background: "none", border: "none", color: "#8B6914", cursor: "pointer", fontSize: 12, marginTop: 6 }}>✕ Band Karo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Popup */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ ...styles.popupCard, right: 8, left: "auto", zIndex: 3 }}>
            <div style={{ fontWeight: "bold", color: "#8B6914", marginBottom: 4 }}>👤 {kisanNaam} ji</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>📱 {phone}</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>📍 {shehar}</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>🌾 {fasal}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <button onClick={() => { setShowProfile(false); setScreen("fasal"); }}
                style={styles.smallBtn}>🔄 Nayi Fasal</button>
              <button onClick={() => {
                setShowProfile(false);
                setScreen("phone"); setPhone(""); setPin(""); setKisanNaam("");
                setShehar(""); setFasal(""); setBeejDate(""); setMessages([]);
              }} style={{ ...styles.smallBtn, background: "#c0392b" }}>🚪 Logout</button>
            </div>
            <button onClick={() => setShowProfile(false)}
              style={{ background: "none", border: "none", color: "#8B6914", cursor: "pointer", fontSize: 12, marginTop: 4 }}>✕ Band Karo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Card */}
      <motion.div style={{ ...styles.weatherCard, position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {weather ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#5a3e10", fontWeight: "bold" }}>📍 {weather.city}</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#8B6914" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
              <div style={{ fontSize: 11, color: "#5a3e10" }}>{weather.description}</div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "#5a3e10" }}>
              <div>💧 {weather.humidity}%</div>
              <div>💨 {weather.wind} m/s</div>
              <div style={{ fontSize: 9, color: "#a07030", marginTop: 2 }}>⚠️ Approximate</div>
            </div>
          </div>
        ) : (
          <motion.div style={{ textAlign: "center", fontSize: 12, color: "#8B6914" }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
            🌤️ Mausam load ho raha hai...
          </motion.div>
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
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
              style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div style={styles.botMsg} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}>
            Soch raha hoon... ⏳
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Camera */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ ...styles.cameraBox, position: "relative", zIndex: 2 }}>
            <p style={{ fontSize: 12, color: "#5a3e10", margin: "0 0 6px" }}>📸 Fasal ki photo lo!</p>
            <input type="file" accept="image/*" capture="environment"
              onChange={() => { setShowCamera(false); alert("Photo li! AI analysis jaldi add hoga."); }} />
            <button onClick={() => setShowCamera(false)} style={{ ...styles.closeBtn, marginTop: 6 }}>✕ Band Karo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <div style={{ ...styles.inputBar, position: "relative", zIndex: 2 }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowCamera(!showCamera)} style={styles.iconBtn}>📷</motion.button>
        <input style={styles.input} value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage(input)}
          placeholder={recording ? "Bol rahe ho... 🎤" : "Sawaal likhein..."} />
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleVoice}
          style={{ ...styles.iconBtn, color: recording ? "red" : "inherit" }}>
          {recording ? "🔴" : "🎤"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => !loading && sendMessage(input)} style={styles.sendBtn}>➤</motion.button>
      </div>

      {/* Footer */}
      <div style={{ ...styles.footer, position: "relative", zIndex: 1 }}>
        🌾 Hanuman Khad Bhandar, Vill. Hatt (Safidon), Jind 🌾
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" },
  splash: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(139,105,20,0.92)", padding: "10px 14px", color: "white", backdropFilter: "blur(4px)" },
  weatherCard: { background: "rgba(255,248,225,0.93)", padding: "8px 12px", margin: "6px 8px", borderRadius: 12, border: "1px solid #c8a96e" },
  stageCard: { background: "rgba(255,248,225,0.93)", padding: 11, margin: "0 8px 8px", borderRadius: 14, borderLeft: "5px solid #2d8a2d" },
  stageTitle: { color: "#8B6914", fontWeight: "bold", fontSize: 12 },
  stageName: { color: "#2d8a2d", fontSize: 14, fontWeight: "bold", marginTop: 3 },
  advice: { color: "#5a3e10", fontSize: 12, marginTop: 3 },
  chatBox: { flex: 1, overflowY: "auto", padding: "0 8px", marginBottom: 4 },
  userMsg: { background: "#8B6914", color: "white", padding: "8px 12px", borderRadius: "16px 16px 4px 16px", margin: "4px 0", maxWidth: "78%", marginLeft: "auto", fontSize: 13 },
  botMsg: { background: "rgba(255,248,225,0.96)", color: "#3a2a0a", padding: "8px 12px", borderRadius: "16px 16px 16px 4px", margin: "4px 0", maxWidth: "78%", fontSize: 13, border: "1px solid #c8a96e" },
  inputBar: { display: "flex", alignItems: "center", padding: "7px 8px", background: "rgba(255,248,225,0.97)", borderTop: "2px solid #c8a96e", gap: 5 },
  input: { flex: 1, padding: "8px 12px", borderRadius: 25, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 13, outline: "none" },
  iconBtn: { background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4 },
  sendBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 15, cursor: "pointer" },
  cameraBox: { background: "rgba(255,248,225,0.96)", padding: 10, margin: "0 8px 6px", borderRadius: 14, border: "2px dashed #2d8a2d", textAlign: "center" },
  closeBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12 },
  formInput: { width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" },
  btn: { background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" },
  footer: { textAlign: "center", padding: "6px 10px", fontSize: 11, color: "#8B6914", borderTop: "1px solid #c8a96e", background: "rgba(255,248,225,0.97)" },
  suggestions: { position: "absolute", top: "100%", left: 0, right: 0, background: "#fff8e1", border: "1px solid #c8a96e", borderRadius: 10, zIndex: 100, maxHeight: 140, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  suggestionItem: { padding: "9px 14px", fontSize: 13, color: "#5a3e10", cursor: "pointer", borderBottom: "1px solid #f0e8d0" },
  popupCard: { position: "absolute", top: 58, left: 8, background: "rgba(255,248,225,0.98)", border: "1px solid #c8a96e", borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", minWidth: 180, zIndex: 3 },
  smallBtn: { background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer" },
};

export default App;