"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, TrendingUp, FileText, Plus, Clock, Activity, MessageSquare, Sliders, X, Sparkles } from "lucide-react"
import { selectToken } from '../../features/token/tokenSlice'
import { selectUser } from "../../features/user/userSlice"
import { useSelector } from "react-redux"
import { selectUserEmail } from '../../features/user/userActiveEmail'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripHorizontal } from "lucide-react"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

function SortableStatCard({ stat, isLoading, statsData }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`relative bg-card border ${isDragging ? 'border-primary shadow-lg' : 'border-border'} rounded-xl p-4 hover:shadow-md transition-all duration-300 group cursor-default overflow-hidden`}
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${
        stat.color.includes('blue') ? 'from-blue-500 to-blue-400' :
        stat.color.includes('purple') ? 'from-purple-500 to-purple-400' :
        stat.color.includes('green') ? 'from-emerald-500 to-emerald-400' :
        stat.color.includes('indigo') ? 'from-indigo-500 to-indigo-400' :
        'from-primary to-primary/70'
      } opacity-80`} />
      
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground p-1 hover:bg-secondary rounded-md transition-all touch-none"
      >
        <GripHorizontal className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-start gap-3 mt-1">
        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
          <stat.icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground font-medium truncate mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight leading-none">{isLoading ? "—" : statsData[stat.valueKey]}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const user = useSelector(selectUser)
  const user_email = useSelector(selectUserEmail)
  const tokenFromTokenSlice = useSelector(selectToken)
  const tokenFromAuth = useSelector((state: any) => state.auth?.token)
  const token = tokenFromTokenSlice || tokenFromAuth

  const router = useRouter()

  const [stats, setStats] = useState({
    activeModels: 0,
    totalReports: 0,
    completedReports: 0,
    scenarios: 0,
 
  })

  const [recentReports, setRecentReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [showOnboarding, setShowOnboarding] = useState(false)

  // #3 — Drag-to-reorder state
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const defaultStats = [
    { id: "active-models", label: "Active Models", valueKey: 'activeModels', icon: BarChart3, color: "bg-blue-50 text-blue-600" },
    { id: "total-reports", label: "Total Reports", valueKey: 'totalReports', icon: FileText, color: "bg-purple-50 text-purple-600" },
    { id: "scenarios", label: "Scenarios", valueKey: 'scenarios', icon: Activity, color: "bg-green-50 text-green-600" },
  
    { id: "completed", label: "Completed", valueKey: 'completedReports', icon: Activity, color: "bg-indigo-50 text-indigo-600" },
  ]
  const [cardOrder, setCardOrder] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('plyground_dashboard_cards')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length === defaultStats.length) {
          setCardOrder(parsed)
          return
        }
      } catch {}
    }
    setCardOrder(defaultStats.map(s => s.id))
  }, [])

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const newArray = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem('plyground_dashboard_cards', JSON.stringify(newArray))
        return newArray
      })
    }
  }

  const orderedStats = cardOrder.length > 0 
    ? cardOrder.map(id => defaultStats.find(s => s.id === id)!).filter(Boolean)
    : defaultStats

  useEffect(() => {
    // Show onboarding if it hasn't been seen in this session
    if (!sessionStorage.getItem('hasSeenOnboarding')) {
      const timer = setTimeout(() => setShowOnboarding(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    sessionStorage.setItem('hasSeenOnboarding', 'true')
  }

  const handleSelectOnboardingOption = (path: string) => {
    setShowOnboarding(false)
    sessionStorage.setItem('hasSeenOnboarding', 'true')
    router.push(path)
  }

  useEffect(() => {
    if (!token) return

    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const actualToken = typeof token === 'object' && token?.access ? token.access : token
        const headers = { 'Authorization': `JWT ${actualToken}` }

        const [modelsRes, reportsRes, scenariosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/models/`, { headers }).catch(() => null),
          fetch(`${API_BASE_URL}/reports/`, { headers }).catch(() => null),
          fetch(`${API_BASE_URL}/scenarios/`, { headers }).catch(() => null)
        ])

        let modelsData = []
        let reportsData = []
        let scenariosData = []

        if (modelsRes?.ok) {
          modelsData = await modelsRes.json()
        }
        if (reportsRes?.ok) {
          reportsData = await reportsRes.json()
        }
        if (scenariosRes?.ok) {
          scenariosData = await scenariosRes.json()
        }

        if (isMounted) {
          const mData = Array.isArray(modelsData) ? modelsData : (modelsData?.results || []);
          const rData = Array.isArray(reportsData) ? reportsData : (reportsData?.results || []);
          const sData = Array.isArray(scenariosData) ? scenariosData : (scenariosData?.results || []);

          setStats({
            activeModels: modelsData?.count ?? mData.length,
            totalReports: reportsData?.count ?? rData.length,
            completedReports: rData.filter((r: any) => r.status === 'completed').length || 0,
            scenarios: scenariosData?.count ?? sData.length,
          })



          // Get 3 most recent reports
          if (rData.length > 0) {
            const sortedReports = rData.sort((a: any, b: any) =>
              new Date(b.date_created || b.created_at || 0).getTime() - new Date(a.date_created || a.created_at || 0).getTime()
            ).slice(0, 3)

            setRecentReports(sortedReports as any)
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [token])

  // Derived user displayName
  let displayName = "User"
  if (user?.first_name) {
    displayName = user.first_name
  } else if (user_email) {
    displayName = user_email.split('@')[0]
  } else if (user?.email) {
    displayName = user.email.split('@')[0]
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <motion.div
      className="flex flex-col overflow-hidden flex-1"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <header className="border-b border-border bg-card px-5 py-3">
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="font-semibold text-foreground capitalize tracking-tight">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Here's what's happening with your financial models today.
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/models/input/basic')}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium text-xs hover:shadow-md transition-shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="inline">New Model</span>
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Quick Stats (#3 reorderable items) */}
          <motion.section variants={itemVariants} className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Quick Overview</h2>
            
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={cardOrder.length > 0 ? cardOrder : defaultStats.map(s => s.id)} 
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {orderedStats.map((stat) => (
                    <SortableStatCard 
                      key={stat.id} 
                      stat={stat} 
                      isLoading={isLoading} 
                      statsData={stats} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </motion.section>

          {/* Recent Reports */}
          <motion.section variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Recent Reports</h2>
              <motion.button
                onClick={() => router.push('/dashboard/reports')}
                whileHover={{ x: 2 }}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                View All →
              </motion.button>
            </div>

            <div className="space-y-1.5">
              {isLoading ? (
                <div className="text-xs text-muted-foreground p-3 bg-card rounded-lg border border-border">Loading recent activity...</div>
              ) : recentReports.length > 0 ? (
                recentReports.map((report: any, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 2 }}
                    className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-xs text-foreground">{report.name || "Untitled Report"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {report.date_created ? new Date(report.date_created).toLocaleDateString() : 'Recently'}
                            <span className="mx-1">·</span>
                            <span className={`capitalize ${report.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {report.status || 'Processing'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/80"
                      >
                        Open
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                  <p className="text-xs text-muted-foreground mb-3">No reports generated yet.</p>
                  <Button variant="outline" onClick={() => router.push('/dashboard/reports')} className="text-xs h-7 px-3">
                    Go to Reports
                  </Button>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
            >
              <button 
                onClick={handleCloseOnboarding}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8 sm:p-10 space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors cursor-default">
                    Welcome back, {displayName}!
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
                    How would you like to interact with your financial models today?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOnboardingOption('/dashboard/chat')}
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                  >
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-all">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Chat with Models</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Have a conversational experience to explore data and get insights instantly.
                    </p>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectOnboardingOption('/dashboard/models/input/basic')}
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all group"
                  >
                    <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-all">
                      <Sliders className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Use Input Forms</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Manually tweak parameters and fine-tune variables using our detailed forms.
                    </p>
                  </motion.button>
                </div>
                
                <div className="pt-6 text-center">
                  <button 
                    onClick={handleCloseOnboarding}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Skip for now, take me to my dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
