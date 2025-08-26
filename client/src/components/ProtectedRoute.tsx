"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const PUBLIC_ROUTES = ["/", "/privacy-policy", "/about", "/login"]

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("acccessToken") || localStorage.getItem("access_token")
        : null

    const currentPath = window.location.pathname

    if (!PUBLIC_ROUTES.includes(currentPath) && !token) {
      router.replace("/login")
    }
  }, [])

  return <>{children}</>
}