"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import DashboardHeader from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  Activity,
  DollarSign,
  Loader2,
  PieChart as PieChartIcon,
  CreditCard,
  Clock,
  FileText,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  Percent,
  Building2,
  Zap
} from "lucide-react"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

const COLORS = ["#0ea5e9", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6", "#f97316", "#8b5cf6"]
const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8",
  active: "#0ea5e9",
  archived: "#6366f1",
}
const SCENARIO_TYPE_COLORS: Record<string, string> = {
  base: "#10b981",
  upside: "#0ea5e9",
  downside: "#f59e0b",
  custom: "#6366f1",
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                         */
/* ------------------------------------------------------------------ */
const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, isLoading }: any) => (
  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-2" />
            ) : (
              <>
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                {subtitle && (
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
              </>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconColor || "bg-primary/10"}`}>
            <Icon className={`h-4.5 w-4.5 ${iconColor ? "text-white" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
async function fetchAllPages(url: string, headers: Record<string, string>) {
  let allResults: any[] = []
  let nextUrl: string | null = url

  while (nextUrl) {
    const res = await fetch(nextUrl, { headers }).catch(() => null)
    if (!res?.ok) break
    const json = await res.json()

    if (Array.isArray(json)) {
      allResults = json
      break // non-paginated
    }

    allResults = allResults.concat(json.results || [])
    nextUrl = json.next || null
  }

  return allResults
}

function formatCurrency(val: number, compact = false) {
  if (val === 0) return "$0"
  if (compact) {
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val)
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */
export default function AnalyticsPage() {
  const token = useSelector(selectToken)
  const [isLoading, setIsLoading] = useState(true)

  // Raw data
  const [models, setModels] = useState<any[]>([])
  const [scenarios, setScenarios] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [calcLogs, setCalcLogs] = useState<any[]>([])

  useEffect(() => {
    if (!token) return

    let isMounted = true
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const headers: Record<string, string> = {
          'Authorization': `JWT ${typeof token === 'object' && token?.access ? token.access : token}`,
          'Content-Type': 'application/json'
        }

        const [modelsData, scenariosData, reportsData, logsData] = await Promise.all([
          fetchAllPages(`${API_BASE_URL}/models/`, headers),
          fetchAllPages(`${API_BASE_URL}/scenarios/`, headers),
          fetchAllPages(`${API_BASE_URL}/reports/`, headers),
          fetchAllPages(`${API_BASE_URL}/calculation-logs/`, headers),
        ])

        if (!isMounted) return

        setModels(modelsData)
        setScenarios(scenariosData)
        setReports(reportsData)
        setCalcLogs(logsData)
      } catch (e) {
        console.error("Failed to load analytics data", e)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()
    return () => { isMounted = false }
  }, [token])

  /* ---------------------------------------------------------------- */
  /*  Derived Stats — all computed from raw data                      */
  /* ---------------------------------------------------------------- */
  const stats = useMemo(() => {
    // ---- Models ----
    const totalModels = models.length
    const draftModels = models.filter((m) => m.status === "draft").length
    const activeModels = models.filter((m) => m.status === "active").length
    const archivedModels = models.filter((m) => m.status === "archived").length
    const calculatedModels = models.filter((m) => m.last_calculated_at).length

    // ---- Scenarios ----
    const totalScenarios = scenarios.length
    const baseScenarios = scenarios.filter((s) => s.scenario_type === "base").length
    const upsideScenarios = scenarios.filter((s) => s.scenario_type === "upside").length
    const downsideScenarios = scenarios.filter((s) => s.scenario_type === "downside").length
    const customScenarios = scenarios.filter((s) => s.scenario_type === "custom").length

    // ---- Financial metrics from scenarios ----
    let totalIrr = 0, irrCount = 0
    let totalCapex = 0, capexCount = 0
    let totalEquityPct = 0, equityCount = 0
    let totalPayback = 0, paybackCount = 0
    let totalTenor = 0, tenorCount = 0
    let totalDebtPct = 0, debtCount = 0
    let totalTaxRate = 0, taxCount = 0
    let totalDiscountRate = 0, discountCount = 0

    scenarios.forEach((scenario: any) => {
      // IRR
      if (scenario.exit_valuation?.target_irr_pct) {
        totalIrr += parseFloat(scenario.exit_valuation.target_irr_pct)
        irrCount++
      }
      // Payback
      if (scenario.exit_valuation?.payback_period_target_years) {
        totalPayback += parseFloat(scenario.exit_valuation.payback_period_target_years)
        paybackCount++
      }
      // CAPEX
      if (scenario.capital_expenditure) {
        const ce = scenario.capital_expenditure
        const capex = parseFloat(ce.total_capex || ce.total_development_cost || 0) ||
          ((parseFloat(ce.land_cost) || 0) +
          (parseFloat(ce.construction_building_cost) || 0) +
          (parseFloat(ce.equipment_machinery_cost) || 0) +
          (parseFloat(ce.ffe_cost) || 0))
        if (capex > 0) {
          totalCapex += capex
          capexCount++
        }
      }
      // Debt / Equity
      if (scenario.debt_financing) {
        if (scenario.debt_financing.equity_percentage) {
          totalEquityPct += parseFloat(scenario.debt_financing.equity_percentage)
          equityCount++
        }
        if (scenario.debt_financing.debt_percentage) {
          totalDebtPct += parseFloat(scenario.debt_financing.debt_percentage)
          debtCount++
        }
        if (scenario.debt_financing.loan_tenor_years) {
          totalTenor += parseFloat(scenario.debt_financing.loan_tenor_years)
          tenorCount++
        }
      }
      // Tax
      if (scenario.tax_assumptions?.corporate_income_tax_rate) {
        totalTaxRate += parseFloat(scenario.tax_assumptions.corporate_income_tax_rate)
        taxCount++
      }
      // Discount
      if (scenario.macro_assumptions?.discount_rate_wacc) {
        totalDiscountRate += parseFloat(scenario.macro_assumptions.discount_rate_wacc)
        discountCount++
      }
    })

    // ---- Reports ----
    const totalReports = reports.length
    const completedReports = reports.filter((r) => r.status === "completed").length

    // ---- Calc logs ----
    const totalCalcs = calcLogs.length
    const successfulCalcs = calcLogs.filter((l) => l.status === "success").length
    const failedCalcs = calcLogs.filter((l) => l.status === "failed").length

    return {
      totalModels,
      draftModels,
      activeModels,
      archivedModels,
      calculatedModels,
      totalScenarios,
      baseScenarios,
      upsideScenarios,
      downsideScenarios,
      customScenarios,
      avgIrr: irrCount > 0 ? (totalIrr / irrCount).toFixed(1) : null,
      avgCapex: capexCount > 0 ? totalCapex / capexCount : null,
      totalCapex,
      avgEquity: equityCount > 0 ? (totalEquityPct / equityCount).toFixed(1) : null,
      avgDebt: debtCount > 0 ? (totalDebtPct / debtCount).toFixed(1) : null,
      avgPayback: paybackCount > 0 ? (totalPayback / paybackCount).toFixed(1) : null,
      avgLoanTenor: tenorCount > 0 ? (totalTenor / tenorCount).toFixed(1) : null,
      avgTaxRate: taxCount > 0 ? (totalTaxRate / taxCount).toFixed(1) : null,
      avgWacc: discountCount > 0 ? (totalDiscountRate / discountCount).toFixed(1) : null,
      totalReports,
      completedReports,
      totalCalcs,
      successfulCalcs,
      failedCalcs,
    }
  }, [models, scenarios, reports, calcLogs])

  /* ---- Project types distribution ---- */
  const projectTypesData = useMemo(() => {
    const typeCount: Record<string, number> = {}
    models.forEach((model: any) => {
      const type = model.project_type || model.project_type_display || "general"
      const friendly = type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      typeCount[friendly] = (typeCount[friendly] || 0) + 1
    })
    const data = Object.entries(typeCount).map(([name, value]) => ({ name, value }))
    return data.length > 0 ? data : []
  }, [models])

  /* ---- Model status distribution ---- */
  const modelStatusData = useMemo(() => {
    const counts = [
      { name: "Draft", value: stats.draftModels, fill: STATUS_COLORS.draft },
      { name: "Active", value: stats.activeModels, fill: STATUS_COLORS.active },
      { name: "Archived", value: stats.archivedModels, fill: STATUS_COLORS.archived },
    ].filter((d) => d.value > 0)
    return counts
  }, [stats])

  /* ---- Scenario type breakdown ---- */
  const scenarioTypeData = useMemo(() => {
    return [
      { name: "Base Case", value: stats.baseScenarios, fill: SCENARIO_TYPE_COLORS.base },
      { name: "Upside", value: stats.upsideScenarios, fill: SCENARIO_TYPE_COLORS.upside },
      { name: "Downside", value: stats.downsideScenarios, fill: SCENARIO_TYPE_COLORS.downside },
      { name: "Custom", value: stats.customScenarios, fill: SCENARIO_TYPE_COLORS.custom },
    ].filter((d) => d.value > 0)
  }, [stats])

  /* ---- Monthly activity timeline (models created per month, last 12 months) ---- */
  const monthlyActivityData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const data = []

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = months[d.getMonth()]
      const year = d.getFullYear()

      const modelsInMonth = models.filter((m: any) => {
        if (!m.created_at) return false
        const md = new Date(m.created_at)
        return md.getMonth() === d.getMonth() && md.getFullYear() === d.getFullYear()
      }).length

      const scenariosInMonth = scenarios.filter((s: any) => {
        if (!s.created_at) return false
        const sd = new Date(s.created_at)
        return sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear()
      }).length

      const reportsInMonth = reports.filter((r: any) => {
        const rDate = r.date_created || r.created_at
        if (!rDate) return false
        const rd = new Date(rDate)
        return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
      }).length

      data.push({
        name: `${monthName} ${year !== now.getFullYear() ? year.toString().slice(-2) : ""}`.trim(),
        models: modelsInMonth,
        scenarios: scenariosInMonth,
        reports: reportsInMonth,
      })
    }

    return data
  }, [models, scenarios, reports])

  /* ---- Recent models ---- */
  const recentModels = useMemo(() => {
    return [...models]
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, 8)
  }, [models])

  /* ---- Calculation success rate ---- */
  const calcSuccessRate = useMemo(() => {
    if (stats.totalCalcs === 0) return null
    return ((stats.successfulCalcs / stats.totalCalcs) * 100).toFixed(0)
  }, [stats])

  /* ---- Average completion percentage ---- */
  const avgCompletion = useMemo(() => {
    if (models.length === 0) return 0
    const total = models.reduce((sum, m) => sum + (m.completion_percentage || 0), 0)
    return Math.round(total / models.length)
  }, [models])

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <DashboardHeader />

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Page Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive overview of your financial models, scenarios, and activity.
              </p>
            </div>
          </motion.div>

          {/* ====== TOP KPIs ====== */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Key Metrics</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <StatCard
                isLoading={isLoading}
                title="Total Models"
                value={stats.totalModels}
                subtitle={`${stats.activeModels} active · ${stats.draftModels} draft`}
                icon={Layers}
                iconColor="bg-blue-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Total Scenarios"
                value={stats.totalScenarios}
                subtitle={stats.totalScenarios > 0 ? `${stats.baseScenarios} base · ${stats.upsideScenarios + stats.downsideScenarios + stats.customScenarios} variants` : "No scenarios yet"}
                icon={Activity}
                iconColor="bg-emerald-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Reports Generated"
                value={stats.totalReports}
                subtitle={stats.totalReports > 0 ? `${stats.completedReports} completed` : "No reports yet"}
                icon={FileText}
                iconColor="bg-purple-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Calculations Run"
                value={stats.totalCalcs}
                subtitle={stats.totalCalcs > 0 ? `${calcSuccessRate}% success rate` : "No calculations yet"}
                icon={Zap}
                iconColor="bg-amber-500"
              />
            </div>
          </motion.div>

          {/* ====== FINANCIAL METRICS ====== */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Financial Summary</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <StatCard
                isLoading={isLoading}
                title="Avg. Target IRR"
                value={stats.avgIrr ? `${stats.avgIrr}%` : "—"}
                subtitle={stats.avgIrr ? "Across all scenarios" : "No IRR data"}
                icon={TrendingUp}
                iconColor="bg-green-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Total CAPEX Modeled"
                value={stats.totalCapex > 0 ? formatCurrency(stats.totalCapex, true) : "—"}
                subtitle={stats.avgCapex ? `Avg: ${formatCurrency(stats.avgCapex, true)}/scenario` : "No CAPEX data"}
                icon={DollarSign}
                iconColor="bg-sky-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. Equity Split"
                value={stats.avgEquity ? `${stats.avgEquity}%` : "—"}
                subtitle={stats.avgDebt ? `Debt: ${stats.avgDebt}%` : "No financing data"}
                icon={PieChartIcon}
                iconColor="bg-indigo-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. Payback Period"
                value={stats.avgPayback ? `${stats.avgPayback} yrs` : "—"}
                subtitle={stats.avgLoanTenor ? `Loan tenor: ${stats.avgLoanTenor} yrs` : "No payback data"}
                icon={Clock}
                iconColor="bg-rose-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. Loan Tenor"
                value={stats.avgLoanTenor ? `${stats.avgLoanTenor} yrs` : "—"}
                subtitle="Average across scenarios"
                icon={CreditCard}
                iconColor="bg-orange-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. Tax Rate"
                value={stats.avgTaxRate ? `${stats.avgTaxRate}%` : "—"}
                subtitle="Corporate income tax"
                icon={Percent}
                iconColor="bg-red-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. WACC"
                value={stats.avgWacc ? `${stats.avgWacc}%` : "—"}
                subtitle="Discount rate"
                icon={Target}
                iconColor="bg-teal-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Avg. Completion"
                value={`${avgCompletion}%`}
                subtitle="Model input progress"
                icon={CheckCircle2}
                iconColor="bg-cyan-500"
              />
            </div>
          </motion.div>

          {/* ====== CHARTS ROW 1: Activity Timeline + Industry Distribution ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-7">
            {/* Monthly Activity */}
            <Card className="lg:col-span-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Monthly Activity</CardTitle>
                <CardDescription>Models, scenarios, and reports created per month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[320px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : monthlyActivityData.every((d) => d.models === 0 && d.scenarios === 0 && d.reports === 0) ? (
                    <div className="text-center">
                      <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No activity data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="models" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Models" />
                        <Bar dataKey="scenarios" fill="#10b981" radius={[4, 4, 0, 0]} name="Scenarios" />
                        <Bar dataKey="reports" fill="#6366f1" radius={[4, 4, 0, 0]} name="Reports" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Industry/Project Type Pie */}
            <Card className="lg:col-span-3 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Projects by Industry</CardTitle>
                <CardDescription>Distribution of models across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : projectTypesData.length === 0 ? (
                    <div className="text-center">
                      <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No models created yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectTypesData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {projectTypesData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ====== CHARTS ROW 2: Model Status + Scenario Types ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
            {/* Model Status */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Model Status</CardTitle>
                <CardDescription>Current status distribution of your models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : modelStatusData.length === 0 ? (
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No models yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelStatusData}
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {modelStatusData.map((entry, index) => (
                            <Cell key={`status-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scenario Types */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Scenario Breakdown</CardTitle>
                <CardDescription>Types of scenarios across all models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : scenarioTypeData.length === 0 ? (
                    <div className="text-center">
                      <Layers className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No scenarios yet</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 h-full">
                      <div className="flex-1 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={scenarioTypeData}
                              cx="50%"
                              cy="45%"
                              innerRadius={55}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                              stroke="none"
                            >
                              {scenarioTypeData.map((entry, index) => (
                                <Cell key={`scenario-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ====== RECENT MODELS TABLE ====== */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Recent Models</CardTitle>
                <CardDescription>Your most recently updated financial models</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : recentModels.length === 0 ? (
                  <div className="text-center py-12">
                    <Layers className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No models created yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Create your first financial model to see it here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model Name</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completion</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Updated</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Calculated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentModels.map((model: any) => (
                          <tr key={model.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                            <td className="py-2.5 px-3 font-medium">{model.name || "Untitled"}</td>
                            <td className="py-2.5 px-3">
                              <Badge variant="secondary" className="text-xs font-normal">
                                {(model.project_type_display || model.project_type || "General").replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3">
                              <Badge
                                variant="outline"
                                className={`text-xs font-normal ${
                                  model.status === "active"
                                    ? "border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-400"
                                    : model.status === "archived"
                                    ? "border-indigo-300 text-indigo-700 dark:border-indigo-600 dark:text-indigo-400"
                                    : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {(model.status_display || model.status || "draft").charAt(0).toUpperCase() + (model.status_display || model.status || "draft").slice(1)}
                              </Badge>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${model.completion_percentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{model.completion_percentage || 0}%</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-muted-foreground text-xs">
                              {model.updated_at
                                ? new Date(model.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "—"
                              }
                            </td>
                            <td className="py-2.5 px-3">
                              {model.last_calculated_at ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {new Date(model.last_calculated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <AlertCircle className="w-3 h-3" />
                                  Not yet
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      </main>
    </div>
  )
}
