import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";

export default function CommunityPage({ onBack, db, kisanNaam, phone }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(items);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [db]);

  const submitPost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "community_posts"), {
        text: newPost.trim(),
        author: kisanNaam || "Kisan",
        authorPhone: phone,
        likes: [],
        createdAt: serverTimestamp(),
      });
      setNewPost("");
    } catch (e) { console.log(e); }
    setPosting(false);
  };

  const toggleLike = async (postId, currentLikes) => {
    const liked = currentLikes?.includes(phone);
    try {
      await updateDoc(doc(db, "community_posts", postId), {
        likes: liked ? arrayRemove(phone) : arrayUnion(phone)
      });
    } catch (e) { console.log(e); }
  };

  const timeAgo = (timestamp) => {
    if (!timestamp?.toDate) return "abhi";
    const diff = Math.floor((Date.now() - timestamp.toDate().getTime()) / 1000);
    if (diff < 60) return "abhi";
    if (diff < 3600) return `${Math.floor(diff / 60)} min pehle`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ghante pehle`;
    return `${Math.floor(diff / 86400)} din pehle`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050d1a", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#071528", borderBottom: "1px solid rgba(100,180,255,0.15)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#60b8ff", fontSize: 20, cursor: "pointer" }}>←</button>
        <span style={{ color: "#60b8ff", fontWeight: "bold", fontSize: 16 }}>👥 Kisan Samuday</span>
      </div>

      <div style={{ padding: "10px 12px", background: "rgba(100,180,255,0.05)", borderBottom: "1px solid rgba(100,180,255,0.1)" }}>
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
          placeholder="Apna sawaal ya tajurba share karo..."
          rows={2}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(100,180,255,0.2)", background: "rgba(100,180,255,0.07)", color: "#fff", fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box" }} />
        <button onClick={submitPost} disabled={posting || !newPost.trim()}
          style={{ marginTop: 6, background: "#1e90ff", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: newPost.trim() ? "pointer" : "default", opacity: newPost.trim() ? 1 : 0.5 }}>
          {posting ? "Post ho raha hai..." : "📤 Post Karo"}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loading && <div style={{ textAlign: "center", padding: 30, color: "#60b8ff" }}>⏳ Loading...</div>}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.4)" }}>
            Abhi koi post nahi hai — sabse pehle tum likho!
          </div>
        )}
        <AnimatePresence>
          {posts.map(post => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.13)", borderRadius: 12, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#60b8ff" }}>👤 {post.author}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{timeAgo(post.createdAt)}</div>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, marginBottom: 8 }}>{post.text}</div>
              <button onClick={() => toggleLike(post.id, post.likes)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: post.likes?.includes(phone) ? "#ff6666" : "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                {post.likes?.includes(phone) ? "❤️" : "🤍"} {post.likes?.length || 0}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}