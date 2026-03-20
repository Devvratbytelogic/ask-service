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
    return out;
  } catch (e) {
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
  } catch (e) {
    console.warn("[FCM] Cookie set failed:", e);
  }
}

export async function getFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }
  if (!VAPID_KEY) {
    return null;
  }

  try {
    const messaging = await getMessagingInstance();
    if (!messaging) {
      return null;
    }
    const { getToken } = await import("firebase/messaging");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    const getTokenWithRetry = async (attempt = 0): Promise<string | null> => {
      const token = await getToken(messaging, { vapidKey: VAPID_KEY! });
      if (token?.trim()) return token.trim();
      if (attempt < 1) {
        await new Promise((r) => setTimeout(r, 1500));
        return getTokenWithRetry(attempt + 1);
      }
      return null;
    };

    const tokenStr = await getTokenWithRetry();
    if (tokenStr) {
      setFcmTokenCookie(tokenStr);
      return tokenStr;
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
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
      const title = payload.notification?.title ?? (payload.data as Record<string, string> | undefined)?.title ?? "Notification";
      const body = payload.notification?.body ?? (payload.data as Record<string, string> | undefined)?.body ?? "";
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(title, { body, icon: "/images/icon-192.png" });
      }
    });
  } catch (err) {
    console.warn("[FCM] registerForegroundMessageHandler failed:", err);
  }
}
