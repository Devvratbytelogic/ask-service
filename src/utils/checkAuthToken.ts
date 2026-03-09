import { API_BASE_URL } from '@/utils/config';
import {
    getAuthToken,
    isUnauthorizedError,
    logoutAndRedirectToHome,
} from '@/utils/authCookies';

/**
 * Checks if the auth_token is valid.
 * - If no token exists: logs out and redirects to home.
 * - If token exists: optionally validates with the backend (GET profile).
 *   On 401 or invalid/expired token response: logs out and redirects to home.
 *
 * @returns Promise<true> if token is valid, Promise<false> if invalid (and logout/redirect was triggered).
 * Safe to call on server (no-op, returns false).
 */
export async function checkAuthTokenAndLogoutIfInvalid(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const token = getAuthToken();
    if (!token?.trim()) {
        logoutAndRedirectToHome();
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/user/get-profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            credentials: 'same-origin',
        });

        const data = await res.json().catch(() => ({}));
        const message = (data?.message ?? data?.error ?? '') as string;

        if (!res.ok && isUnauthorizedError(message, res.status)) {
            logoutAndRedirectToHome();
            return false;
        }

        if (!res.ok) {
            // Other client/server errors - don't treat as auth failure
            return true;
        }

        return true;
    } catch {
        // Network or other error - don't force logout; let normal API calls handle 401
        return true;
    }
}
