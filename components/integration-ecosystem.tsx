"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import {
  Database,
  FileSpreadsheet,
  Cloud,
  Globe,
  ArrowRight,
  Plug,
  CheckCircle2,
  Zap,
} from "lucide-react"

const integrations = [
  {
    category: "Data Sources",
    icon: Database,
    items: [
      { name: "PostgreSQL", status: "live" },
      { name: "MySQL", status: "live" },
      { name: "MongoDB", status: "live" },
      { name: "Snowflake", status: "coming" },
    ],
  },
  {
    category: "Spreadsheets",
    icon: FileSpreadsheet,
    items: [
      { name: "Excel (.xlsx)", status: "live" },
      { name: "Google Sheets", status: "live" },
      { name: "CSV Import", status: "live" },
      { name: "Numbers", status: "coming" },
    ],
  },
  {
    category: "Cloud Services",
    icon: Cloud,
    items: [
      { name: "AWS S3", status: "live" },
      { name: "Google Cloud", status: "coming" },
      { name: "Azure Blob", status: "coming" },
      { name: "Dropbox", status: "live" },
    ],
  },
  {
    category: "APIs & ERPs",
    icon: Globe,
    items: [
      { name: "REST APIs", status: "live" },
      { name: "QuickBooks", status: "live" },
      { name: "SAP", status: "coming" },
      { name: "NetSuite", status: "coming" },
    ],
  },
]

const connectorNodes = [
  { x: 15, y: 20, label: "CSV" },
  { x: 85, y: 15, label: "API" },
  { x: 10, y: 80, label: "DB" },
  { x: 88, y: 75, label: "ERP" },
  { x: 50, y: 50, label: "Playground", isCenter: true },
]

export function IntegrationEcosystem() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 right-0 w-80 h-80 rounded-full bg-[#f0ece7]/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Plug className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Seamless Integrations
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Connect All Your{" "}
            <span className="text-blue-600">Data Sources</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Like Jedox, Playground unifies data from spreadsheets, databases,
            and cloud services into a single planning environment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Connection Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 rounded-xl border border-[#e8e4df] bg-white p-8 shadow-sm relative"
          >
            <div className="aspect-square relative">
              {/* Connection lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
              >
                {connectorNodes
                  .filter((n) => !n.isCenter)
                  .map((node, i) => (
                    <motion.line
                      key={i}
                      x1={node.x}
                      y1={node.y}
                      x2={50}
                      y2={50}
                      stroke="#bfdbfe"
                      strokeWidth="0.5"
                      strokeDasharray="2,2"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.15 }}
                    />
                  ))}
              </svg>

              {/* Nodes */}
              {connectorNodes.map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="absolute"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {node.isCenter ? (
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#f0ece7] border border-[#e8e4df] flex flex-col items-center justify-center hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                      <span className="text-[10px] font-semibold text-slate-600">
                        {node.label}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Pulse rings */}
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-28 h-28 rounded-2xl border border-blue-200/30 animate-pulse" />
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              All data flows through Playground's unified engine
            </p>
          </motion.div>

          {/* Right: Integration Categories */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {integrations.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="group cursor-pointer"
                >
                  <div
                    className={`rounded-xl p-6 border transition-all duration-300 h-full ${
                      hoveredCategory === index
                        ? "border-blue-200 bg-white shadow-lg shadow-blue-100/40 -translate-y-1"
                        : "border-[#e8e4df] bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          hoveredCategory === index
                            ? "bg-blue-600 text-white"
                            : "bg-[#f0ece7] text-blue-600"
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {category.category}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {category.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1.5"
                        >
                          <span className="text-sm text-slate-600">
                            {item.name}
                          </span>
                          {item.status === "live" ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" />
                              Live
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">
                              Soon
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/demo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            View all integrations
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
