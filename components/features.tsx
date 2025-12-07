"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import {
  BarChart3,
  Upload,
  PieChart,
  FileText,
  TrendingUp,
  Zap,
  Share2,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Infinity,
} from "lucide-react"

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const hoveredIndex = hoveredFeature // Declare hoveredIndex variable

  const colors = {
    primary: "#1e40af",
    lightBg: "#ffffff",
    accent: "#0f172a",
    border: "#e5e7eb",
    lightGray: "#f9fafb",
    mediumGray: "#6b7280",
    darkText: "#111827",
    accentColor: "#3b82f6",
  }

  const mvpFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Model Templates",
      description:
        "Access pre-built financial models including DCF analysis, IRR calculations, NPV analysis, and custom scenario modeling for rapid analysis",
      badge: "Essential",
      accentIcon: <Sparkles className="w-4 h-4" />,
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "File Upload",
      description:
        "Upload and parse CSV, XLSX, and JSON files instantly with intelligent data mapping and validation capabilities",
      badge: "Core",
      accentIcon: <Infinity className="w-4 h-4" />,
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Charts",
      description:
        "Create beautiful, interactive charts and visualizations with real-time data updates and export options",
      badge: "Analytics",
      accentIcon: <Lightbulb className="w-4 h-4" />,
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Export PDF",
      description: "Generate professional reports with custom branding, charts, and executive summaries",
      badge: "Reports",
      accentIcon: <CheckCircle2 className="w-4 h-4" />,
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
      className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div
        className="absolute top-0 left-1/4 right-1/4 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.primary}30, transparent)`,
          pointerEvents: "none",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border"
            style={{
              backgroundColor: `${colors.primary}10`,
              borderColor: colors.primary,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span style={{ color: colors.primary }} className="text-xs md:text-sm font-semibold">
              MVP Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: colors.darkText }}>
            Powerful Features <span style={{ color: colors.primary }}>Available Now</span>
          </h2>
          <p className="text-base md:text-lg" style={{ color: colors.mediumGray, maxWidth: "600px", margin: "0 auto" }}>
            Everything you need for professional financial analysis and modeling
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
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
                className="relative rounded-xl p-6 border transition-all duration-300 group-hover:-translate-y-1"
                style={{
                  backgroundColor: colors.lightGray,
                  borderColor: hoveredFeature === index ? colors.primary : colors.border,
                  boxShadow: hoveredFeature === index ? `0 8px 24px ${colors.primary}15` : "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                  style={{
                    background: hoveredIndex === index ? colors.primary : `${colors.primary}20`,
                    transition: "all 0.3s ease",
                  }}
                />

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary,
                    }}
                  >
                    {feature.badge}
                  </div>
                  <div style={{ color: `${colors.primary}40` }}>{feature.accentIcon}</div>
                </div>

                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                  }}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.darkText }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.mediumGray }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div
            className="relative rounded-2xl p-8 md:p-10 lg:p-12 border transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: colors.lightGray,
              borderColor: colors.border,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
              }}
            />

            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: colors.darkText }}>
                Coming Soon
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {futureFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="group/item"
                >
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg transition-all duration-300 group-hover/item:translate-x-1"
                    style={{
                      backgroundColor: `${colors.primary}08`,
                      borderLeft: `3px solid ${colors.primary}`,
                    }}
                  >
                    <div
                      className="mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                      style={{ color: colors.primary }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm md:text-base" style={{ color: colors.darkText }}>
                        {feature.text}
                      </div>
                      <div className="text-xs mt-1" style={{ color: colors.mediumGray }}>
                        {feature.detail}
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
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
