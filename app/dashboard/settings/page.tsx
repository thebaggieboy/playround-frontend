"use client"

import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Bell, Lock, User, Palette, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const settingsSections = [
  {
    icon: User,
    title: "Profile Settings",
    description: "Manage your account information and preferences",
    items: ["Full Name", "Email Address", "Phone Number", "Avatar"],
  },
  {
    icon: Lock,
    title: "Security",
    description: "Manage your password and security settings",
    items: ["Change Password", "Two-Factor Authentication", "Active Sessions", "Login History"],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how you receive notifications",
    items: ["Email Notifications", "Model Alerts", "Team Updates", "Weekly Digest"],
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize your dashboard appearance",
    items: ["Theme", "Color Scheme", "Font Size", "Layout"],
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

export default function SettingsPage() {
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
          <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 max-w-4xl">
            {/* Header */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-sm lg:text-base text-muted-foreground">Manage your account and preferences</p>
            </motion.div>

            {/* Settings Sections */}
            <motion.div variants={itemVariants} className="space-y-3 lg:space-y-4">
              {settingsSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="bg-card border border-border rounded-xl p-4 lg:p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <section.icon className="w-5 lg:w-6 h-5 lg:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base lg:text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4">{section.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                        {section.items.map((item) => (
                          <motion.button
                            key={item}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-2 lg:px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs lg:text-sm text-foreground transition-colors text-left truncate"
                          >
                            {item}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              variants={itemVariants}
              className="bg-red-50 border border-red-200 rounded-xl p-4 lg:p-6 space-y-4"
            >
              <div className="flex items-start gap-3 lg:gap-4">
                <div className="p-2 lg:p-3 bg-red-100 rounded-lg flex-shrink-0">
                  <LogOut className="w-5 lg:w-6 h-5 lg:h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-semibold text-red-900 mb-1">Danger Zone</h3>
                  <p className="text-xs lg:text-sm text-red-700 mb-3 lg:mb-4">Irreversible actions</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto">Delete Account</Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
