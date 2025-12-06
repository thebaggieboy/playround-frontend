"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, FileText } from "lucide-react"

const stats = [
  { icon: FileText, label: "Total Models", value: "24", change: "+12%" },
  { icon: Users, label: "Collaborators", value: "8", change: "+2" },
  { icon: TrendingUp, label: "Avg Accuracy", value: "94.2%", change: "+3.1%" },
  { icon: BarChart3, label: "Reports Generated", value: "156", change: "+45" },
]

export default function AnalyticsSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-green-600">{stat.change}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
