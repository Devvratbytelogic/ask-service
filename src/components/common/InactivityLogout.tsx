'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAuthToken, logoutAndRedirectToHome } from '@/utils/authCookies';

const INACTIVITY_MS = 1 * 60 * 1000; // 1 minutes
const AUTH_CHECK_INTERVAL_MS = 2000; // re-check auth so timer starts after login
const LAST_ACTIVITY_KEY = 'inactivity_last_activity';

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
] as const;

/** Persist last activity time so all tabs share it — activity in any tab keeps user logged in. */
function setLastActivityNow(): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch {
    // ignore if localStorage is unavailable
  }
}

function getLastActivity(): number {
  try {
    const v = localStorage.getItem(LAST_ACTIVITY_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Listens for user activity and logs out after inactivity.
 * Syncs activity across tabs: activity in any tab resets the inactivity timer everywhere.
 * Only runs when the user is authenticated (has auth_token). Renders nothing.
 */
export default function InactivityLogout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenersActiveRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (!getAuthToken()) return;

    setLastActivityNow();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const last = getLastActivity();
      if (Date.now() - last < INACTIVITY_MS) {
        // Another tab had activity; don't logout, just reschedule
        resetTimer();
        return;
      }
      logoutAndRedirectToHome();
    }, INACTIVITY_MS);
  }, []);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleActivity = () => resetTimer();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) resetTimer();
    };

    const setupListeners = () => {
      if (listenersActiveRef.current) return;
      listenersActiveRef.current = true;
      ACTIVITY_EVENTS.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
      window.addEventListener('storage', handleStorage);
    };

    const removeListeners = () => {
      if (!listenersActiveRef.current) return;
      listenersActiveRef.current = false;
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      window.removeEventListener('storage', handleStorage);
    };

    if (getAuthToken()) {
      setLastActivityNow();
      resetTimer();
      setupListeners();
    }

    // Re-check auth periodically so we start the timer when user logs in after mount
    const intervalId = setInterval(() => {
      if (getAuthToken()) {
        if (!timeoutRef.current) {
          setLastActivityNow();
          resetTimer();
          setupListeners();
        }
      } else {
        clearTimer();
        removeListeners();
      }
    }, AUTH_CHECK_INTERVAL_MS);

    return () => {
      removeListeners();
      clearTimer();
      clearInterval(intervalId);
    };
  }, [resetTimer, clearTimer]);

  return null;
}
