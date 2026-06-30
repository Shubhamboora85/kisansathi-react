import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage({ messages, loading, onSend, onSendImage, onBack, kisanNaam }) {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "hi-IN";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const handleVoice = () => {
    if (recording) { recognitionRef.current?.stop(); recognitionRef.current = null; setRecording(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Chrome use karo!"); return; }
    const r = new SR();
    r.lang = "hi-IN"; r.continuous = false; r.interimResults = false;
    r.onstart = () => setRecording(true);
    r.onresult = e => { setInput(e.results[0][0].transcript); setRecording(false); recognitionRef.current = null; };
    r.onerror = r.onend = () => { setRecording(false); recognitionRef.current = null; };
    recognitionRef.current = r;
    r.start();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowImageOptions(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      onSendImage(event.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#60b8ff", fontWeight: "bold", fontSize: 16 }}>🤖 Kisan Saathi AI</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 30, color: "rgba(100,180,255,0.5)" }}>
            <div style={{ fontSize: 40 }}>🌾</div>
            <div style={{ fontSize: 14 }}>Namaste {kisanNaam} ji! Koi bhi sawaal poochho, ya fasal ki photo bhejo!</div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ position: "relative" }}>
              <div style={msg.role === "user" ? {
                background: "#1e90ff", color: "white", padding: "9px 13px",
                borderRadius: "16px 16px 4px 16px", margin: "5px 0",
                maxWidth: "78%", marginLeft: "auto", fontSize: 13
              } : {
                background: "rgba(10,40,100,0.6)", color: "#e0f0ff",
                padding: "9px 13px", borderRadius: "16px 16px 16px 4px",
                margin: "5px 0", maxWidth: "78%", fontSize: 13,
                border: "1px solid rgba(100,180,255,0.2)"
              }}>
                {msg.image && (
                  <img src={msg.image} alt="uploaded crop" style={{ width: "100%", maxWidth: 200, borderRadius: 10, marginBottom: 6, display: "block" }} />
                )}
                {msg.content}
              </div>
              {msg.role === "assistant" && (
                <button onClick={() => speakText(msg.content)}
                  style={{ background: "none", border: "none", color: "rgba(100,180,255,0.5)", fontSize: 14, cursor: "pointer", padding: "0 4px", marginLeft: 4 }}
                  title="Sunao">🔊</button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}
            style={{ background: "rgba(10,40,100,0.6)", color: "#60b8ff", padding: "9px 13px", borderRadius: "16px 16px 16px 4px", margin: "5px 0", maxWidth: "78%", fontSize: 13, border: "1px solid rgba(100,180,255,0.2)" }}>
            Soch raha hoon... ⏳
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleImageSelect} />
      <input ref={galleryInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />

      <AnimatePresence>
        {showImageOptions && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{ background: "rgba(7,21,40,0.98)", borderTop: "1px solid rgba(100,180,255,0.15)", padding: "10px 14px", display: "flex", gap: 10 }}>
            <button onClick={() => cameraInputRef.current?.click()}
              style={{ flex: 1, background: "rgba(100,180,255,0.1)", border: "1px solid rgba(100,180,255,0.25)", color: "#60b8ff", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              📷 Photo Kheencho
            </button>
            <button onClick={() => galleryInputRef.current?.click()}
              style={{ flex: 1, background: "rgba(100,180,255,0.1)", border: "1px solid rgba(100,180,255,0.25)", color: "#60b8ff", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              🖼️ Gallery Se Chuno
            </button>
            <button onClick={() => setShowImageOptions(false)}
              style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff6666", borderRadius: 10, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", padding: "7px 8px", background: "rgba(7,21,40,0.97)", borderTop: "1px solid rgba(100,180,255,0.12)", gap: 5 }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowImageOptions(!showImageOptions)}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4, color: "#60b8ff" }}>
          📷
        </motion.button>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && (onSend(input), setInput(""))}
          placeholder={recording ? "Bol rahe ho... 🎤" : "Sawaal likhein..."}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 25, border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.07)", color: "#fff", fontSize: 13, outline: "none" }} />
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleVoice}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4, color: recording ? "red" : "#60b8ff" }}>
          {recording ? "🔴" : "🎤"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { if (!loading && input.trim()) { onSend(input); setInput(""); } }}
          style={{ background: "#1e90ff", color: "white", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 15, cursor: "pointer" }}>➤</motion.button>
      </div>
    </div>
  );
}