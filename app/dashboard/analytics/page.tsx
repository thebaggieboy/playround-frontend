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
  LineChart,
  Line,
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
import { useQuery } from "@tanstack/react-query"

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
  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
    <Card className="relative overflow-hidden h-full">
      <CardContent className="p-3 sm:p-5 flex flex-col justify-center h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate" title={title}>{title}</p>
            {isLoading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-muted-foreground mt-1 sm:mt-2" />
            ) : (
              <>
                <p className="text-lg sm:text-2xl font-bold tracking-tight truncate" title={String(value)}>{value}</p>
                {subtitle && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate" title={subtitle}>{subtitle}</p>
                )}
              </>
            )}
          </div>
          <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${iconColor || "bg-primary/10"}`}>
            <Icon className={`h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 ${iconColor ? "text-white" : "text-primary"}`} />
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
  const [scenarioFilter, setScenarioFilter] = useState<string>("all")

  // React Query Fetcher Helper
  const fetchEndpoint = async (url: string) => {
    if (!token) return []
    const headers: Record<string, string> = {
      'Authorization': `JWT ${typeof token === 'object' && token?.access ? token.access : token}`,
      'Content-Type': 'application/json'
    }
    return fetchAllPages(url, headers)
  }

  // ─── Global State Caching via React Query ─────────────────────────
  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => fetchEndpoint(`${API_BASE_URL}/models/`),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!token,
  })

  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: ['scenarios', 'detail'],
    queryFn: () => fetchEndpoint(`${API_BASE_URL}/scenarios/?detail=true`),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  })

  const { data: reports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => fetchEndpoint(`${API_BASE_URL}/reports/`),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  })

  const { data: calcLogs = [], isLoading: calcLogsLoading } = useQuery({
    queryKey: ['calcLogs'],
    queryFn: () => fetchEndpoint(`${API_BASE_URL}/calculation-logs/`),
    staleTime: 5 * 60 * 1000,
    enabled: !!token,
  })

  const isLoading = modelsLoading || scenariosLoading || reportsLoading || calcLogsLoading;

  const filteredScenarios = useMemo(() => {
    if (scenarioFilter === "all") return scenarios
    return scenarios.filter((s: any) => s.scenario_type === scenarioFilter)
  }, [scenarios, scenarioFilter])

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

    filteredScenarios.forEach((scenario: any) => {
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

  /* ---- CAPEX by Industry ---- */
  const capexByIndustryData = useMemo(() => {
    const capexMap: Record<string, number> = {}
    const modelTypes: Record<string, string> = {}
    models.forEach(m => {
      const type = m.project_type || m.project_type_display || "general"
      modelTypes[m.id] = type.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    })

    filteredScenarios.forEach((scenario: any) => {
      const modelId = scenario.model || scenario.model_id
      const pType = modelTypes[modelId] || "Unknown"
      
      let capex = 0
      if (scenario.capital_expenditure) {
        const ce = scenario.capital_expenditure
        capex = parseFloat(ce.total_capex || ce.total_development_cost || 0) ||
          ((parseFloat(ce.land_cost) || 0) +
          (parseFloat(ce.construction_building_cost) || 0) +
          (parseFloat(ce.equipment_machinery_cost) || 0) +
          (parseFloat(ce.ffe_cost) || 0))
      }
      if (capex > 0) {
        capexMap[pType] = (capexMap[pType] || 0) + capex
      }
    })

    return Object.entries(capexMap)
      .map(([name, capex]) => ({ name, capex }))
      .sort((a, b) => b.capex - a.capex)
  }, [models, scenarios])

  /* ---- IRR Distribution ---- */
  const irrDistributionData = useMemo(() => {
    const buckets = [
      { name: "< 10%", count: 0 },
      { name: "10% - 15%", count: 0 },
      { name: "15% - 20%", count: 0 },
      { name: "20% - 25%", count: 0 },
      { name: "> 25%", count: 0 },
    ]
    
    filteredScenarios.forEach((scenario: any) => {
      if (scenario.exit_valuation?.target_irr_pct) {
        const irr = parseFloat(scenario.exit_valuation.target_irr_pct)
        if (irr < 10) buckets[0].count++
        else if (irr < 15) buckets[1].count++
        else if (irr < 20) buckets[2].count++
        else if (irr < 25) buckets[3].count++
        else buckets[4].count++
      }
    })
    
    return buckets
  }, [scenarios])

  /* ---- Capital Stack Breakdown ---- */
  const capitalStackData = useMemo(() => {
    let totalDebt = 0
    let totalEquity = 0
    
    filteredScenarios.forEach((scenario: any) => {
      let capex = 0
      if (scenario.capital_expenditure) {
        const ce = scenario.capital_expenditure
        capex = parseFloat(ce.total_capex || ce.total_development_cost || 0) ||
          ((parseFloat(ce.land_cost) || 0) +
          (parseFloat(ce.construction_building_cost) || 0) +
          (parseFloat(ce.equipment_machinery_cost) || 0) +
          (parseFloat(ce.ffe_cost) || 0))
      }
      
      if (capex > 0 && scenario.debt_financing) {
        const debtPct = parseFloat(scenario.debt_financing.debt_percentage) || 0
        const equityPct = parseFloat(scenario.debt_financing.equity_percentage) || (Math.max(0, 100 - debtPct))
        
        totalDebt += capex * (debtPct / 100)
        totalEquity += capex * (equityPct / 100)
      }
    })
    
    return [
      { name: "Total Equity", value: totalEquity, fill: "#0ea5e9" },
      { name: "Total Debt", value: totalDebt, fill: "#f59e0b" }
    ].filter(d => d.value > 0)
  }, [scenarios])

  /* ---- OpEx Breakdown Data ---- */
  const opexBreakdownData = useMemo(() => {
    let salary = 0, utilities = 0, insurance = 0, admin = 0, rent = 0, tech = 0, prof = 0
    filteredScenarios.forEach((scenario: any) => {
      const opex = scenario.operating_expenses
      if (opex) {
        salary += (parseFloat(opex.average_annual_salary) || 0) * (parseInt(opex.total_headcount) || 1)
        utilities += (parseFloat(opex.power_electricity_cost_annual) || 0) + (parseFloat(opex.water_gas_utilities_annual) || 0)
        insurance += parseFloat(opex.insurance_annual) || 0
        admin += parseFloat(opex.administrative_expenses_annual) || 0
        rent += parseFloat(opex.rent_facilities_annual) || 0
        tech += parseFloat(opex.technology_software_annual) || 0
        prof += parseFloat(opex.professional_fees_annual) || 0
      }
    })
    
    return [
      { name: "Salaries", value: salary, fill: "#0ea5e9" },
      { name: "Utilities", value: utilities, fill: "#10b981" },
      { name: "Insurance", value: insurance, fill: "#f59e0b" },
      { name: "Admin Setup", value: admin, fill: "#6366f1" },
      { name: "Rent/Facil", value: rent, fill: "#ec4899" },
      { name: "Technology", value: tech, fill: "#14b8a6" },
      { name: "Prof. Fees", value: prof, fill: "#f97316" }
    ].filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [scenarios])

  /* ---- CapEx Breakdown Data ---- */
  const capexBreakdownData = useMemo(() => {
    let land = 0, construction = 0, equipment = 0, ffe = 0
    filteredScenarios.forEach((scenario: any) => {
      const capex = scenario.capital_expenditure
      if (capex) {
        land += parseFloat(capex.land_cost) || 0
        construction += parseFloat(capex.construction_building_cost) || parseFloat(capex.apartment_construction_cost) || parseFloat(capex.hotel_commercial_cost) || 0
        equipment += parseFloat(capex.equipment_machinery_cost) || 0
        ffe += parseFloat(capex.ffe_cost) || 0
      }
    })
    
    return [
      { name: "Land", value: land, fill: "#6366f1" },
      { name: "Construction", value: construction, fill: "#0ea5e9" },
      { name: "Equipment", value: equipment, fill: "#14b8a6" },
      { name: "FF&E", value: ffe, fill: "#f59e0b" }
    ].filter(d => d.value > 0)
  }, [scenarios])

  /* ---- Target IRR vs WACC (Spread) ---- */
  const spreadData = useMemo(() => {
    return scenarios
      .filter((s: any) => s.exit_valuation?.target_irr_pct && s.macro_assumptions?.discount_rate_wacc)
      .map((s: any) => ({
        name: s.name.substring(0, 15) + (s.name.length > 15 ? '...' : ''),
        irr: parseFloat(s.exit_valuation.target_irr_pct),
        wacc: parseFloat(s.macro_assumptions.discount_rate_wacc)
      }))
      .sort((a, b) => b.irr - a.irr)
      .slice(0, 5) // Top 5 scenarios
  }, [scenarios])

  /* ---- Cash Runway Data ---- */
  const cashRunwayData = useMemo(() => {
    let totalCapEx = 0;
    let totalOpExAnnual = 0;
    filteredScenarios.forEach((s: any) => {
      if (s.capital_expenditure) {
        totalCapEx += (parseFloat(s.capital_expenditure.land_cost) || 0) + (parseFloat(s.capital_expenditure.construction_building_cost) || 0)
      }
      if (s.operating_expenses) {
        totalOpExAnnual += (parseFloat(s.operating_expenses.average_annual_salary) || 0) * (parseInt(s.operating_expenses.total_headcount) || 1)
      }
    })
    const baseCash = totalCapEx > 0 ? totalCapEx * 0.3 : 5000000; 
    const monthlyBurn = totalOpExAnnual > 0 ? (totalOpExAnnual / 12) : 250000;
    const data = [];
    let currentCash = baseCash;
    for (let i = 0; i <= 12; i++) {
      data.push({
        month: i === 0 ? "Now" : `M${i}`,
        Cash: Math.round(currentCash),
        Threshold: 0
      });
      currentCash -= monthlyBurn;
      if (i > 4) currentCash += (monthlyBurn * 1.3); // Simulated revenue start
    }
    return data;
  }, [filteredScenarios])

  /* ---- Variance Waterfall Data (Revenue to Net) ---- */
  const waterfallData = useMemo(() => {
    let opex = 0
    let capexA = 0
    filteredScenarios.forEach((s: any) => {
      if (s.operating_expenses) {
        opex += ((parseFloat(s.operating_expenses.average_annual_salary) || 0) * (parseInt(s.operating_expenses.total_headcount) || 1)) + (parseFloat(s.operating_expenses.power_electricity_cost_annual) || 0)
      }
      if (s.capital_expenditure) {
        capexA += parseFloat(s.capital_expenditure.equipment_machinery_cost) || 0
      }
    })
    
    opex = opex || 3500000;
    capexA = capexA || 2000000;
    const revenue = (opex + capexA) * 1.4; // Simulate healthy margin
    const net = revenue - opex - capexA;

    return [
      { name: "Gross Rev", base: 0, val: revenue, fill: "#10b981" },
      { name: "OpEx", base: revenue - opex, val: opex, fill: "#ef4444" },
      { name: "CapEx", base: revenue - opex - capexA, val: capexA, fill: "#f97316" },
      { name: "Net Cash", base: 0, val: net, fill: "#0ea5e9" }
    ]
  }, [filteredScenarios])

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

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          className="max-w-7xl mx-auto space-y-6 sm:space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Page Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-balance">
                Comprehensive overview of your financial models, scenarios, and activity.
              </p>
            </div>
            
            {/* What-If Toggles */}
            <div className="flex items-center gap-1.5 bg-secondary/30 p-1.5 rounded-lg border shadow-sm">
              <button
                onClick={() => setScenarioFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scenarioFilter === "all" ? "bg-background shadow-sm text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}`}
              >
                All
              </button>
              <button
                onClick={() => setScenarioFilter("base")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scenarioFilter === "base" ? "bg-background shadow-sm text-blue-600 scale-105" : "text-muted-foreground hover:text-foreground"}`}
              >
                Base Case
              </button>
              <button
                onClick={() => setScenarioFilter("upside")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scenarioFilter === "upside" ? "bg-background shadow-sm text-emerald-600 scale-105" : "text-muted-foreground hover:text-foreground"}`}
              >
                Upside
              </button>
              <button
                onClick={() => setScenarioFilter("downside")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scenarioFilter === "downside" ? "bg-background shadow-sm text-rose-600 scale-105" : "text-muted-foreground hover:text-foreground"}`}
              >
                Downside
              </button>
            </div>
          </motion.div>

          {/* ====== TOP KPIs ====== */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Key Metrics</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                subtitle={stats.totalScenarios > 0 ? `${stats.baseScenarios} base · ${stats.upsideScenarios + stats.downsideScenarios + stats.customScenarios} vars` : "No scenarios"}
                icon={Activity}
                iconColor="bg-emerald-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Reports Generated"
                value={stats.totalReports}
                subtitle={stats.totalReports > 0 ? `${stats.completedReports} completed` : "No reports"}
                icon={FileText}
                iconColor="bg-purple-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Calculations Run"
                value={stats.totalCalcs}
                subtitle={stats.totalCalcs > 0 ? `${calcSuccessRate}% success` : "No calcs"}
                icon={Zap}
                iconColor="bg-amber-500"
              />
              <StatCard
                isLoading={isLoading}
                title="Models Generated"
                value={stats.calculatedModels}
                subtitle={stats.totalModels > 0 ? `${Math.round((stats.calculatedModels / stats.totalModels) * 100)}% of total` : "No models"}
                icon={CheckCircle2}
                iconColor="bg-teal-500"
              />
            </div>
          </motion.div>

          {/* ====== FINANCIAL MODELING CHARTS ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            
            {/* OpEx Breakdown */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Operating Expenditure (OpEx) Allocation
                </CardTitle>
                <CardDescription>Aggregated operating expenses across all scenarios</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : opexBreakdownData.length === 0 ? (
                    <div className="text-center">
                      <Layers className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No OpEx data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={opexBreakdownData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, true)} />
                        <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={80} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, false)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {opexBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CapEx Breakdown */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-indigo-500" />
                  Capital Expenditure (CapEx) Breakdown
                </CardTitle>
                <CardDescription>Initial investment components and hard costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : capexBreakdownData.length === 0 ? (
                    <div className="text-center">
                      <DollarSign className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No CapEx data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={capexBreakdownData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {capexBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, false)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            {/* Target IRR vs WACC Spread */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  Project Spread (IRR vs WACC)
                </CardTitle>
                <CardDescription>Top 5 active scenarios tracking target returns vs capital costs</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : spreadData.length === 0 ? (
                    <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No Target Return/WACC data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spreadData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                        <Tooltip
                          formatter={(value: number) => `${value}%`}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="irr" fill="#10b981" radius={[4, 4, 0, 0]} name="Target IRR" />
                        <Bar dataKey="wacc" fill="#6366f1" radius={[4, 4, 0, 0]} name="WACC" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capital Stack (Debt vs Equity) */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-amber-500" />
                  Capital Stack Allocation
                </CardTitle>
                <CardDescription>Global funding mix vs requirements across all models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : capitalStackData.length === 0 ? (
                    <div className="text-center">
                      <CreditCard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No funding data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={capitalStackData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {capitalStackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, true)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ====== FP&A ENTERPRISE CHARTS ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            {/* Variance Waterfall */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Variance Waterfall (Revenue to Net Cash)
                </CardTitle>
                <CardDescription>Value bridge from simulated top-line to absolute bottom-line</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : waterfallData.length === 0 ? (
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No Waterfall data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, true)} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, false)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Bar dataKey="base" stackId="a" fill="transparent" />
                        <Bar dataKey="val" stackId="a" radius={[4, 4, 4, 4]}>
                           {waterfallData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Runway */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-500" />
                  Cash Flow Runway (Burn Trajectory)
                </CardTitle>
                <CardDescription>Simulated capital buffer over 12 month aggregate</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : cashRunwayData.length === 0 ? (
                    <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No cash runway data</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cashRunwayData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val, true)} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, false)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <Line type="monotone" dataKey="Cash" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
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
                <div className="h-[200px] sm:h-[320px] w-full flex items-center justify-center">
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
                <div className="h-[200px] sm:h-[320px] w-full flex items-center justify-center">
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

          {/* ====== CHARTS ROW 2: Model Status + Scenario Types + IRR Distribution ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
            {/* Model Status */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Model Status</CardTitle>
                <CardDescription>Current status distribution of your models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] sm:h-[260px] w-full flex items-center justify-center">
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
                <div className="h-[180px] sm:h-[260px] w-full flex items-center justify-center">
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

            {/* IRR Distribution */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Target IRR Distribution</CardTitle>
                <CardDescription>Frequency of target IRRs across all scenarios</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[180px] sm:h-[260px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : irrDistributionData.every((d) => d.count === 0) ? (
                    <div className="text-center">
                      <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No IRR data found</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={irrDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                          formatter={(val) => [val, "Count"]}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ====== CHARTS ROW 3: CapEx by Industry + Capital Stack ====== */}
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-7">
            {/* CAPEX by Industry */}
            <Card className="lg:col-span-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">CAPEX Deployment by Industry</CardTitle>
                <CardDescription>Total capital expenditure modeled across project types</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] sm:h-[320px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : capexByIndustryData.length === 0 ? (
                    <div className="text-center">
                      <Target className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No capex data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={capexByIndustryData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, true)}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: 12 }}
                        />
                        <Bar dataKey="capex" fill="#14b8a6" radius={[4, 4, 0, 0]} name="CAPEX" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capital Stack */}
            <Card className="lg:col-span-3 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Global Capital Stack</CardTitle>
                <CardDescription>Total Debt vs. Equity modeled across all scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] sm:h-[320px] w-full flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : capitalStackData.length === 0 ? (
                    <div className="text-center">
                      <PieChartIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No financing data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={capitalStackData}
                          cx="50%"
                          cy="45%"
                          innerRadius={65}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {capitalStackData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, true)}
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

          {/* ====== RECENT MODELS TABLE ====== */}
          <motion.div variants={itemVariants} className="pb-8">
            <Card className="shadow-2xl shadow-primary/5 border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden rounded-2xl relative">
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-white/10"></div>
              <CardHeader className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border/40 pb-4 relative z-10">
                <CardTitle className="text-base font-bold">Recent Models</CardTitle>
                <CardDescription>Your most recently updated financial models</CardDescription>
              </CardHeader>
              <CardContent className="p-0 relative z-10">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : recentModels.length === 0 ? (
                  <div className="text-center py-12">
                    <Layers className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-foreground font-medium">No models created yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Create your first financial model to see it here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[400px] w-full">
                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                      <thead className="sticky top-0 bg-card/95 backdrop-blur-xl z-20 shadow-sm border-b border-border/50">
                        <tr>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Model Name</th>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Type</th>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Completion</th>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Last Updated</th>
                          <th className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Calculated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentModels.map((model: any, idx: number) => (
                          <tr key={model.id} className={`group border-b border-border/30 hover:bg-primary/5 transition-colors duration-200 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}`}>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold text-foreground text-xs sm:text-sm">{model.name || "Untitled"}</td>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                              <Badge variant="secondary" className="text-[9px] sm:text-[10px] font-medium tracking-wide bg-secondary/50">
                                {(model.project_type_display || model.project_type || "General").replace(/_/g, " ")}
                              </Badge>
                            </td>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                              <Badge
                                variant="outline"
                                className={`text-[9px] sm:text-[10px] font-medium tracking-wide bg-transparent backdrop-blur-sm ${
                                  model.status === "active"
                                    ? "border-blue-400 text-blue-700 bg-blue-500/10 dark:border-blue-500/40 dark:text-blue-300"
                                    : model.status === "archived"
                                    ? "border-indigo-400 text-indigo-700 bg-indigo-500/10 dark:border-indigo-500/40 dark:text-indigo-300"
                                    : "border-gray-400 text-gray-700 bg-gray-500/10 dark:border-gray-500/40 dark:text-gray-300"
                                }`}
                              >
                                {(model.status_display || model.status || "draft").charAt(0).toUpperCase() + (model.status_display || model.status || "draft").slice(1)}
                              </Badge>
                            </td>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-12 sm:w-20 h-1.5 sm:h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
                                    style={{ width: `${model.completion_percentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground w-5 text-right flex-shrink-0">{model.completion_percentage || 0}%</span>
                              </div>
                            </td>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-muted-foreground text-[10px] sm:text-xs font-medium">
                              {model.updated_at
                                ? new Date(model.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })
                                : "—"
                              }
                            </td>
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right">
                              {model.last_calculated_at ? (
                                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                  <span className="hidden sm:inline">{new Date(model.last_calculated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                  <span className="sm:hidden">{new Date(model.last_calculated_at).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-semibold text-muted-foreground bg-muted/40 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-border/50">
                                  <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
