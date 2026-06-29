import { doc, getDoc, setDoc } from "firebase/firestore";

export const checkAndUpdateStreak = async (db, phone) => {
  if (!phone) return { streak: 0, points: 0, todayDone: false };
  
  try {
    const snap = await getDoc(doc(db, "kisans", phone));
    if (!snap.exists()) return { streak: 0, points: 0, todayDone: false };
    
    const data = snap.data();
    const today = new Date().toDateString();
    const lastLogin = data.lastLoginDate || "";
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let streak = data.streak || 0;
    let points = data.points || 0;
    let todayDone = false;

    if (lastLogin === today) {
      todayDone = true;
    } else if (lastLogin === yesterday) {
      streak += 1;
      points += 10;
      todayDone = true;
      await setDoc(doc(db, "kisans", phone), {
        streak, points, lastLoginDate: today
      }, { merge: true });
    } else {
      streak = 1;
      points += 10;
      todayDone = true;
      await setDoc(doc(db, "kisans", phone), {
        streak, points, lastLoginDate: today
      }, { merge: true });
    }

    return { streak, points, todayDone };
  } catch {
    return { streak: 0, points: 0, todayDone: false };
  }
};

export const getLeaderboard = async (db) => {
  return [
    { naam: "Ramesh Kumar", points: 820 },
    { naam: "Suresh Yadav", points: 710 },
    { naam: "Mahesh Singh", points: 640 },
  ];
};

export const getStreakDays = (streak) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  return days.map((d, i) => ({
    name: d,
    done: i <= todayIndex && i >= todayIndex - (Math.min(streak, 7) - 1),
    isToday: i === todayIndex
  }));
};