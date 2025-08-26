import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/src/components/providers"
import { Navbar } from "@/src/components/navbar"
import { Footer } from "@/src/components/footer"
import { SwitchUserModal } from "@/src/components/switch-user-modal"
import { Toaster } from "@/components/ui/toaster"
import { config } from "@/src/lib/config"
import ProtectedRoute from "@/src/components/ProtectedRoute"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: config.app_name,
  description: config.app_description,
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ProtectedRoute>
            <Navbar />
            <main className="flex-1 min-h-[80vh] flex flex-col justify-between">
              {children}
            </main>
            <Footer />
            <SwitchUserModal />
            <Toaster />
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  )
}