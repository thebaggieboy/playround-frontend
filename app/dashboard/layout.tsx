"use client"

import type React from "react"

import { motion } from "framer-motion"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { CommandPalette } from "@/components/CommandPalette"
import OnboardingTour from "@/components/onboarding-tour"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useSelector(selectToken)
  const router = useRouter()

  useEffect(() => {
    if (!token || token.trim() === "") {
      router.push("/signin")
    }
  }, [token, router])

  return (
    <div 
      className="dashboard relative flex h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background print:h-auto print:bg-white text-foreground print:text-black print:overflow-visible"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, sans-serif", letterSpacing: "-0.01em" }}
    >
      <CommandPalette />
      <OnboardingTour />
      <DashboardSidebar />

      <motion.main
        className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0 print:overflow-visible print:bg-white print:text-black"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {children}
      </motion.main>
    </div>
  )
}
