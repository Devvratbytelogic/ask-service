import type { Dispatch } from 'redux';
import { setAuthCookies, type AuthResponseData } from '@/utils/authCookies';
import { clientSideGetApis } from '@/redux/rtkQueries/clientSideGetApis';
import { setUserRole, setClientAuthenticated } from '@/redux/slices/authSlice';

/**
 * Call after login, registration, or verify (email/phone) when auth token is received.
 * Stores auth cookies, updates Redux role and client auth flag (so Header re-renders and fetches the correct profile),
 * and invalidates the profile cache for the user's role.
 */
export function setAuthAndRefetchProfile(data: AuthResponseData, dispatch: Dispatch): void {
    setAuthCookies(data);
    const role = data.role != null && data.role !== ''
        ? (typeof data.role === 'string' ? data.role : (data.role.name ?? data.role.id ?? data.role._id))
        : null;
    const roleStr = role != null ? String(role) : null;
    dispatch(setClientAuthenticated(true));
    dispatch(setUserRole(roleStr));
    const tag = roleStr?.toLowerCase() === 'vendor' ? 'VendorProfile' : 'UserProfile';
    dispatch(clientSideGetApis.util.invalidateTags([tag]));
}
