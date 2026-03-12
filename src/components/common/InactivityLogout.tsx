'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAuthToken, logoutAndRedirectToHome } from '@/utils/authCookies';

const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
const AUTH_CHECK_INTERVAL_MS = 2000; // re-check auth so timer starts after login

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
] as const;

/**
 * Listens for user activity and logs out after 10 minutes of inactivity.
 * Only runs when the user is authenticated (has auth_token).
 * Renders nothing.
 */
export default function InactivityLogout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenersActiveRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (!getAuthToken()) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
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

    const setupListeners = () => {
      if (listenersActiveRef.current) return;
      listenersActiveRef.current = true;
      ACTIVITY_EVENTS.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });
    };

    const removeListeners = () => {
      if (!listenersActiveRef.current) return;
      listenersActiveRef.current = false;
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };

    if (getAuthToken()) {
      resetTimer();
      setupListeners();
    }

    // Re-check auth periodically so we start the timer when user logs in after mount
    const intervalId = setInterval(() => {
      if (getAuthToken()) {
        if (!timeoutRef.current) {
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
