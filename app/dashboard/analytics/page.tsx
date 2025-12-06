"use client"

import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { BarChart3, TrendingUp, Users, FileText, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const chartData = [
  { month: "Jan", models: 12, accuracy: 88 },
  { month: "Feb", models: 19, accuracy: 90 },
  { month: "Mar", models: 15, accuracy: 92 },
  { month: "Apr", models: 25, accuracy: 91 },
  { month: "May", models: 22, accuracy: 94 },
  { month: "Jun", models: 30, accuracy: 93 },
]

const stats = [
  { icon: FileText, label: "Total Models", value: "156", change: "+12%" },
  { icon: Users, label: "Team Members", value: "8", change: "+2" },
  { icon: TrendingUp, label: "Avg Accuracy", value: "92.1%", change: "+3.1%" },
  { icon: BarChart3, label: "Reports Generated", value: "342", change: "+45" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <motion.main
        className="flex-1 flex flex-col overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <DashboardHeader />

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
                  <p className="text-sm lg:text-base text-muted-foreground mt-1">
                    Track your platform usage and performance
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 lg:px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Last 6 months</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="bg-card border border-border rounded-xl p-4 lg:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                  </div>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-xl lg:text-2xl font-bold text-foreground">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Line Chart */}
              <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">Models Created Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="models"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Bar Chart */}
              <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-4 lg:p-6">
                <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">Accuracy Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
