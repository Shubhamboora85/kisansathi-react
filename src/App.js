import QuizPage from "./components/QuizPage";
import YojnaPage from "./components/YojnaPage";
import WeatherPage from "./components/WeatherPage";
import ProfilePage from "./components/ProfilePage";
import ChatPage from "./components/ChatPage";
import CommunityPage from "./components/CommunityPage";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import HomePage from "./components/HomePage";
import { setupNotifications } from "./components/notifications";
import { getFullKnowledgeBase } from "./components/farmKnowledge";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./App.css";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function FasalBackground({ din, windSpeed, isRain, isNight, fasal }) {
  const hour = new Date().getHours();
  const getSky = () => {
    if (isRain) return { top: "#3a4a5a", mid: "#5a6a7a", bot: "#7a8a9a" };
    if (hour >= 5 && hour < 7) return { top: "#f6934a", mid: "#f6b86a", bot: "#fbd38d" };
    if (hour >= 7 && hour < 17) return { top: "#1565c0", mid: "#42a5f5", bot: "#90caf9" };
    if (hour >= 17 && hour < 20) return { top: "#8B2500", mid: "#c05621", bot: "#f6ad55" };
    return { top: "#020408", mid: "#080818", bot: "#0d1428" };
  };
  const sky = getSky();
  const ph = din <= 5 ? 0 : din <= 15 ? 12 : din <= 25 ? 22 : din <= 50 ? 42 : din <= 80 ? 62 : din <= 110 ? 76 : 70;
  const isGolden = din > 100;
  const hasEar = din > 80;
  const pc = isGolden ? "#8B6914" : "#1a4a20";
  const lc = isGolden ? "#c8a030" : "#2d7a35";
  const wa = windSpeed > 8 ? 22 : windSpeed > 4 ? 12 : 5;
  const sunX = hour < 12 ? 50 + hour * 20 : 450 - (hour - 12) * 20;
  const sunY = hour < 6 ? 170 : hour < 12 ? 170 - (hour - 6) * 16 : hour < 18 ? 74 + (hour - 12) * 13 : 170;

  const Plant = ({ x, i }) => {
    const baseY = 228;
    const h = ph * (0.85 + (i % 5) * 0.06);
    const lf = h * 0.4;
    const dur = `${1.3 + (i % 7) * 0.25}s`;
    const vals = `0 ${x} ${baseY};${wa} ${x} ${baseY};${-wa * 0.3} ${x} ${baseY};${wa * 0.6} ${x} ${baseY};0 ${x} ${baseY}`;
    if (din <= 5) return <ellipse key={i} cx={x} cy={baseY + 1} rx="3" ry="1.8" fill="#c8a030" opacity="0.7" />;
    if (din <= 18) return (
      <g key={i}>
        <animateTransform attributeName="transform" type="rotate" values={`0 ${x} ${baseY};${wa * 0.5} ${x} ${baseY};0 ${x} ${baseY}`} dur={`${2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
        <line x1={x} y1={baseY} x2={x} y2={baseY - 14} stroke="#2d6a30" strokeWidth="1.5" />
        <path d={`M${x},${baseY - 9} C${x - 8},${baseY - 14} ${x - 12},${baseY - 11} ${x - 14},${baseY - 8}`} stroke="#3a8a3a" strokeWidth="1.3" fill="none" />
        <path d={`M${x},${baseY - 11} C${x + 7},${baseY - 16} ${x + 11},${baseY - 13} ${x + 13},${baseY - 10}`} stroke="#3a8a3a" strokeWidth="1.3" fill="none" />
      </g>
    );
    return (
      <g key={i}>
        <animateTransform attributeName="transform" type="rotate" values={vals} dur={dur} repeatCount="indefinite" />
        <line x1={x - 2} y1={baseY} x2={x - 3} y2={baseY - h * 0.92} stroke={pc} strokeWidth="1.4" />
        <line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke={pc} strokeWidth="1.8" />
        <line x1={x + 2} y1={baseY} x2={x + 3} y2={baseY - h * 0.88} stroke={pc} strokeWidth="1.4" />
        <path d={`M${x},${baseY - h * 0.25} C${x - lf * 1.4},${baseY - h * 0.32} ${x - lf * 1.8},${baseY - h * 0.18} ${x - lf * 2},${baseY - h * 0.08}`} stroke={lc} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d={`M${x},${baseY - h * 0.45} C${x + lf * 1.3},${baseY - h * 0.52} ${x + lf * 1.7},${baseY - h * 0.38} ${x + lf * 1.9},${baseY - h * 0.28}`} stroke={lc} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d={`M${x},${baseY - h * 0.62} C${x - lf * 1.1},${baseY - h * 0.7} ${x - lf * 1.5},${baseY - h * 0.56} ${x - lf * 1.7},${baseY - h * 0.46}`} stroke={lc} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {din > 45 && <path d={`M${x},${baseY - h * 0.78} C${x + lf},${baseY - h * 0.86} ${x + lf * 1.3},${baseY - h * 0.72} ${x + lf * 1.5},${baseY - h * 0.62}`} stroke={lc} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
        {hasEar && <>
          <path d={`M${x},${baseY - h} Q${x + 10},${baseY - h - 16} ${x + 7},${baseY - h - 30}`} stroke={isGolden ? "#c8a030" : "#4a8a4a"} strokeWidth="1.8" fill="none" />
          {[0,1,2,3,4,5].map(gi => (
            <g key={gi}>
              <ellipse cx={x + 4 + gi * 0.5} cy={baseY - h - 6 - gi * 4} rx="2.4" ry="1.2" fill={isGolden ? "#d4a020" : "#5a9a5a"} transform={`rotate(${-40 + gi * 7}, ${x + 4 + gi * 0.5}, ${baseY - h - 6 - gi * 4})`} />
              <ellipse cx={x + 9 - gi * 0.3} cy={baseY - h - 8 - gi * 4} rx="2" ry="1.1" fill={isGolden ? "#b89018" : "#4a8a4a"} transform={`rotate(${-20 + gi * 5}, ${x + 9 - gi * 0.3}, ${baseY - h - 8 - gi * 4})`} />
            </g>
          ))}
        </>}
      </g>
    );
  };

  const cols = 16;
  return (
    <svg viewBox="0 0 480 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky.top} /><stop offset="55%" stopColor={sky.mid} /><stop offset="100%" stopColor={sky.bot} />
        </linearGradient>
        <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a5a2a" /><stop offset="100%" stopColor="#1a3a1a" />
        </linearGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b4226" /><stop offset="100%" stopColor="#4a2c1a" />
        </linearGradient>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aaae0" stopOpacity="0.6" /><stop offset="100%" stopColor="#3a7ab0" stopOpacity="0.4" />
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      <rect x="0" y="0" width="480" height="220" fill="url(#sg)" />
      {!isNight && !isRain && <>
        <circle cx={sunX} cy={sunY} r="50" fill="#fff7a0" opacity="0.2" />
        <circle cx={sunX} cy={sunY} r="28" fill="#fef08a" opacity="0.8" />
        <circle cx={sunX} cy={sunY} r="20" fill="#fde047" />
      </>}
      {isNight && <>
        <circle cx="385" cy="36" r="22" fill="#dde6f0" opacity="0.9" />
        <circle cx="395" cy="30" r="17" fill={sky.top} opacity="0.95" />
      </>}
      {isNight && [[40,18],[88,30],[142,12],[196,36],[250,16],[298,30],[348,13],[418,26],[62,50],[174,56],[326,46],[456,16]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.8 + (i%3) * 0.5} fill="white" opacity={0.5 + (i%4) * 0.12} />
      ))}
      {!isNight && <g opacity={isRain ? 0.85 : 0.6}>
        <ellipse cx="105" cy="46" rx="50" ry="19" fill={isRain ? "#4a5a6a" : "white"} />
        <ellipse cx="82" cy="53" rx="33" ry="15" fill={isRain ? "#4a5a6a" : "white"} />
        <ellipse cx="338" cy="36" rx="58" ry="21" fill={isRain ? "#3a4a5a" : "white"} />
        <ellipse cx="370" cy="44" rx="40" ry="16" fill={isRain ? "#3a4a5a" : "white"} />
      </g>}
      <path d="M0,188 Q60,162 120,175 Q180,162 240,178 Q300,165 360,178 Q420,163 480,178 L480,200 L0,200Z" fill="#1a3a1a" opacity="0.6" />
      {[[52,162,18,28],[118,168,14,22],[228,165,20,30],[318,168,16,24],[408,164,18,26]].map(([tx,ty,tw,th],i) => (
        <g key={i} opacity={0.55} filter="url(#blur)">
          <rect x={tx-2} y={ty} width="4" height="30" fill="#1a2a1a" />
          <ellipse cx={tx} cy={ty - 8} rx={tw * 0.75} ry={th * 0.5} fill="#1e4a1e" />
          <ellipse cx={tx} cy={ty - 16} rx={tw * 0.65} ry={th * 0.45} fill="#2a5a2a" />
          <ellipse cx={tx} cy={ty - 24} rx={tw * 0.4} ry={th * 0.3} fill="#3a6a3a" />
        </g>
      ))}
      <rect x="0" y="198" width="480" height="102" fill="url(#gg)" />
      <rect x="0" y="235" width="480" height="65" fill="url(#soil)" />
      {(fasal === "🌾 Chawal (Rice)" || !fasal) && din > 8 && (
        <rect x="0" y="225" width="480" height="12" fill="url(#wg)" />
      )}
      {[...Array(cols)].map((_, i) => {
        const x = 15 + i * (450 / cols);
        return <Plant key={i} x={x} i={i} />;
      })}
      {isRain && [...Array(40)].map((_, i) => (
        <g key={i}>
          <animateTransform attributeName="transform" type="translate"
            values={`${(i * 9.8) % 480} -15; ${((i * 9.8) + 20) % 480} 308`}
            dur={`${0.48 + (i%6)*0.065}s`} begin={`${(i%20)*0.065}s`} repeatCount="indefinite" />
          <line x1="0" y1="0" x2="-4" y2="14" stroke="rgba(160,210,255,0.7)" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

function KhataPage({ phone, onBack }) {
  const [entries, setEntries] = useState([]);
  const [category, setCategory] = useState("Dawaai");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("kharcha");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) return;
    getDoc(doc(db, "kisans", phone)).then(snap => {
      if (snap.exists()) setEntries(snap.data().khata || []);
      setLoading(false);
    });
  }, [phone]);

  const addEntry = async () => {
    if (!amount || isNaN(amount)) return;
    const entry = { id: Date.now(), category, amount: parseInt(amount), type, date: new Date().toLocaleDateString("hi-IN") };
    const updated = [entry, ...entries];
    setEntries(updated);
    setAmount("");
    await setDoc(doc(db, "kisans", phone), { khata: updated }, { merge: true });
  };

  const totalKharcha = entries.filter(e => e.type === "kharcha").reduce((s, e) => s + e.amount, 0);
  const totalKamai = entries.filter(e => e.type === "kamai").reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7dffaa", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#7dffaa", fontWeight: "bold", fontSize: 16 }}>📒 Kisan Khata</span>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 10px 0" }}>
        {[["Total Kharcha", totalKharcha, "#ff6666"], ["Total Kamai", totalKamai, "#7dffaa"], ["Net", totalKamai - totalKharcha, totalKamai - totalKharcha >= 0 ? "#7dffaa" : "#ff6666"]].map(([label, val, color]) => (
          <div key={label} style={{ flex: 1, background: "rgba(100,180,255,0.07)", borderRadius: 12, padding: 10, border: "1px solid rgba(100,180,255,0.13)", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color }}>{val < 0 ? "-" : ""}₹{Math.abs(val).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {loading ? <div style={{ textAlign: "center", padding: 20, color: "#7dffaa" }}>⏳ Loading...</div> :
          entries.length === 0 ? <div style={{ textAlign: "center", padding: 30, color: "rgba(100,180,255,0.5)" }}>Abhi koi entry nahi hai</div> :
          entries.map(e => (
            <div key={e.id} style={{ background: "rgba(100,180,255,0.07)", borderRadius: 12, padding: "10px 14px", margin: "6px 0", border: `1px solid ${e.type === "kharcha" ? "rgba(255,100,100,0.3)" : "rgba(100,255,150,0.3)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#fff", fontSize: 13 }}>{e.category}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{e.date}</div>
              </div>
              <div style={{ fontWeight: "bold", fontSize: 15, color: e.type === "kharcha" ? "#ff6666" : "#7dffaa" }}>
                {e.type === "kharcha" ? "-" : "+"}₹{e.amount.toLocaleString()}
              </div>
            </div>
          ))
        }
      </div>
      <div style={{ background: "rgba(7,21,40,0.97)", borderTop: "1px solid rgba(100,180,255,0.12)", padding: 10 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["kharcha", "kamai"].map(t => (
            <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: 8, borderRadius: 10, border: "none", background: type === t ? (t === "kharcha" ? "#c0392b" : "#2d8a2d") : "rgba(100,180,255,0.1)", color: type === t ? "white" : "rgba(255,255,255,0.5)", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>
              {t === "kharcha" ? "− Kharcha" : "+ Kamai"}
            </button>
          ))}
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.07)", color: "#fff", fontSize: 13, marginBottom: 8, outline: "none" }}>
          {["Dawaai","Beej","Khad/Urea","Mazdoori","Tractor","Mandi se kamai","Bijli bill","Kuch aur"].map(c => <option key={c} style={{ background: "#071528" }}>{c}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))} placeholder="Amount ₹" type="number"
            style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.07)", color: "#fff", fontSize: 13, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && addEntry()} />
          <button onClick={addEntry} style={{ background: "#1e90ff", color: "white", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>Add</button>
        </div>
      </div>
    </div>
  );
}

function MandiBhavPage({ onBack }) {
  const [location, setLocation] = useState("");
  const [bhav, setBhav] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getMandiBhav = async () => {
    if (!location.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const res = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.REACT_APP_MANDI_KEY}&format=json&filters[district]=${encodeURIComponent(location)}&limit=20`);
      const data = await res.json();
      setBhav(data.records && data.records.length > 0 ? data.records : []);
    } catch { setBhav([]); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7dffaa", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#7dffaa", fontWeight: "bold", fontSize: 16 }}>📊 Mandi Bhav — Haryana</span>
      </div>
      <div style={{ padding: "12px 10px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="District likhein (jaise: Jind, Kaithal, Karnal)"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.07)", color: "#fff", fontSize: 13, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && getMandiBhav()} />
          <button onClick={getMandiBhav} style={{ background: "#1e90ff", color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: "bold", cursor: "pointer" }}>🔍</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {["Jind","Kaithal","Karnal","Hisar","Rohtak"].map(m => (
            <button key={m} onClick={() => setLocation(m)} style={{ padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(100,180,255,0.25)", background: "rgba(100,180,255,0.08)", color: "#7dffaa", fontSize: 11, cursor: "pointer" }}>{m}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
        {loading && <div style={{ textAlign: "center", padding: 30, color: "#7dffaa" }}>⏳ Bhav dhundh raha hoon...</div>}
        {!loading && searched && bhav.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.4)" }}>😕 Is district ka bhav nahi mila</div>}
        {bhav.map((b, i) => (
          <div key={i} style={{ background: "rgba(100,180,255,0.07)", borderRadius: 12, padding: "10px 14px", margin: "6px 0", border: "1px solid rgba(100,180,255,0.13)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#fff", fontSize: 13 }}>{b.commodity}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>📍 {b.market} | {b.arrival_date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", color: "#7dffaa", fontSize: 14 }}>₹{b.modal_price}/q</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Min: ₹{b.min_price} | Max: ₹{b.max_price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 12px", background: "rgba(7,21,40,0.97)", borderTop: "1px solid rgba(100,180,255,0.1)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>⚠️ Bhav thoda upar neeche ho sakta hai — mandi jaane se pehle confirm karein</div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("splash");
  const [page, setPage] = useState("main");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [kisanNaam, setKisanNaam] = useState("");
  const [shehar, setShehar] = useState("");
  const [fasal, setFasal] = useState("");
  const [beejDate, setBeejDate] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [showBg, setShowBg] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const handleBackButton = () => {
      if (page !== "main") {
        setPage("main");
        window.history.pushState(null, "", window.location.href);
      } else if (screen === "main") {
        if (window.confirm("Kya aap app band karna chahte hain?")) {
          window.history.back();
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [page, screen]);

  useEffect(() => {
    const savedPhone = localStorage.getItem("kisan_phone");
    if (savedPhone) {
      setPhone(savedPhone); setDbLoading(true);
      getDoc(doc(db, "kisans", savedPhone)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setKisanNaam(data.naam || "");
          setShehar(data.shehar || "");
          setFasal(data.fasal || "");
          setBeejDate(data.beejDate || "");
          setMessages([]);
          setUserPoints(data.points || 0);
          setUserStreak(data.streak || 0);
          if (data.fasal && data.beejDate) setScreen("main");
          else setScreen("fasal");
        }
        setDbLoading(false);
      }).catch(() => setDbLoading(false));
    } else {
      setTimeout(() => setScreen("phone"), 2500);
    }
  }, []);

  useEffect(() => {
  if (screen === "phone" && !window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  }
}, [screen]);

  useEffect(() => {
    if (phone && screen === "main") {
      setupNotifications(app, db, phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, screen]);

  useEffect(() => {
    if (shehar && screen === "main") {
      const city = shehar.split(",")[0].trim();
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json()).then(data => {
          if (data?.main) setWeather({ temp: Math.round(data.main.temp), humidity: data.main.humidity, description: data.weather[0].description, id: data.weather[0].id, wind: Math.round(data.wind.speed), city: data.name });
        }).catch(() => {});
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json()).then(data => {
          if (data?.list) {
            const today = new Date().toDateString();
            const seenDates = new Set([today]);
            const dailyForecasts = [];

            for (const d of data.list) {
              const entryDate = new Date(d.dt * 1000);
              const dateStr = entryDate.toDateString();
              const hour = entryDate.getHours();

              if (!seenDates.has(dateStr) && (hour >= 11 && hour <= 15)) {
                seenDates.add(dateStr);
                dailyForecasts.push({
                  date: entryDate.toLocaleDateString("hi-IN", { weekday: "short", day: "numeric" }),
                  temp: Math.round(d.main.temp),
                  desc: d.weather[0].description,
                  id: d.weather[0].id
                });
              }
              if (dailyForecasts.length === 3) break;
            }
            setForecast(dailyForecasts);
          }
        }).catch(() => {});
    }
  }, [shehar, screen]);


const handlePhoneSubmit = async () => {
  setError("");
  if (phone.length !== 10) { setError("10 digit number daalo!"); return; }
  setDbLoading(true);
  try {
    const result = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
    setConfirmationResult(result);
    setScreen("otp");
  } catch (e) {
  console.error("Firebase OTP Error:", e);
  setError("OTP bhejne mein dikkat aayi: " + e.code);
}
  setDbLoading(false);
};

  const handleOtpSubmit = async () => {
    setError("");
    if (otp.length !== 6) { setError("6 digit OTP daalo!"); return; }
    setDbLoading(true);
    try {
      await confirmationResult.confirm(otp);
      localStorage.setItem("kisan_phone", phone);
      const snap = await getDoc(doc(db, "kisans", phone));
      if (snap.exists()) {
        const data = snap.data();
        setKisanNaam(data.naam || "");
        setShehar(data.shehar || "");
        setFasal(data.fasal || "");
        setBeejDate(data.beejDate || "");
        setUserPoints(data.points || 0);
        setUserStreak(data.streak || 0);
        if (data.fasal && data.beejDate) setScreen("main");
        else setScreen("fasal");
      } else {
        await setDoc(doc(db, "kisans", phone), { phone, naam: "", shehar: "", fasal: "", beejDate: "", points: 0, streak: 0 });
        setScreen("fasal");
      }
    } catch {
      setError("Galat OTP! Dobara try karo");
    }
    setDbLoading(false);
  };

  const saveData = async (extra = {}) => {
    if (!phone) return;
    try { await setDoc(doc(db, "kisans", phone), { phone, naam: kisanNaam, shehar, fasal, beejDate, ...extra }, { merge: true }); }
    catch (e) { console.log(e); }
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
      return { stage: "✂️ Harvesting Stage", advice: "Gehun taiyaar" };
    }
    if (fasal === "🟡 Sarso (Mustard)") {
      if (din <= 20) return { stage: "🌱 Jamav Stage", advice: "Halka paani do" };
      if (din <= 45) return { stage: "🌿 Growth Stage", advice: "Urea aur keeton ki dawai" };
      if (din <= 75) return { stage: "🌸 Phool Stage", advice: "Koi spray mat karo" };
      return { stage: "✂️ Harvesting Stage", advice: "Sarso katne ka samay!" };
    }
    if (fasal === "🍬 Ganna (Sugarcane)") {
      if (din <= 30) return { stage: "🌱 Jamav Stage", advice: "Halka paani do" };
      if (din <= 90) return { stage: "🌿 Growth Stage", advice: "Urea — zameen ka size batao" };
      if (din <= 180) return { stage: "🎋 Bhadai Stage", advice: "Potash daalo" };
      if (din <= 270) return { stage: "🍬 Ripening Stage", advice: "Paani kam karo" };
      return { stage: "✂️ Harvesting Stage", advice: "Mill se contact karo" };
    }
    return { stage: "Stage pata nahi", advice: "Sahi fasal chunein" };
  };

  const { stage, advice } = getStage();

  const getWeatherIcon = (id) => {
    if (!id) return "🌤️";
    if (id < 300) return "⛈️"; if (id < 500) return "🌦️"; if (id < 600) return "🌧️";
    if (id < 700) return "❄️"; if (id < 800) return "🌫️"; if (id === 800) return "☀️"; return "⛅";
  };

  const getWeatherAlert = () => {
    if (!weather) return null;
    if (weather.id >= 200 && weather.id < 600) {
      if (stage.includes("Harvesting")) return "🚨 Baarish aa rahi hai! Aaj hi fasal kaatne ki koshish karein!";
      if (stage.includes("Flowering")) return "⚠️ Baarish mein fungicide spray band karein!";
      return "💧 Baarish ho rahi hai — aaj paani mat do!";
    }
    if (weather.temp > 42) return "🌡️ Bahut garmi — subah ya shaam paani do, dopahar nahi!";
    if (weather.wind > 10) return "💨 Tej hawa — aaj spray karna rokein!";
    return null;
  };

  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 19;
  const isRain = weather && weather.id >= 200 && weather.id < 600;
  const windSpeed = weather?.wind || 0;
  const alert = getWeatherAlert();

  const sendMessage = async (text) => {
    if (!text || typeof text !== "string" || !text.trim()) return;
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs); setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", max_tokens: 200,
          messages: [
            { role: "system", content: `Tu ek experienced Indian agriculture expert hai. Kisan ka naam: ${kisanNaam || "Kisan"}, Fasal: ${fasal}, Stage: ${stage}, Din: ${din}. Mausam: ${weather ? `${weather.temp}°C, ${weather.description}` : "N/A"}.

${getFullKnowledgeBase()}

Rules: Hindi mein, 2-3 lines mein, aasan bhasha, zameen ka size poochhe bina matra mat batao. Upar diye gaye local terms aur units ka istemal samajhne ke liye karo.` },
            ...newMsgs.slice(-10)
          ]
        })
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      const jawab = data?.choices?.[0]?.message?.content;
      if (!jawab) throw new Error("No response");
      const updated = [...newMsgs, { role: "assistant", content: jawab }];
      setMessages(updated);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  const sendImageMessage = async (base64Image, userQuestion = "") => {
    const newMsgs = [...messages, { role: "user", content: userQuestion || "Photo bheji", image: base64Image }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const promptText = userQuestion
        ? `Tu ek experienced Indian agriculture expert hai. Is photo ko dekho — yeh fasal, patta, keeda, ya dawai/khad ki packet kuch bhi ho sakti hai. User ka sawaal hai: "${userQuestion}". Photo ke context mein iska jawab do — Hindi mein, 3-4 lines mein, aasan bhasha mein.`
        : `Tu ek experienced Indian agriculture expert hai. Is photo ko pehle pehchano ki yeh kya hai:
1) Agar yeh FASAL/PATTA hai — bimari ya nutrient deficiency batao, kaaran batao, treatment batao.
2) Agar yeh DAWAI/KHAD ki packet/bottle hai — uska naam, active ingredient, kis cheez ke liye use hoti hai, aur sahi matra/dosage batao per acre.
3) Agar dono mein se kuch nahi samajh aaye, to bolo dobara saaf photo bhejo.
Hindi mein, 3-4 lines mein, aasan bhasha mein jawab do.`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}` },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          max_tokens: 350,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: promptText },
                { type: "image_url", image_url: { url: base64Image } }
              ]
            }
          ]
        })
      });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      const jawab = data?.choices?.[0]?.message?.content;
      if (!jawab) throw new Error("No response");
      const updated = [...newMsgs, { role: "assistant", content: jawab }];
      setMessages(updated);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Photo samajhne mein dikkat aayi — dobara saaf photo bhejo!" }]);
    }
    setLoading(false);
  };

  const handleOpenChat = (initMsg = "") => {
    setPage("chat");
    if (initMsg && typeof initMsg === "string" && initMsg.trim()) {
      setTimeout(() => sendMessage(initMsg), 300);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kisan_phone");
    setScreen("phone"); setPhone(""); setKisanNaam("");
    setShehar(""); setFasal(""); setBeejDate(""); setMessages([]);
    setUserPoints(0); setUserStreak(0); setPage("main");
  };

  const authStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0f0c", padding: 20, textAlign: "center" };
  const inputStyle = { width: "85%", padding: "11px 15px", borderRadius: 10, border: "1px solid rgba(120,220,150,0.25)", background: "rgba(120,220,150,0.07)", color: "#fff", fontSize: 14, margin: "7px 0", outline: "none" };
  const btnStyle = { background: "#1eb464", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" };

  if (page === "chat") return <ChatPage messages={messages} loading={loading} onSend={sendMessage} onSendImage={sendImageMessage} onBack={() => setPage("main")} kisanNaam={kisanNaam || "Kisan"} />;
  if (page === "khata") return <KhataPage phone={phone} onBack={() => setPage("main")} />;
  if (page === "mandi") return <MandiBhavPage onBack={() => setPage("main")} />;
  if (page === "quiz") return <QuizPage onBack={() => setPage("main")} db={db} phone={phone} kisanNaam={kisanNaam || "Kisan"} fasal={fasal} />;
  if (page === "yojna") return <YojnaPage onBack={() => setPage("main")} />;
  if (page === "weather") return <WeatherPage onBack={() => setPage("main")} weather={weather} forecast={forecast} getWeatherIcon={getWeatherIcon} shehar={shehar} />;
  if (page === "profile") return <ProfilePage onBack={() => setPage("main")} kisanNaam={kisanNaam || "Kisan"} phone={phone} shehar={shehar} fasal={fasal} beejDate={beejDate} points={userPoints} streak={userStreak} onLogout={handleLogout} onChangeFasal={() => { setPage("main"); setScreen("fasal"); }} />;
  if (page === "community") return <CommunityPage onBack={() => setPage("main")} db={db} kisanNaam={kisanNaam || "Kisan"} phone={phone} />;

  if (screen === "splash" || (dbLoading && !kisanNaam)) return (
    <motion.div style={authStyle} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }} style={{ fontSize: 80 }}>🌾</motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#7dffaa" }}>Kisan Saathi</motion.h1>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "rgba(255,255,255,0.7)" }}>Hanuman Khad Bhandar</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ color: "rgba(100,180,255,0.6)" }}>Vill. Hatt (Safidon), Jind</motion.p>
      <div style={{ width: 200, height: 3, background: "rgba(100,180,255,0.1)", borderRadius: 2, margin: "15px auto 0" }}>
        <motion.div style={{ height: 3, background: "#1e90ff", borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.1, duration: 1.2 }} />
      </div>
    </motion.div>
  );

  if (screen === "phone") return (
    <motion.div style={authStyle} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}>
      <div style={{ fontSize: 60 }}>📱</div>
      <h2 style={{ color: "#7dffaa" }}>Namaste!</h2>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Apna mobile number daalo</p>
      <input style={inputStyle} placeholder="10 digit mobile number" value={phone} maxLength={10} type="tel"
        onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()} />
      {error && <p style={{ color: "#ff6666", fontSize: 12 }}>{error}</p>}
      {dbLoading ? <div style={{ color: "#7dffaa", marginTop: 12 }}>⏳ Loading...</div> :
        <motion.button whileTap={{ scale: 0.95 }} style={btnStyle} onClick={handlePhoneSubmit}>✅ Aage Badho</motion.button>}
      <div id="recaptcha-container"></div>
    </motion.div>
  );

  if (screen === "otp") return (
    <motion.div style={authStyle} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}>
      <div style={{ fontSize: 50 }}>🔐</div>
      <h3 style={{ color: "#7dffaa" }}>OTP Daalein</h3>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>+91{phone} par bheja gaya hai</p>
      <input style={inputStyle} placeholder="6 digit OTP" value={otp} maxLength={6} type="tel"
        onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && handleOtpSubmit()} />
      {error && <p style={{ color: "#ff6666", fontSize: 12 }}>{error}</p>}
      {dbLoading ? <div style={{ color: "#7dffaa" }}>⏳ Verify ho raha hai...</div> :
        <motion.button whileTap={{ scale: 0.95 }} style={btnStyle} onClick={handleOtpSubmit}>✅ Verify Karo</motion.button>}
      <button onClick={() => { setScreen("phone"); setOtp(""); setError(""); }}
        style={{ background: "none", border: "none", color: "#7dffaa", marginTop: 10, cursor: "pointer", fontSize: 13 }}>← Number Badlein</button>
    </motion.div>
  );

  if (screen === "fasal") return (
    <motion.div style={authStyle} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}>
      <div style={{ fontSize: 50 }}>🌾</div>
      <h3 style={{ color: "#7dffaa" }}>Namaste!</h3>
      <input style={inputStyle} placeholder="Apna naam likhein (optional)" value={kisanNaam} onChange={e => setKisanNaam(e.target.value)} />
      <select style={{ ...inputStyle, appearance: "none" }} value={fasal} onChange={e => setFasal(e.target.value)}>
        <option value="" style={{ background: "#0a0f0c" }}>-- Fasal chunein --</option>
        {["🌾 Chawal (Rice)","🌿 Gehun (Wheat)","🟡 Sarso (Mustard)","🍬 Ganna (Sugarcane)"].map(f => <option key={f} style={{ background: "#0a0f0c" }}>{f}</option>)}
      </select>
      <input style={inputStyle} type="date" value={beejDate} max={new Date().toISOString().split("T")[0]} onChange={e => setBeejDate(e.target.value)} />
      {error && <p style={{ color: "#ff6666", fontSize: 12 }}>{error}</p>}
      <motion.button whileTap={{ scale: 0.95 }} style={btnStyle} onClick={async () => {
        if (!fasal || !beejDate) { setError("Fasal aur beej ki tarikh dono bharo!"); return; }
        setDbLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            try {
              const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`);
              const data = await res.json();
              const cityName = data?.[0]?.name || "Aapka Sheher";
              setShehar(cityName);
              const initMsgs = [{ role: "assistant", content: `Namaste ${kisanNaam || "Kisan"} ji! 🙏 Aapki ${fasal} fasal ka track shuru ho gaya!` }];
              setMessages(initMsgs);
              await saveData({ naam: kisanNaam, fasal, beejDate, shehar: cityName });
              setDbLoading(false);
              setScreen("main");
            } catch {
              setDbLoading(false);
              setError("Location fetch nahi hui, dobara try karo");
            }
          },
          async () => {
            const initMsgs = [{ role: "assistant", content: `Namaste ${kisanNaam || "Kisan"} ji! 🙏` }];
            setMessages(initMsgs);
            await saveData({ naam: kisanNaam, fasal, beejDate, shehar: "Safidon" });
            setDbLoading(false);
            setScreen("main");
          }
        );
      }}>{dbLoading ? "⏳ Location le rahe hain..." : "📍 Location Allow Karke Shuru Karein"}</motion.button>
    </motion.div>
  );

  if (showBg) return (
    <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", background: "#87CEEB", overflow: "hidden" }}
      onClick={() => setShowBg(false)}>
      <FasalBackground din={din} windSpeed={windSpeed} isRain={isRain} isNight={isNight} fasal={fasal} />
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", zIndex: 10 }}>
        <div style={{ background: "rgba(0,0,0,0.5)", color: "white", padding: "8px 16px", borderRadius: 20, display: "inline-block", fontSize: 12 }}>
          👆 Tap karke wapas jao
        </div>
      </div>
    </div>
  );

  return (
    <HomePage
      db={db}
      phone={phone}
      kisanNaam={kisanNaam || "Kisan"}
      shehar={shehar}
      fasal={fasal}
      beejDate={beejDate}
      weather={weather}
      forecast={forecast}
      stage={stage}
      advice={advice}
      din={din}
      alert={alert}
      getWeatherIcon={getWeatherIcon}
      onOpenChat={handleOpenChat}
      onOpenQuiz={() => setPage("quiz")}
      onOpenYojna={() => setPage("yojna")}
      onOpenWeather={() => setPage("weather")}
      onOpenProfile={() => setPage("profile")}
      onOpenKhata={() => setPage("khata")}
      onOpenMandi={() => setPage("mandi")}
      onOpenCommunity={() => setPage("community")}
      onOpenBg={() => setShowBg(true)}
      isNight={isNight}
      isRain={isRain}
    />
  );
}

export default App;