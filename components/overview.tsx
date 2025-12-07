"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, FileUp, BarChart3, Download, Zap, Shield, Layers } from "lucide-react"

export function Overview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const colors = {
    primary: "#FF1B6D",
    secondary: "#1A2654",
    tertiary: "#7C3AED",
    background: "#0F172A",
    foreground: "#F1F5F9",
    foregroundMuted: "#94A3B8",
    card: "#1E293B",
  }

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Template-Based Models",
      description:
        "Access pre-built financial models including DCF (Discounted Cash Flow), IRR (Internal Rate of Return), and NPV (Net Present Value) calculations. Deploy sophisticated financial analysis frameworks instantly without manual setup.",
      gradient: `linear-gradient(135deg, ${colors.primary}19 0%, ${colors.primary}0d 100%)`,
      borderColor: `${colors.primary}33`,
      hoverBg: `${colors.primary}26`,
    },
    {
      icon: <FileUp className="w-6 h-6" />,
      title: "Upload & Parse",
      description:
        "Seamlessly import and automatically parse XLSM and CSV files with intelligent data recognition. Our advanced parsing engine handles complex financial data structures and preserves formatting for accurate analysis.",
      gradient: `linear-gradient(135deg, ${colors.tertiary}19 0%, ${colors.tertiary}0d 100%)`,
      borderColor: `${colors.tertiary}33`,
      hoverBg: `${colors.tertiary}26`,
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Visualize & Analyze",
      description:
        "Transform raw financial data into compelling interactive charts and dashboards. Identify trends, outliers, and key performance indicators with advanced analytics and real-time metric calculations.",
      gradient: `linear-gradient(135deg, ${colors.secondary}19 0%, ${colors.secondary}0d 100%)`,
      borderColor: `${colors.secondary}33`,
      hoverBg: `${colors.secondary}26`,
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Reports",
      description:
        "Generate professional PDF reports with customizable layouts, branding options, and comprehensive financial summaries. Share insights with stakeholders in polished, presentation-ready formats.",
      gradient: `linear-gradient(135deg, ${colors.primary}19 0%, ${colors.tertiary}0d 100%)`,
      borderColor: `${colors.primary}33`,
      hoverBg: `${colors.primary}1a`,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Processing",
      description:
        "Experience lightning-fast data processing with optimized algorithms that handle large datasets instantly. Get immediate results for complex financial calculations and scenario analysis.",
      gradient: `linear-gradient(135deg, ${colors.secondary}19 0%, ${colors.primary}0d 100%)`,
      borderColor: `${colors.secondary}33`,
      hoverBg: `${colors.secondary}1a`,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption and security protocols protect your sensitive financial data. Compliance with industry standards ensures your information remains secure and confidential.",
      gradient: `linear-gradient(135deg, ${colors.tertiary}19 0%, ${colors.primary}0d 100%)`,
      borderColor: `${colors.tertiary}33`,
      hoverBg: `${colors.tertiary}1a`,
    },
  ]

  return (
    <section
      ref={ref}
      id="overview"
      className="py-24 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: colors.background,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${colors.background}, ${colors.background}dd, ${colors.primary}0d)`,
        }}
      />
      <div
        className="absolute top-20 -left-40 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background: colors.primary,
          filter: "blur(96px)",
        }}
      />
      <div
        className="absolute bottom-0 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: colors.secondary,
          filter: "blur(96px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: `${colors.primary}1a`,
              border: `1px solid ${colors.primary}33`,
            }}
          >
            <Layers className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Comprehensive Solution
            </span>
          </motion.div>

          <h2
            className="text-5xl text-white md:text-5xl font-bold mb-6"
            
          >
            Powerful Features
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed mb-2" style={{ color: colors.foregroundMuted }}>
            A comprehensive financial analysis platform designed for modern finance professionals who demand
            sophisticated tools without unnecessary complexity.
          </p>
      
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-xl p-8 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                background: feature.gradient,
                border: `1px solid ${feature.borderColor}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = feature.hoverBg
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = feature.gradient
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}0d 0%, transparent 100%)`,
                }}
              />

              <div
                className="relative z-10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}33 0%, ${colors.primary}0d 100%)`,
                  color: colors.primary,
                }}
              >
                {feature.icon}
              </div>

              <h3
                className="text-xl font-semibold mb-3 relative z-10 group-hover:text-primary transition-colors duration-300"
                style={{ color: colors.foreground }}
              >
                {feature.title}
              </h3>
              <p
                className="leading-relaxed relative text-xs z-10 transition-colors duration-300"
                style={{ color: colors.foregroundMuted }}
              >
                {feature.description}
              </p>

              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.tertiary})`,
                }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Financial Models", value: "50+", icon: BarChart3 },
            { label: "Processing Speed", value: "<100ms", icon: Zap },
            { label: "Data Formats", value: "15+", icon: FileUp },
            { label: "Uptime Guarantee", value: "99.9%", icon: Shield },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg p-6 text-center transition-colors duration-300 backdrop-blur-sm"
                style={{
                  background: `${colors.card}80`,
                  border: `1px solid ${colors.primary}1a`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary}4d`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colors.primary}1a`
                }}
              >
                <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: colors.primary, opacity: 0.8 }} />
                <div className="text-2xl font-bold mb-1" style={{ color: colors.foreground }}>
                  {stat.value}
                </div>
                <div style={{ color: colors.foregroundMuted, fontSize: "0.875rem" }}>{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
