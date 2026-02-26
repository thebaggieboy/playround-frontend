"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, FileText, Plus, Clock, Activity } from "lucide-react"
import { selectToken } from '../../features/token/tokenSlice'
import { selectUser } from "../../features/user/userSlice"
import { useSelector } from "react-redux"
import { selectUserEmail } from '../../features/user/userActiveEmail'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

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

  useEffect(() => {
    if (!token) return

    let isMounted = true

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const headers = { 'Authorization': `JWT ${token}` }

        const [modelsRes, reportsRes, scenariosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/models/`, { headers }).catch(() => null),
          fetch(`${API_BASE_URL}/reports/`, { headers }).catch(() => null),
          fetch(`${API_BASE_URL}/scenarios/`, { headers }).catch(() => null)
        ])

        let modelsData = []
        let reportsData = []
        let scenariosData = []

        if (modelsRes?.ok) {
          const data = await modelsRes.json()
          modelsData = data.results || data
        }
        if (reportsRes?.ok) {
          const data = await reportsRes.json()
          reportsData = data.results || data
        }
        if (scenariosRes?.ok) {
          const data = await scenariosRes.json()
          scenariosData = data.results || data
        }

        if (isMounted) {
          const mData = Array.isArray(modelsData) ? modelsData : (modelsData?.results || []);
          const rData = Array.isArray(reportsData) ? reportsData : (reportsData?.results || []);
          const sData = Array.isArray(scenariosData) ? scenariosData : (scenariosData?.results || []);

          setStats({
            activeModels: mData.length || (modelsData?.count || 0),
            totalReports: rData.length || (reportsData?.count || 0),
            completedReports: rData.filter((r: any) => r.status === 'completed').length || 0,
            scenarios: sData.length || (scenariosData?.count || 0),
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
      <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6" >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground capitalize">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here is what's happening with your financial models today.
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/models/input/basic')}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="inline">New Model</span>
            </motion.button>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Quick Stats */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Models", value: isLoading ? "..." : stats.activeModels, icon: BarChart3, color: "bg-blue-50" },
                { label: "Total Reports", value: isLoading ? "..." : stats.totalReports, icon: FileText, color: "bg-purple-50" },
                { label: "Completed Reports", value: isLoading ? "..." : stats.completedReports, icon: Activity, color: "bg-green-50" },
                { label: "Scenarios Used", value: isLoading ? "..." : stats.scenarios, icon: TrendingUp, color: "bg-orange-50" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-primary opacity-60" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Recent Reports */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
              <motion.button
                onClick={() => router.push('/dashboard/reports')}
                whileHover={{ x: 4 }}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View All →
              </motion.button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-muted-foreground p-4 bg-card rounded-lg border border-border">Loading recent activity...</div>
              ) : recentReports.length > 0 ? (
                recentReports.map((report: any, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.name || "Untitled Report"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {report.date_created ? new Date(report.date_created).toLocaleDateString() : 'Recently'}
                            <span className="mx-2">•</span>
                            <span className={`capitalize ${report.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {report.status || 'Processing'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/80"
                      >
                        Open
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground mb-4">No reports generated yet.</p>
                  <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
                    Go to Reports
                  </Button>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  )
}
