"use client"

import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Search, Filter, Plus, Download, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const models = [
  {
    id: 1,
    name: "Q4 Financial Forecast",
    template: "DCF Analysis",
    date: "2 days ago",
    status: "Completed",
    accuracy: "94.2%",
  },
  {
    id: 2,
    name: "Revenue Projection 2025",
    template: "Budget Forecast",
    date: "1 week ago",
    status: "Completed",
    accuracy: "91.8%",
  },
  {
    id: 3,
    name: "Investment Analysis",
    template: "NPV Model",
    date: "3 days ago",
    status: "In Progress",
    accuracy: "—",
  },
  {
    id: 4,
    name: "Portfolio Valuation",
    template: "IRR Calculator",
    date: "5 days ago",
    status: "Completed",
    accuracy: "96.1%",
  },
  {
    id: 5,
    name: "Market Analysis 2024",
    template: "Sensitivity Analysis",
    date: "1 week ago",
    status: "Completed",
    accuracy: "92.5%",
  },
  {
    id: 6,
    name: "Cost Optimization Study",
    template: "Break-Even Analysis",
    date: "2 weeks ago",
    status: "Completed",
    accuracy: "95.3%",
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

export default function ModelsPage() {
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
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Models</h1>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                  Manage and analyze your financial models
                </p>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-stretch sm:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search models..."
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
                  <span className="hidden sm:inline">New Model</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </motion.div>

            {/* Models Table - Responsive */}
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Model Name
                      </th>
                      <th className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Template
                      </th>
                      <th className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Accuracy
                      </th>
                      <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model, index) => (
                      <motion.tr
                        key={model.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b border-border hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-foreground">
                          {model.name}
                        </td>
                        <td className="hidden sm:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">
                          {model.template}
                        </td>
                        <td className="hidden md:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">
                          {model.date}
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm">
                          <span
                            className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${
                              model.status === "Completed" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {model.status}
                          </span>
                        </td>
                        <td className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-medium text-foreground">
                          {model.accuracy}
                        </td>
                        <td className="px-3 lg:px-6 py-3 lg:py-4">
                          <motion.div className="flex items-center gap-1 lg:gap-2" whileHover={{ scale: 1.05 }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-secondary rounded transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-secondary rounded transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-muted-foreground" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 hover:bg-secondary rounded transition-colors"
                              title="Delete"
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
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
