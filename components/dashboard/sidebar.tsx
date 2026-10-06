"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  LayoutDashboard, FileText, BarChart3, Layout, Settings,
  LogOut, Menu, X, PenSquare, MessageSquare, PieChart,
  Layers, ChevronLeft, ChevronRight, GitCompareArrows,
  Upload, Sun, Moon, HelpCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { setToken } from "@/features/token/tokenSlice"
import { setUser } from "@/features/user/userSlice"
import { useTheme } from "next-themes"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
  { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
  { icon: BarChart3, label: "Models", href: "/dashboard/models" },
  { icon: PenSquare, label: "Input Model", href: "/dashboard/models/input/advanced" },
  { icon: Layers, label: "Scenarios", href: "/dashboard/scenarios" },
  { icon: Layout, label: "Templates", href: "/dashboard/templates" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: HelpCircle, label: "Help Center", href: "/dashboard/help" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 1024)
    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

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
      {/* Mobile Top Toggle Button */}
      <div className="lg:hidden fixed top-3 left-3 z-[120]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-card border border-border shadow-md hover:bg-secondary text-foreground transition-colors flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/30 z-[105] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isMobile ? 280 : isCollapsed ? 56 : 208 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`${isOpen ? "fixed lg:static" : "fixed lg:static"} top-16 lg:top-0 h-[calc(100vh-4rem)] lg:h-screen border-r border-[#25334a] bg-[#111c2e] text-slate-100 flex flex-col z-[110] overflow-hidden shadow-[4px_0_24px_rgba(15,23,42,0.08)] ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand wordmark stays visible in the mobile drawer, including when desktop is collapsed. */}
        <div className="flex p-3 border-b border-[#25334a] sticky top-0 bg-[#111c2e] items-center gap-2 overflow-hidden shrink-0 min-h-14">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0" aria-label="Plyground dashboard">
            <div className="hidden lg:flex w-7 h-7 bg-[#263d5d] rounded-md items-center justify-center shadow-sm flex-shrink-0">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-sm tracking-[0.16em] text-white whitespace-nowrap overflow-hidden"
                >
                  PLYGROUND
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 pt-3 lg:pt-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <Link href={item.href} onClick={closeSidebar}>
                <div
                  title={isCollapsed && !isMobile ? item.label : undefined}
                  className={`relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all duration-200 cursor-pointer group
                    ${isActive(item.href)
                      ? "bg-[#263750] text-white shadow-sm ring-1 ring-inset ring-white/5 before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-sky-300"
                      : "text-slate-200 hover:bg-[#1b2a40] hover:text-white"
                    }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
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
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 py-1 px-2 bg-[#17243a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg ring-1 ring-white/10">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Bottom: Dark mode + Logout + Collapse */}
        <div className="p-2 border-t border-[#25334a] space-y-1">
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={isCollapsed && !isMobile ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : undefined}
              className="relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-slate-300 hover:bg-[#1b2a40] hover:text-white transition-colors group"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 flex-shrink-0" />
                : <Moon className="w-4 h-4 flex-shrink-0" />
              }
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-xs whitespace-nowrap overflow-hidden"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </motion.span>
                )}
              </AnimatePresence>
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 py-1 px-2 bg-[#17243a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg ring-1 ring-white/10">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </div>
              )}
            </button>
          )}
          <button
            onClick={handleLogout}
            title={isCollapsed && !isMobile ? "Logout" : undefined}
            className="relative w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-slate-300 hover:bg-[#1b2a40] hover:text-white transition-colors group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
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
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 py-1 px-2 bg-[#17243a] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg ring-1 ring-white/10">
                Logout
              </div>
            )}
          </button>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center gap-2.5 px-2.5 py-2 rounded-md text-slate-300 hover:bg-[#1b2a40] hover:text-white transition-colors"
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
