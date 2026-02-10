"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import {
  Brain,
  BarChart3,
  Layers,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Cpu,
} from "lucide-react"

const capabilities = [
  {
    id: "intelligence",
    label: "Intelligence",
    icon: Brain,
    title: "AI-Powered Planning Intelligence",
    description:
      "Surface actionable insights with predictive and prescriptive AI built into every model. Playground analyzes your data patterns and recommends optimal strategies, just like enterprise tools at a fraction of the cost.",
    features: [
      "Predictive revenue forecasting",
      "Anomaly detection in financial data",
      "Smart scenario recommendations",
      "Natural language model queries",
    ],
    visual: {
      metric: "Revenue Forecast",
      value: "$4.2M",
      change: "+18.3%",
      bars: [40, 55, 48, 62, 70, 65, 78, 85, 92, 88, 95, 100],
    },
  },
  {
    id: "modeling",
    label: "Modeling",
    icon: Layers,
    title: "Multidimensional Modeling Engine",
    description:
      "Build complex financial models with driver-based logic, top-down and bottom-up planning, and multi-scenario versioning. Structure models across any dimension your business needs.",
    features: [
      "Driver-based planning",
      "Multi-scenario versioning",
      "Custom dimension hierarchies",
      "Real-time formula engine",
    ],
    visual: {
      metric: "Scenario Analysis",
      value: "3 Active",
      change: "Comparing",
      bars: [80, 65, 90, 72, 85, 68, 95, 78, 88, 82, 70, 92],
    },
  },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: Users,
    title: "Connected Team Planning",
    description:
      "Break down silos between finance, operations, and strategy. Every stakeholder contributes to a single source of truth with role-based access, approval workflows, and real-time updates.",
    features: [
      "Role-based access controls",
      "Approval workflows",
      "Real-time co-editing",
      "Audit trail and versioning",
    ],
    visual: {
      metric: "Team Activity",
      value: "24 Active",
      change: "Live",
      bars: [50, 70, 60, 80, 75, 90, 85, 70, 65, 95, 80, 88],
    },
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    title: "Enterprise-Grade Analytics",
    description:
      "Transform raw data into interactive dashboards with drill-down capabilities, custom KPI tracking, and automated report generation that rivals tools costing 10x more.",
    features: [
      "Interactive drill-down charts",
      "Custom KPI dashboards",
      "Automated PDF reports",
      "Embedded chart sharing",
    ],
    visual: {
      metric: "EBITDA Margin",
      value: "32.4%",
      change: "+4.1%",
      bars: [60, 62, 58, 65, 70, 68, 72, 75, 78, 80, 82, 85],
    },
  },
]

function MiniBarChart({ bars, active }: { bars: number[]; active: boolean }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: active ? `${height}%` : "20%" }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className={`flex-1 rounded-sm transition-colors duration-300 ${
            active ? "bg-blue-400" : "bg-[#264a82]"
          }`}
          style={{ opacity: active ? 0.4 + (i / bars.length) * 0.6 : 0.3 }}
        />
      ))}
    </div>
  )
}

export function PlatformCapabilities() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeTab, setActiveTab] = useState(0)

  const active = capabilities[activeTab]

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#0f1b3d] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1d3a6e]" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-[#1a3264]/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-[#162d5a]/30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-[#1a3264] border border-[#264a82]">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Enterprise Planning,{" "}
            <span className="text-blue-400">Simplified</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The same powerful capabilities found in Anaplan and Jedox, built for
            modern teams who need speed and simplicity.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {capabilities.map((cap, index) => {
            const Icon = cap.icon
            return (
              <button
                key={cap.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "bg-[#1a3264]/60 text-slate-400 hover:bg-[#1a3264] hover:text-slate-200 border border-[#264a82]/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cap.label}
              </button>
            )
          })}
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-8 items-stretch"
        >
          {/* Left: Info */}
          <div className="rounded-xl border border-[#264a82] bg-[#0c1630] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  {(() => {
                    const Icon = active.icon
                    return <Icon className="w-5 h-5 text-blue-400" />
                  })()}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {active.title}
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8">
                {active.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#162d5a]/50 border border-[#264a82]/50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#1d3a6e]">
              <a
                href="/demo"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                See it in action
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Interactive Visual */}
          <div className="rounded-xl border border-[#264a82] bg-[#0c1630] p-8 md:p-10 flex flex-col">
            {/* Mock dashboard header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  {active.visual.metric}
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-bold text-white">
                    {active.visual.value}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {active.visual.change}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-500">Live</span>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 flex flex-col justify-end">
              <MiniBarChart bars={active.visual.bars} active={true} />
              <div className="flex justify-between mt-3">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                  (m) => (
                    <span key={m} className="text-[10px] text-slate-600 flex-1 text-center">
                      {m}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Mock KPI row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#1d3a6e]">
              {[
                { label: "Accuracy", value: "97.2%" },
                { label: "Models", value: "156" },
                { label: "Insights", value: "2.4K" },
              ].map((kpi) => (
                <div key={kpi.label} className="text-center">
                  <p className="text-lg font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-slate-500">{kpi.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
