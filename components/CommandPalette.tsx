"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, LayoutDashboard, MessageSquare, PieChart,
  BarChart3, PenSquare, Layers, Layout, FileText,
  Settings, Plus, ArrowRight
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Navigate" },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare, group: "Navigate" },
  { label: "Analytics", href: "/dashboard/analytics", icon: PieChart, group: "Navigate" },
  { label: "Models", href: "/dashboard/models", icon: BarChart3, group: "Navigate" },
  { label: "Input Model", href: "/dashboard/models/input/advanced", icon: PenSquare, group: "Navigate" },
  { label: "Scenarios", href: "/dashboard/scenarios", icon: Layers, group: "Navigate" },
  { label: "Templates", href: "/dashboard/templates", icon: Layout, group: "Navigate" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText, group: "Navigate" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Navigate" },
]

const actions = [
  { label: "New Model", href: "/dashboard/models/input/basic", icon: Plus, group: "Actions" },
  { label: "New Advanced Model", href: "/dashboard/models/input/advanced", icon: PenSquare, group: "Actions" },
]

const allItems = [...actions, ...navItems]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const router = useRouter()

  const filtered = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  const execute = useCallback((href: string) => {
    setOpen(false)
    setQuery("")
    setSelected(0)
    router.push(href)
  }, [router])

  // Global keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (!open) return
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelected(s => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelected(s => Math.max(s - 1, 0))
      }
      if (e.key === "Enter" && filtered[selected]) {
        execute(filtered[selected].href)
      }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [open, filtered, selected, execute])

  // Reset selection when query changes
  useEffect(() => setSelected(0), [query])

  // Group items
  const groups = filtered.reduce<Record<string, typeof allItems>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={() => { setOpen(false); setQuery("") }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages and actions..."
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[340px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-8">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                Object.entries(groups).map(([group, items]) => {
                  // Calculate global index offset for this group
                  const groupStart = filtered.indexOf(items[0])
                  return (
                    <div key={group}>
                      <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {group}
                      </p>
                      {items.map((item, i) => {
                        const globalIdx = groupStart + i
                        const isSelected = globalIdx === selected
                        return (
                          <button
                            key={item.href}
                            onClick={() => execute(item.href)}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-secondary"
                            }`}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left font-medium">{item.label}</span>
                            {isSelected && <ArrowRight className="w-3.5 h-3.5 opacity-60" />}
                          </button>
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 bg-muted">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 bg-muted">↵</kbd> open</span>
              <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 bg-muted">ESC</kbd> close</span>
              <span className="ml-auto flex items-center gap-1">
                <kbd className="border border-border rounded px-1 py-0.5 bg-muted">Ctrl</kbd>
                <kbd className="border border-border rounded px-1 py-0.5 bg-muted">K</kbd>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
