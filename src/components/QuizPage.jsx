import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  { q: "Chawal ki nursery mein peele patte kyun aate hain?", options: ["Paani zyada", "Zinc ki kami", "Dhoop zyada", "Beej kharab"], ans: 1, exp: "Zinc Sulphate spray karo — 500g per acre" },
  { q: "Gehun mein pehla paani kab dena chahiye?", options: ["Beej ke din", "21 din baad", "7 din baad", "45 din baad"], ans: 1, exp: "Pehla paani 21 din baad — Crown Root Initiation stage" },
  { q: "Sarson mein phool aane par kya nahi karna chahiye?", options: ["Paani dena", "Spray karna", "Khad dena", "Kuch nahi"], ans: 1, exp: "Phool mein spray se madhumakkhi marti hai — pollination rukta hai" },
  { q: "Urea dene ka sahi samay kaunsa hai?", options: ["Dophar mein", "Baarish se pehle", "Subah ya shaam", "Raat mein"], ans: 2, exp: "Subah ya shaam — dophar mein urea ud jaata hai" },
  { q: "Chawal mein kitna paani rakhna chahiye?", options: ["Sukha khet", "2-3 inch", "6 inch", "1 foot"], ans: 1, exp: "2-3 inch paani — zyada paani se roots ko oxygen nahi milti" },
  { q: "Khad mein NPK ka N kya hai?", options: ["Neon", "Nitrogen", "Nickel", "Sodium"], ans: 1, exp: "N = Nitrogen — patte green aur healthy rakhta hai" },
  { q: "Fasal mein drip irrigation se kya fayda hai?", options: ["Zyada paani", "Paani ki bachat", "Zyada khad", "Koi fayda nahi"], ans: 1, exp: "Drip se 40-50% paani bachta hai — roots tak seedha paani jaata hai" },
  { q: "Gehu ka MSP 2024-25 mein kitna tha?", options: ["₹1800", "₹2015", "₹2275", "₹2500"], ans: 2, exp: "Gehun MSP 2024-25: ₹2275 per quintal" },
  { q: "DAP khad mein kaunse do tत्व hote hain?", options: ["N aur K", "P aur K", "N aur P", "Ca aur Mg"], ans: 2, exp: "DAP = Di-Ammonium Phosphate — Nitrogen (18%) aur Phosphorus (46%)" },
  { q: "Baarish ke baad khet mein kab jaana chahiye?", options: ["Turant", "Jab mitti sukh jaaye", "2 ghante baad", "Koi baat nahi"], ans: 1, exp: "Geeli mitti mein jaane se soil compact hoti hai — roots damage hoti hain" },
];

const S = {
  wrap: { minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" },
  header: { background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 },
  backBtn: { background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" },
  title: { color: "#60b8ff", fontWeight: "bold", fontSize: 16 },
  scroll: { flex: 1, overflowY: "auto", padding: "12px 14px" },
};

export default function QuizPage({ onBack, db, phone, kisanNaam }) {
  const [todayQs, setTodayQs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showDiscount, setShowDiscount] = useState(false);

  useEffect(() => {
    const todayKey = new Date().toDateString();
    const played = localStorage.getItem(`quiz_played_${phone}`);
    if (played === todayKey) { setAlreadyPlayed(true); }

    // Pick 5 random questions for today (seed by date)
    const seed = new Date().getDate();
    const shuffled = [...QUESTIONS].sort((a, b) => ((a.q.charCodeAt(0) + seed) % 7) - ((b.q.charCodeAt(0) + seed) % 7));
    setTodayQs(shuffled.slice(0, 5));

    // Get current points
    if (phone) {
      getDoc(doc(db, "kisans", phone)).then(snap => {
        if (snap.exists()) setTotalPoints(snap.data().points || 0);
      });
    }
  }, [phone]);

  const handleAnswer = async (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === todayQs[current].ans;
    const newScore = correct ? score + 10 : score;
    if (correct) setScore(newScore);

    setTimeout(async () => {
      if (current + 1 >= todayQs.length) {
        setDone(true);
        localStorage.setItem(`quiz_played_${phone}`, new Date().toDateString());
        // Save points
        if (phone && newScore > 0) {
          const snap = await getDoc(doc(db, "kisans", phone));
          const existing = snap.exists() ? (snap.data().points || 0) : 0;
          await setDoc(doc(db, "kisans", phone), { points: existing + newScore }, { merge: true });
          setTotalPoints(existing + newScore);
        }
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (alreadyPlayed && !done) return (
    <div style={S.wrap}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack}>←</button>
        <span style={S.title}>🎯 Aaj ka Quiz</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#7dffaa", marginBottom: 8 }}>Aaj ka quiz ho gaya!</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>Kal subah naya quiz aayega</div>
        <div style={{ background: "rgba(100,180,255,0.1)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 14, padding: "16px 24px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Total Points</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#ffd700" }}>⭐ {totalPoints}</div>
        </div>
        <button onClick={() => setShowDiscount(true)} style={{ marginTop: 20, background: "rgba(255,120,0,0.15)", border: "1px solid rgba(255,120,0,0.3)", color: "#ff9944", borderRadius: 12, padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          🎁 Points se Discount kaise milega?
        </button>
        {showDiscount && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 16, background: "rgba(255,120,0,0.1)", border: "1px solid rgba(255,120,0,0.2)", borderRadius: 14, padding: 16, textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff9944", marginBottom: 8 }}>🏪 Hanuman Khad Bhandar — Points Reward</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              • 100 points = ₹5 discount dawai par<br/>
              • 500 points = ₹30 discount<br/>
              • 1000 points = ₹75 discount + free soil test<br/>
              <br/>
              <strong style={{ color: "#ffd700" }}>Dukaan par aakar apna naam aur points batao!</strong><br/>
              Vill. Hatt (Safidon), Jind
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  if (done) return (
    <div style={S.wrap}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack}>←</button>
        <span style={S.title}>🎯 Quiz Result</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: 70, marginBottom: 12 }}>
          {score >= 40 ? "🏆" : score >= 20 ? "👍" : "📚"}
        </motion.div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {score >= 40 ? "Shabaash! Expert Kisan!" : score >= 20 ? "Achha kiya!" : "Aur seekho!"}
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
          {todayQs.length} mein se {score / 10} sahi jawab
        </div>
        <div style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: 14, padding: "16px 32px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Aaj kamaaye</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#ffd700" }}>+{score} pts</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Total: {totalPoints} pts</div>
        </div>
        <button onClick={() => setShowDiscount(true)} style={{ background: "rgba(255,120,0,0.15)", border: "1px solid rgba(255,120,0,0.3)", color: "#ff9944", borderRadius: 12, padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          🎁 Points se Discount kaise milega?
        </button>
        {showDiscount && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "rgba(255,120,0,0.1)", border: "1px solid rgba(255,120,0,0.2)", borderRadius: 14, padding: 16, textAlign: "left", width: "100%" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ff9944", marginBottom: 8 }}>🏪 Hanuman Khad Bhandar — Points Reward</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              • 100 points = ₹5 discount dawai par<br/>
              • 500 points = ₹30 discount<br/>
              • 1000 points = ₹75 discount + free soil test<br/>
              <br/>
              <strong style={{ color: "#ffd700" }}>Dukaan par aakar apna naam aur points batao!</strong>
            </div>
          </motion.div>
        )}
        <button onClick={onBack} style={{ marginTop: 12, background: "#1e90ff", color: "white", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          🏠 Ghar Wapas Jao
        </button>
      </div>
    </div>
  );

  if (todayQs.length === 0) return null;
  const q = todayQs[current];

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={onBack}>←</button>
        <span style={S.title}>🎯 Aaj ka Quiz</span>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{current + 1}/5</div>
      </div>
      <div style={S.scroll}>
        {/* Progress */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
          <motion.div style={{ height: "100%", background: "#1e90ff", borderRadius: 10 }} animate={{ width: `${((current) / 5) * 100}%` }} />
        </div>

        {/* Score */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Sawaal {current + 1} of 5</div>
          <div style={{ fontSize: 12, color: "#ffd700", fontWeight: 600 }}>⭐ {score} pts</div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div style={{ background: "rgba(10,40,100,0.5)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 14, padding: "16px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 15, color: "#fff", fontWeight: 600, lineHeight: 1.5 }}>{q.q}</div>
            </div>

            {/* Options */}
            {q.options.map((opt, i) => {
              let bg = "rgba(100,180,255,0.07)";
              let border = "rgba(100,180,255,0.15)";
              let color = "rgba(255,255,255,0.75)";
              if (selected !== null) {
                if (i === q.ans) { bg = "rgba(30,180,100,0.2)"; border = "#7dffaa"; color = "#7dffaa"; }
                else if (i === selected && selected !== q.ans) { bg = "rgba(255,80,80,0.2)"; border = "#ff6666"; color = "#ff6666"; }
              }
              return (
                <motion.button key={i} whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(i)}
                  style={{ width: "100%", padding: "13px 14px", marginBottom: 8, borderRadius: 12, border: `1px solid ${border}`, background: bg, color, fontSize: 13, textAlign: "left", cursor: selected !== null ? "default" : "pointer", fontWeight: 500, transition: "all 0.3s" }}>
                  <span style={{ marginRight: 8, opacity: 0.5 }}>{["A","B","C","D"][i]}.</span> {opt}
                </motion.button>
              );
            })}

            {/* Explanation */}
            {selected !== null && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
                <div style={{ fontSize: 11, color: "#ffd700", fontWeight: 600, marginBottom: 3 }}>💡 Sahi Jawab:</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{q.exp}</div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}