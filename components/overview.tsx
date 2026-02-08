"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, FileUp, BarChart3, Download, Zap, Shield, Layers } from "lucide-react"

export function Overview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: BarChart3,
      title: "Template-Based Models",
      description:
        "Access pre-built financial models including DCF, IRR, and NPV calculations. Deploy sophisticated financial analysis frameworks instantly without manual setup.",
    },
    {
      icon: FileUp,
      title: "Upload & Parse",
      description:
        "Seamlessly import and automatically parse XLSM and CSV files with intelligent data recognition. Our advanced parsing engine handles complex financial data structures.",
    },
    {
      icon: TrendingUp,
      title: "Visualize & Analyze",
      description:
        "Transform raw financial data into compelling interactive charts and dashboards. Identify trends, outliers, and key performance indicators with advanced analytics.",
    },
    {
      icon: Download,
      title: "Export Reports",
      description:
        "Generate professional PDF reports with customizable layouts, branding options, and comprehensive financial summaries for stakeholders.",
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description:
        "Experience lightning-fast data processing with optimized algorithms that handle large datasets instantly for complex financial calculations.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption and security protocols protect your sensitive financial data. Compliance with industry standards ensures confidentiality.",
    },
  ]

  const stats = [
    { label: "Financial Models", value: "50+", icon: BarChart3 },
    { label: "Processing Speed", value: "<100ms", icon: Zap },
    { label: "Data Formats", value: "15+", icon: FileUp },
    { label: "Uptime Guarantee", value: "99.9%", icon: Shield },
  ]

  return (
    <section
      ref={ref}
      id="overview"
      className="py-24 md:py-36 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white"
    >
      {/* Subtle decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute top-16 -left-20 w-72 h-72 rounded-full bg-[#f5f0ea]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-0 w-64 h-64 rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Comprehensive Solution
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance">
            Powerful Features
          </h2>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed text-slate-500">
            A comprehensive financial analysis platform designed for modern finance professionals who demand
            sophisticated tools without unnecessary complexity.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-xl p-8 bg-[#faf9f7] border border-[#e8e4df] shadow-sm shadow-[#e8e4df]/30 hover:shadow-md hover:border-blue-200 hover:bg-white transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-[#f0ece7] text-blue-600 group-hover:bg-blue-50 transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Bottom accent bar on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-blue-500 transition-all duration-500 rounded-b-xl" />
              </motion.div>
            )
          })}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="rounded-xl p-6 text-center bg-[#faf9f7] border border-[#e8e4df] hover:border-blue-200 hover:bg-white transition-all duration-300"
              >
                <Icon className="w-5 h-5 mx-auto mb-3 text-blue-500" />
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
