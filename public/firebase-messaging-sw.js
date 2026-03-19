// Firebase Cloud Messaging service worker. Must live at domain root (e.g. /firebase-messaging-sw.js).
// Use the same config as src/firebase/FirebaseConfig.ts (ask-service--login project).
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBm-6Ffv6IK8HcuPpGM370LVbZc1kTQ058",
  authDomain: "ask-service--login.firebaseapp.com",
  projectId: "ask-service--login",
  storageBucket: "ask-service--login.firebasestorage.app",
  messagingSenderId: "112726239018",
  appId: "1:112726239018:web:9edb160cee06c853bb2053",
  measurementId: "G-QNNDJKYV4Y",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[FCM SW] Background message received:", payload);
  const notificationTitle = payload.notification?.title ?? payload.data?.title ?? "Notification";
  const notificationOptions = {
    body: payload.notification?.body ?? payload.data?.body ?? "",
    icon: payload.notification?.icon ?? "/images/icon-192.png",
    data: payload.data ?? {},
  };
  self.registration.showNotification(notificationTitle, notificationOptions).then(
    function () {
      console.log("[FCM SW] Notification shown:", notificationTitle);
    },
    function (err) {
      console.error("[FCM SW] showNotification failed:", err);
    }
  );
});
