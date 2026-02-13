import { configureStore } from "@reduxjs/toolkit";
import allModalSlice from "./slices/allModalSlice";
import { rtkQuerieSetup } from "./services/rtkQuerieSetup";

export const appStore = configureStore({
  reducer: {
    allCommonModal: allModalSlice,
    [rtkQuerieSetup.reducerPath]: rtkQuerieSetup.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQuerieSetup.middleware),
});
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export default appStore;