"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector, useAppDispatch } from "@/src/redux/store"
import { toggle_switch_user_modal } from "@/src/redux/slices/ui_slice"
import { switch_user } from "@/src/redux/slices/auth_slice"
import { config } from "@/src/lib/config"

export function SwitchUserModal() {
  const dispatch = useAppDispatch()
  const { is_switch_user_modal_open } = useAppSelector((state) => state.ui)

  const handle_close = () => {
    dispatch(toggle_switch_user_modal())
  }

  const handle_switch = (user: (typeof config.mock_users)[0]) => {
    const { password, ...user_data } = user
    dispatch(switch_user(user_data))
    handle_close()
  }

  return (
    <AnimatePresence>
      {is_switch_user_modal_open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handle_close}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-card border rounded-lg shadow-lg w-full max-w-md mx-4 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Switch User</h2>
              <Button variant="ghost" size="sm" onClick={handle_close}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {config.mock_users.map((user) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handle_switch(user)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-primary font-medium">{user.role}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
