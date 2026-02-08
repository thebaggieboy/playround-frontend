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
  ArrowRight,
} from "lucide-react"

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const mvpFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Model Templates",
      description:
        "Access pre-built financial models including DCF analysis, IRR calculations, NPV analysis, and custom scenario modeling for rapid analysis.",
      badge: "Essential",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "File Upload",
      description:
        "Upload and parse CSV, XLSX, and JSON files instantly with intelligent data mapping and validation capabilities.",
      badge: "Core",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Charts",
      description:
        "Create beautiful, interactive charts and visualizations with real-time data updates and export options.",
      badge: "Analytics",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Export PDF",
      description:
        "Generate professional reports with custom branding, charts, and executive summaries.",
      badge: "Reports",
    },
  ]

  const futureFeatures = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Stock & portfolio analytics",
      detail: "Real-time market data",
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      text: "Team collaboration",
      detail: "Shared workspaces & permissions",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "AI-powered insights",
      detail: "Automated recommendations",
    },
  ]

  return (
    <section
      ref={ref}
      id="features"
      className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white relative"
    >
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-200" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs md:text-sm font-semibold text-blue-600">
              MVP Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
            Powerful Features{" "}
            <span className="text-blue-600">Available Now</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Everything you need for professional financial analysis and modeling
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {mvpFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group cursor-pointer"
            >
              <div
                className={`relative rounded-xl p-6 border transition-all duration-200 h-full ${
                  hoveredFeature === index
                    ? "border-blue-300 bg-blue-50/50 shadow-lg shadow-blue-100/50 -translate-y-1"
                    : "border-slate-200 bg-slate-50 shadow-sm"
                }`}
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-6 right-6 h-0.5 rounded-full transition-colors duration-200 ${
                    hoveredFeature === index ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />

                {/* Badge */}
                <div className="mb-4">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                    {feature.badge}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-200 ${
                    hoveredFeature === index
                      ? "bg-blue-600 text-white scale-110"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative rounded-xl p-8 md:p-10 lg:p-12 border border-slate-200 bg-[#0f1b3d]">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-24 h-1 rounded-tr-full bg-blue-500" />

            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Coming Soon
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {futureFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="group/item"
                >
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border-l-2 border-blue-500 transition-all duration-200 hover:bg-white/10 hover:translate-x-1">
                    <div className="mt-0.5 flex-shrink-0 text-blue-400 transition-transform duration-200 group-hover/item:scale-110">
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm md:text-base text-white">
                        {feature.text}
                      </div>
                      <div className="text-xs mt-1 text-slate-400">
                        {feature.detail}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
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
