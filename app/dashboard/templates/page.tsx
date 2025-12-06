"use client"

import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const templates = [
  {
    id: 1,
    name: "DCF Analysis",
    description: "Discounted Cash Flow valuation model",
    category: "Valuation",
    icon: "📊",
    models: 12,
    rating: 4.8,
  },
  {
    id: 2,
    name: "IRR Calculator",
    description: "Internal Rate of Return analysis",
    category: "Returns",
    icon: "📈",
    models: 8,
    rating: 4.9,
  },
  {
    id: 3,
    name: "NPV Model",
    description: "Net Present Value calculations",
    category: "Valuation",
    icon: "💰",
    models: 15,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Budget Forecast",
    description: "Annual budget forecasting",
    category: "Planning",
    icon: "📋",
    models: 20,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Break-Even Analysis",
    description: "Break-even point calculations",
    category: "Analysis",
    icon: "🎯",
    models: 6,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Sensitivity Analysis",
    description: "What-if scenario modeling",
    category: "Analysis",
    icon: "🔄",
    models: 10,
    rating: 4.9,
  },
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

export default function TemplatesPage() {
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
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Templates</h1>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                  Browse and manage financial model templates
                </p>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch sm:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  <Filter className="w-5 h-5 text-muted-foreground" />
                </motion.button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full sm:w-auto">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Template</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            </motion.div>

            {/* Templates Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                  className="bg-card border border-border rounded-xl p-4 lg:p-6 cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl lg:text-4xl">{template.icon}</div>
                    <span className="px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {template.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 text-base lg:text-lg">{template.name}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-4">{template.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                      <span>{template.models} models</span>
                      <span>⭐ {template.rating}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 lg:px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs lg:text-sm font-medium"
                    >
                      Use
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
