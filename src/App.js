import { useState } from "react";
import "./App.css";

// ========== MAIN APP ==========
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

  // Splash screen — 2 sec baad naam screen
  if (screen === "splash") {
    setTimeout(() => setScreen("naam"), 2000);
  }

  // ========== SCREENS ==========
  if (screen === "splash") return <SplashScreen />;
  if (screen === "naam") return (
    <NaamScreen
      onSubmit={(naam, shehar) => {
        setKisanNaam(naam);
        setShehar(shehar);
        setScreen("fasal");
      }}
    />
  );
  if (screen === "fasal") return (
    <FasalScreen
      kisanNaam={kisanNaam}
      onSubmit={(fasal, date) => {
        setFasal(fasal);
        setBeejDate(date);
        setMessages([{
          role: "assistant",
          content: `Namaste ${kisanNaam} ji! 🙏 Aapki ${fasal} fasal ka track shuru ho gaya!`
        }]);
        setScreen("main");
      }}
    />
  );

  // Main App Screen
  const din = beejDate
    ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24))
    : 0;

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

  // AI se jawab lo
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
Rules:
- Hamesha Hindi mein jawab de
- Sirf 2-3 lines mein jawab do
- Aasan bhasha
- Seedha solution batao
- Dawai ka salt naam aur matra batao
- Pehle poora sawaal samjho phir jawab do`
            },
            ...newMessages
          ]
        })
      });
      const data = await response.json();
      const jawab = data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: jawab }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  // Voice input
  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Ye browser mic support nahi karta — Chrome use karo!");
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

  return (
    <div style={styles.app}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <span style={styles.kisanNaam}>🙏 Namaste, {kisanNaam} ji!</span>
        <span style={styles.dukaanNaam}>🏪 Hanuman Khad Bhandar</span>
      </div>

      {/* Stage Card */}
      <div style={styles.stageCard}>
        <div style={styles.stageTitle}>{fasal} — Din {din}</div>
        <div style={styles.stageName}>{stage}</div>
        <div style={styles.advice}>💡 {advice}</div>
      </div>

      {/* Chat Messages */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? styles.userMsg : styles.botMsg}>
            {msg.content}
          </div>
        ))}
        {loading && <div style={styles.botMsg}>Soch raha hoon... ⏳</div>}
      </div>

      {/* Camera */}
      {showCamera && (
        <div style={styles.cameraBox}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setShowCamera(false);
              alert("Photo li! AI analysis abhi add hoga.");
            }}
          />
          <button onClick={() => setShowCamera(false)} style={styles.closeBtn}>✕ Band Karo</button>
        </div>
      )}

      {/* Input Bar */}
      <div style={styles.inputBar}>
        <button onClick={() => setShowCamera(true)} style={styles.iconBtn}>📷</button>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Sawaal likhein..."
        />
        <button onClick={startVoice} style={styles.iconBtn}>
          {recording ? "🔴" : "🎤"}
        </button>
        <button onClick={() => sendMessage(input)} style={styles.sendBtn}>➤</button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        🌾 Greetings from Hanuman Khad Bhandar, Vill. Hatt (Safidon) 🌾
      </div>
    </div>
  );
}

// ========== SPLASH SCREEN ==========
function SplashScreen() {
  return (
    <div style={styles.splash}>
      <div style={{ fontSize: 80 }}>🌾</div>
      <h1 style={{ color: "#8B6914" }}>Kisan Saathi</h1>
      <h3 style={{ color: "#5a3e10" }}>Hanuman Khad Bhandar</h3>
      <p style={{ color: "#8B6914" }}>Vill. Hatt (Safidon), Jind</p>
      <p style={{ color: "#2d8a2d" }}>Loading...</p>
    </div>
  );
}

// ========== NAAM SCREEN ==========
function NaamScreen({ onSubmit }) {
  const [naam, setNaam] = useState("");
  const [shehar, setShehar] = useState("");
  return (
    <div style={styles.splash}>
      <div style={{ fontSize: 60 }}>🙏</div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10" }}>Main aapka Kisan Saathi hoon</p>
      <p style={{ color: "#8B6914", fontSize: 13 }}>— Hanuman Khad Bhandar ki taraf se —</p>
      <input
        style={styles.formInput}
        placeholder="Apna naam likhein..."
        value={naam}
        onChange={(e) => setNaam(e.target.value)}
      />
      <input
        style={styles.formInput}
        placeholder="Apna shehar likhein..."
        value={shehar}
        onChange={(e) => setShehar(e.target.value)}
      />
      <button
        style={styles.btn}
        onClick={() => {
          if (naam && shehar) onSubmit(naam, shehar);
        }}
      >
        ✅ Aage Badho
      </button>
    </div>
  );
}

// ========== FASAL SCREEN ==========
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
      <input
        style={styles.formInput}
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        style={styles.btn}
        onClick={() => { if (fasal && date) onSubmit(fasal, date); }}
      >
        🚀 Tracking Shuru Karein
      </button>
    </div>
  );
}

// ========== STYLES ==========
const styles = {
  app: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f0e8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    maxWidth: 480,
    margin: "0 auto",
  },
  splash: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f5f0e8",
    padding: 20,
    textAlign: "center",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#8B6914",
    padding: "12px 16px",
    color: "white",
  },
  kisanNaam: { fontSize: 15, fontWeight: "bold", color: "white" },
  dukaanNaam: { fontSize: 12, color: "white" },
  stageCard: {
    background: "#fff8e1",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    borderLeft: "5px solid #2d8a2d",
  },
  stageTitle: { color: "#8B6914", fontWeight: "bold", fontSize: 14 },
  stageName: { color: "#2d8a2d", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  advice: { color: "#5a3e10", fontSize: 13, marginTop: 6 },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "0 10px",
    marginBottom: 10,
  },
  userMsg: {
    background: "#8B6914",
    color: "white",
    padding: "10px 14px",
    borderRadius: "18px 18px 4px 18px",
    margin: "6px 0",
    maxWidth: "80%",
    alignSelf: "flex-end",
    marginLeft: "auto",
    fontSize: 14,
  },
  botMsg: {
    background: "#fff8e1",
    color: "#3a2a0a",
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 4px",
    margin: "6px 0",
    maxWidth: "80%",
    fontSize: 14,
    border: "1px solid #c8a96e",
  },
  inputBar: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    background: "#fff8e1",
    borderTop: "2px solid #c8a96e",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 25,
    border: "2px solid #c8a96e",
    background: "#f5f0e8",
    fontSize: 14,
    outline: "none",
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    padding: 4,
  },
  sendBtn: {
    background: "#8B6914",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 18,
    cursor: "pointer",
  },
  cameraBox: {
    background: "#fff8e1",
    padding: 15,
    margin: 10,
    borderRadius: 15,
    border: "2px dashed #2d8a2d",
    textAlign: "center",
  },
  closeBtn: {
    background: "#8B6914",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    marginTop: 8,
    cursor: "pointer",
  },
  formInput: {
    width: "85%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "2px solid #c8a96e",
    background: "#fff8e1",
    fontSize: 15,
    margin: "8px 0",
    outline: "none",
  },
  btn: {
    background: "#8B6914",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "12px 30px",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
    width: "85%",
  },
  footer: {
    textAlign: "center",
    padding: 10,
    fontSize: 11,
    color: "#8B6914",
    borderTop: "1px solid #c8a96e",
    background: "#fff8e1",
  },
};

export default App;