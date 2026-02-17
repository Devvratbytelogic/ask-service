/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AllCommonModalState {
    isOpen: boolean;
    componentName: string | null | undefined;
    data?: any;
    endPoint: string | null;
    modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    modalPadding?: string;
    hideCloseButton?: boolean;
}

interface OpenModalPayload {
    componentName: string;
    data?: any;
    modalSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
    endPoint?: string | null;
    modalPadding?: string;
    hideCloseButton?: boolean;
}

const initialState: AllCommonModalState = {
    isOpen: false,
    componentName: null,
    data: null,
    endPoint: null,
    modalSize: 'xl',
    modalPadding: 'px-8 py-6.5',
    hideCloseButton: false,
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
            state.modalPadding = action.payload.modalPadding
            state.hideCloseButton = action.payload.hideCloseButton
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
