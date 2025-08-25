"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  LogOut,
  UserCheck,
  Calendar,
  Users,
  BookOpen,
  Settings,
  Dumbbell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSelector, useAppDispatch } from "@/src/redux/store"
import { logout } from "@/src/redux/slices/auth_slice"
import { toggle_switch_user_modal } from "@/src/redux/slices/ui_slice"
import { config } from "@/src/lib/config"

const role_menus = {
  TRAINEE: [
    { href: "/all-schedule", label: "All Schedule", icon: Calendar },
    { href: "/all-trainer", label: "All Trainer", icon: Users },
    { href: "/my-booking", label: "My Booking", icon: BookOpen },
  ],
  ADMIN: [
    { href: "/all-schedule", label: "All Schedule", icon: Calendar },
    { href: "/all-user", label: "All User", icon: Users },
    { href: "/create-schedule", label: "Create a Schedule", icon: Settings },
  ],
  TRAINER: [
    { href: "/my-schedule", label: "My Schedule", icon: Calendar },
    { href: "/all-trainee", label: "All Trainee", icon: Users },
  ],
}

export function Navbar() {
  const [is_mobile_menu_open, set_is_mobile_menu_open] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const { user, is_authenticated } = useAppSelector((state) => state.auth)

  const handle_logout = () => {
    dispatch(logout())
  }

  const handle_switch_user = () => {
    dispatch(toggle_switch_user_modal())
  }

  const public_links = [
    { href: "/", label: "Home" },
    ...(is_authenticated
      ? []
      : [
          { href: "/about", label: "About Us" },
          { href: "/privacy-policy", label: "Privacy Policy" },
        ]),
  ]

  const user_menu_items = user ? role_menus[user.role] || [] : []

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">{config.app_name}</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Public Links */}
            {public_links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* User Menu Items */}
            {user_menu_items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu or Join Button */}
            {is_authenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary font-medium">{user.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handle_switch_user}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Switch User
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handle_logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90">Join with us</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => set_is_mobile_menu_open(!is_mobile_menu_open)}
            >
              {is_mobile_menu_open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {is_mobile_menu_open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
            >
              <div className="py-4 space-y-2">
                {public_links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => set_is_mobile_menu_open(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {user_menu_items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => set_is_mobile_menu_open(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
