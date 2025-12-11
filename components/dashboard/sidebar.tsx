"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LayoutDashboard, FileText, BarChart3, Layout, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: BarChart3, label: "Models", href: "/dashboard/models" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2.5 rounded-lg bg-primary text-primary-foreground lg:hidden shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className={`${isOpen ? "fixed lg:static" : "fixed lg:static"} w-72 h-screen border-r border-border bg-white lg:bg-white flex flex-col z-40 overflow-y-auto ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border sticky top-0 bg-white">
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <span className="font-bold text-lg text-foreground">Playground</span>
            </motion.div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Link href={item.href} onClick={closeSidebar}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active ? "bg-primary text-white shadow-sm" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-border space-y-3">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
