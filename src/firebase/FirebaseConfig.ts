// FirebaseConfig.ts
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD5_ZaxV6OZab41HWMkpAOX_cutByeoSpI",
  authDomain: "ask-service-7eeda.firebaseapp.com",
  projectId: "ask-service-7eeda",
  storageBucket: "ask-service-7eeda.firebasestorage.app",
  messagingSenderId: "667450202511",
  appId: "1:667450202511:web:99d33c3661654e308593fa",
  measurementId: "G-7G54MX3GM4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const getFirebaseAuth = async () => {
  if (typeof window === "undefined") return null;

  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
};

const getMessagingInstance = async () => {
  if (typeof window === "undefined") return null;

  const { isSupported, getMessaging } = await import("firebase/messaging");

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
};

export { getFirebaseAuth, getMessagingInstance };
