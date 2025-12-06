"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const templates = [
  { name: "DCF Analysis", description: "Discounted Cash Flow valuation", icon: "📊" },
  { name: "IRR Calculator", description: "Internal Rate of Return analysis", icon: "📈" },
  { name: "NPV Model", description: "Net Present Value calculations", icon: "💰" },
  { name: "Budget Forecast", description: "Annual budget forecasting", icon: "📋" },
]

export default function TemplatesSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Available Templates</h2>
        <motion.button whileHover={{ x: 4 }} className="text-primary text-sm font-medium flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-all"
          >
            <div className="text-3xl mb-3">{template.icon}</div>
            <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
