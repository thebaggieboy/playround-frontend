"use client"

import { motion } from "framer-motion"
import { Bell, Settings, User } from "lucide-react"

export default function DashboardHeader() {
  return (
    <motion.header
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs lg:text-sm text-muted-foreground">Welcome back to Playground</p>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
