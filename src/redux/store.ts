import { configureStore } from "@reduxjs/toolkit";
import comprasReducer from "./slices/comprasSlice";

export const store = configureStore({
  reducer: {
    compras: comprasReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
