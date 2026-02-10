"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  PieChart,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react"

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
  active,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  active: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const increment = target / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const kpiCards = [
  {
    label: "Total Revenue",
    value: 842,
    prefix: "$",
    suffix: "K",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    label: "Gross Margin",
    value: 64,
    prefix: "",
    suffix: "%",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    label: "Burn Rate",
    value: 127,
    prefix: "$",
    suffix: "K",
    change: "-8.1%",
    trend: "down",
    icon: Activity,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    label: "Runway",
    value: 18,
    prefix: "",
    suffix: " mo",
    change: "+2 mo",
    trend: "up",
    icon: PieChart,
    color: "bg-blue-500/10 text-blue-500",
  },
]

const revenueData = [
  { month: "Jan", actual: 320, forecast: 310 },
  { month: "Feb", actual: 340, forecast: 330 },
  { month: "Mar", actual: 380, forecast: 350 },
  { month: "Apr", actual: 360, forecast: 370 },
  { month: "May", actual: 420, forecast: 390 },
  { month: "Jun", actual: 450, forecast: 410 },
  { month: "Jul", actual: 480, forecast: 440 },
  { month: "Aug", actual: 520, forecast: 470 },
  { month: "Sep", actual: 0, forecast: 500 },
  { month: "Oct", actual: 0, forecast: 540 },
  { month: "Nov", actual: 0, forecast: 580 },
  { month: "Dec", actual: 0, forecast: 620 },
]

const expenseBreakdown = [
  { label: "Personnel", percent: 45, color: "bg-blue-500" },
  { label: "Infrastructure", percent: 22, color: "bg-blue-400" },
  { label: "Marketing", percent: 18, color: "bg-blue-300" },
  { label: "Operations", percent: 15, color: "bg-blue-200" },
]

export function LiveDashboardPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeView, setActiveView] = useState<"overview" | "forecast">(
    "overview"
  )

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute top-32 right-0 w-72 h-72 rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Interactive Dashboard
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-balance">
            See Your Finances{" "}
            <span className="text-blue-600">Come Alive</span>
          </h2>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Real-time KPI tracking, interactive charts, and automated insights
            that update as your data changes.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.98 }
          }
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-xl border border-[#e8e4df] bg-[#faf9f7] shadow-lg shadow-[#e8e4df]/50 overflow-hidden"
        >
          {/* Dashboard toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#e8e4df]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#e8e4df]" />
                <div className="w-3 h-3 rounded-full bg-[#e8e4df]" />
                <div className="w-3 h-3 rounded-full bg-[#e8e4df]" />
              </div>
              <span className="text-xs font-medium text-slate-400 ml-3">
                Financial Overview - Q3 2025
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("overview")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeView === "overview"
                    ? "bg-blue-600 text-white"
                    : "bg-[#f0ece7] text-slate-500 hover:bg-[#e8e4df]"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveView("forecast")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeView === "forecast"
                    ? "bg-blue-600 text-white"
                    : "bg-[#f0ece7] text-slate-500 hover:bg-[#e8e4df]"
                }`}
              >
                Forecast
              </button>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6">
            {activeView === "overview" ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {kpiCards.map((kpi, index) => {
                    const Icon = kpi.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                        }
                        transition={{
                          duration: 0.4,
                          delay: 0.3 + index * 0.08,
                        }}
                        className="rounded-lg bg-white border border-[#e8e4df] p-4 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span
                            className={`flex items-center gap-0.5 text-xs font-medium ${
                              kpi.trend === "up"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {kpi.trend === "up" ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {kpi.change}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                          <AnimatedCounter
                            target={kpi.value}
                            prefix={kpi.prefix}
                            suffix={kpi.suffix}
                            active={isInView}
                          />
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {kpi.label}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Charts row */}
                <div className="grid lg:grid-cols-3 gap-4">
                  {/* Revenue chart */}
                  <div className="lg:col-span-2 rounded-lg bg-white border border-[#e8e4df] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Revenue vs Forecast
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          Actual
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-blue-300" />
                          Forecast
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-32">
                      {revenueData.map((d, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-0.5"
                        >
                          <div className="w-full flex gap-0.5 items-end h-28">
                            {d.actual > 0 && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={
                                  isInView
                                    ? {
                                        height: `${(d.actual / 620) * 100}%`,
                                      }
                                    : { height: 0 }
                                }
                                transition={{
                                  duration: 0.6,
                                  delay: 0.4 + i * 0.05,
                                }}
                                className="flex-1 bg-blue-600 rounded-sm"
                              />
                            )}
                            <motion.div
                              initial={{ height: 0 }}
                              animate={
                                isInView
                                  ? {
                                      height: `${(d.forecast / 620) * 100}%`,
                                    }
                                  : { height: 0 }
                              }
                              transition={{
                                duration: 0.6,
                                delay: 0.5 + i * 0.05,
                              }}
                              className={`flex-1 rounded-sm ${
                                d.actual > 0
                                  ? "bg-blue-200"
                                  : "bg-blue-200 border border-dashed border-blue-300"
                              }`}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400">
                            {d.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expense breakdown */}
                  <div className="rounded-lg bg-white border border-[#e8e4df] p-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">
                      Expense Breakdown
                    </h4>
                    <div className="space-y-3">
                      {expenseBreakdown.map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">
                              {item.label}
                            </span>
                            <span className="text-xs font-medium text-slate-900">
                              {item.percent}%
                            </span>
                          </div>
                          <div className="h-2 bg-[#f0ece7] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                isInView
                                  ? { width: `${item.percent}%` }
                                  : { width: 0 }
                              }
                              transition={{
                                duration: 0.8,
                                delay: 0.5 + i * 0.1,
                              }}
                              className={`h-full rounded-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#e8e4df]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Total OpEx
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          $384K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Forecast View */
              <div className="space-y-6">
                <div className="rounded-lg bg-white border border-[#e8e4df] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        3-Scenario Revenue Projection
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Monte Carlo simulation with 10,000 iterations
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Optimistic
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Base
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Conservative
                      </span>
                    </div>
                  </div>
                  {/* Scenario bars */}
                  <div className="space-y-4">
                    {[
                      {
                        label: "Q4 2025",
                        optimistic: 85,
                        base: 70,
                        conservative: 55,
                      },
                      {
                        label: "Q1 2026",
                        optimistic: 92,
                        base: 75,
                        conservative: 58,
                      },
                      {
                        label: "Q2 2026",
                        optimistic: 100,
                        base: 82,
                        conservative: 62,
                      },
                      {
                        label: "Q3 2026",
                        optimistic: 100,
                        base: 88,
                        conservative: 65,
                      },
                    ].map((q, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 w-16 flex-shrink-0">
                          {q.label}
                        </span>
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-[#f0ece7] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                isInView
                                  ? { width: `${q.optimistic}%` }
                                  : { width: 0 }
                              }
                              transition={{
                                duration: 0.8,
                                delay: 0.3 + i * 0.1,
                              }}
                              className="h-full rounded-full bg-emerald-500"
                            />
                          </div>
                          <div className="h-2 bg-[#f0ece7] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                isInView
                                  ? { width: `${q.base}%` }
                                  : { width: 0 }
                              }
                              transition={{
                                duration: 0.8,
                                delay: 0.4 + i * 0.1,
                              }}
                              className="h-full rounded-full bg-blue-500"
                            />
                          </div>
                          <div className="h-2 bg-[#f0ece7] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={
                                isInView
                                  ? { width: `${q.conservative}%` }
                                  : { width: 0 }
                              }
                              transition={{
                                duration: 0.8,
                                delay: 0.5 + i * 0.1,
                              }}
                              className="h-full rounded-full bg-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forecast summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Best Case ARR",
                      value: "$2.4M",
                      confidence: "68%",
                    },
                    {
                      label: "Expected ARR",
                      value: "$1.8M",
                      confidence: "85%",
                    },
                    {
                      label: "Worst Case ARR",
                      value: "$1.2M",
                      confidence: "95%",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                      className="rounded-lg bg-white border border-[#e8e4df] p-4 text-center hover:border-blue-200 transition-all duration-300"
                    >
                      <p className="text-xl font-bold text-slate-900">
                        {item.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.label}
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-2">
                        {item.confidence} confidence
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
