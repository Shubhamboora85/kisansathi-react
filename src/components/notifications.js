import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

// Notification permission maango aur FCM token save karo
export async function setupNotifications(app, db, phone) {
  try {
    if (!("Notification" in window)) return null;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FCM_VAPID_KEY
    });

    if (token && phone) {
      await setDoc(doc(db, "kisans", phone), { fcmToken: token }, { merge: true });
    }

    // Jab app khuli ho aur notification aaye
    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (Notification.permission === "granted") {
        new Notification(title || "Kisan Saathi", { body, icon: "/logo192.png" });
      }
    });

    return token;
  } catch (e) {
    console.log("Notification setup error:", e);
    return null;
  }
}