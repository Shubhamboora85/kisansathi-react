// ============================================
// KISAN SAATHI - FINAL COMPLETE VERSION
// Exactly Image 2 Design + Bottom Navbar + All Features
// ============================================

import {
  TrendingUp, Cloud, BookOpen, Users, LogOut, User, ChevronRight,
  Search, Mic, Camera, Send, Heart, Loader, ArrowLeft,
  Wheat, FileText, Droplets, MapPin, Phone, MessageCircle, Settings,
  Zap, Shield, Award, Leaf, Pill, Home, Bell
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

// COLORS - EXACT FROM MOCKUP
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
  glow: "rgba(45, 90, 61, 0.5)",
};

// ==================== MANDI API ====================
async function fetchMandiPrices(location) {
  try {
    const response = await fetch(
      `https://data.gov.in/api/3/action/datastore_search?resource_id=9ef84268-d588-465a-a308-a864a43d0070&limit=15`
    );
    const data = await response.json();
    if (data.success) {
      const records = data.result.records || [];
      return records.slice(0, 8).map(r => ({
        crop: r.commodity || "Wheat",
        price: `₹${r.modal_price || r.price || "2135"}`,
        market: r.market || location,
        trend: Math.random() > 0.5 ? "↑" : "↓",
        change: Math.floor(Math.random() * 50) + 10
      }));
    }
  } catch (e) {
    console.log("API Error:", e);
  }
  return [
    { crop: "Wheat (गेहूं)", price: "₹2,135", market: "Kanpur", trend: "↑", change: 32 },
    { crop: "Paddy (धान)", price: "₹2,045", market: "Kanpur", trend: "↑", change: 18 },
    { crop: "Cotton (कपास)", price: "₹6,850", market: "Kanpur", trend: "↓", change: 25 },
  ];
}

// ==================== GLOW STYLES ====================
const glowStyles = `
  @keyframes glow {
    0%, 100% { text-shadow: 0 0 5px rgba(45, 90, 61, 0.4), 0 0 10px rgba(45, 90, 61, 0.3); }
    50% { text-shadow: 0 0 15px rgba(45, 90, 61, 0.6), 0 0 20px rgba(45, 90, 61, 0.4); }
  }
  @keyframes iconGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(45, 90, 61, 0.4)); }
    50% { filter: drop-shadow(0 0 8px rgba(45, 90, 61, 0.6)); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .glow-text { animation: glow 2s ease-in-out infinite; }
  .glow-icon { animation: iconGlow 2s ease-in-out infinite; }
  .pulse { animation: pulse 2s ease-in-out infinite; }
`;

// ==================== HOME PAGE (MAIN SCREEN) ====================
function HomePage({ kisanNaam, shehar, fasal, beejDate, weather, din, advice, stage, onNavigate }) {
  const progressPercent = Math.min((din / 120) * 100, 100);
  const ringR = 22;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc - (progressPercent / 100) * ringCirc;

  return (
    <div style={{ minHeight: "100vh", background: C.cream, display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", paddingBottom: 70 }}>
      {/* HERO HEADER WITH BACKGROUND IMAGE */}
      <div style={{
        position: "relative", height: 280, background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
        backgroundImage: `url(/public/images/home-bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(245,241,232,0.95) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, padding: "18px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ color: "white", fontSize: 12, margin: "0 0 2px 0", fontWeight: 500, opacity: 0.9 }}>Namaste,</p>
              <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 800, color: "white", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                {kisanNaam}
              </h1>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", margin: "4px 0 0 0" }}>What would you like to do today?</p>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => onNavigate("profile")}
              style={{
                width: 48, height: 48, borderRadius: "50%", background: C.darkGreen,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", boxShadow: `0 4px 15px ${C.glow}`
              }}>
              <User size={22} color="white" className="glow-icon" />
            </motion.button>
          </div>

          {/* WEATHER WIDGET - TRANSPARENT */}
          <motion.div onClick={() => onNavigate("weather")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{
              position: "absolute", top: 80, right: 16, zIndex: 3,
              background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)",
              borderRadius: 16, padding: "12px 16px", cursor: "pointer", minWidth: 120,
              border: `1.5px solid rgba(255,255,255,0.3)`, boxShadow: `0 8px 24px ${C.glow}`
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>☀️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.darkGreen, margin: 0 }}>{weather?.temp || 28}°C</p>
                <p style={{ fontSize: 9, color: C.textLight, margin: 0 }}>{weather?.description || "Sunny"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{
          margin: "16px 14px 0", background: "white", borderRadius: 24, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10, border: `1.5px solid ${C.border}`,
          cursor: "pointer", boxShadow: `0 4px 16px ${C.glow}`, transition: "all 0.3s"
        }} onClick={() => onNavigate("chat")}>
        <Search size={16} color={C.textLight} />
        <input placeholder="AI Chatbot se poocho..." disabled style={{
          flex: 1, background: "none", border: "none", outline: "none",
          fontSize: 12, color: C.text, fontFamily: "Inter, sans-serif"
        }} />
        <Camera size={14} color={C.darkGreen} className="glow-icon" />
        <Mic size={14} color={C.darkGreen} className="glow-icon" />
      </motion.div>

      {/* QUICK ACTIONS - 3x2 GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "14px 14px", padding: 0 }}>
        {[
          { icon: TrendingUp, label: "Mandi Bhav", page: "mandi", color: "#D4A574" },
          { icon: FileText, label: "Yojnaayein", page: "yojna", color: "#6FCF97" },
          { icon: Users, label: "Community", page: "community", color: "#2D5A3D" },
          { icon: Cloud, label: "Mausam", page: "weather", color: "#1565c0" },
          { icon: BookOpen, label: "Khata", page: "khata", color: "#E27C6B" },
          { icon: Wheat, label: "Fasal Track", page: "crop", color: "#D4A574" },
        ].map((btn, i) => (
          <motion.button key={i} whileTap={{ scale: 0.92 }} onClick={() => onNavigate(btn.page)}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 13,
              background: "white", border: `1.5px solid ${C.border}`, borderRadius: 14,
              cursor: "pointer", fontSize: 10, fontWeight: 700, color: C.darkGreen,
              boxShadow: `0 4px 12px ${C.glow}`, transition: "all 0.3s"
            }}>
            <btn.icon size={20} className="glow-icon" color={btn.color} />
            <span>{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* FASAL CARD - PROMINENT */}
      <motion.div onClick={() => onNavigate("crop")} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{
          margin: "8px 14px 12px", background: "white", border: `1.5px solid ${C.border}`,
          borderRadius: 16, padding: "16px", cursor: "pointer", position: "relative",
          boxShadow: `0 6px 20px ${C.glow}`, transition: "all 0.3s"
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 9, color: C.textLight, margin: "0 0 4px 0", fontWeight: 600 }}>Aapki Fasal</p>
            <h3 style={{ fontSize: 16, color: C.darkGreen, margin: 0, fontWeight: 700, marginBottom: 6 }}>{fasal}</h3>
            <p style={{ fontSize: 10, color: C.success, margin: 0, fontWeight: 700 }}>📍 {stage}</p>
            <p style={{ fontSize: 9, color: C.textLight, margin: "3px 0 0 0" }}>{Math.max(0, 120 - din)} din remaining</p>
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
          <p style={{ fontSize: 10, color: C.darkGreen, margin: 0, fontWeight: 600 }}>💡 {advice}</p>
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
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/chatpage-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>AI Saathi</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Your Farming Assistant</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 2 }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 20px", color: "white",
            background: `rgba(0, 0, 0, 0.3)`, backdropFilter: "blur(6px)",
            borderRadius: 16, border: `1px solid rgba(255,255,255,0.2)`
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
              Namaste! Mujhe sawaal poochho ya photo bhejo.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 15px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? C.darkGreen : `rgba(255, 255, 255, 0.95)`,
              backdropFilter: "blur(6px)", color: msg.role === "user" ? "white" : C.text,
              fontSize: 13, lineHeight: 1.5, border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
              boxShadow: msg.role === "user" ? `0 4px 12px ${C.glow}` : "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 15px", borderRadius: "18px 18px 18px 4px",
              background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
              color: C.text, fontSize: 13, border: `1px solid ${C.border}`
            }}>
              <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.97)`,
        backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.border}`,
        padding: "10px 12px", display: "flex", alignItems: "center", gap: 8
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
          cursor: "pointer", boxShadow: `0 4px 12px ${C.glow}`
        }}>
          <Send size={16} />
        </motion.button>
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== MANDI PAGE ====================
function MandiPage({ onBack }) {
  const [mandis, setMandis] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Kanpur");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMandiPrices(selectedLocation).then(data => {
      setMandis(data || []);
      setLoading(false);
    });
  }, [selectedLocation]);

  const locations = ["Kanpur", "Delhi", "Pune", "Mumbai"];

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/mandibhav-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>Mandi Bhav</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Today's Market Prices</p>
        </div>
      </div>

      {/* LOCATION TABS */}
      <div style={{ position: "relative", zIndex: 5, padding: "10px 14px", background: `rgba(255, 255, 255, 0.85)`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {locations.map(loc => (
            <motion.button key={loc} whileTap={{ scale: 0.95 }} onClick={() => setSelectedLocation(loc)} style={{
              padding: "8px 16px", borderRadius: 22, background: selectedLocation === loc ? C.darkGreen : "white",
              color: selectedLocation === loc ? "white" : C.text, border: `1.5px solid ${C.border}`,
              fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: selectedLocation === loc ? `0 4px 12px ${C.glow}` : "0"
            }}>
              <MapPin size={12} style={{ display: "inline", marginRight: 4 }} />
              {loc}
            </motion.button>
          ))}
        </div>
      </div>

      {/* PRICES LIST */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 9 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "white" }}>
            <Loader size={28} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        ) : (
          mandis.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              style={{
                background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: `0 4px 12px ${C.glow}`
              }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.darkGreen }}>{m.crop}</p>
                <p style={{ margin: "3px 0 0 0", fontSize: 9, color: C.textLight }}>{m.market}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.darkGreen }}>{m.price}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: 10, fontWeight: 700, color: m.trend === "↑" ? C.success : C.danger }}>
                  {m.trend} {m.change}
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
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/community-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.25))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Kisan Samuday</h2>
      </div>

      {/* POST INPUT */}
      <div style={{
        position: "relative", zIndex: 5, padding: "12px 14px", background: `rgba(255, 255, 255, 0.85)`,
        backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}`
      }}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
          placeholder="Apna tajurba share karo..." rows={2} style={{
            width: "100%", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${C.border}`,
            background: "white", color: C.text, fontSize: 12, outline: "none", resize: "none",
            boxSizing: "border-box", fontFamily: "Inter, sans-serif"
          }} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={submitPost} style={{
          marginTop: 8, background: C.darkGreen, color: "white", border: "none", borderRadius: 10,
          padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", width: "100%",
          boxShadow: `0 4px 12px ${C.glow}`
        }}>
          Post Karo
        </motion.button>
      </div>

      {/* POSTS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "white" }}>Koi post nahi hai</div>
        )}
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px",
              boxShadow: `0 4px 12px ${C.glow}`
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.darkGreen }}>{post.author}</span>
              <span style={{ fontSize: 9, color: C.textLight }}>recently</span>
            </div>
            <p style={{ fontSize: 12, color: C.text, margin: "0 0 8px 0", lineHeight: 1.5 }}>{post.text}</p>
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

// ==================== WEATHER PAGE ====================
function WeatherPage({ onBack, weather, shehar }) {
  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/weather-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Weather</h2>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
        {weather ? (
          <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
                border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "24px", textAlign: "center",
                boxShadow: `0 6px 20px ${C.glow}`
              }}>
              <p style={{ margin: "0 0 12px 0", fontSize: 11, color: C.textLight, fontWeight: 600 }}>📍 {weather.city || shehar}</p>
              <div style={{ fontSize: 64, margin: "0 0 12px 0" }}>☀️</div>
              <h1 style={{ margin: 0, fontSize: 52, fontWeight: 800, color: C.darkGreen }}>{weather.temp}°C</h1>
              <p style={{ margin: "10px 0 0 0", fontSize: 14, color: C.text, fontWeight: 600 }}>{weather.description}</p>
            </motion.div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
                { icon: Cloud, label: "Wind", value: `${weather.wind} m/s` },
                { icon: Zap, label: "Pressure", value: "1013 hPa" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
                  border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px", textAlign: "center",
                  boxShadow: `0 4px 12px ${C.glow}`
                }}>
                  <item.icon size={22} color={C.darkGreen} style={{ margin: "0 auto 6px" }} className="glow-icon" />
                  <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen }}>{item.value}</p>
                  <p style={{ margin: 0, fontSize: 9, color: C.textLight }}>{item.label}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: 80, color: "white" }}>
            <Loader size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        )}
      </div>

      <style>{glowStyles}</style>
    </div>
  );
}

// ==================== PROFILE PAGE ====================
function ProfilePage({ onBack, kisanNaam, phone, shehar, fasal, beejDate, onLogout, onChangeFasal }) {
  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/profile-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.4))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Profile</h2>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "20px", textAlign: "center",
            boxShadow: `0 6px 20px ${C.glow}`
          }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.darkGreen, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "white", boxShadow: `0 4px 16px ${C.glow}` }}>
            <User size={32} />
          </div>
          <h3 style={{ margin: "0 0 6px 0", color: C.darkGreen, fontSize: 18, fontWeight: 800 }}>{kisanNaam}</h3>
          <p style={{ margin: "3px 0", color: C.textLight, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Phone size={12} /> {phone}
          </p>
          <p style={{ margin: "3px 0 14px 0", color: C.textLight, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <MapPin size={12} /> {shehar}
          </p>
        </motion.div>

        {/* MENU ITEMS */}
        {[
          { icon: Wheat, label: "My Crops", onClick: onChangeFasal },
          { icon: MessageCircle, label: "Messages", onClick: () => { } },
          { icon: Award, label: "Achievements", onClick: () => { } },
          { icon: Settings, label: "Settings", onClick: () => { } },
        ].map((item, i) => (
          <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={item.onClick}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "13px 14px",
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              boxShadow: `0 4px 12px ${C.glow}`, transition: "all 0.3s"
            }}>
            <item.icon size={20} color={C.darkGreen} className="glow-icon" />
            <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: C.text, textAlign: "left" }}>{item.label}</span>
            <ChevronRight size={14} color={C.textLight} />
          </motion.button>
        ))}

        {/* LOGOUT */}
        <motion.button whileTap={{ scale: 0.98 }} onClick={onLogout}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: C.danger + "22", border: `1.5px solid ${C.danger}`, color: C.danger,
            borderRadius: 12, padding: "13px", cursor: "pointer", fontSize: 12, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: `0 4px 12px ${C.glow}`, transition: "all 0.3s"
          }}>
          <LogOut size={16} />
          Logout
        </motion.button>
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
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/fasal-growth-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <div>
          <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800 }}>Fasal Tracking</h2>
          <p style={{ margin: "2px 0 0 0", color: C.textLight, fontSize: 10 }}>Your Crop Journey</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "18px", marginBottom: 14,
            boxShadow: `0 6px 20px ${C.glow}`
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.darkGreen }}>{fasal}</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 10, color: C.textLight }}>Sown: {beejDate}</p>
            </div>
            <Wheat size={36} color={C.darkGreen} className="glow-icon" />
          </div>

          {/* STAGE PROGRESSION */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            {stages.map((s, i) => (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", margin: "0 auto 6px",
                  background: i <= currentStageIndex ? C.success : "white",
                  border: `2.5px solid ${i <= currentStageIndex ? C.success : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i <= currentStageIndex ? "white" : C.text, fontWeight: 800, fontSize: 12,
                  boxShadow: i <= currentStageIndex ? `0 0 12px ${C.glow}` : "0"
                }}>
                  {i < currentStageIndex ? "✓" : i === currentStageIndex ? "●" : i + 1}
                </div>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: C.text }}>{s}</p>
              </div>
            ))}
          </div>

          <div style={{ background: C.lightCream, borderRadius: 12, padding: 12 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.darkGreen, marginBottom: 4 }}>Current: {stage}</p>
            <p style={{ margin: 0, fontSize: 10, color: C.textLight }}>Day {din} / 120</p>
          </div>
        </motion.div>

        {/* TIP CARD */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
            border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "14px",
            boxShadow: `0 4px 12px ${C.glow}`
          }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Leaf size={20} color={C.success} style={{ marginTop: 2, flexShrink: 0 }} className="glow-icon" />
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.darkGreen, marginBottom: 4 }}>Today's Tip</p>
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
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/yojna-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.25))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Sarkari Yojnayen</h2>
      </div>

      {/* YOJNAS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
        {yojnas.map((y, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            style={{
              background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "13px 14px", cursor: "pointer",
              display: "flex", alignItems: "flex-start", gap: 12,
              boxShadow: `0 4px 12px ${C.glow}`, transition: "all 0.3s"
            }}>
            <y.icon size={24} color={C.darkGreen} className="glow-icon" style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 800, color: C.darkGreen }}>{y.name}</h4>
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

// ==================== KHATA PAGE ====================
function KhataPage({ phone, onBack, db }) {
  const [entries, setEntries] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("kharcha");

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

  const totalKharcha = entries.filter(e => e.type === "kharcha").reduce((s, e) => s + e.amount, 0);
  const totalKamai = entries.filter(e => e.type === "kamai").reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, #2D5A3D 0%, #1a3428 100%)`,
      backgroundImage: `url(/public/images/profile-bg.png)`,
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))", pointerEvents: "none" }} />

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.95)`,
        backdropFilter: "blur(12px)", borderBottom: `1.5px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        boxShadow: `0 4px 16px ${C.glow}`
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={22} color={C.darkGreen} />
        </button>
        <h2 style={{ margin: 0, color: C.darkGreen, fontSize: 16, fontWeight: 800, flex: 1 }}>Kisan Khata</h2>
      </div>

      {/* SUMMARY */}
      <div style={{ position: "relative", zIndex: 5, display: "flex", gap: 8, padding: "10px", background: `rgba(255, 255, 255, 0.85)`, backdropFilter: "blur(6px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ flex: 1, background: "white", borderRadius: 12, padding: 10, textAlign: "center", border: `1.5px solid ${C.border}`, boxShadow: `0 2px 8px ${C.glow}` }}>
          <p style={{ margin: 0, fontSize: 9, color: C.textLight, fontWeight: 600 }}>Kharcha</p>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 800, color: C.danger }}>₹{totalKharcha}</p>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: 12, padding: 10, textAlign: "center", border: `1.5px solid ${C.border}`, boxShadow: `0 2px 8px ${C.glow}` }}>
          <p style={{ margin: 0, fontSize: 9, color: C.textLight, fontWeight: 600 }}>Kamai</p>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, fontWeight: 800, color: C.success }}>₹{totalKamai}</p>
        </div>
      </div>

      {/* ENTRIES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", position: "relative", zIndex: 2 }}>
        {entries.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "white" }}>Abhi koi entry nahi</div>
        )}
        {entries.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
            style={{
              background: `rgba(255, 255, 255, 0.95)`, backdropFilter: "blur(6px)",
              border: `1.5px solid ${C.border}`, borderRadius: 11, padding: "10px 12px", marginBottom: 8,
              display: "flex", justifyContent: "space-between",
              boxShadow: `0 2px 8px ${C.glow}`
            }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.text }}>{e.category}</p>
              <p style={{ margin: "2px 0 0 0", fontSize: 9, color: C.textLight }}>{e.date}</p>
            </div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: e.type === "kharcha" ? C.danger : C.success }}>
              {e.type === "kharcha" ? "-" : "+"}₹{e.amount}
            </p>
          </motion.div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{
        position: "relative", zIndex: 10, background: `rgba(255, 255, 255, 0.97)`,
        backdropFilter: "blur(12px)", borderTop: `1.5px solid ${C.border}`, padding: "10px 12px"
      }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <button onClick={() => setType("kharcha")} style={{
            flex: 1, padding: 8, borderRadius: 10, border: "none",
            background: type === "kharcha" ? C.danger : "white", color: type === "kharcha" ? "white" : C.text,
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
          }}>
            Kharcha
          </button>
          <button onClick={() => setType("kamai")} style={{
            flex: 1, padding: 8, borderRadius: 10, border: "none",
            background: type === "kamai" ? C.success : "white", color: type === "kamai" ? "white" : C.text,
            fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
          }}>
            Kamai
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
            boxShadow: `0 4px 12px ${C.glow}`
          }}>
            Add
          </motion.button>
        </div>
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
    { page: "post", icon: MessageCircle, label: "Post" },
    { page: "alerts", icon: Bell, label: "Alerts" },
    { page: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      height: 70, background: `rgba(255, 255, 255, 0.98)`, backdropFilter: "blur(12px)",
      borderTop: `1.5px solid ${C.border}`, display: "flex", justifyContent: "space-around",
      alignItems: "center", zIndex: 100, boxShadow: `0 -4px 16px ${C.glow}`
    }}>
      {navItems.map(item => (
        <motion.button key={item.page} whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (item.page === "post") onNavigate("community");
            else if (item.page === "alerts") onNavigate("weather");
            else onNavigate(item.page);
          }}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            transition: "all 0.3s"
          }}>
          <item.icon size={22} color={page === item.page ? C.darkGreen : C.textLight}
            className={page === item.page ? "glow-icon" : ""} />
          <span style={{ fontSize: 9, fontWeight: 700, color: page === item.page ? C.darkGreen : C.textLight }}>
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
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
          if (data?.main) setWeather({ temp: Math.round(data.main.temp), humidity: data.main.humidity, description: data.weather[0].description, id: data.weather[0].id, wind: Math.round(data.wind.speed), city: data.name });
        });
    }
  }, [shehar, screen]);

  const din = beejDate ? Math.floor((new Date() - new Date(beejDate)) / (1000 * 60 * 60 * 24)) : 0;

  const getStage = () => {
    if (fasal === "Chawal (Rice)") {
      if (din <= 25) return { stage: "Nursery Stage", advice: "Roz paani do, temperature 28-32°C rakho" };
      if (din <= 50) return { stage: "Transplanting", advice: "2-3 inch paani rakho field mein" };
      if (din <= 80) return { stage: "Growth Stage", advice: "Urea aur potash lagao" };
      if (din <= 110) return { stage: "Flowering", advice: "Paani zaroori hai, kharpatvar nikalo" };
      return { stage: "Harvesting", advice: "Fasal tayyar, katai shuru karo" };
    }
    return { stage: "Stage unknown", advice: "Sahi fasal chunein" };
  };

  const { stage, advice } = getStage();

  const handlePhoneSubmit = async () => {
    if (phone.length !== 10) { setError("10 digit number daalo!"); return; }
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
      setError("Internet check karo!");
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
      setMessages([...newMsgs, { role: "assistant", content: "Dobara try karo!" }]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("kisan_phone");
    setScreen("phone");
    setPhone("");
    setKisanNaam("");
    setShehar("");
    setFasal("");
    setBeejDate("");
    setMessages([]);
    setPage("main");
  };

  const handleNavigate = (newPage) => {
    setPage(newPage);
  };

  if (page === "chat") return <ChatPage messages={messages} loading={loading} onSend={sendMessage} onBack={() => setPage("main")} />;
  if (page === "khata") return <KhataPage phone={phone} onBack={() => setPage("main")} db={db} />;
  if (page === "mandi") return <MandiPage onBack={() => setPage("main")} />;
  if (page === "yojna") return <YojnaPage onBack={() => setPage("main")} />;
  if (page === "weather") return <WeatherPage onBack={() => setPage("main")} weather={weather} shehar={shehar} />;
  if (page === "profile") return <ProfilePage onBack={() => setPage("main")} kisanNaam={kisanNaam} phone={phone} shehar={shehar} fasal={fasal} beejDate={beejDate} onLogout={handleLogout} onChangeFasal={() => { setPage("main"); setScreen("fasal"); }} />;
  if (page === "community") return <CommunityPage onBack={() => setPage("main")} db={db} kisanNaam={kisanNaam} phone={phone} />;
  if (page === "crop") return <CropTrackingPage onBack={() => setPage("main")} fasal={fasal} beejDate={beejDate} din={din} stage={stage} advice={advice} />;

  if (screen === "splash" || (dbLoading && !kisanNaam)) return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, textAlign: "center", padding: 20 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} style={{ fontSize: 64, marginBottom: 20 }}>🌾</motion.div>
      <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 800, color: C.darkGreen, margin: "0 0 8px 0" }}>Kisan Saathi</h1>
      <h3 style={{ fontSize: 14, color: C.textLight, margin: "0 0 30px 0" }}>Hanuman Khad Bhandar</h3>
      <div style={{ width: 200, height: 3, background: C.border, borderRadius: 2, margin: "0 auto" }}>
        <motion.div style={{ height: 3, background: C.darkGreen, borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1, duration: 1.2 }} />
      </div>
    </motion.div>
  );

  if (screen === "phone") return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, padding: 20 }}>
      <div style={{ fontSize: 52, marginBottom: 20 }}>📱</div>
      <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 800, color: C.darkGreen, margin: "0 0 8px 0" }}>Namaste!</h2>
      <p style={{ color: C.textLight, fontSize: 13, margin: "0 0 20px 0" }}>Apna mobile number daalo</p>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "Inter, sans-serif", boxShadow: `0 4px 12px ${C.glow}` }} placeholder="10 digit number" value={phone} maxLength={10} type="tel" onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()} />
      {error && <p style={{ color: C.danger, fontSize: 12, margin: "0 0 12px 0" }}>{error}</p>}
      <motion.button whileTap={{ scale: 0.95 }} style={{ width: "80%", background: C.darkGreen, color: "white", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 12px ${C.glow}` }} onClick={handlePhoneSubmit}>
        {dbLoading ? "Loading..." : "Continue"}
      </motion.button>
    </motion.div>
  );

  if (screen === "fasal") return (
    <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.cream, padding: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🌾</div>
      <h3 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 800, color: C.darkGreen, margin: "0 0 20px 0" }}>Apni Jaankari Bharo</h3>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "Inter, sans-serif", boxShadow: `0 4px 12px ${C.glow}` }} placeholder="Apna naam" value={kisanNaam} onChange={e => setKisanNaam(e.target.value)} />
      <select style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 10, fontFamily: "Inter, sans-serif", boxShadow: `0 4px 12px ${C.glow}` }} value={fasal} onChange={e => setFasal(e.target.value)}>
        <option>-- Fasal chunein --</option>
        <option>Chawal (Rice)</option>
        <option>Gehun (Wheat)</option>
        <option>Sarso (Mustard)</option>
        <option>Ganna (Sugarcane)</option>
      </select>
      <input style={{ width: "80%", padding: "11px 15px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "white", color: C.text, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: "Inter, sans-serif", boxShadow: `0 4px 12px ${C.glow}` }} type="date" value={beejDate} onChange={e => setBeejDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
      {error && <p style={{ color: C.danger, fontSize: 12, margin: "0 0 12px 0" }}>{error}</p>}
      <motion.button whileTap={{ scale: 0.95 }} style={{ width: "80%", background: C.darkGreen, color: "white", border: "none", borderRadius: 10, padding: "11px", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 12px ${C.glow}` }} onClick={async () => {
        if (!fasal || !beejDate) { setError("Fasal aur tarikh zaroori hai!"); return; }
        setDbLoading(true);
        try {
          await saveData({ naam: kisanNaam, fasal, beejDate, shehar: "Safidon" });
          setScreen("main");
        } catch { setError("Error saving"); }
        setDbLoading(false);
      }}>
        {dbLoading ? "Loading..." : "Start Tracking"}
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