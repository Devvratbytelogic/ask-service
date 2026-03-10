import { configureStore } from "@reduxjs/toolkit";
import allModalSlice from "./slices/allModalSlice";
import authReducer from "./slices/authSlice";
import { rtkQuerieSetup } from "./services/rtkQuerieSetup";
import { geoLocationApiService } from "./services/geoLocationApiService";

export const appStore = configureStore({
  reducer: {
    allCommonModal: allModalSlice,
    auth: authReducer,
    [rtkQuerieSetup.reducerPath]: rtkQuerieSetup.reducer,
    [geoLocationApiService.reducerPath]: geoLocationApiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQuerieSetup.middleware, geoLocationApiService.middleware),
});
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export default appStore;