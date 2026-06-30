import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const YOJNAS = [
  {
    id: 1, name: "PM Kisan Samman Nidhi", icon: "💰",
    status: "Active", deadline: "Saal bhar",
    color: "#7dffaa",
    tabs: [
      { label: "Kya hai?", content: "Har kisan ko saal mein ₹6,000 teen installments mein milte hain — ₹2,000 har 4 mahine. Seedha bank account mein aate hain." },
      { label: "Kaun apply kar sakta hai?", content: "• 2 hectare tak zameen wale kisan\n• Zameen apne naam honi chahiye\n• Bank account Aadhaar se linked hona chahiye\n• Income tax nahi bharna chahiye" },
      { label: "Kaise apply karein?", content: "1. pmkisan.gov.in website kholo\n2. 'New Farmer Registration' pe click karo\n3. Aadhaar number daalo\n4. Zameen ki jaankari bharo\n5. Bank account details dalo\n6. Submit karo" },
      { label: "Documents", content: "• Aadhaar card\n• Bank passbook\n• Khasra/Khatauni (zameen ka kaagaz)\n• Mobile number" },
    ]
  },
  {
    id: 2, name: "PM Fasal Bima Yojna", icon: "🛡️",
    status: "Deadline: 31 Jul 2026", deadline: "31 July 2026",
    color: "#ff9944",
    tabs: [
      { label: "Kya hai?", content: "Baarish, aandhi, bimari, ya kisi bhi prakritik aapda se fasal kharab ho to sarkar muavza deti hai. Premium bahut kam hota hai — Rabi mein sirf 1.5%." },
      { label: "Kharif 2026 Premium", content: "• Chawal: 2% premium\n• Maize: 2% premium\n• Baaki fasal: 2%\n\nMaan lo ₹50,000 ki fasal beema karvaayi to sirf ₹1,000 premium dena hoga!" },
      { label: "Kaise apply karein?", content: "1. Apne nzdeeki bank mein jao (jahan KCC loan hai)\n2. Ya CSC center par jao\n3. Fasal Bima form bharo\n4. Premium jama karo\n5. Policy number lo" },
      { label: "Documents", content: "• Aadhaar card\n• Bank passbook\n• Zameen ka kaagaz\n• Beej kharidne ki receipt\n• Mobile number" },
    ]
  },
  {
    id: 3, name: "Kisan Credit Card (KCC)", icon: "💳",
    status: "Saal bhar", deadline: "Kabhi bhi",
    color: "#60b8ff",
    tabs: [
      { label: "Kya hai?", content: "KCC ek special loan card hai jo kisan ko fasal ugane ke liye short-term credit deta hai. Sirf 4% byaaj — aam loan se bahut sasta!" },
      { label: "Kitna loan milega?", content: "• Zameen ke hisaab se\n• Typically ₹50,000 to ₹3,00,000\n• Har saal renew hota hai\n• Byaaj: 4% per year (govt subsidy ke baad)" },
      { label: "Kaise apply karein?", content: "1. Apne nzdeeki bank mein jao (SBI, PNB, HDFC)\n2. KCC application form lo\n3. Bharo aur submit karo\n4. 2-3 hafte mein card milega" },
      { label: "Documents", content: "• Aadhaar card\n• Pan card\n• Zameen ka kaagaz (Khasra)\n• 2 passport photos\n• Bank account" },
    ]
  },
  {
    id: 4, name: "Meri Fasal Mera Byora (Haryana)", icon: "📋",
    status: "Active — Haryana", deadline: "Saal bhar",
    color: "#d7b8ff",
    tabs: [
      { label: "Kya hai?", content: "Haryana sarkar ka portal jahan kisan apni fasal register karte hain. Registration zaroori hai — bina iske MSP par bechna mushkil ho sakta hai." },
      { label: "Fayda", content: "• MSP par fasal bech sakte ho\n• Fasal bima le sakte ho\n• Sarkar ki madad seedha milegi\n• Mandi mein priority milegi" },
      { label: "Kaise register karein?", content: "1. fasal.haryana.gov.in kholo\n2. 'Kisan Registration' pe click karo\n3. Family ID (Parivar Pehchan Patra) daalo\n4. Fasal ki jaankari bharo\n5. Submit karo" },
      { label: "Documents", content: "• Parivar Pehchan Patra (PPP)\n• Aadhaar card\n• Khasra number\n• Bank account\n• Mobile number" },
    ]
  },
];

export default function YojnaPage({ onBack }) {
  const [activeYojna, setActiveYojna] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const y = YOJNAS[activeYojna];

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#60b8ff", fontWeight: "bold", fontSize: 16 }}>🏛️ Sarkari Yojnayen</span>
      </div>

      {/* Scheme selector */}
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", overflowX: "auto", borderBottom: "1px solid rgba(100,180,255,0.08)" }}>
        {YOJNAS.map((yj, i) => (
          <button key={i} onClick={() => { setActiveYojna(i); setActiveTab(0); }}
            style={{ flexShrink: 0, padding: "7px 12px", borderRadius: 20, border: `1px solid ${activeYojna === i ? yj.color : "rgba(100,180,255,0.15)"}`, background: activeYojna === i ? `${yj.color}18` : "rgba(100,180,255,0.05)", color: activeYojna === i ? yj.color : "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: activeYojna === i ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
            {yj.icon} {yj.name.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeYojna} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Scheme header */}
            <div style={{ background: `${y.color}12`, border: `1px solid ${y.color}30`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{y.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{y.name}</div>
              <div style={{ display: "inline-block", background: `${y.color}20`, border: `1px solid ${y.color}40`, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: y.color, fontWeight: 600 }}>
                ✅ {y.status}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto" }}>
              {y.tabs.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)}
                  style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: `1px solid ${activeTab === i ? y.color : "rgba(100,180,255,0.15)"}`, background: activeTab === i ? `${y.color}18` : "transparent", color: activeTab === i ? y.color : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: activeTab === i ? 700 : 400, cursor: "pointer" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.13)", borderRadius: 14, padding: "16px 14px" }}>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {y.tabs[activeTab].content}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}