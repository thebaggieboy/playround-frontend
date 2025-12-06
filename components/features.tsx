"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { BarChart3, Upload, PieChart, FileText, TrendingUp, Zap, Share2, CheckCircle2, Sparkles } from "lucide-react"

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const colors = {
    primary: "#FF1B6D",
    secondary: "#1A2654",
    tertiary: "#7C3AED",
    dark: "#0f172a",
    light: "#f8fafc",
    lightGray: "#e2e8f0",
  }

  const mvpFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Model Templates",
      description:
        "Access pre-built financial models including DCF analysis, IRR calculations, NPV analysis, and custom scenario modeling for rapid analysis",
      badge: "Essential",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "File Upload",
      description:
        "Upload and parse CSV, XLSX, and JSON files instantly with intelligent data mapping and validation capabilities",
      badge: "Core",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Charts",
      description:
        "Create beautiful, interactive charts and visualizations with real-time data updates and export options",
      badge: "Analytics",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Export PDF",
      description: "Generate professional reports with custom branding, charts, and executive summaries",
      badge: "Reports",
    },
  ]

  const futureFeatures = [
    { icon: <TrendingUp className="w-5 h-5" />, text: "Stock & portfolio analytics", detail: "Real-time market data" },
    { icon: <Share2 className="w-5 h-5" />, text: "Team collaboration", detail: "Shared workspaces & permissions" },
    { icon: <Zap className="w-5 h-5" />, text: "AI-powered insights", detail: "Automated recommendations" },
  ]

  return (
    <section
      ref={ref}
      id="features"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.secondary}15 100%)` }}
    >
      <div
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.tertiary}, transparent)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}30` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span style={{ color: colors.primary }} className="text-sm font-semibold">
              MVP Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.light }}>
            Powerful Features{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Available Now
            </span>
          </h2>
          <p className="text-lg" style={{ color: `${colors.light}b3` }}>
            Everything you need for professional financial analysis and modeling
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mvpFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="relative group cursor-pointer"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.tertiary}30)` }}
              />
              <div
                className="relative rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}40, ${colors.secondary}20)`,
                  borderColor: hoveredFeature === index ? colors.primary : `${colors.primary}20`,
                  boxShadow: hoveredFeature === index ? `0 20px 40px ${colors.primary}20` : "none",
                }}
              >
                <div
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: `${colors.tertiary}20`, color: colors.tertiary }}
                >
                  {feature.badge}
                </div>

                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}30, ${colors.tertiary}20)`,
                    color: colors.primary,
                    boxShadow: hoveredFeature === index ? `0 8px 20px ${colors.primary}30` : "none",
                  }}
                >
                  {feature.icon}
                </div>

                <h3
                  className="text-lg font-semibold mb-2 transition-colors duration-300"
                  style={{ color: colors.light }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm transition-colors duration-300" style={{ color: `${colors.light}99` }}>
                  {feature.description}
                </p>

                <div
                  className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: hoveredFeature === index ? "100%" : "0%",
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.tertiary})`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative group"
        >
          <div
            className="absolute inset-0 rounded-3xl opacity-30 blur-xl"
            style={{ background: `linear-gradient(135deg, ${colors.primary}40, ${colors.tertiary}40)` }}
          />
          <div
            className="relative rounded-3xl p-8 md:p-12 border backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}50, ${colors.secondary}30)`,
              borderColor: `${colors.primary}30`,
            }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              <h3 className="text-2xl font-bold" style={{ color: colors.light }}>
                Coming Soon
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {futureFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group/item"
                >
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 group-hover/item:translate-x-2"
                    style={{ background: `${colors.primary}10` }}
                  >
                    <div
                      className="mt-1 flex-shrink-0 transition-all duration-300 group-hover/item:scale-125"
                      style={{ color: colors.primary }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold transition-colors duration-300" style={{ color: colors.light }}>
                        {feature.text}
                      </div>
                      <div
                        className="text-xs mt-1 transition-colors duration-300"
                        style={{ color: `${colors.light}80` }}
                      >
                        {feature.detail}
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `${colors.primary}60` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
