"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import {
  Check,
  X,
  ArrowRight,
  Scale,
} from "lucide-react"

const comparisonData = [
  {
    feature: "Setup Time",
    playground: "Minutes",
    traditional: "Weeks",
    enterprise: "Months",
  },
  {
    feature: "Excel-like Interface",
    playground: true,
    traditional: false,
    enterprise: true,
  },
  {
    feature: "AI-Powered Insights",
    playground: true,
    traditional: false,
    enterprise: true,
  },
  {
    feature: "Multi-Scenario Modeling",
    playground: true,
    traditional: false,
    enterprise: true,
  },
  {
    feature: "Real-time Collaboration",
    playground: true,
    traditional: false,
    enterprise: true,
  },
  {
    feature: "Custom Integrations",
    playground: true,
    traditional: false,
    enterprise: true,
  },
  {
    feature: "Starting Price",
    playground: "$49/mo",
    traditional: "Free",
    enterprise: "$50K+/yr",
  },
  {
    feature: "No IT Team Required",
    playground: true,
    traditional: true,
    enterprise: false,
  },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="w-5 h-5 text-emerald-600" />
    ) : (
      <X className="w-5 h-5 text-slate-300" />
    )
  }
  return <span className="text-sm font-medium text-slate-900">{value}</span>
}

export function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="py-14 sm:py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-blue-50/20 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              How We Compare
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Enterprise Power,{" "}
            <span className="text-blue-600">Startup Speed</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Get the capabilities of Anaplan and Jedox without the complexity or
            enterprise price tag.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-xl border border-[#e8e4df] bg-white overflow-x-auto shadow-sm"
        >
          <div className="min-w-[520px]">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-[#e8e4df]">
              <div className="p-5">
                <span className="text-sm font-medium text-slate-500">
                  Feature
                </span>
              </div>
              <div className="p-5 bg-blue-600 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-700 text-[10px] font-bold text-white uppercase tracking-wider">
                  Best Value
                </div>
                <span className="text-sm font-bold text-white">
                  Playground
                </span>
              </div>
              <div className="p-5 text-center">
                <span className="text-sm font-medium text-slate-500">
                  Spreadsheets
                </span>
              </div>
              <div className="p-5 text-center">
                <span className="text-sm font-medium text-slate-500">
                  Enterprise CPM
                </span>
              </div>
            </div>

            {/* Table Rows */}
            {comparisonData.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                }
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`grid grid-cols-4 border-b border-[#e8e4df] last:border-b-0 transition-colors duration-200 ${hoveredRow === index ? "bg-blue-50/50" : ""
                  }`}
              >
                <div className="p-4 flex items-center">
                  <span className="text-sm text-slate-700 font-medium">
                    {row.feature}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center bg-blue-50/30">
                  <CellValue value={row.playground} />
                </div>
                <div className="p-4 flex items-center justify-center">
                  <CellValue value={row.traditional} />
                </div>
                <div className="p-4 flex items-center justify-center">
                  <CellValue value={row.enterprise} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
          >
            Start for free - no credit card required
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
