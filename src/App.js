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

// ===== REALISTIC FARM SVG =====
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
        {/* Multiple stems for tiller effect */}
        <line x1={x - 2} y1={baseY} x2={x - 3} y2={baseY - h * 0.92} stroke={pc} strokeWidth="1.4" />
        <line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke={pc} strokeWidth="1.8" />
        <line x1={x + 2} y1={baseY} x2={x + 3} y2={baseY - h * 0.88} stroke={pc} strokeWidth="1.4" />
        {/* Leaves — curved like real rice */}
        <path d={`M${x},${baseY - h * 0.25} C${x - lf * 1.4},${baseY - h * 0.32} ${x - lf * 1.8},${baseY - h * 0.18} ${x - lf * 2},${baseY - h * 0.08}`} stroke={lc} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d={`M${x},${baseY - h * 0.45} C${x + lf * 1.3},${baseY - h * 0.52} ${x + lf * 1.7},${baseY - h * 0.38} ${x + lf * 1.9},${baseY - h * 0.28}`} stroke={lc} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d={`M${x},${baseY - h * 0.62} C${x - lf * 1.1},${baseY - h * 0.7} ${x - lf * 1.5},${baseY - h * 0.56} ${x - lf * 1.7},${baseY - h * 0.46}`} stroke={lc} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {din > 45 && <path d={`M${x},${baseY - h * 0.78} C${x + lf},${baseY - h * 0.86} ${x + lf * 1.3},${baseY - h * 0.72} ${x + lf * 1.5},${baseY - h * 0.62}`} stroke={lc} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
        {din > 60 && <path d={`M${x - 2},${baseY - h * 0.12} C${x - lf * 0.9},${baseY - h * 0.18} ${x - lf * 1.2},${baseY - h * 0.06} ${x - lf * 1.4},${baseY}`} stroke={lc} strokeWidth="1.3" fill="none" strokeLinecap="round" />}
        {/* Bali */}
        {hasEar && <>
          <path d={`M${x},${baseY - h} Q${x + 10},${baseY - h - 16} ${x + 7},${baseY - h - 30}`} stroke={isGolden ? "#c8a030" : "#4a8a4a"} strokeWidth="1.8" fill="none" />
          {[0,1,2,3,4,5].map(gi => <>
            <ellipse key={`l${gi}`} cx={x + 4 + gi * 0.5} cy={baseY - h - 6 - gi * 4} rx="2.4" ry="1.2" fill={isGolden ? "#d4a020" : "#5a9a5a"} transform={`rotate(${-40 + gi * 7}, ${x + 4 + gi * 0.5}, ${baseY - h - 6 - gi * 4})`} />
            <ellipse key={`r${gi}`} cx={x + 9 - gi * 0.3} cy={baseY - h - 8 - gi * 4} rx="2" ry="1.1" fill={isGolden ? "#b89018" : "#4a8a4a"} transform={`rotate(${-20 + gi * 5}, ${x + 9 - gi * 0.3}, ${baseY - h - 8 - gi * 4})`} />
          </>)}
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

      {/* Sky */}
      <rect x="0" y="0" width="480" height="220" fill="url(#sg)" />

      {/* Sun */}
      {!isNight && !isRain && <>
        <circle cx={sunX} cy={sunY} r="50" fill="#fff7a0" opacity="0.2" />
        <circle cx={sunX} cy={sunY} r="28" fill="#fef08a" opacity="0.8" />
        <circle cx={sunX} cy={sunY} r="20" fill="#fde047" />
      </>}

      {/* Moon */}
      {isNight && <>
        <circle cx="385" cy="36" r="22" fill="#dde6f0" opacity="0.9" />
        <circle cx="395" cy="30" r="17" fill={sky.top} opacity="0.95" />
        <circle cx="378" cy="42" r="3" fill="#c0ccd8" opacity="0.35" />
      </>}

      {/* Stars */}
      {isNight && [[40,18],[88,30],[142,12],[196,36],[250,16],[298,30],[348,13],[418,26],[62,50],[174,56],[326,46],[456,16],[122,40],[274,60],[406,50],[20,32],[460,40],[310,68]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={0.8 + (i%3) * 0.5} fill="white" opacity={0.5 + (i%4) * 0.12} />
      ))}

      {/* Clouds */}
      {!isNight && <g opacity={isRain ? 0.85 : 0.6}>
        <ellipse cx="105" cy="46" rx="50" ry="19" fill={isRain ? "#4a5a6a" : "white"} />
        <ellipse cx="82" cy="53" rx="33" ry="15" fill={isRain ? "#4a5a6a" : "white"} />
        <ellipse cx="135" cy="53" rx="36" ry="15" fill={isRain ? "#4a5a6a" : "white"} />
        <ellipse cx="338" cy="36" rx="58" ry="21" fill={isRain ? "#3a4a5a" : "white"} />
        <ellipse cx="308" cy="44" rx="38" ry="16" fill={isRain ? "#3a4a5a" : "white"} />
        <ellipse cx="370" cy="44" rx="40" ry="16" fill={isRain ? "#3a4a5a" : "white"} />
      </g>}

      {/* Rain clouds */}
      {isRain && <g opacity="0.78">
        <ellipse cx="240" cy="62" rx="72" ry="25" fill="#2a3a4a" />
        <ellipse cx="192" cy="70" rx="50" ry="20" fill="#2a3a4a" />
        <ellipse cx="290" cy="70" rx="54" ry="20" fill="#2a3a4a" />
      </g>}

      {/* Distant hills */}
      <path d="M0,188 Q60,162 120,175 Q180,162 240,178 Q300,165 360,178 Q420,163 480,178 L480,200 L0,200Z" fill="#1a3a1a" opacity="0.6" />
      <path d="M0,195 Q80,178 160,188 Q240,178 320,190 Q400,178 480,188 L480,205 L0,205Z" fill="#1e4a1e" opacity="0.5" />

      {/* Realistic trees on horizon */}
      {[[52,162,18,28],[118,168,14,22],[228,165,20,30],[318,168,16,24],[408,164,18,26],[460,170,12,20]].map(([tx,ty,tw,th],i) => (
        <g key={i} opacity={0.55 + (i%2)*0.1} filter="url(#blur)">
          <rect x={tx-2} y={ty} width="4" height={ty > 165 ? 28 : 32} fill="#1a2a1a" />
          {/* Tree shape — layered ellipses */}
          <ellipse cx={tx} cy={ty - 2} rx={tw * 0.6} ry={th * 0.45} fill="#1a3a1a" />
          <ellipse cx={tx} cy={ty - 8} rx={tw * 0.75} ry={th * 0.5} fill="#1e4a1e" />
          <ellipse cx={tx} cy={ty - 16} rx={tw * 0.65} ry={th * 0.45} fill="#2a5a2a" />
          <ellipse cx={tx} cy={ty - 22} rx={tw * 0.45} ry={th * 0.35} fill="#2a5a2a" />
          <ellipse cx={tx} cy={ty - 27} rx={tw * 0.28} ry={th * 0.22} fill="#3a6a3a" />
        </g>
      ))}

      {/* Ground */}
      <rect x="0" y="198" width="480" height="102" fill="url(#gg)" />
      <rect x="0" y="235" width="480" height="65" fill="url(#soil)" />

      {/* Water for rice */}
      {(fasal === "🌾 Chawal (Rice)" || !fasal) && din > 8 && <>
        <rect x="0" y="225" width="480" height="12" fill="url(#wg)" />
        {[50,130,220,310,400].map((wx,i) => (
          <ellipse key={i} cx={wx} cy="231" rx="28" ry="1.8" fill="white" opacity="0.1" />
        ))}
      </>}

      {/* Field rows */}
      {[0,1,2,3].map(r => (
        <line key={r} x1="0" y1={230 + r*6} x2="480" y2={230 + r*6} stroke="#3a6a3a" strokeWidth="0.4" opacity="0.3" />
      ))}

      {/* Plants */}
      {[...Array(cols)].map((_, i) => {
        const x = 15 + i * (450 / cols);
        return <Plant key={i} x={x} i={i} />;
      })}

      {/* Rain drops */}
      {isRain && [...Array(50)].map((_, i) => (
        <g key={i}>
          <animateTransform attributeName="transform" type="translate"
            values={`${(i * 9.8) % 480} -15; ${((i * 9.8) + 20) % 480} 308`}
            dur={`${0.48 + (i%6)*0.065}s`} begin={`${(i%20)*0.065}s`} repeatCount="indefinite" />
          <line x1="0" y1="0" x2="-4" y2="14" stroke="rgba(160,210,255,0.7)" strokeWidth="1.2" />
        </g>
      ))}

      {/* Ground shadow */}
      <rect x="0" y="292" width="480" height="8" fill="rgba(0,0,0,0.2)" />
    </svg>
  );
}

// ===== KHATA PAGE =====
function KhataPage({ phone, pin, onBack }) {
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
    const entry = {
      id: Date.now(),
      category,
      amount: parseInt(amount),
      type,
      date: new Date().toLocaleDateString("hi-IN")
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    setAmount("");
    await setDoc(doc(db, "kisans", phone), { khata: updated }, { merge: true });
  };

  const totalKharcha = entries.filter(e => e.type === "kharcha").reduce((s, e) => s + e.amount, 0);
  const totalKamai = entries.filter(e => e.type === "kamai").reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#8B6914", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>📒 Kisan Khata</span>
      </div>

      {/* Summary */}
      <div style={{ display: "flex", gap: 8, padding: "10px 10px 0" }}>
        <div style={{ flex: 1, background: "#fff8e1", borderRadius: 12, padding: 10, border: "1px solid #c8a96e", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#8B6914" }}>Total Kharcha</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#c0392b" }}>₹{totalKharcha.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, background: "#fff8e1", borderRadius: 12, padding: 10, border: "1px solid #c8a96e", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#8B6914" }}>Total Kamai</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#2d8a2d" }}>₹{totalKamai.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, background: "#fff8e1", borderRadius: 12, padding: 10, border: "1px solid #c8a96e", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#8B6914" }}>Net</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: totalKamai - totalKharcha >= 0 ? "#2d8a2d" : "#c0392b" }}>₹{(totalKamai - totalKharcha).toLocaleString()}</div>
        </div>
      </div>

      {/* Entries */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {loading ? <div style={{ textAlign: "center", padding: 20, color: "#8B6914" }}>⏳ Loading...</div> :
          entries.length === 0 ? <div style={{ textAlign: "center", padding: 30, color: "#a07030" }}>Abhi koi entry nahi hai</div> :
          entries.map(e => (
            <div key={e.id} style={{ background: "#fff8e1", borderRadius: 12, padding: "10px 14px", margin: "6px 0", border: `1px solid ${e.type === "kharcha" ? "#e74c3c" : "#2d8a2d"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#5a3e10", fontSize: 14 }}>{e.category}</div>
                <div style={{ fontSize: 11, color: "#a07030" }}>{e.date}</div>
              </div>
              <div style={{ fontWeight: "bold", fontSize: 16, color: e.type === "kharcha" ? "#c0392b" : "#2d8a2d" }}>
                {e.type === "kharcha" ? "-" : "+"}₹{e.amount.toLocaleString()}
              </div>
            </div>
          ))
        }
      </div>

      {/* Input */}
      <div style={{ background: "#fff8e1", borderTop: "2px solid #c8a96e", padding: 10 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <button onClick={() => setType("kharcha")}
            style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: type === "kharcha" ? "#c0392b" : "#e0d0b0", color: type === "kharcha" ? "white" : "#5a3e10", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>
            − Kharcha
          </button>
          <button onClick={() => setType("kamai")}
            style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: type === "kamai" ? "#2d8a2d" : "#e0d0b0", color: type === "kamai" ? "white" : "#5a3e10", fontWeight: "bold", cursor: "pointer", fontSize: 13 }}>
            + Kamai
          </button>
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 13, marginBottom: 8, outline: "none" }}>
          <option>Dawaai</option>
          <option>Beej</option>
          <option>Khad/Urea</option>
          <option>Mazdoori</option>
          <option>Tractor</option>
          <option>Udhar liya</option>
          <option>Udhar diya</option>
          <option>Mandi se kamai</option>
          <option>Bijli bill</option>
          <option>Kuch aur</option>
        </select>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="Amount ₹" type="number"
            style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 13, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && addEntry()} />
          <button onClick={addEntry}
            style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MANDI BHAV PAGE =====
function MandiBhavPage({ onBack }) {
  const [location, setLocation] = useState("");
  const [bhav, setBhav] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getMandiBhav = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.REACT_APP_MANDI_KEY}&format=json&filters[District]=${location}&limit=20`
      );
      const data = await res.json();
      if (data.records && data.records.length > 0) {
        setBhav(data.records);
      } else {
        setBhav([]);
      }
    } catch {
      setBhav([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#8B6914", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>📊 Mandi Bhav</span>
      </div>

      <div style={{ padding: "12px 10px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="Mandi ka naam likhein (jaise: Jind, Hisar)"
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 13, outline: "none" }}
            onKeyDown={e => e.key === "Enter" && getMandiBhav()} />
          <button onClick={getMandiBhav}
            style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: "bold", cursor: "pointer" }}>
            🔍
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px" }}>
        {loading && <div style={{ textAlign: "center", padding: 30, color: "#8B6914" }}>⏳ Bhav dhundh raha hoon...</div>}

        {!loading && searched && bhav.length === 0 && (
          <div style={{ textAlign: "center", padding: 30, color: "#a07030" }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>😕</div>
            Is mandi ka bhav nahi mila — doosra naam try karein
          </div>
        )}

        {bhav.map((b, i) => (
          <div key={i} style={{ background: "#fff8e1", borderRadius: 12, padding: "10px 14px", margin: "6px 0", border: "1px solid #c8a96e" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: "bold", color: "#5a3e10", fontSize: 14 }}>{b.commodity}</div>
                <div style={{ fontSize: 11, color: "#a07030" }}>📍 {b.market} | {b.arrival_date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", color: "#2d8a2d", fontSize: 15 }}>₹{b.modal_price}/q</div>
                <div style={{ fontSize: 10, color: "#a07030" }}>Min: ₹{b.min_price} Max: ₹{b.max_price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 12px", background: "#fff8e1", borderTop: "1px solid #c8a96e" }}>
        <div style={{ fontSize: 10, color: "#a07030", textAlign: "center" }}>
          ⚠️ Disclaimer: Mandi bhav thoda upar neeche ho sakta hai — yeh sirf ek estimate hai. Mandi jaane se pehle khud confirm karein.
        </div>
      </div>
    </div>
  );
}

// ===== CHAT PAGE =====
function ChatPage({ messages, loading, onSend, onBack, kisanNaam }) {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoice = () => {
    if (recording) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setRecording(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Chrome use karo!"); return; }
    const r = new SR();
    r.lang = "hi-IN";
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setRecording(true);
    r.onresult = e => { setInput(e.results[0][0].transcript); setRecording(false); recognitionRef.current = null; };
    r.onerror = r.onend = () => { setRecording(false); recognitionRef.current = null; };
    recognitionRef.current = r;
    r.start();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#8B6914", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>🤖 Kisan Saathi AI</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 30, color: "#a07030" }}>
            <div style={{ fontSize: 40 }}>🌾</div>
            <div style={{ fontSize: 14 }}>Namaste {kisanNaam} ji! Koi bhi sawaal poochho!</div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={msg.role === "user" ? {
                background: "#8B6914", color: "white", padding: "9px 13px",
                borderRadius: "16px 16px 4px 16px", margin: "5px 0",
                maxWidth: "78%", marginLeft: "auto", fontSize: 13
              } : {
                background: "rgba(255,248,225,0.98)", color: "#3a2a0a",
                padding: "9px 13px", borderRadius: "16px 16px 16px 4px",
                margin: "5px 0", maxWidth: "78%", fontSize: 13,
                border: "1px solid #c8a96e"
              }}>
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}
            style={{ background: "rgba(255,248,225,0.98)", color: "#3a2a0a", padding: "9px 13px", borderRadius: "16px 16px 16px 4px", margin: "5px 0", maxWidth: "78%", fontSize: 13, border: "1px solid #c8a96e" }}>
            Soch raha hoon... ⏳
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {showCamera && (
        <div style={{ background: "#fff8e1", padding: 10, margin: "0 10px 8px", borderRadius: 14, border: "2px dashed #2d8a2d", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#5a3e10", margin: "0 0 6px" }}>📸 Fasal ki photo lo!</p>
          <input type="file" accept="image/*" capture="environment" onChange={() => { setShowCamera(false); }} />
          <button onClick={() => setShowCamera(false)} style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, marginTop: 6 }}>✕ Band Karo</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", padding: "7px 8px", background: "rgba(255,248,225,0.97)", borderTop: "2px solid #c8a96e", gap: 5 }}>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => setShowCamera(!showCamera)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4 }}>📷</motion.button>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && (onSend(input), setInput(""))}
          placeholder={recording ? "Bol rahe ho... 🎤" : "Sawaal likhein..."}
          style={{ flex: 1, padding: "8px 12px", borderRadius: 25, border: "2px solid #c8a96e", background: "#f5f0e8", fontSize: 13, outline: "none" }} />
        <motion.button whileTap={{ scale: 0.8 }} onClick={handleVoice} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 4, color: recording ? "red" : "inherit" }}>
          {recording ? "🔴" : "🎤"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => { if (!loading && input.trim()) { onSend(input); setInput(""); } }}
          style={{ background: "#8B6914", color: "white", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 15, cursor: "pointer" }}>➤</motion.button>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
function App() {
  const [screen, setScreen] = useState("splash");
  const [page, setPage] = useState("main"); // main, chat, khata, mandi
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
  const [loading, setLoading] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Auto login
  useEffect(() => {
    const savedPhone = localStorage.getItem("kisan_phone");
    const savedPin = localStorage.getItem("kisan_pin");
    if (savedPhone && savedPin) {
      setPhone(savedPhone);
      setPin(savedPin);
      setDbLoading(true);
      getDoc(doc(db, "kisans", savedPhone)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.pin === savedPin) {
            setKisanNaam(data.naam || "");
            setShehar(data.shehar || "");
            setFasal(data.fasal || "");
            setBeejDate(data.beejDate || "");
            setMessages(data.messages || []);
            if (data.fasal && data.beejDate) setScreen("main");
            else setScreen("naam");
          }
        }
        setDbLoading(false);
      }).catch(() => setDbLoading(false));
    } else {
      setTimeout(() => setScreen("phone"), 2500);
    }
  }, []);

  // Weather + forecast
  useEffect(() => {
    if (shehar && screen === "main") {
      const city = shehar.split(",")[0].trim();
      // Current weather
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi`)
        .then(r => r.json()).then(data => {
          if (data?.main) setWeather({ temp: Math.round(data.main.temp), humidity: data.main.humidity, description: data.weather[0].description, id: data.weather[0].id, wind: Math.round(data.wind.speed), city: data.name });
        }).catch(() => {});
      // 3-day forecast
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric&lang=hi&cnt=4`)
        .then(r => r.json()).then(data => {
          if (data?.list) {
            const days = data.list.slice(1, 4).map(d => ({
              date: new Date(d.dt * 1000).toLocaleDateString("hi-IN", { weekday: "short", day: "numeric" }),
              temp: Math.round(d.main.temp),
              desc: d.weather[0].description,
              id: d.weather[0].id
            }));
            setForecast(days);
          }
        }).catch(() => {});
    }
  }, [shehar, screen]);

  const fetchSuggestions = async (val) => {
    if (val.length < 2) { setSheharSuggestions([]); return; }
    try {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${val},IN&limit=5&appid=${process.env.REACT_APP_WEATHER_KEY}`);
      const data = await res.json();
      if (Array.isArray(data)) setSheharSuggestions([...new Set(data.map(d => `${d.name}${d.state ? ", " + d.state : ""}`))]);
    } catch { setSheharSuggestions([]); }
  };

  const handlePhoneSubmit = async () => {
    setError("");
    if (phone.length !== 10) { setError("10 digit number daalo!"); return; }
    setDbLoading(true);
    try {
      const snap = await getDoc(doc(db, "kisans", phone));
      if (snap.exists()) {
        const data = snap.data();
        setIsNewUser(false);
        setKisanNaam(data.naam || ""); setShehar(data.shehar || "");
        setFasal(data.fasal || ""); setBeejDate(data.beejDate || "");
        setMessages(data.messages || []);
      } else setIsNewUser(true);
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
        await setDoc(doc(db, "kisans", phone), { phone, pin, naam: "", shehar: "", fasal: "", beejDate: "", messages: [], khata: [] });
        setScreen("naam");
      } else {
        const snap = await getDoc(doc(db, "kisans", phone));
        if (snap.data()?.pin !== pin) { setError("Galat PIN!"); setDbLoading(false); return; }
        localStorage.setItem("kisan_phone", phone);
        localStorage.setItem("kisan_pin", pin);
        if (fasal && beejDate) {
          if (messages.length === 0) setMessages([{ role: "assistant", content: `Namaste ${kisanNaam} ji! 🙏 Wapas aaye!` }]);
          setScreen("main");
        } else setScreen("naam");
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
      if (din <= 30) return { stage: "🌱 Jamav Stage", advice: "Halka paani do" };
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
    if (id < 300) return "⛈️"; if (id < 500) return "🌦️"; if (id < 600) return "🌧️";
    if (id < 700) return "❄️"; if (id < 800) return "🌫️"; if (id === 800) return "☀️"; return "⛅";
  };

  const getWeatherAlert = () => {
    if (!weather) return null;
    if (weather.id >= 200 && weather.id < 600) {
      if (stage.includes("Harvesting")) return "🚨 Baarish aa rahi hai! Aaj hi fasal kaatne ki koshish karein!";
      if (stage.includes("Flowering")) return "⚠️ Baarish mein fungicide spray band karein!";
      return "💧 Baarish ho rahi hai — aaj paani mat do khet mein!";
    }
    if (weather.temp > 42) return "🌡️ Bahut garmi — subah ya shaam paani do, dopahar nahi!";
    if (weather.wind > 10) return "💨 Tej hawa — aaj spray karna rokein!";
    return null;
  };

  const alert = getWeatherAlert();
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 19;
  const isRain = weather && weather.id >= 200 && weather.id < 600;
  const windSpeed = weather?.wind || 0;

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMsgs = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.REACT_APP_GROQ_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", max_tokens: 150,
          messages: [
            { role: "system", content: `Tu ek experienced Indian agriculture expert hai.
Kisan ka naam: ${kisanNaam}, Fasal: ${fasal}, Stage: ${stage}, Din: ${din}
Mausam: ${weather ? `${weather.temp}°C, ${weather.description}` : "N/A"}
Rules: Hindi mein, 2-3 lines mein, aasan bhasha, zameen ka size poochhe bina matra mat batao, Nursery mein sirf paani aur Zinc Sulphate, galat advice mat do` },
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
      try { await saveData({ messages: updated }); } catch (e) { }
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Kuch dikkat aayi — dobara try karo!" }]);
    }
    setLoading(false);
  };

  // ===== PAGES =====
  if (page === "chat") return <ChatPage messages={messages} loading={loading} onSend={sendMessage} onBack={() => setPage("main")} kisanNaam={kisanNaam} />;
  if (page === "khata") return <KhataPage phone={phone} pin={pin} onBack={() => setPage("main")} />;
  if (page === "mandi") return <MandiBhavPage onBack={() => setPage("main")} />;

  // ===== SPLASH =====
  if (screen === "splash" || (dbLoading && !kisanNaam)) return (
    <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" }}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }} style={{ fontSize: 80 }}>🌾</motion.div>
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ color: "#8B6914" }}>Kisan Saathi</motion.h1>
      <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ color: "#5a3e10" }}>Hanuman Khad Bhandar</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ color: "#8B6914" }}>Vill. Hatt (Safidon), Jind</motion.p>
      <div style={{ width: 200, height: 4, background: "#e0d0b0", borderRadius: 2, margin: "15px auto 0" }}>
        <motion.div style={{ height: 4, background: "#8B6914", borderRadius: 2 }} initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.1, duration: 1.2 }} />
      </div>
    </motion.div>
  );

  // ===== PHONE =====
  if (screen === "phone") return (
    <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" }}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ fontSize: 60 }}>📱</motion.div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10", fontSize: 14 }}>Apna mobile number daalo</p>
      <p style={{ color: "#8B6914", fontSize: 11 }}>— Ek baar daalo, hamesha yaad rahega —</p>
      <input style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        placeholder="10 digit mobile number" value={phone} maxLength={10} type="tel"
        onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
        onKeyDown={e => e.key === "Enter" && handlePhoneSubmit()} />
      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
      {dbLoading
        ? <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: "#8B6914", marginTop: 12 }}>⏳ Loading...</motion.div>
        : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" }}
            onClick={handlePhoneSubmit}>✅ Aage Badho</motion.button>}
    </motion.div>
  );

  // ===== PIN =====
  if (screen === "pin") return (
    <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" }}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ fontSize: 50 }}>🔐</div>
      <h3 style={{ color: "#8B6914" }}>{isNewUser ? "Naya PIN banao" : `Wapas Aaye, ${kisanNaam || "Dost"} ji!`}</h3>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>{isNewUser ? "4 digit PIN choose karo" : "Apna PIN daalo"}</p>
      <input style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        placeholder="4 digit PIN" value={pin} maxLength={4} type="password"
        onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
        onKeyDown={e => e.key === "Enter" && handlePinSubmit()} />
      {isNewUser && <input style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        placeholder="PIN dobara daalo" value={pinConfirm} maxLength={4} type="password"
        onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ""))} />}
      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
      {dbLoading
        ? <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ color: "#8B6914" }}>⏳ Checking...</motion.div>
        : <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" }}
            onClick={handlePinSubmit}>{isNewUser ? "✅ PIN Set Karo" : "🔓 Login Karo"}</motion.button>}
      <button onClick={() => { setScreen("phone"); setPin(""); setPinConfirm(""); setError(""); }}
        style={{ background: "none", border: "none", color: "#8B6914", marginTop: 10, cursor: "pointer", fontSize: 13 }}>← Wapas Jao</button>
    </motion.div>
  );

  // ===== NAAM =====
  if (screen === "naam") return (
    <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" }}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ fontSize: 60 }}>🙏</div>
      <h2 style={{ color: "#8B6914" }}>Namaste!</h2>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>Thodi si jaankari do</p>
      <input style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        placeholder="Apna naam likhein..." value={kisanNaam} onChange={e => setKisanNaam(e.target.value)} />
      <div style={{ width: "85%", position: "relative" }}>
        <input style={{ width: "100%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none", boxSizing: "border-box" }}
          placeholder="Apna shehar/gaon likhein..." value={shehar}
          onChange={e => { setShehar(e.target.value); fetchSuggestions(e.target.value); }} />
        <AnimatePresence>
          {sheharSuggestions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff8e1", border: "1px solid #c8a96e", borderRadius: 10, zIndex: 100, maxHeight: 140, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              {sheharSuggestions.map((s, i) => (
                <div key={i} style={{ padding: "9px 14px", fontSize: 13, color: "#5a3e10", cursor: "pointer", borderBottom: "1px solid #f0e8d0" }}
                  onClick={() => { setShehar(s.split(",")[0].trim()); setSheharSuggestions([]); }}>📍 {s}</div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" }}
        onClick={async () => {
          if (kisanNaam && shehar) { await saveData({ naam: kisanNaam, shehar }); setScreen("fasal"); }
          else setError("Naam aur shehar dono bharo!");
        }}>✅ Aage Badho</motion.button>
    </motion.div>
  );

  // ===== FASAL =====
  if (screen === "fasal") return (
    <motion.div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f5f0e8", padding: 20, textAlign: "center" }}
      initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <div style={{ fontSize: 50 }}>🌾</div>
      <h3 style={{ color: "#8B6914" }}>Namaste {kisanNaam} ji!</h3>
      <p style={{ color: "#5a3e10", fontSize: 13 }}>Kaunsi fasal uga rahe hain?</p>
      <select style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        value={fasal} onChange={e => setFasal(e.target.value)}>
        <option value="">-- Fasal chunein --</option>
        <option>🌾 Chawal (Rice)</option>
        <option>🌿 Gehun (Wheat)</option>
        <option>🟡 Sarso (Mustard)</option>
        <option>🍬 Ganna (Sugarcane)</option>
      </select>
      <input style={{ width: "85%", padding: "11px 15px", borderRadius: 10, border: "2px solid #c8a96e", background: "#fff8e1", fontSize: 14, margin: "7px 0", outline: "none" }}
        type="date" value={beejDate} max={new Date().toISOString().split("T")[0]} onChange={e => setBeejDate(e.target.value)} />
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 10, width: "85%" }}
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

  // ===== MAIN SCREEN =====
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden", background: "#87CEEB" }}>

      {/* Farm Background */}
      <FasalBackground din={din} windSpeed={windSpeed} isRain={isRain} isNight={isNight} fasal={fasal} />

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(139,105,20,0.92)", padding: "10px 14px", position: "relative", zIndex: 2, backdropFilter: "blur(4px)" }}>
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => { setShowAddress(!showAddress); setShowProfile(false); }} style={{ cursor: "pointer" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>🏪 Tap for address</div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>Hanuman Khad Bhandar</div>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }} onClick={() => { setShowProfile(!showProfile); setShowAddress(false); }} style={{ cursor: "pointer", textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>👤 Tap for profile</div>
          <div style={{ fontSize: 13, fontWeight: "bold", color: "white" }}>{kisanNaam} ji</div>
        </motion.div>
      </div>

      {/* Address Popup */}
      <AnimatePresence>
        {showAddress && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: "absolute", top: 54, left: 8, background: "rgba(255,248,225,0.98)", border: "1px solid #c8a96e", borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", minWidth: 180, zIndex: 10 }}>
            <div style={{ fontWeight: "bold", color: "#8B6914", marginBottom: 4 }}>🏪 Hanuman Khad Bhandar</div>
            <div style={{ fontSize: 13, color: "#5a3e10" }}>📍 Vill. Hatt (Safidon)</div>
            <div style={{ fontSize: 13, color: "#5a3e10" }}>Jind, Haryana</div>
            <div style={{ fontSize: 12, color: "#2d8a2d", marginTop: 4 }}>🌾 Khad, Beej aur Dawaiyan</div>
            <button onClick={() => setShowAddress(false)} style={{ background: "none", border: "none", color: "#8B6914", cursor: "pointer", fontSize: 12, marginTop: 6 }}>✕ Band Karo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Popup */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: "absolute", top: 54, right: 8, background: "rgba(255,248,225,0.98)", border: "1px solid #c8a96e", borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", minWidth: 180, zIndex: 10 }}>
            <div style={{ fontWeight: "bold", color: "#8B6914", marginBottom: 4 }}>👤 {kisanNaam} ji</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>📱 {phone}</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>📍 {shehar}</div>
            <div style={{ fontSize: 12, color: "#5a3e10" }}>🌾 {fasal}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <button onClick={() => { setShowProfile(false); setScreen("fasal"); }}
                style={{ background: "#8B6914", color: "white", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>🔄 Nayi Fasal</button>
              <button onClick={() => {
                setShowProfile(false); localStorage.removeItem("kisan_phone"); localStorage.removeItem("kisan_pin");
                setScreen("phone"); setPhone(""); setPin(""); setKisanNaam(""); setShehar(""); setFasal(""); setBeejDate(""); setMessages([]);
              }} style={{ background: "#c0392b", color: "white", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>🚪 Logout</button>
            </div>
            <button onClick={() => setShowProfile(false)} style={{ background: "none", border: "none", color: "#8B6914", cursor: "pointer", fontSize: 12, marginTop: 4 }}>✕ Band Karo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Card */}
      <motion.div style={{ background: "rgba(255,248,225,0.93)", padding: "10px 12px", margin: "6px 8px", borderRadius: 12, border: "1px solid #c8a96e", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

        {/* Alert */}
        {alert && (
          <div style={{ background: "#fef3c7", borderRadius: 8, padding: "6px 10px", marginBottom: 8, border: "1px solid #f59e0b", fontSize: 12, color: "#92400e" }}>
            {alert}
          </div>
        )}

        {weather ? (
          <>
            {/* Today */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#5a3e10", fontWeight: "bold" }}>📍 {weather.city} — Aaj</div>
                <div style={{ fontSize: 20, fontWeight: "bold", color: "#8B6914" }}>{getWeatherIcon(weather.id)} {weather.temp}°C</div>
                <div style={{ fontSize: 11, color: "#5a3e10" }}>{weather.description}</div>
              </div>
              <div style={{ textAlign: "right", fontSize: 11, color: "#5a3e10" }}>
                <div>💧 {weather.humidity}%</div>
                <div>💨 {weather.wind} m/s</div>
              </div>
            </div>

            {/* 3 Day Forecast */}
            {forecast.length > 0 && (
              <div style={{ display: "flex", gap: 6, borderTop: "1px solid #e8d8b0", paddingTop: 8 }}>
                {forecast.map((f, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", background: "rgba(255,248,225,0.7)", borderRadius: 8, padding: "5px 4px" }}>
                    <div style={{ fontSize: 10, color: "#8B6914", fontWeight: "bold" }}>{f.date}</div>
                    <div style={{ fontSize: 16 }}>{getWeatherIcon(f.id)}</div>
                    <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a3e10" }}>{f.temp}°C</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <motion.div style={{ textAlign: "center", fontSize: 12, color: "#8B6914" }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
            🌤️ Mausam load ho raha hai...
          </motion.div>
        )}
      </motion.div>

      {/* Stage Card */}
      <motion.div style={{ background: "rgba(255,248,225,0.93)", padding: 12, margin: "0 8px 8px", borderRadius: 14, borderLeft: "5px solid #2d8a2d", position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={{ color: "#8B6914", fontWeight: "bold", fontSize: 12 }}>{fasal}</div>
        <div style={{ color: "#2d8a2d", fontSize: 15, fontWeight: "bold", marginTop: 3 }}>{stage}</div>
        <div style={{ color: "#5a3e10", fontSize: 12, marginTop: 3 }}>📅 Din {din} | 💡 {advice}</div>
      </motion.div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom Buttons */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 12px 16px" }}>

        {/* Left — Menu Button */}
        <div style={{ position: "relative" }}>
          <AnimatePresence>
            {showMenu && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ position: "absolute", bottom: 60, left: 0, background: "rgba(255,248,225,0.98)", border: "1px solid #c8a96e", borderRadius: 14, padding: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", minWidth: 160 }}>
                <button onClick={() => { setPage("khata"); setShowMenu(false); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#5a3e10", fontSize: 14, cursor: "pointer", textAlign: "left", borderRadius: 10, fontWeight: "bold" }}>
                  📒 Khata Dairy
                </button>
                <button onClick={() => { setPage("mandi"); setShowMenu(false); }}
                  style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", color: "#5a3e10", fontSize: 14, cursor: "pointer", textAlign: "left", borderRadius: 10, fontWeight: "bold" }}>
                  📊 Mandi Bhav
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(139,105,20,0.9)", border: "none", color: "white", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}>
            ☰
          </motion.button>
        </div>

        {/* Right — Chat Button */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setPage("chat")}
          style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(139,105,20,0.9)", border: "none", color: "white", fontSize: 28, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", position: "relative" }}>
          💬
          {messages.length > 0 && (
            <div style={{ position: "absolute", top: -2, right: -2, background: "#e74c3c", color: "white", borderRadius: "50%", width: 18, height: 18, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {messages.filter(m => m.role === "assistant").length}
            </div>
          )}
        </motion.button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "5px 10px 8px", fontSize: 10, color: "#8B6914", borderTop: "1px solid rgba(200,169,110,0.5)", background: "rgba(255,248,225,0.9)", position: "relative", zIndex: 1 }}>
        <div>🌾 Hanuman Khad Bhandar, Vill. Hatt (Safidon), Jind</div>
        <div style={{ color: "#a07030", marginTop: 2 }}>⚠️ Ye AI hai — galat advice ho sakti hai, expert se zaroor milein</div>
      </div>
    </div>
  );
}

export default App;