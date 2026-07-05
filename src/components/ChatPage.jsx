import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage({ messages, loading, onSend, onSendImage, onBack, kisanNaam }) {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
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
    reader.onload = (event) => { setPendingImage(event.target.result); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSend = () => {
    if (loading) return;
    if (pendingImage) {
      onSendImage(pendingImage, input.trim());
      setPendingImage(null);
      setInput("");
    } else if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0612", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Robot background image - fixed, subtle */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url(/images/ai-robot-bg.png)",
        backgroundSize: "cover", backgroundPosition: "center top",
        opacity: 0.9
      }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(10,6,18,0.15) 0%, rgba(10,6,18,0.4) 45%, #0a0612 78%)" }} />

      <div style={{ position: "relative", zIndex: 3, background: "rgba(10,6,18,0.55)", backdropFilter: "blur(6px)", borderBottom: "1px solid rgba(217,70,239,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#22d3ee", fontSize: 20, cursor: "pointer" }}>←</button>
        <div>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>AI Assistant</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5 }}>Aapka AI Kisan Saathi</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "260px 10px 8px", position: "relative", zIndex: 3 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "16px 20px", color: "rgba(255,255,255,0.85)", background: "rgba(20,10,35,0.55)", backdropFilter: "blur(6px)", borderRadius: 16, margin: "0 6px" }}>
            <div style={{ fontSize: 14 }}>Namaste {kisanNaam} ji! Koi bhi sawaal poochho, ya fasal/dawai ki photo bhejo!</div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ position: "relative" }}>
              <div style={msg.role === "user" ? {
                background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "white", padding: "9px 13px",
                borderRadius: "16px 16px 4px 16px", margin: "5px 0",
                maxWidth: "78%", marginLeft: "auto", fontSize: 13
              } : {
                background: "rgba(20,10,35,0.75)", backdropFilter: "blur(6px)", color: "#e5e0ff",
                padding: "9px 13px", borderRadius: "16px 16px 16px 4px",
                margin: "5px 0", maxWidth: "78%", fontSize: 13,
                border: "1px solid rgba(139,92,246,0.25)"
              }}>
                {msg.image && (
                  <img src={msg.image} alt="uploaded" style={{ width: "100%", maxWidth: 200, borderRadius: 10, marginBottom: 6, display: "block" }} />
                )}
                {msg.content}
              </div>
              {msg.role === "assistant" && (
                <button onClick={() => speakText(msg.content)}
                  style={{ background: "none", border: "none", color: "rgba(139,92,246,0.6)", fontSize: 14, cursor: "pointer", padding: "0 4px", marginLeft: 4 }}
                  title="Sunao">🔊</button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}
            style={{ background: "rgba(20,10,35,0.75)", backdropFilter: "blur(6px)", color: "#c4b5fd", padding: "9px 13px", borderRadius: "16px 16px 16px 4px", margin: "5px 0", maxWidth: "78%", fontSize: 13, border: "1px solid rgba(139,92,246,0.25)" }}>
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
            style={{ position: "relative", zIndex: 3, background: "rgba(10,6,18,0.9)", borderTop: "1px solid rgba(139,92,246,0.2)", padding: "10px 14px", display: "flex", gap: 10 }}>
            <button onClick={() => cameraInputRef.current?.click()}
              style={{ flex: 1, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              📷 Photo Kheencho
            </button>
            <button onClick={() => galleryInputRef.current?.click()}
              style={{ flex: 1, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              🖼️ Gallery Se Chuno
            </button>
            <button onClick={() => setShowImageOptions(false)}
              style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff6666", borderRadius: 10, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingImage && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ position: "relative", zIndex: 3, background: "rgba(10,6,18,0.9)", borderTop: "1px solid rgba(139,92,246,0.2)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <img src={pendingImage} alt="preview" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Photo ready hai — kuch specific poochna hai to type karo, ya seedha bhejo
            </div>
            <button onClick={() => setPendingImage(null)}
              style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff6666", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", padding: "7px 8px", background: "rgba(10,6,18,0.9)", borderTop: "1px solid rgba(139,92,246,0.2)", gap: 5 }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowImageOptions(!showImageOptions)}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4, color: "#c4b5fd" }}>
          📷
        </motion.button>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={pendingImage ? "Kuch poochna hai? (optional)" : recording ? "Bol rahe ho... 🎤" : "Sawaal likhein..."}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 25, border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)", color: "#fff", fontSize: 13, outline: "none" }} />
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleVoice}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4, color: recording ? "#ff4444" : "#c4b5fd" }}>
          {recording ? "🔴" : "🎤"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", color: "white", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 15, cursor: "pointer" }}>➤</motion.button>
      </div>
    </div>
  );
}