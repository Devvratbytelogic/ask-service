/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllCommonModalState {
    isOpen: boolean;
    componentName: string | null | undefined;
    data?: any;
    endPoint: string | null;
    modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

interface OpenModalPayload {
    componentName: string;
    data?: any;
    modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    endPoint?: string | null;
}

const initialState: AllCommonModalState = {
    isOpen: false,
    componentName: null,
    data: null,
    endPoint: null,
    modalSize:'xl',
};

const allCommonModalSlice = createSlice({
    name: "allCommonModal",
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<OpenModalPayload>) => {
            state.isOpen = true;
            state.componentName = action.payload.componentName;
            state.data = action.payload.data;
            state.modalSize = action.payload.modalSize
            // state.endPoint = action.payload.endPoint;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.componentName = null;
            state.data = null;
            state.endPoint = null;
        }
    }
});

export const { openModal, closeModal } = allCommonModalSlice.actions;
export default allCommonModalSlice.reducer;
