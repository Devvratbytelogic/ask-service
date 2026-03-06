import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    /** Set after login/verify so Header re-renders and fetches the correct profile API */
    userRole: string | null;
    /** Set true after client-side login so Header updates before layout re-renders */
    isClientAuthenticated: boolean;
}

const initialState: AuthState = {
    userRole: null,
    isClientAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<string | null>) => {
            state.userRole = action.payload;
        },
        setClientAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isClientAuthenticated = action.payload;
        },
    },
});

export const { setUserRole, setClientAuthenticated } = authSlice.actions;
export default authSlice.reducer;
