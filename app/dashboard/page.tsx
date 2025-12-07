"use client"

import { motion } from "framer-motion"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { BarChart3, TrendingUp, FileText, Plus } from "lucide-react"

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
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <motion.main
        className="flex-1 flex flex-col overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back to your financial models</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Model</span>
            </motion.button>
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
                  { label: "Active Models", value: "12", icon: BarChart3, color: "bg-blue-50" },
                  { label: "Total Reports", value: "48", icon: FileText, color: "bg-purple-50" },
                  { label: "This Month", value: "+23%", icon: TrendingUp, color: "bg-green-50" },
                  { label: "Last Updated", value: "2 hrs ago", icon: BarChart3, color: "bg-orange-50" },
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

            {/* Recent Models */}
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Recent Models</h2>
                <motion.a
                  href="#"
                  whileHover={{ x: 4 }}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View All →
                </motion.a>
              </div>
              <div className="space-y-3">
                {["Revenue Forecast 2025", "Operating Budget Analysis", "Market Growth Model"].map((model, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{model}</p>
                          <p className="text-xs text-muted-foreground">Updated 2 days ago</p>
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
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
