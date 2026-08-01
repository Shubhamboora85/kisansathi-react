// ============================================
// KISAN SAATHI - PROFESSIONAL COMPLETE VERSION
// No Emojis | Lucide Icons | Modern Animations | Glow Effects
// ============================================

import {
  TrendingUp, Cloud, Users, LogOut, User, ChevronRight,
  Search, Mic, Camera, Send, Heart, Loader, ArrowLeft,
  Wheat, FileText, Droplets, MapPin, Phone, MessageCircle, Settings,
  Zap, Shield, Award, Leaf, Pill, Home, Bell, MoreVertical, Trash2,
  AlertCircle, CheckCircle, Trophy, HelpCircle, Mail,
  Terminal, Globe, Plus, Minus, Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import {
  getFirestore, doc, setDoc, getDoc, collection,
  addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// PROFESSIONAL COLOR PALETTE
const C = {
  darkGreen: "#2D5A3D",
  lightGreen: "#1a3428",
  cream: "#F5F1E8",
  lightCream: "#E8E4D8",
  gold: "#D4A574",
  success: "#6FCF97",
  danger: "#E27C6B",
  text: "#1A1A1A",
  textLight: "#6B6B6B",
  border: "#D9D1C0",
  glow: "rgba(45, 90, 61, 0.6)",
};

// PROFESSIONAL ANIMATIONS & EFFECTS
const glowStyles = `
  @keyframes glow {
    0%, 100% { 
      box-shadow: 0 0 8px rgba(45, 90, 61, 0.3), 0 0 16px rgba(45, 90, 61, 0.15);
    }
    50% { 
      box-shadow: 0 0 12px rgba(45, 90, 61, 0.5), 0 0 24px rgba(45, 90, 61, 0.25);
    }
  }
  @keyframes iconGlow {
    0%, 100% { filter: drop-shadow(0 0 2px rgba(45, 90, 61, 0.4)); }
    50% { filter: drop-shadow(0 0 6px rgba(45, 90, 61, 0.6)); }
  }
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes slideDown {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes fadeScale {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .glow { animation: glow 2s ease-in-out infinite; }
  .icon-glow { animation: iconGlow 2s ease-in-out infinite; }
  .pulse { animation: pulse 2s ease-in-out infinite; }
`;

// ==================== MODAL COMPONENT ====================
function ConfirmModal({ title, message, onConfirm, onCancel, isDanger = false }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "none"
      }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{
          background: "white", borderRadius: 16, padding: "24px",
          maxWidth: 320, boxShadow: `0 10px 40px ${C.glow}`
        }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          {isDanger ? (
            <AlertCircle size={24} color={C.danger} />
          ) : (
            <CheckCircle size={24} color={C.success} />
          )}
          <h3 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>
            {title}
          </h3>
        </div>
        <p style={{ fontSize: 13, color: C.textLight, margin: "0 0 20px 0", lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onCancel}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: `1.5px solid ${C.border}`,
              background: "white", color: C.text, fontSize: 12, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s"
            }}>
            Cancel
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onConfirm}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none",
              background: isDanger ? C.danger : C.success, color: "white",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 12px ${isDanger ? "rgba(226,124,107,0.3)" : "rgba(111,207,151,0.3)"}`
            }}>
            {isDanger ? "Delete" : "Confirm"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== MANDI API ====================
async function fetchMandiPrices(location) {
  try {
    const response = await fetch(
      `https://data.gov.in/api/3/action/datastore_search?resource_id=9ef84268-d588-465a-a308-a864a43d0070&limit=20`
    );
    const data = await response.json();
    if (data.success) {
      return data.result.records.slice(0, 12).map(r => ({
        id: Math.random(),
        crop: r.commodity || "Wheat",
        price: `₹${r.modal_price || r.price || "2135"}`,
        market: r.market || location,
        trend: Math.random() > 0.5 ? "up" : "down",
        change: Math.floor(Math.random() * 50) + 10
      }));
    }
  } catch (e) {
    console.log("API Error:", e);
  }
  return [
    { id: 1, crop: "Wheat", price: "₹2,135", market: "Kanpur", trend: "up", change: 32 },
    { id: 2, crop: "Paddy", price: "₹2,045", market: "Kanpur", trend: "up", change: 18 },
    { id: 3, crop: "Cotton", price: "₹6,850", market: "Kanpur", trend: "down", change: 25 },
  ];
}

// ==================== HOME PAGE ====================
function HomePage({ kisanNaam, shehar, fasal, beejDate, weather, din, advice, stage, onNavigate }) {
  const progressPercent = Math.min((din / 120) * 100, 100);
  const ringR = 22;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc - (progressPercent / 100) * ringCirc;

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", paddingBottom: 80 }}>
      {/* HERO SECTION */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: "relative", height: 280,
          background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
          backgroundImage: `url(/public/images/home-bg.png)`,
          backgroundSize: "cover", backgroundPosition: "center",
          overflow: "hidden"
        }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(245,241,232,0.95))" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, margin: "0 0 4px 0", fontWeight: 600 }}>Welcome</p>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 800, color: "white", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                {kisanNaam}
              </h1>
            </motion.div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onNavigate("profile")}
              style={{
                width: 48, height: 48, borderRadius: "50%", background: C.darkGreen,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: `0 4px 16px ${C.glow}`
              }}>
              <User size={22} color="white" className="icon-glow" />
            </motion.button>
          </div>

          {/* WEATHER CARD */}
          <motion.div onClick={() => onNavigate("weather")} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              position: "absolute", top: 80, right: 16, zIndex: 3,
              background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
              borderRadius: 14, padding: "11px 14px", cursor: "pointer", minWidth: 120,
              border: `1px solid rgba(255,255,255,0.4)`, animation: "glow 3s ease-in-out infinite"
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Cloud size={18} color={C.darkGreen} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: C.darkGreen, margin: 0 }}>
                  {weather?.temp || 28}°C
                </p>
                <p style={{ fontSize: 9, color: C.textLight, margin: "2px 0 0 0" }}>
                  {weather?.description || "Clear"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onClick={() => onNavigate("chat")}
        style={{
          margin: "16px 14px 0", background: "white", borderRadius: 24, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${C.border}`,
          cursor: "pointer", animation: "glow 3s ease-in-out infinite"
        }}>
        <Search size={16} color={C.textLight} />
        <input placeholder="Ask AI Saathi..." disabled style={{
          flex: 1, background: "none", border: "none", outline: "none",
          fontSize: 12, color: C.text, fontFamily: "Inter, sans-serif"
        }} />
        <Camera size={14} color={C.darkGreen} className="icon-glow" />
        <Mic size={14} color={C.darkGreen} className="icon-glow" />
      </motion.div>

      {/* QUICK ACTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "14px 14px", padding: 0 }}>
        {[
          { icon: TrendingUp, label: "Mandi Bhav", page: "mandi" },
          { icon: FileText, label: "Yojnas", page: "yojna" },
          { icon: Users, label: "Community", page: "community" },
          { icon: Cloud, label: "Weather", page: "weather" },
          { icon: FileText, label: "Khata", page: "khata" },
          { icon: Wheat, label: "Crop Track", page: "crop" },
        ].map((btn, i) => (
          <motion.button key={i} whileTap={{ scale: 0.92 }} onClick={() => onNavigate(btn.page)}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12,
              background: "white", border: `1.5px solid ${C.border}`, borderRadius: 14,
              cursor: "pointer", fontSize: 10, fontWeight: 700, color: C.darkGreen,
              animation: "glow 3s ease-in-out infinite"
            }}>
            <btn.icon size={20} className="icon-glow" />
            <span>{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* FASAL CARD */}
      <motion.div onClick={() => onNavigate("crop")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          margin: "8px 14px 12px", background: "white", border: `1.5px solid ${C.border}`,
          borderRadius: 16, padding: "16px", cursor: "pointer",
          animation: "glow 3s ease-in-out infinite"
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 9, color: C.textLight, margin: "0 0 4px 0", fontWeight: 600 }}>Current Crop</p>
            <h3 style={{ fontSize: 16, color: C.darkGreen, margin: 0, fontWeight: 800, marginBottom: 6 }}>
              {fasal}
            </h3>
            <p style={{ fontSize: 10, color: C.success, margin: 0, fontWeight: 700 }}>
              <Leaf size={12} style={{ display: "inline", marginRight: 4 }} />
              {stage}
            </p>
            <p style={{ fontSize: 9, color: C.textLight, margin: "4px 0 0 0" }}>
              {Math.max(0, 120 - din)} days remaining
            </p>
          </div>
          <div style={{ position: "relative", width: 58, height: 58 }}>
            <svg width="58" height="58" viewBox="0 0 58 58">
              <circle cx="29" cy="29" r={ringR} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="6" />
              <circle cx="29" cy="29" r={ringR} fill="none" stroke={C.success} strokeWidth="6"
                strokeLinecap="round" strokeDasharray={ringCirc} strokeDashoffset={ringOffset}
                transform="rotate(-90 29 29)" style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.success
            }}>
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>
        <div style={{ background: C.lightCream, borderRadius: 10, padding: "10px 12px", marginTop: 12 }}>
          <p style={{ fontSize: 10, color: C.darkGreen, margin: 0, fontWeight: 600, lineHeight: 1.5 }}>
            <AlertCircle size={12} style={{ display: "inline", marginRight: 4 }} />
            {advice}
          </p>
        </div>
      </motion.div>

      <div style={{ flex: 1 }} />
      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== CHAT PAGE ====================
function ChatPage({ messages, loading, onSend, onBack }) {
  const [input, setInput] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/chatpage-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>AI Saathi</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Farming Assistant</p>
        </div>
      </motion.div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 2 }}>
        {messages.length === 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{
              textAlign: "center", padding: "40px 20px", color: "white",
              background: `rgba(0,0,0,0.2)`, backdropFilter: "blur(6px)",
              borderRadius: 16, border: `1px solid rgba(255,255,255,0.1)`
            }}>
            <MessageCircle size={48} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
              Ask me about crops, diseases, weather, or farming tips!
            </p>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? C.darkGreen : `rgba(255,255,255,0.95)`,
              backdropFilter: "blur(6px)", color: msg.role === "user" ? "white" : C.text,
              fontSize: 13, lineHeight: 1.5, border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
              animation: msg.role === "user" ? "glow 3s ease-in-out infinite" : "none"
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 15px", borderRadius: "18px 18px 18px 4px",
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              color: C.text, fontSize: 13, border: `1px solid ${C.border}`
            }}>
              <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={{
        position: "fixed", bottom: 70, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: `rgba(255,255,255,0.97)`, backdropFilter: "blur(12px)",
        borderTop: `1.5px solid ${C.border}`, padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 8, zIndex: 100
      }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (input.trim() ? onSend(input) : null)}
          placeholder="Type message..." style={{
            flex: 1, padding: "10px 14px", borderRadius: 22, border: `1.5px solid ${C.border}`,
            background: "white", color: C.text, fontSize: 12, outline: "none", fontFamily: "Inter, sans-serif"
          }} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { if (input.trim()) onSend(input); setInput(""); }} style={{
          background: C.darkGreen, color: "white", border: "none", borderRadius: "50%",
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", animation: "glow 3s ease-in-out infinite"
        }}>
          <Send size={16} />
        </motion.button>
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== MANDI PAGE WITH SEARCH ====================
function MandiPage({ onBack }) {
  const [mandis, setMandis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Kanpur");
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMandiPrices(selectedLocation).then(data => {
      setMandis(data || []);
      setLoading(false);
    });
  }, [selectedLocation]);

  const locations = ["Kanpur", "Delhi", "Pune", "Mumbai", "Ludhiana", "Jaipur", "Indore", "Nagpur"];

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = locations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/mandibhav-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>Mandi Bhav</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Live Market Prices</p>
        </div>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: "relative", zIndex: 8, padding: "12px 14px", background: `rgba(255,255,255,0.85)`,
          backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}`
        }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: C.textLight }} />
          <input value={searchTerm} onChange={e => handleSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search mandi location..." style={{
              width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: "white", color: C.text,
              fontSize: 12, outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box"
            }} />

          {/* SUGGESTIONS */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={{
                  position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6,
                  background: "white", borderRadius: 10, border: `1px solid ${C.border}`,
                  boxShadow: `0 4px 16px ${C.glow}`, zIndex: 200, maxHeight: 200, overflowY: "auto"
                }}>
                {suggestions.map((loc, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setSearchTerm(loc);
                      setShowSuggestions(false);
                    }}
                    style={{
                      width: "100%", padding: "10px 12px", borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}` : "none",
                      background: "white", border: "none", cursor: "pointer", fontSize: 12,
                      color: C.text, textAlign: "left", display: "flex", alignItems: "center", gap: 8
                    }}>
                    <MapPin size={14} color={C.darkGreen} />
                    {loc}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* PRICES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 9 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "white" }}>
            <Loader size={28} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : (
          mandis.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              style={{
                background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                animation: "glow 3s ease-in-out infinite"
              }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.darkGreen }}>{m.crop}</p>
                <p style={{ margin: "3px 0 0 0", fontSize: 9, color: C.textLight, display: "flex", alignItems: "center", gap: 4 }}>
                  <MapPin size={10} />
                  {m.market}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.darkGreen }}>{m.price}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 10, fontWeight: 700, color: m.trend === "up" ? C.success : C.danger, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                  {m.trend === "up" ? <Plus size={10} /> : <Minus size={10} />}
                  {m.change}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== KHATA PAGE WITH DELETE ====================
function KhataPage({ phone, onBack, db }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("kharcha");
  const [deleteModal, setDeleteModal] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (!phone) return;
    getDoc(doc(db, "kisans", phone)).then(snap => {
      if (snap.exists()) setEntries(snap.data().khata || []);
    });
  }, [phone, db]);

  const addEntry = async () => {
    if (!amount) return;
    const entry = { id: Date.now(), category: "Dawaai", amount: parseInt(amount), type, date: new Date().toLocaleDateString("hi-IN") };
    const updated = [entry, ...entries];
    setEntries(updated);
    setAmount("");
    await setDoc(doc(db, "kisans", phone), { khata: updated }, { merge: true });
  };

  const deleteEntry = async (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    setDeleteModal(null);
    setOpenMenu(null);
    await setDoc(doc(db, "kisans", phone), { khata: updated }, { merge: true });
  };

  const totalKharcha = entries.filter(e => e.type === "kharcha").reduce((s, e) => s + e.amount, 0);
  const totalKamai = entries.filter(e => e.type === "kamai").reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/profile-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Kisan Khata</h2>
      </motion.div>

      {/* SUMMARY */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ position: "relative", zIndex: 5, display: "flex", gap: 8, padding: "10px", background: `rgba(255,255,255,0.85)`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ flex: 1, background: "white", borderRadius: 12, padding: 10, textAlign: "center", border: `1.5px solid ${C.border}`, animation: "glow 3s ease-in-out infinite" }}>
          <p style={{ margin: 0, fontSize: 9, color: C.textLight, fontWeight: 600 }}>Expenses</p>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 800, color: C.danger }}>₹{totalKharcha}</p>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: 12, padding: 10, textAlign: "center", border: `1.5px solid ${C.border}`, animation: "glow 3s ease-in-out infinite" }}>
          <p style={{ margin: 0, fontSize: 9, color: C.textLight, fontWeight: 600 }}>Income</p>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 800, color: C.success }}>₹{totalKamai}</p>
        </div>
      </motion.div>

      {/* ENTRIES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2 }}>
        {entries.length === 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: "center", padding: 40, color: "white" }}>
            <FileText size={40} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 12, fontWeight: 600 }}>No entries yet</p>
          </motion.div>
        )}
        {entries.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 11, padding: "10px 12px", marginBottom: 8,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              position: "relative", animation: "glow 3s ease-in-out infinite"
            }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.text }}>{e.category}</p>
              <p style={{ margin: "2px 0 0 0", fontSize: 9, color: C.textLight }}>{e.date}</p>
            </div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: e.type === "kharcha" ? C.danger : C.success, marginRight: 10 }}>
              {e.type === "kharcha" ? "-" : "+"}₹{e.amount}
            </p>
            <div style={{ position: "relative" }}>
              <button onClick={() => setOpenMenu(openMenu === e.id ? null : e.id)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <MoreVertical size={16} color={C.textLight} />
              </button>
              {openMenu === e.id && (
                <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setDeleteModal(e.id)}
                  style={{
                    position: "absolute", right: 24, top: 0, background: C.danger, color: "white",
                    border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer",
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", zIndex: 50
                  }}>
                  <Trash2 size={12} style={{ display: "inline", marginRight: 4 }} />
                  Delete
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{
        position: "fixed", bottom: 70, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: `rgba(255,255,255,0.97)`, backdropFilter: "blur(12px)",
        borderTop: `1.5px solid ${C.border}`, padding: "10px 12px", zIndex: 100
      }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <button onClick={() => setType("kharcha")} style={{
            flex: 1, padding: 8, borderRadius: 10, border: "none",
            background: type === "kharcha" ? C.danger : "white", color: type === "kharcha" ? "white" : C.text,
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
          }}>
            Expense
          </button>
          <button onClick={() => setType("kamai")} style={{
            flex: 1, padding: 8, borderRadius: 10, border: "none",
            background: type === "kamai" ? C.success : "white", color: type === "kamai" ? "white" : C.text,
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
          }}>
            Income
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="Amount" type="number" style={{
              flex: 1, padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`,
              background: "white", color: C.text, fontSize: 11, outline: "none", fontFamily: "Inter, sans-serif"
            }} />
          <motion.button whileTap={{ scale: 0.95 }} onClick={addEntry} style={{
            background: C.darkGreen, color: "white", border: "none", borderRadius: 10,
            padding: "8px 14px", fontSize: 11, fontWeight: 800, cursor: "pointer",
            animation: "glow 3s ease-in-out infinite"
          }}>
            <Plus size={14} />
          </motion.button>
        </div>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteModal && (
          <ConfirmModal
            title="Delete Entry?"
            message="This action cannot be undone. The entry will be permanently removed from your Khata."
            isDanger={true}
            onConfirm={() => deleteEntry(deleteModal)}
            onCancel={() => setDeleteModal(null)}
          />
        )}
      </AnimatePresence>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== WEATHER PAGE WITH SEARCH & FORECAST ====================
function WeatherPage({ onBack, weather, shehar }) {
  const [searchTerm, setSearchTerm] = useState(shehar || "");
  const [localWeather, setLocalWeather] = useState(weather);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`
      );
      const data = await response.json();
      if (data?.list) {
        setLocalWeather({
          temp: Math.round(data.list[0].main.temp),
          humidity: data.list[0].main.humidity,
          description: data.list[0].weather[0].main,
          wind: Math.round(data.list[0].wind.speed),
          city: data.city.name
        });
        const dailyForecasts = [];
        for (let i = 0; i < Math.min(3, data.list.length); i += 8) {
          dailyForecasts.push({
            date: new Date(data.list[i].dt * 1000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            temp: Math.round(data.list[i].main.temp),
            description: data.list[i].weather[0].main
          });
        }
        setForecast(dailyForecasts);
      }
    } catch (e) {
      console.log("Weather Error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (shehar) fetchWeather(shehar.split(",")[0]);
  }, [shehar]);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/weather-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Weather</h2>
      </motion.div>

      {/* SEARCH */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: "relative", zIndex: 8, padding: "12px 14px", background: `rgba(255,255,255,0.85)`,
          backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}`
        }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Search size={14} style={{ position: "absolute", left: 26, top: 20, color: C.textLight }} />
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search location..." style={{
              flex: 1, padding: "10px 12px 10px 38px", borderRadius: 10,
              border: `1.5px solid ${C.border}`, background: "white", color: C.text,
              fontSize: 12, outline: "none", fontFamily: "Inter, sans-serif"
            }} />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => fetchWeather(searchTerm)}
            style={{
              background: C.darkGreen, color: "white", border: "none", borderRadius: 10,
              padding: "10px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <Search size={14} />
          </motion.button>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "white" }}>
            <Loader size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : localWeather ? (
          <>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{
                background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "24px", textAlign: "center",
                animation: "glow 3s ease-in-out infinite"
              }}>
              <p style={{ margin: "0 0 12px 0", fontSize: 11, color: C.textLight, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <MapPin size={12} />
                {localWeather.city}
              </p>
              <div style={{ fontSize: 56, margin: "0 0 12px 0" }}>
                {localWeather.description === "Clear" ? "☀️" : localWeather.description === "Clouds" ? "☁️" : "🌧️"}
              </div>
              <h1 style={{ margin: 0, fontSize: 52, fontWeight: 800, color: C.darkGreen }}>
                {localWeather.temp}°C
              </h1>
              <p style={{ margin: "10px 0 0 0", fontSize: 14, color: C.text, fontWeight: 600 }}>
                {localWeather.description}
              </p>
            </motion.div>

            {/* DETAILS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: Droplets, label: "Humidity", value: `${localWeather.humidity}%` },
                { icon: Zap, label: "Wind", value: `${localWeather.wind} m/s` },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  style={{
                    background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                    border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", textAlign: "center",
                    animation: "glow 3s ease-in-out infinite"
                  }}>
                  <item.icon size={22} color={C.darkGreen} style={{ margin: "0 auto 8px" }} className="icon-glow" />
                  <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen }}>
                    {item.value}
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: C.textLight }}>{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* 3-DAY FORECAST */}
            {forecast.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                style={{
                  background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                  border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px",
                  animation: "glow 3s ease-in-out infinite"
                }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: 11, fontWeight: 800, color: C.darkGreen, display: "flex", alignItems: "center", gap: 6 }}>
                  <Cloud size={14} />
                  3-Day Forecast
                </h4>
                {forecast.map((f, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 0", borderBottom: i < forecast.length - 1 ? `1px solid ${C.border}` : "none"
                  }}>
                    <span style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>{f.date}</span>
                    <span style={{ fontSize: 11, color: C.text }}>
                      {f.description === "Clear" ? "☀️" : f.description === "Clouds" ? "☁️" : "🌧️"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.darkGreen }}>{f.temp}°C</span>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 80, color: "white" }}>
            <Cloud size={40} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 12, fontWeight: 600 }}>Unable to load weather</p>
          </div>
        )}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== COMMUNITY PAGE ====================
function CommunityPage({ onBack, db, kisanNaam, phone }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, () => { });
    return unsub;
  }, [db]);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    await addDoc(collection(db, "community_posts"), {
      text: newPost.trim(), author: kisanNaam, authorPhone: phone, likes: [], createdAt: serverTimestamp()
    });
    setNewPost("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/community-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.25))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Kisan Samuday</h2>
      </motion.div>

      {/* POST FORM */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: "relative", zIndex: 5, padding: "12px 14px", background: `rgba(255,255,255,0.85)`,
          backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}`
        }}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
          placeholder="Share your farming tips..." rows={2} style={{
            width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.border}`,
            background: "white", color: C.text, fontSize: 12, outline: "none", resize: "none",
            boxSizing: "border-box", fontFamily: "Inter, sans-serif"
          }} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={submitPost}
          style={{
            marginTop: 8, background: C.darkGreen, color: "white", border: "none", borderRadius: 10,
            padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%",
            animation: "glow 3s ease-in-out infinite"
          }}>
          <Plus size={12} style={{ display: "inline", marginRight: 4 }} />
          Post
        </motion.button>
      </motion.div>

      {/* POSTS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.length === 0 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ textAlign: "center", padding: 40, color: "white" }}>
            <Users size={40} style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 12, fontWeight: 600 }}>No posts yet. Be the first!</p>
          </motion.div>
        )}
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.darkGreen }}>{post.author}</span>
              <span style={{ fontSize: 9, color: C.textLight }}>Recent</span>
            </div>
            <p style={{ fontSize: 12, color: C.text, margin: "0 0 8px 0", lineHeight: 1.5 }}>
              {post.text}
            </p>
            <button style={{
              background: "none", border: "none", cursor: "pointer", fontSize: 11,
              color: C.textLight, display: "flex", alignItems: "center", gap: 4, padding: 0
            }}>
              <Heart size={12} /> {post.likes?.length || 0}
            </button>
          </motion.div>
        ))}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== PROFILE PAGE ====================
function ProfilePage({ onBack, kisanNaam, phone, shehar, fasal, beejDate, db }) {
  const [previousCrops, setPreviousCrops] = useState([]);
  const [activePage, setActivePage] = useState("main");

  useEffect(() => {
    if (phone) {
      getDoc(doc(db, "kisans", phone)).then(snap => {
        if (snap.exists()) {
          setPreviousCrops(snap.data().previousCrops || []);
        }
      });
    }
  }, [phone, db]);

  if (activePage === "crops") {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>My Crops</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px", marginBottom: 12,
              animation: "glow 3s ease-in-out infinite"
            }}>
            <p style={{ margin: "0 0 4px 0", fontSize: 9, color: C.textLight, fontWeight: 600 }}>Current Crop</p>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.darkGreen, marginBottom: 6 }}>
              {fasal}
            </h3>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>
              Sown: {beejDate}
            </p>
          </motion.div>

          {previousCrops.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: "white", margin: "12px 0 8px 0" }}>Previous Crops</p>
              {previousCrops.map((crop, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                  style={{
                    background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                    border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", marginBottom: 8,
                    animation: "glow 3s ease-in-out infinite"
                  }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.darkGreen }}>{crop.name}</p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 10, color: C.textLight }}>Completed</p>
                </motion.div>
              ))}
            </>
          )}
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  if (activePage === "help") {
    const faqs = [
      { q: "How to add my crop?", a: "Go to Home → Click 'Crop Track' → Enter crop details and sowing date" },
      { q: "How to track crop stages?", a: "Visit Crop Track page to see growth stages and daily tips" },
      { q: "How to check mandi prices?", a: "Open Mandi Bhav → Select or search your location" },
      { q: "How to record expenses?", a: "Go to Khata → Add amount and category" },
      { q: "How to delete an entry?", a: "In Khata, click three dots next to entry and select Delete" },
      { q: "How to join community?", a: "Open Community → Share tips and insights with other farmers" },
    ];

    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Help & FAQs</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              style={{
                background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", marginBottom: 10,
                animation: "glow 3s ease-in-out infinite"
              }}>
              <h4 style={{ margin: "0 0 6px 0", fontSize: 11, fontWeight: 800, color: C.darkGreen, display: "flex", alignItems: "center", gap: 6 }}>
                <HelpCircle size={14} />
                {faq.q}
              </h4>
              <p style={{ margin: 0, fontSize: 10, color: C.textLight, lineHeight: 1.5 }}>{faq.a}</p>
            </motion.div>
          ))}
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  if (activePage === "achievements") {
    const levels = [
      { level: 5, badge: "Seedling", color: "#90EE90", requirement: "5 days active" },
      { level: 10, badge: "Sprout", color: "#6FCF97", requirement: "10 days active" },
      { level: 25, badge: "Harvest", color: "#D4A574", requirement: "25 days active" },
      { level: 50, badge: "Master Farmer", color: "#FFD700", requirement: "50 days active" },
    ];

    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Achievements</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: "0 0 12px 0" }}>Unlock badges by staying active and using Kisan Saathi daily</p>
          {levels.map((lvl, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
              style={{
                background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 12,
                animation: "glow 3s ease-in-out infinite"
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: lvl.color,
                display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                fontWeight: 800, fontSize: 18
              }}>
                {lvl.level}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.darkGreen }}>
                  Level {lvl.level}: {lvl.badge}
                </p>
                <p style={{ margin: "3px 0 0 0", fontSize: 9, color: C.textLight }}>
                  {lvl.requirement}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  if (activePage === "settings") {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Settings</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
          <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12, background: `rgba(255,255,255,0.95)`,
              backdropFilter: "blur(6px)", border: `1.5px solid ${C.border}`, display: "flex",
              alignItems: "center", gap: 12, cursor: "pointer", fontSize: 12, fontWeight: 700,
              color: C.text, animation: "glow 3s ease-in-out infinite"
            }}>
            <Lock size={16} color={C.darkGreen} />
            <span style={{ flex: 1, textAlign: "left" }}>Change Password</span>
            <ChevronRight size={14} color={C.textLight} />
          </motion.button>

          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12, background: `rgba(255,255,255,0.95)`,
              backdropFilter: "blur(6px)", border: `1.5px solid ${C.border}`, display: "flex",
              alignItems: "center", gap: 12, cursor: "pointer", fontSize: 12, fontWeight: 700,
              color: C.danger, marginTop: 10, animation: "glow 3s ease-in-out infinite"
            }}>
            <LogOut size={16} color={C.danger} />
            <span style={{ flex: 1, textAlign: "left" }}>Logout</span>
            <ChevronRight size={14} color={C.textLight} />
          </motion.button>
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  if (activePage === "about") {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>About Us</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px", position: "relative", zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px", textAlign: "center",
              marginBottom: 14, animation: "glow 3s ease-in-out infinite"
            }}>
            <Wheat size={40} color={C.darkGreen} style={{ margin: "0 auto 12px" }} />
            <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
              Kisan Saathi v1.0
            </h2>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>Hanuman Khad Bhandar</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px", marginBottom: 12,
              animation: "glow 3s ease-in-out infinite"
            }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen, display: "flex", alignItems: "center", gap: 6 }}>
              <Globe size={14} />
              Mission
            </h3>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight, lineHeight: 1.6 }}>
              Empowering every farmer with live market data, AI-powered advice, and government schemes in one app.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen, display: "flex", alignItems: "center", gap: 6 }}>
              <Terminal size={14} />
              Developer
            </h3>
            <p style={{ margin: "0 0 4px 0", fontSize: 10, color: C.text, fontWeight: 600 }}>Shubham Boora</p>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>github.com/shubhamboora85</p>
          </motion.div>
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  if (activePage === "contact") {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
        backgroundImage: `url(/public/images/profile-bg.png)`,
        backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", flexDirection: "column", paddingBottom: 80
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          style={{
            position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
            backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
            padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <button onClick={() => setActivePage("main")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <ArrowLeft size={22} color={C.darkGreen} />
          </button>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Contact Us</h2>
        </motion.div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px", position: "relative", zIndex: 2 }}>
          <motion.a href="mailto:support@kisansaathi.com" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex", background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12,
              textDecoration: "none", alignItems: "center", gap: 12, cursor: "pointer",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <Mail size={18} color={C.darkGreen} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.darkGreen }}>Email Support</p>
              <p style={{ margin: "2px 0 0 0", fontSize: 10, color: C.textLight }}>support@kisansaathi.com</p>
            </div>
            <ChevronRight size={14} color={C.textLight} />
          </motion.a>

          <motion.a href="tel:+919876543210" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              display: "flex", background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12,
              textDecoration: "none", alignItems: "center", gap: 12, cursor: "pointer",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <Phone size={18} color={C.darkGreen} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.darkGreen }}>WhatsApp Support</p>
              <p style={{ margin: "2px 0 0 0", fontSize: 10, color: C.textLight }}>+91 9876543210</p>
            </div>
            <ChevronRight size={14} color={C.textLight} />
          </motion.a>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px",
              animation: "glow 3s ease-in-out infinite"
            }}>
            <p style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen, display: "flex", alignItems: "center", gap: 6 }}>
              <HelpCircle size={14} />
              Response Time
            </p>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>We respond within 24 hours</p>
          </motion.div>
        </div>

        <style>{glowStyles}</style>
      </div>
    );
  }

  // MAIN PROFILE PAGE
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/profile-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Profile</h2>
      </motion.div>

      {/* PROFILE CARD */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "18px", textAlign: "center", marginBottom: 12,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.darkGreen, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "white", animation: "glow 3s ease-in-out infinite" }}>
            <User size={32} />
          </div>
          <h3 style={{ margin: "0 0 6px 0", color: C.darkGreen, fontSize: 18, fontWeight: 800 }}>
            {kisanNaam}
          </h3>
          <p style={{ margin: "2px 0", color: C.textLight, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Phone size={12} />
            {phone}
          </p>
          <p style={{ margin: "2px 0 12px 0", color: C.textLight, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <MapPin size={12} />
            {shehar}
          </p>
        </motion.div>

        {/* MENU ITEMS */}
        {[
          { icon: Wheat, label: "My Crops", page: "crops" },
          { icon: HelpCircle, label: "Help & FAQs", page: "help" },
          { icon: Trophy, label: "Achievements", page: "achievements" },
          { icon: Globe, label: "About Us", page: "about" },
          { icon: Mail, label: "Contact Us", page: "contact" },
          { icon: Settings, label: "Settings", page: "settings" },
        ].map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => setActivePage(item.page)}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              width: "100%", background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "13px 14px",
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10,
              animation: "glow 3s ease-in-out infinite"
            }}>
            <item.icon size={18} color={C.darkGreen} className="icon-glow" />
            <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
            <ChevronRight size={14} color={C.textLight} />
          </motion.button>
        ))}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== CROP TRACKING PAGE ====================
function CropTrackingPage({ onBack, fasal, beejDate, din, stage, advice }) {
  const stages = ["Sowing", "Germination", "Growing", "Flowering", "Harvest"];
  const currentStageIndex = Math.min(Math.floor(din / 24), 4);

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/fasal-growth-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>Crop Tracking</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Your Crop Journey</p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "18px", marginBottom: 14,
            animation: "glow 3s ease-in-out infinite"
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.darkGreen }}>{fasal}</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 10, color: C.textLight }}>Sown: {beejDate}</p>
            </div>
            <Wheat size={36} color={C.darkGreen} className="icon-glow" />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            {stages.map((s, i) => (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", margin: "0 auto 8px",
                  background: i <= currentStageIndex ? C.success : "white",
                  border: `2.5px solid ${i <= currentStageIndex ? C.success : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i <= currentStageIndex ? "white" : C.text, fontWeight: 800, fontSize: 12,
                  animation: i === currentStageIndex ? "pulse 2s ease-in-out infinite" : "none"
                }}>
                  {i < currentStageIndex ? "✓" : i === currentStageIndex ? "●" : i + 1}
                </div>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: C.text }}>{s}</p>
              </div>
            ))}
          </div>

          <div style={{ background: C.lightCream, borderRadius: 12, padding: 12 }}>
            <p style={{ margin: "0 0 6px 0", fontSize: 11, fontWeight: 800, color: C.darkGreen }}>
              Current: {stage}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>Day {din} / 120</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px",
            animation: "glow 3s ease-in-out infinite"
          }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Leaf size={20} color={C.success} style={{ marginTop: 2, flexShrink: 0 }} className="icon-glow" />
            <div>
              <p style={{ margin: "0 0 6px 0", fontSize: 11, fontWeight: 800, color: C.darkGreen }}>Daily Tip</p>
              <p style={{ margin: 0, fontSize: 11, color: C.text, lineHeight: 1.6 }}>{advice}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== YOJNAS PAGE ====================
function YojnaPage({ onBack }) {
  const yojnas = [
    { name: "PM Kisan", icon: Shield, description: "₹6000 annually to all farmers" },
    { name: "Fasal Bima", icon: Award, description: "Crop insurance scheme" },
    { name: "KCC", icon: Pill, description: "Kisan Credit Card facility" },
    { name: "Meri Fasal", icon: Leaf, description: "Haryana government portal" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${C.darkGreen} 0%, ${C.lightGreen} 100%)`,
      backgroundImage: `url(/public/images/yojna-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", paddingBottom: 80
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.25))", pointerEvents: "none" }} />

      {/* HEADER */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
          position: "relative", zIndex: 10, background: `rgba(255,255,255,0.95)`,
          backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
          animation: "glow 3s ease-in-out infinite"
        }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>
          Government Schemes
        </h2>
      </motion.div>

      {/* YOJNAS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
        {yojnas.map((y, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              background: `rgba(255,255,255,0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", cursor: "pointer",
              display: "flex", alignItems: "flex-start", gap: 12,
              animation: "glow 3s ease-in-out infinite"
            }}>
            <y.icon size={24} color={C.darkGreen} className="icon-glow" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen }}>
                {y.name}
              </h4>
              <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>{y.description}</p>
            </div>
            <ChevronRight size={14} color={C.textLight} />
          </motion.div>
        ))}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== BOTTOM NAVIGATION ====================
function BottomNav({ page, onNavigate }) {
  const navItems = [
    { page: "main", icon: Home, label: "Home" },
    { page: "community", icon: Users, label: "Community" },
    { page: "chat", icon: MessageCircle, label: "AI Chat" },
    { page: "weather", icon: Bell, label: "Alerts" },
    { page: "profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.div initial={{ y: 80 }} animate={{ y: 0 }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        height: 70, background: `rgba(255,255,255,0.98)`, backdropFilter: "blur(12px)",
        borderTop: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-around",
        alignItems: "center", zIndex: 100, animation: "glow 3s ease-in-out infinite"
      }}>
      {navItems.map(item => (
        <motion.button key={item.page} whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate(item.page)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            transition: "all 0.3s"
          }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%",
            background: page === item.page ? C.darkGreen + "20" : "transparent",
            animation: page === item.page ? "glow 3s ease-in-out infinite" : "none"
          }}>
            <item.icon size={22} color={page === item.page ? C.darkGreen : C.textLight}
              className={page === item.page ? "icon-glow" : ""} />
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, color: page === item.page ? C.darkGreen : C.textLight
          }}>
            {item.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ==================== MAIN APP ====================
function App() {
  const [screen, setScreen] = useState("splash");
  const [page, setPage] = useState("main");
  const [phone, setPhone] = useState("");
  const [kisanNaam, setKisanNaam] = useState("");
  const [shehar, setShehar] = useState("");
  const [fasal, setFasal] = useState("");
  const [beejDate, setBeejDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedPhone = localStorage.getItem("kisan_phone");
    if (savedPhone) {
      setPhone(savedPhone);
      setDbLoading(true);
      getDoc(doc(db, "kisans", savedPhone)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setKisanNaam(data.naam || "");
          setShehar(data.shehar || "");
          setFasal(data.fasal || "");
          setBeejDate(data.beejDate || "");
          if (data.fasal && data.beejDate) setScreen("main");
          else setScreen("fasal");
        }
        setDbLoading(false);
      });
    } else {
      setTimeout(() => setScreen("phone"), 2500);
    }
  }, []);

  useEffect(() => {
    if (shehar && screen === "main") {
      const city = shehar.split(",")[0].trim();
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`)
        .then(r => r.json()).then(data => {
          if (data?.main) setWeather({
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity,
            description: data.weather[0].main,
            wind: Math.round(data.wind.speed),
            city: data.name
          });
        });
    }
  }, [shehar, screen]);

  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;

  const getStage = () => {
    if (fasal === "Chawal (Rice)") {
      if (din <= 25) return { stage: "Nursery Stage", advice: "Daily watering needed. Maintain temperature 28-32°C" };
      if (din <= 50) return { stage: "Transplanting", advice: "Maintain 2-3 inches of water in field" };
      if (din <= 80) return { stage: "Growth Stage", advice: "Apply urea and potash fertilizer" };
      if (din <= 110) return { stage: "Flowering", advice: "Water management critical. Remove weeds regularly" };
      return { stage: "Harvesting", advice: "Crop is ready for harvesting" };
    }
    return { stage: "Stage unknown", advice: "Select correct crop" };
  };

  const { stage, advice } = getStage();

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) { setError("Enter 10 digit number"); return; }
    setDbLoading(true);
    try {
      localStorage.setItem("kisan_phone", phone);
      const snap = await getDoc(doc(db, "kisans", phone));
      if (snap.exists()) {
        const data = snap.data();
        setKisanNaam(data.naam || "");
        setShehar(data.shehar || "");
        setFasal(data.fasal || "");
        setBeejDate(data.beejDate || "");
        if (data.fasal && data.beejDate) setScreen("main");
        else setScreen("fasal");
      } else {
        await setDoc(doc(db, "kisans", phone), { phone, naam: "", shehar: "", fasal: "", beejDate: "" });
        setScreen("fasal");
      }
    } catch (e) {
      setError("Connection error");
    }
    setDbLoading(false);
  };

  const saveData = async (extra = {}) => {
    if (!phone) return;
    try {
      await setDoc(doc(db, "kisans", phone), { phone, naam: kisanNaam, shehar, fasal, beejDate, ...extra }, { merge: true });
    } catch (e) { }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 300, messages: [...newMsgs.slice(-10)] })
      });
      const data = await res.json();
      const jawab = data?.choices?.[0]?.message?.content;
      if (jawab) setMessages([...newMsgs, { role: "assistant", content: jawab }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Try again" }]);
    }
    setLoading(false);
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
  };

  if (page === "chat") return <ChatPage messages={messages} loading={loading} onSend={sendMessage} onBack={() => setPage("main")} />;
  if (page === "khata") return <KhataPage phone={phone} onBack={() => setPage("main")} db={db} />;
  if (page === "mandi") return <MandiPage onBack={() => setPage("main")} />;
  if (page === "yojna") return <YojnaPage onBack={() => setPage("main")} />;
  if (page === "weather") return <WeatherPage onBack={() => setPage("main")} weather={weather} shehar={shehar} />;
  if (page === "profile") return <ProfilePage onBack={() => setPage("main")} kisanNaam={kisanNaam} phone={phone} shehar={shehar} fasal={fasal} beejDate={beejDate} db={db} />;
  if (page === "community") return <CommunityPage onBack={() => setPage("main")} db={db} kisanNaam={kisanNaam} phone={phone} />;
  if (page === "crop") return <CropTrackingPage onBack={() => setPage("main")} fasal={fasal} beejDate={beejDate} din={din} stage={stage} advice={advice} />;

  if (screen === "splash" || (dbLoading && !kisanNaam)) return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, textAlign: "center", padding: 20 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} style={{ fontSize: 64, marginBottom: 20 }}>
        <Wheat size={64} color={C.darkGreen} />
      </motion.div>
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 800, color: C.darkGreen, margin: "0 0 8px 0" }}>
        Kisan Saathi
      </h1>
      <h3 style={{ fontSize: 14, color: C.textLight, margin: "0 0 30px 0" }}>Hanuman Khad Bhandar</h3>
      <div style={{ width: 200, height: 3, background: C.border, borderRadius: 2, margin: "0 auto" }}>
        <motion.div style={{ height: 3, background: C.darkGreen, borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 1.2 }} />
      </div>
    </motion.div>
  );

  if (screen === "phone") return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, padding: 20 }}>
      <div style={{ fontSize: 52, marginBottom: 20 }}>
        <Phone size={52} color={C.darkGreen} />
      </div>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 800, color: C.darkGreen, margin: "0 0 8px 0" }}>
        Welcome
      </h2>
      <p style={{ color: C.textLight, fontSize: 13, margin: "0 0 20px 0" }}>Enter your 10-digit phone number</p>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "Inter, sans-serif" }} placeholder="Phone number" value={phone} maxLength={10} type="tel" onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()} />
      {error && <p style={{ color: C.danger, fontSize: 12, margin: "0 0 12px 0" }}>{error}</p>}
      <motion.button whileTap={{ scale: 0.95 }} style={{ width: "80%", background: C.darkGreen, color: "white", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 800, cursor: "pointer" }} onClick={handlePhoneSubmit}>
        {dbLoading ? "Loading..." : "Continue"}
      </motion.button>
    </motion.div>
  );

  if (screen === "fasal") return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, padding: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>
        <Wheat size={48} color={C.darkGreen} />
      </div>
      <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 800, color: C.darkGreen, margin: "0 0 20px 0" }}>
        Setup Your Farm
      </h3>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "Inter, sans-serif" }} placeholder="Your name" value={kisanNaam} onChange={e => setKisanNaam(e.target.value)} />
      <select style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "Inter, sans-serif" }} value={fasal} onChange={e => setFasal(e.target.value)}>
        <option>Select crop</option>
        <option>Chawal (Rice)</option>
        <option>Gehun (Wheat)</option>
        <option>Sarso (Mustard)</option>
        <option>Ganna (Sugarcane)</option>
      </select>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "Inter, sans-serif" }} type="date" value={beejDate} onChange={e => setBeejDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
      {error && <p style={{ color: C.danger, fontSize: 12, margin: "0 0 12px 0" }}>{error}</p>}
      <motion.button whileTap={{ scale: 0.95 }} style={{ width: "80%", background: C.darkGreen, color: "white", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 800, cursor: "pointer" }} onClick={async () => {
        if (!fasal || !beejDate) { setError("Fill all details"); return; }
        setDbLoading(true);
        try {
          await saveData({ naam: kisanNaam, fasal, beejDate, shehar: "Safidon" });
          setScreen("main");
        } catch { setError("Error"); }
        setDbLoading(false);
      }}>
        {dbLoading ? "Loading..." : "Start"}
      </motion.button>
    </motion.div>
  );

  return (
    <>
      <HomePage
        kisanNaam={kisanNaam || "Kisan"} shehar={shehar} fasal={fasal} beejDate={beejDate}
        weather={weather} din={din} advice={advice} stage={stage}
        onNavigate={handleNavigate}
      />
      <BottomNav page={page} onNavigate={handleNavigate} />
      <style>{glowStyles}</style>
    </>
  );
}

export default App;