"use client"

import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authSlice from "./slices/auth_slice"
import uiSlice from "./slices/ui_slice"
import dataSlice from "./slices/data_slice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    data: dataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
