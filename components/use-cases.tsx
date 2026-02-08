"use client"

import { TrendingUp, PieChart, BarChart3, Zap, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function UseCases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const useCases = [
    {
      icon: TrendingUp,
      title: "Investment Analysis",
      description:
        "Evaluate investment opportunities with DCF and NPV models. Compare multiple scenarios with real-time data integration.",
      details: ["Automated DCF models", "Multi-scenario analysis", "Real-time data"],
      link: "/use-cases/investment-analysis",
    },
    {
      icon: PieChart,
      title: "Portfolio Management",
      description:
        "Track and analyze portfolio performance metrics across multiple asset classes with advanced visualizations.",
      details: ["Performance tracking", "Risk assessment", "Asset allocation"],
      link: "/use-cases/portfolio-management",
    },
    {
      icon: BarChart3,
      title: "Financial Forecasting",
      description:
        "Create accurate forecasts with built-in templates and historical data modeling for predictive analytics.",
      details: ["Template library", "Trend analysis", "Predictive models"],
      link: "/use-cases/financial-forecasting",
    },
    {
      icon: Zap,
      title: "Quick Analysis",
      description:
        "Get insights in minutes, not hours. Transform raw data into actionable intelligence instantly.",
      details: ["Instant calculations", "Auto-insights", "Export ready"],
      link: "/use-cases/quick-analysis",
    },
  ]

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      {/* Subtle decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-[#f5f0ea]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-56 h-56 rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Multiple Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Use Cases for Every Role
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Whether you're a CFO, analyst, or finance novice, our platform
            adapts to your needs and expertise level
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group cursor-pointer"
              >
                <div
                  className={`relative h-full rounded-xl p-7 border transition-all duration-300 ${
                    hoveredIndex === index
                      ? "border-blue-200 bg-white shadow-lg shadow-blue-100/40 -translate-y-1"
                      : "border-[#e8e4df] bg-[#faf9f7] shadow-sm shadow-[#e8e4df]/30"
                  }`}
                >
                  {/* Top accent bar */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300 ${
                      hoveredIndex === index ? "bg-blue-600" : "bg-[#e8e4df]"
                    }`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-all duration-300 ${
                      hoveredIndex === index
                        ? "bg-blue-600 text-white scale-105"
                        : "bg-[#f0ece7] text-blue-600"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {useCase.description}
                  </p>

                  {/* Detail tags */}
                  <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-slate-100">
                    {useCase.details.map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100/60"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={useCase.link}
                    className={`inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all duration-300 ${
                      hoveredIndex === index ? "translate-x-1" : ""
                    }`}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { stat: "500K+", label: "Financial Models Created" },
            { stat: "99.9%", label: "System Uptime" },
            { stat: "<30s", label: "Model Generation Time" },
            { stat: "50+", label: "Pre-built Templates" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl p-6 text-center bg-[#faf9f7] border border-[#e8e4df] shadow-sm shadow-[#e8e4df]/30 hover:border-blue-200 hover:bg-white transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                {item.stat}
              </div>
              <div className="text-sm text-slate-500">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
