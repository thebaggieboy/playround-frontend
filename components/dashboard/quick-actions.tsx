"use client"

import { motion } from "framer-motion"
import { Plus, Upload, FileText } from "lucide-react"

const actions = [
  { icon: Plus, label: "New Model", color: "bg-blue-50 text-primary" },
  { icon: Upload, label: "Upload File", color: "bg-green-50 text-green-600" },
  { icon: FileText, label: "New Template", color: "bg-purple-50 text-purple-600" },
]

export default function QuickActionsSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border border-border transition-all ${action.color}`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <p className="font-medium text-sm">{action.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
