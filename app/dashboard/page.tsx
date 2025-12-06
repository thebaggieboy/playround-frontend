"use client"

import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import TemplatesSection from "@/components/dashboard/templates-section"
import ModelsSection from "@/components/dashboard/models-section"
import AnalyticsSection from "@/components/dashboard/analytics-section"
import QuickActionsSection from "@/components/dashboard/quick-actions"

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
        <DashboardHeader />

        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <QuickActionsSection />
            </motion.div>

            {/* Analytics Overview */}
            <motion.div variants={itemVariants}>
              <AnalyticsSection />
            </motion.div>

            {/* Templates */}
            <motion.div variants={itemVariants}>
              <TemplatesSection />
            </motion.div>

            {/* Recent Models */}
            <motion.div variants={itemVariants}>
              <ModelsSection />
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
