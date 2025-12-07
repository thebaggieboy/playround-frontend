"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  // Color system: Primary (#FF1B6D), Secondary (#1A2654), Tertiary (#7C3AED)
  const colors = {
    primary: "#FF1B6D",
    primaryLight: "rgba(255, 27, 109, 0.15)",
    primaryMuted: "rgba(255, 27, 109, 0.08)",
    secondary: "#1A2654",
    tertiary: "#7C3AED",
    tertiaryMuted: "rgba(124, 58, 237, 0.1)",
  }

  const gradientBlurStyle = {
    position: "absolute" as const,
    borderRadius: "9999px",
    filter: "blur(80px)",
    pointerEvents: "none" as const,
  }

  return (
    <section
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, ${colors.secondary}, ${colors.secondary})`,
      }}
    >
      <div
        style={{
          ...gradientBlurStyle,
          top: "80px",
          right: "40px",
          width: "384px",
          height: "384px",
          background: colors.primaryLight,
        }}
      />
      <div
        style={{
          ...gradientBlurStyle,
          bottom: "-80px",
          left: "-80px",
          width: "384px",
          height: "384px",
          background: colors.tertiaryMuted,
        }}
      />
      <div
        style={{
          ...gradientBlurStyle,
          bottom: "128px",
          right: "33%",
          width: "288px",
          height: "288px",
          background: colors.primaryMuted,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg backdrop-blur-sm border"
                style={{
                  backgroundColor: colors.primaryLight,
                  color: colors.primary,
                  borderColor: `rgba(255, 27, 109, 0.4)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(255, 27, 109, 0.6)`
                  e.currentTarget.style.boxShadow = `0 0 30px ${colors.primary}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `rgba(255, 27, 109, 0.4)`
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                <Sparkles className="w-4 h-4" />
                Financial modeling made simple
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-tight text-balance tracking-tight"
            >
              Financial Analysis for{" "}
              <span
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.primary}, ${colors.tertiary})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Everyone
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-sm text-white/80 max-w-xl text-balance"
            >
              Playground is a one-stop financial analysis platform that makes complex financial modeling accessible to
              both experienced professionals and novices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-lg px-8 h-12 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 w-full sm:w-auto text-white"
                  style={{
                    backgroundColor: colors.primary,
                    boxShadow: `0 0 30px ${colors.primary}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}E6`
                    e.currentTarget.style.boxShadow = `0 0 40px ${colors.primary}60`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary
                    e.currentTarget.style.boxShadow = `0 0 30px ${colors.primary}40`
                  }}
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                className="rounded-lg px-8 h-12 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto text-white"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(255, 27, 109, 0.8)`
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)"
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"
                }}
              >
                View Demo
              </Button>
            </motion.div>

            <div className="pt-4 flex items-center gap-4 text-white/70 text-sm">
              <div className="flex -space-x-2">
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{
                    backgroundColor: `${colors.primary}66`,
                    borderColor: colors.secondary,
                  }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{
                    backgroundColor: `${colors.tertiary}66`,
                    borderColor: colors.secondary,
                  }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2"
                  style={{
                    backgroundColor: `${colors.primary}4D`,
                    borderColor: colors.secondary,
                  }}
                />
              </div>
              <span>Join 2,900+ companies already growing</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-96 md:h-full min-h-96"
          >
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-shadow duration-500 hover:shadow-3xl border"
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${colors.primary}10, ${colors.tertiary}05, ${colors.primary}05)`,
                borderColor: `${colors.primary}4D`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${colors.primary}80`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.primary}4D`
              }}
            >
              <img
                src="/financial-dashboard-with-charts-analytics-and-mode.jpg"
                alt="Playground Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
