"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  LayoutDashboard, FileText, BarChart3, Layout, Settings,
  LogOut, Menu, X, PenSquare, MessageSquare, PieChart,
  Layers, ChevronLeft, ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { setToken } from "@/features/token/tokenSlice"
import { setUser } from "@/features/user/userSlice"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
  { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
  { icon: BarChart3, label: "Models", href: "/dashboard/models" },
  { icon: PenSquare, label: "Input Model", href: "/dashboard/models/input/advanced" },
  { icon: Layers, label: "Scenarios", href: "/dashboard/scenarios" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const dispatch = useDispatch()

  // Persist collapse state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    if (stored === "true") setIsCollapsed(true)
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      localStorage.setItem("sidebar-collapsed", String(!prev))
      return !prev
    })
  }

  const closeSidebar = () => setIsOpen(false)

  const handleLogout = () => {
    try {
      document.cookie = ""
      dispatch(setToken(null))
      dispatch(setUser(null))
    } catch (error) {
      console.log(error)
    }
  }

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile hamburger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2.5 rounded-lg bg-primary text-primary-foreground lg:hidden shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 56 : 208 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`${isOpen ? "fixed lg:static" : "fixed lg:static"} h-screen border-r border-border bg-white flex flex-col z-40 overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-3 border-b border-border sticky top-0 bg-white flex items-center gap-2 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-primary-foreground font-bold text-xs">P</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-sm text-foreground whitespace-nowrap overflow-hidden"
                >
                  Playground
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <Link href={item.href} onClick={closeSidebar}>
                <div
                  title={isCollapsed ? item.label : undefined}
                  className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all duration-200 cursor-pointer group
                    ${isActive(item.href)
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground hover:bg-secondary"
                    }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-xs whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 py-1 px-2 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Bottom: Logout + Collapse toggle */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className="relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-foreground hover:bg-secondary transition-colors group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-xs whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
            {isCollapsed && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-foreground text-background text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-md">
                Logout
              </div>
            )}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center gap-2.5 px-2.5 py-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed
              ? <ChevronRight className="w-4 h-4 flex-shrink-0" />
              : <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            }
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-xs whitespace-nowrap overflow-hidden"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
