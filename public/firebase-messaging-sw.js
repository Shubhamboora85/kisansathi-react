importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAcXcId8acld6mK_ygyaC_KcWtJLwPHkt8",
  authDomain: "kisansaathi-45881.firebaseapp.com",
  projectId: "kisansaathi-45881",
  messagingSenderId: "708976765667",
  appId: "1:708976765667:web:1ebddfd8b5bba7a1c433d6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "Kisan Saathi", {
    body: body || "Naya update hai!",
    icon: "/logo192.png",
    badge: "/logo192.png"
  });
});