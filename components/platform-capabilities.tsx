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
          className={`flex-1 rounded-sm transition-colors duration-300 ${active ? "bg-blue-400" : "bg-white/10"
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
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Enterprise Planning,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-[0_0_16px_rgba(96,165,250,0.3)]">Simplified</span>
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${activeTab === index
                    ? "bg-white/10 text-white border-white/[0.15] shadow-[0_0_16px_rgba(255,255,255,0.05)]"
                    : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:bg-white/[0.05] hover:text-white/80"
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
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  {(() => {
                    const Icon = active.icon
                    return <Icon className="w-5 h-5 text-blue-400" />
                  })()}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {active.title}
                </h3>
              </div>
              <p className="text-white/60 leading-relaxed mb-8 font-light">
                {active.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {active.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-white/[0.08]">
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
          <div className="rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)] p-8 md:p-10 flex flex-col relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider font-medium">
                    {active.visual.metric}
                  </p>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-bold text-white drop-shadow-md">
                      {active.visual.value}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {active.visual.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs text-white/70 font-medium">Live</span>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 flex flex-col justify-end mt-4">
                <MiniBarChart bars={active.visual.bars} active={true} />
                <div className="flex justify-between mt-4">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (m) => (
                      <span key={m} className="text-[10px] text-white/40 flex-1 text-center font-medium">
                        {m}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Mock KPI row */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/[0.08]">
                {[
                  { label: "Accuracy", value: "97.2%" },
                  { label: "Models", value: "156" },
                  { label: "Insights", value: "2.4K" },
                ].map((kpi) => (
                  <div key={kpi.label} className="text-center">
                    <p className="text-xl font-bold text-white drop-shadow-sm">{kpi.value}</p>
                    <p className="text-xs text-white/50 font-medium mt-1">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
