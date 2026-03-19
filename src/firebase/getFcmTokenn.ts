"use client";

import Cookies from "js-cookie";
import { getMessagingInstance } from "./FirebaseConfig";

const VAPID_KEY = 'BIYqEPG8qSacFWKEAHVoTBbCKO_dspY3epEaEzyptnI8EKSfBB7fR7gu-pl6-3fSbIuAo4juyuXapyCjXOj67dk';

export const FCM_COOKIE_NAME = "fcm_token";
const FCM_COOKIE_DAYS = 7;

/** Mask token for safe logging (first 20 + ... + last 8 chars) */
function maskToken(token: string): string {
  if (!token || token.length < 30) return "[invalid]";
  return `${token.slice(0, 20)}...${token.slice(-8)}`;
}

/** Get FCM token from cookie (client-only). Returns null if missing or on server. */
export function getFcmTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const token = Cookies.get(FCM_COOKIE_NAME);
    const out = token?.trim() || null;
    if (out) console.log("[FCM] Token from cookie:", maskToken(out));
    return out;
  } catch (e) {
    console.warn("[FCM] getFcmTokenFromCookie error:", e);
    return null;
  }
}

function setFcmTokenCookie(token: string): void {
  if (typeof window === "undefined" || !token?.trim()) return;
  try {
    Cookies.set(FCM_COOKIE_NAME, token.trim(), {
      path: "/",
      sameSite: "lax",
      expires: FCM_COOKIE_DAYS,
      secure: window.location?.protocol === "https:",
    });
    console.log("[FCM] Token saved to cookie:", maskToken(token));
  } catch (e) {
    console.warn("[FCM] Cookie set failed:", e);
  }
}

export async function getFcmToken(): Promise<string | null> {
  console.log("[FCM] getFcmToken() called");
  if (typeof window === "undefined") {
    console.log("[FCM] Skipped (server)");
    return null;
  }
  if (!VAPID_KEY) {
    console.warn("[FCM] No VAPID key configured");
    return null;
  }

  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.warn("[FCM] Messaging not supported or failed to initialize");
      return null;
    }
    console.log("[FCM] Requesting notification permission...");
    const { getToken } = await import("firebase/messaging");
    const permission = await Notification.requestPermission();
    console.log("[FCM] Permission result:", permission);
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission not granted:", permission);
      return null;
    }

    const getTokenWithRetry = async (attempt = 0): Promise<string | null> => {
      console.log("[FCM] Getting FCM token, attempt", attempt + 1);
      const token = await getToken(messaging, { vapidKey: VAPID_KEY! });
      if (token?.trim()) return token.trim();
      if (attempt < 1) {
        console.log("[FCM] Token empty, retrying in 1.5s...");
        await new Promise((r) => setTimeout(r, 1500));
        return getTokenWithRetry(attempt + 1);
      }
      console.warn("[FCM] Failed to get token after retries");
      return null;
    };

    const tokenStr = await getTokenWithRetry();
    if (tokenStr) {
      setFcmTokenCookie(tokenStr);
      console.log("[FCM] Token obtained successfully:", maskToken(tokenStr), "- use this exact value in Firebase Console → Test on device");
      return tokenStr;
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[FCM] getFcmToken error:", message, err);
    if (message.includes("applicationServerKey") || message.includes("not valid")) {
      console.warn(
        "[FCM] Invalid VAPID key. Get the correct key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates (Key pair). Set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local with no quotes or extra spaces.",
        err
      );
    }
    return null;
  }
}

/** Register foreground message handler (when tab is focused). Call after getFcmToken(). */
export async function registerForegroundMessageHandler(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;
    const { onMessage } = await import("firebase/messaging");
    onMessage(messaging, (payload) => {
      console.log("[FCM] Foreground message received:", payload);
      const title = payload.notification?.title ?? (payload.data as Record<string, string> | undefined)?.title ?? "Notification";
      const body = payload.notification?.body ?? (payload.data as Record<string, string> | undefined)?.body ?? "";
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/images/icon-192.png" });
      }
    });
    console.log("[FCM] Foreground message handler registered");
  } catch (err) {
    console.warn("[FCM] registerForegroundMessageHandler failed:", err);
  }
}
