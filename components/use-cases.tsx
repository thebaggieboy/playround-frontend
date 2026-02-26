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
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden"
    >
      {/* Subtle decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md shadow-[0_0_16px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Multiple Solutions
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Use Cases for Every Role
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed font-light">
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
                  className={`relative h-full rounded-2xl p-7 border transition-all duration-300 ${hoveredIndex === index
                      ? "border-blue-400/30 bg-white/[0.05] backdrop-blur-xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] -translate-y-1"
                      : "border-white/[0.08] bg-white/[0.02] backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
                    }`}
                >
                  {/* Top accent bar */}
                  <div
                    className={`absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300 ${hoveredIndex === index ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-white/10"
                      }`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${hoveredIndex === index
                        ? "bg-blue-500 text-white scale-110 shadow-[0_0_16px_rgba(59,130,246,0.5)]"
                        : "bg-white/10 text-blue-400 border border-white/[0.05]"
                      }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/50 leading-relaxed mb-5 font-light">
                    {useCase.description}
                  </p>

                  {/* Detail tags */}
                  <div className="flex flex-wrap gap-2 mb-5 pb-5 border-b border-white/[0.08]">
                    {useCase.details.map((detail, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href={useCase.link}
                    className={`inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-all duration-300 ${hoveredIndex === index ? "translate-x-1" : ""
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
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-6 text-center bg-white/[0.02] backdrop-blur-md border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
                {item.stat}
              </div>
              <div className="text-sm text-white/50">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
