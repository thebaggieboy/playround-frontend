"use client"

import { motion } from "framer-motion"
import { Download, Trash2, ArrowRight } from "lucide-react"

const models = [
  { name: "Q4 Financial Forecast", template: "DCF Analysis", date: "2 days ago", status: "Completed" },
  { name: "Revenue Projection 2025", template: "Budget Forecast", date: "1 week ago", status: "Completed" },
  { name: "Investment Analysis", template: "NPV Model", date: "3 days ago", status: "In Progress" },
  { name: "Portfolio Valuation", template: "IRR Calculator", date: "5 days ago", status: "Completed" },
]

export default function ModelsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Models</h2>
        <motion.button whileHover={{ x: 4 }} className="text-primary text-sm font-medium flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Model Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Template</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <motion.tr
                  key={model.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{model.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{model.template}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{model.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        model.status === "Completed" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {model.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </motion.button>
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
