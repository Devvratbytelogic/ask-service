import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    /** Set after login/verify so Header re-renders and fetches the correct profile API */
    userRole: string | null;
}

const initialState: AuthState = {
    userRole: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserRole: (state, action: PayloadAction<string | null>) => {
            state.userRole = action.payload;
        },
    },
});

export const { setUserRole } = authSlice.actions;
export default authSlice.reducer;
