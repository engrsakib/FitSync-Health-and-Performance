"use client"

import type React from "react"

import { Provider } from "react-redux"
import { ThemeProvider } from "next-themes"
import { store } from "@/src/redux/store"
import { useEffect } from "react"
import { useAppDispatch } from "@/src/redux/store"
import { hydrate_from_storage } from "@/src/redux/slices/auth_slice"

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(hydrate_from_storage())
  }, [dispatch])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthHydrator>{children}</AuthHydrator>
      </ThemeProvider>
    </Provider>
  )
}
