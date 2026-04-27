"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft, MoreVertical, Share2, Download, Settings,
  TrendingUp, BarChart3, Loader2, AlertCircle, FileText,
  DollarSign, TrendingDown, Activity, PlayCircle, CheckCircle2, ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart
} from "recharts"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "—"
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function fmtPct(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return "—"
  return `${value.toFixed(1)}%`
}

/**
 * Given the grouped calculated_data from the API, extract a named statement line
 * as an array of { period, value } objects ready for Recharts.
 */
function extractLine(
  data: Record<string, Array<{ line_item: string; values_by_period: Record<string, number> }>>,
  statementType: string,
  lineItem: string
): { period: string; value: number }[] {
  const statements = data?.[statementType] ?? []
  const match = statements.find(s => s.line_item === lineItem)
  if (!match) return []
  return Object.entries(match.values_by_period)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, value]) => ({ period, value: Number(value) }))
}

/**
 * Build a multi-series chart dataset from multiple line items merged by period.
 */
function mergeLines(
  data: Record<string, Array<{ line_item: string; values_by_period: Record<string, number> }>>,
  statementType: string,
  items: string[]
): Record<string, any>[] {
  const statements = data?.[statementType] ?? []
  const periodSet = new Set<string>()
  const byItem: Record<string, Record<string, number>> = {}

  for (const item of items) {
    const match = statements.find(s => s.line_item === item)
    if (match) {
      byItem[item] = match.values_by_period
      Object.keys(match.values_by_period).forEach(p => periodSet.add(p))
    }
  }

  return Array.from(periodSet).sort().map(period => {
    const row: Record<string, any> = { period }
    for (const item of items) {
      row[item] = byItem[item]?.[period] ?? 0
    }
    return row
  })
}

/** Get the last value of a line item */
function lastValue(
  data: Record<string, any>,
  statementType: string,
  lineItem: string
): number {
  const rows = extractLine(data, statementType, lineItem)
  if (!rows.length) return 0
  // Use the most recent non-zero value
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].value !== 0) return rows[i].value
  }
  return 0
}

/** Peak value of a line */
function peakValue(
  data: Record<string, any>,
  statementType: string,
  lineItem: string
): number {
  const rows = extractLine(data, statementType, lineItem)
  if (!rows.length) return 0
  return Math.max(...rows.map(r => r.value))
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  )
}

function MetricCard({
  label, value, sub, color = "primary", icon: Icon
}: {
  label: string; value: string; sub?: string; color?: string; icon: any
}) {
  return (
    <Card className="p-4 sm:p-5 hover:shadow-md hover:border-border/80 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1 sm:space-y-1.5 overflow-hidden pr-2">
          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">{label}</p>
          <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{value}</p>
          {sub && <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{sub}</p>}
        </div>
        <div className="p-2 sm:p-2.5 bg-secondary/50 rounded-lg shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/70" />
        </div>
      </div>
    </Card>
  )
}

import { useParams } from "next/navigation"

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReportDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const token = useSelector(selectToken)
  const { toast } = useToast()

  // Safely retrieve the auth token string
  const getAuthToken = () => {
    if (!token) return ""
    if (typeof token === "string") return token
    if (typeof token === "object" && (token as any).access) return (token as any).access
    return ""
  }

  const fetchReport = async (showLoadingState = true) => {
    try {
      if (showLoadingState) setIsLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE_URL}/reports/${id}/`, {
        headers: { Authorization: `JWT ${getAuthToken()}` },
        cache: 'no-store'
      })

      if (!res.ok) {
        let errDetail = `Failed to fetch report (${res.status})`
        try {
          const errData = await res.json()
          errDetail = errData.detail || JSON.stringify(errData)
        } catch (_) { }
        throw new Error(errDetail)
      }

      const data = await res.json()
      setReport(data)
    } catch (err: any) {
      setError(err.message || "Failed to load report")
    } finally {
      if (showLoadingState) setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token && id) fetchReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token])

  const handleCalculate = async () => {
    if (!report?.financial_model) {
      toast({ title: "Error", description: "This report is not linked to a valid model.", variant: "destructive" })
      return
    }
    
    try {
      setIsCalculating(true)
      const res = await fetch(`${API_BASE_URL}/models/${report.financial_model}/calculate/`, {
        method: "POST",
        headers: {
          "Authorization": `JWT ${getAuthToken()}`,
          "Content-Type": "application/json"
        }
      })
      
      if (!res.ok) {
        let errDetail = "Failed to calculate model"
        try {
          const errData = await res.json()
          errDetail = errData.message || errData.error || errDetail
        } catch (_) {}
        throw new Error(errDetail)
      }
      
      toast({
        title: "Success",
        description: "Report data has been calculated successfully.",
      })
      
      // Reload the report data seamlessly
      await fetchReport(false)
      
    } catch (err: any) {
      toast({
        title: "Calculation Error",
        description: err.message || "Failed to calculate report data",
        variant: "destructive"
      })
    } finally {
      setIsCalculating(false)
    }
  }

  // ── Safely Extract Data & Run Hooks First ────────────────────────────────
  const cd: Record<string, any> = report?.calculated_data || {}
  const hasData = Object.keys(cd).length > 0

  // Validation Engine (10d)
  const modelIntegrity = useMemo(() => {
    if (!hasData) return null;
    let isBalanced = true;
    let dscrOk = true;
    const errors: string[] = [];
    
    // Balance Check
    const balanceData = cd["bs"]?.find((item: any) => item.line_item === "Balance Check (should be 0)");
    if (balanceData && balanceData.values_by_period) {
      Object.entries(balanceData.values_by_period).forEach(([period, val]) => {
        if (Math.abs(Number(val)) > 1) { // Allow $1 floating point drift
          isBalanced = false;
          errors.push(`Balance Sheet mismatched in ${period} (Gap: $${Math.abs(Number(val)).toFixed(0)})`);
        }
      });
    }

    // DSCR Covenant Check
    const dscrData = cd["ratio"]?.find((item: any) => item.line_item === "DSCR");
    if (dscrData && dscrData.values_by_period) {
      Object.entries(dscrData.values_by_period).forEach(([period, val]) => {
        if (Number(val) < 1.0 && Number(val) > 0) { 
          dscrOk = false;
          if (!errors.some(e => e.includes("DSCR fell"))) { // Prevent overflowing array
             errors.push(`DSCR Covenant Breach: Fell to ${Number(val).toFixed(2)}x in ${period}`);
          }
        }
      });
    }

    // IRR Performance Target Check
    let irrOk = true;
    const valuationObj = cd["valuation"]?.find((item: any) => item.line_item === "Valuation Metrics");
    const actualIrr = valuationObj?.values_by_period?.["IRR (%)"];
    if (actualIrr !== undefined && Number(actualIrr) <= 0) {
      irrOk = false;
      errors.push(`Financial Warning: Project yields a negative IRR of ${Number(actualIrr).toFixed(2)}%`);
    }

    const passed = isBalanced && dscrOk && irrOk;

    return { passed, isBalanced, dscrOk, irrOk, errors };
  }, [cd, hasData]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading report data…</p>
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !report) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error || "Report not found"}</p>
        <Link href="/dashboard/reports">
          <Button variant="outline">Back to Reports</Button>
        </Link>
      </div>
    )
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  // Key metrics
  const peakRevenue = peakValue(cd, "is", "Total Revenue")
  const lastEbitda = lastValue(cd, "is", "EBITDA")
  const lastNetIncome = lastValue(cd, "is", "Net Income")
  const peakCfo = peakValue(cd, "cfs", "Cash Flow from Operations")
  const npv = lastValue(cd, "valuation", "NPV") || (cd["valuation"]?.[0]?.values_by_period?.["NPV"] ?? 0)

  // Chart datasets
  const revenueVsOpex = mergeLines(cd, "is", ["Total Revenue", "Total Operating Expenses", "EBITDA"])
  const profitabilityData = mergeLines(cd, "is", ["EBITDA", "EBIT", "Net Income"])
  const cashFlowData = mergeLines(cd, "cfs", ["Cash Flow from Operations", "Cash Flow from Investing", "Net Cash Flow"])
  const debtData = mergeLines(cd, "debt", ["Opening Balance", "Closing Balance", "Interest Expense"])

  const COLORS = {
    revenue: "#6366f1",
    opex: "#f43f5e",
    ebitda: "#10b981",
    ebit: "#3b82f6",
    netIncome: "#8b5cf6",
    cfo: "#06b6d4",
    cfi: "#f59e0b",
    ncf: "#10b981",
    debt: "#ef4444",
    interest: "#f97316",
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto h-full p-4 sm:p-5 md:p-8 space-y-6 print:overflow-visible print:h-auto print:p-0 print:block print:space-y-6 print:text-black print:bg-white w-full">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="space-y-4 print:mb-8 print:break-after-avoid">
        <Link href="/dashboard/reports" className="print:hidden">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 print:w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight print:text-black print:text-5xl">{report.name || "Untitled Report"}</h1>
            <p className="text-sm sm:text-base text-muted-foreground print:text-gray-800 print:text-lg">{report.description || "No description provided."}</p>
            <div className="flex flex-wrap gap-2 mt-3 text-[10px] sm:text-xs print:hidden">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{report.report_type}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium capitalize">{report.status}</span>
              {report.model_name && (
                <span className="px-3 py-1 bg-secondary text-foreground rounded-full">{report.model_name}</span>
              )}
              {report.scenario_name && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">{report.scenario_name}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.print()}><Download className="w-4 h-4 mr-2" />Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  try {
                    const url = `${API_BASE_URL}/reports/${id}/export_excel/`
                    const res = await fetch(url, {
                      headers: { 'Authorization': `JWT ${getAuthToken()}` }
                    })
                    if (!res.ok) throw new Error('Export failed')
                    const blob = await res.blob()
                    const downloadUrl = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = downloadUrl
                    a.download = `Export_${report.name?.replace(/\s+/g, '_') || 'Report'}.xlsx`
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(downloadUrl)
                    document.body.removeChild(a)
                  } catch (err) {
                    console.error("Export failed", err)
                  }
                }}>
                  <Download className="w-4 h-4 mr-2" />Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── No-data notice ──────────────────────────────────────────── */}
      {!hasData && (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No calculated data yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Generate the underlying model to populate this report with financial projections and visualizations.
          </p>
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            size="lg"
            className="gap-2"
          >
            {isCalculating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
            {isCalculating ? "Calculating Engine..." : "Calculate Report Data"}
          </Button>
        </Card>
      )}

      {/* ── Automatic Validation Integrity Bar (10d) ────────────────────── */}
      {hasData && modelIntegrity && (
        <Card className={`p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 shadow-sm relative overflow-hidden mb-2 ${
          modelIntegrity.passed ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20" : "border-l-destructive bg-red-50/50 dark:bg-red-950/20"
        }`}>
          <div className="flex items-start gap-3">
            {modelIntegrity.passed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500 mt-0.5" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-destructive mt-0.5" />
            )}
            <div>
              <h3 className={`font-semibold ${modelIntegrity.passed ? "text-green-800 dark:text-green-400" : "text-destructive"}`}>
                {modelIntegrity.passed ? "Model Integrity: Verified" : "Model Integrity: Action Required"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {modelIntegrity.passed 
                  ? "Balance sheet symmetry maintained. Debt service coverage covenants met. Minimum IRR hurdles cleared."
                  : "The automated auditor detected structural breaks or broken covenants in this scenario."}
              </p>
            </div>
          </div>
          
          {!modelIntegrity.passed && modelIntegrity.errors.length > 0 && (
            <div className="md:max-w-md w-full bg-background/60 p-3 rounded-md text-xs sm:text-sm text-destructive font-medium border border-destructive/20 shadow-inner">
              <ul className="list-disc list-inside space-y-1">
                {modelIntegrity.errors.slice(0, 3).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
                {modelIntegrity.errors.length > 3 && (
                  <li className="text-muted-foreground italic">+ {modelIntegrity.errors.length - 3} more errors</li>
                )}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* ── AI Executive Narrative ─────────────────────────────────────────────── */}
      {hasData && (
        <Card className="p-5 sm:p-6 bg-secondary/20 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Automated Executive Narrative
          </h3>
          <div className="space-y-3 print:space-y-2">
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              The financial synthesis indicates peak topline revenue scaling up to <strong className="text-primary">{fmt(peakRevenue)}</strong>. 
              Operating expenditure bridging leaves a terminal EBITDA profile of <strong className="text-primary">{fmt(lastEbitda)}</strong> 
              {peakRevenue > 0 ? ` (representing a margin capacity nearing ${((lastEbitda / peakRevenue) * 100).toFixed(1)}%)` : ""}. 
              The capital formation yields a net present value (NPV) estimation around <strong className="text-primary">{fmt(npv)}</strong>.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Net cash flow indicates {lastNetIncome > 0 ? "positive structural liquidity" : "a highly constrained liquidity runway"}, 
              with peak operating cash reaching <strong className="text-primary">{fmt(peakCfo)}</strong>. 
              Capital stack positioning should be actively monitored against macroeconomic discount rate shifts to protect the baseline structural returns.
            </p>
          </div>
        </Card>
      )}

      {/* ── Key Metrics ─────────────────────────────────────────────── */}
      {hasData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard icon={DollarSign} label="Peak Revenue" value={fmt(peakRevenue)} sub="Highest single period" color="primary" />
          <MetricCard icon={TrendingUp} label="Peak EBITDA" value={fmt(lastEbitda)} sub="Latest period" color="green" />
          <MetricCard icon={Activity} label="Net Income" value={fmt(lastNetIncome)} sub="Latest period" color="blue" />
          <MetricCard icon={BarChart3} label="Peak Operating CF" value={fmt(peakCfo)} sub="Cash generation" color="orange" />
        </div>
      )}

      {/* ── Charts tabs ──────────────────────────────────────────────── */}
      {hasData && (
        <Tabs defaultValue="income" className="w-full">
          <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <TabsList className="inline-flex w-max min-w-full justify-start sm:justify-center p-1 bg-secondary/50 rounded-lg h-auto">
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="income">Income Statement</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="profitability">Profitability</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="cashflow">Cash Flow</TabsTrigger>
              {debtData.length > 0 && <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="debt">Debt</TabsTrigger>}
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="revenue">Revenue</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="opex">OpEx</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="fixed_assets">Fixed Assets</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="tax">Tax</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="dividend">Reserve & Dividends</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="exit">Exit</TabsTrigger>
              <TabsTrigger className="text-[11px] sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4" value="summary">Summary</TabsTrigger>
            </TabsList>
          </div>

          {/* ── Income Statement ───────────────── */}
          <TabsContent value="income" className="mt-4 sm:mt-6 space-y-4">
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                Revenue vs Operating Expenses
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-4">All periods — click legend to toggle series</p>
              {revenueVsOpex.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={revenueVsOpex} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="Total Revenue" fill={COLORS.revenue} stroke={COLORS.revenue} fillOpacity={0.15} name="Revenue" />
                    <Bar dataKey="Total Operating Expenses" fill={COLORS.opex} opacity={0.75} name="OpEx" />
                    <Line type="monotone" dataKey="EBITDA" stroke={COLORS.ebitda} strokeWidth={2} dot={false} name="EBITDA" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">No income statement data</p>
              )}
            </Card>

            {/* Full IS table */}
            {(cd["is"] ?? []).length > 0 && (
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Income Statement — All Periods</h3>
                <FinancialTable rows={cd["is"]} />
              </Card>
            )}
          </TabsContent>

          {/* ── Profitability ──────────────────── */}
          <TabsContent value="profitability" className="mt-4 sm:mt-6 space-y-4">
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                EBITDA / EBIT / Net Income
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-4">Profitability waterfall across all periods</p>
              {profitabilityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={profitabilityData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="gEbitda" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.ebitda} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.ebitda} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gNi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.netIncome} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.netIncome} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="EBITDA" stroke={COLORS.ebitda} fill="url(#gEbitda)" strokeWidth={2} name="EBITDA" />
                    <Area type="monotone" dataKey="EBIT" stroke={COLORS.ebit} fill="none" strokeWidth={2} strokeDasharray="5 3" name="EBIT" />
                    <Area type="monotone" dataKey="Net Income" stroke={COLORS.netIncome} fill="url(#gNi)" strokeWidth={2} name="Net Income" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">No profitability data</p>
              )}
            </Card>

            {/* Ratios table */}
            {(cd["ratio"] ?? []).length > 0 && (
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Financial Ratios</h3>
                <FinancialTable rows={cd["ratio"]} isRatio />
              </Card>
            )}
          </TabsContent>

          {/* ── Cash Flow ─────────────────────── */}
          <TabsContent value="cashflow" className="mt-4 sm:mt-6 space-y-4">
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                Cash Flow Waterfall
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-4">Operating, investing, and net cash generation</p>
              {cashFlowData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={cashFlowData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Cash Flow from Operations" fill={COLORS.cfo} name="Operating CF" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Cash Flow from Investing" fill={COLORS.cfi} name="Investing CF" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Net Cash Flow" fill={COLORS.ncf} name="Net CF" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">No cash flow data</p>
              )}
            </Card>

            {(cd["cfs"] ?? []).length > 0 && (
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Cash Flow Statement — All Periods</h3>
                <FinancialTable rows={cd["cfs"]} />
              </Card>
            )}
          </TabsContent>

          {/* ── Debt Schedule ─────────────────── */}
          {debtData.length > 0 && (
            <TabsContent value="debt" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  Debt Schedule
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-4">Opening balance, closing balance, and interest expense</p>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={debtData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} width={70} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="Opening Balance" stroke={COLORS.debt} fill={COLORS.debt} fillOpacity={0.1} name="Opening Balance" />
                    <Area type="monotone" dataKey="Closing Balance" stroke="#b91c1c" fill="#b91c1c" fillOpacity={0.1} name="Closing Balance" />
                    <Bar dataKey="Interest Expense" fill={COLORS.interest} name="Interest Expense" radius={[3, 3, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Debt Schedule — All Periods</h3>
                <FinancialTable rows={cd["debt"]} />
              </Card>
            </TabsContent>
          )}

          {/* ── Summary ──────────────────────── */}
          <TabsContent value="summary" className="mt-4 sm:mt-6 space-y-4">
            <Card className="p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                Report Metadata
              </h3>
              <div className="grid gap-3 text-sm">
                {[
                  { label: "Report Name", value: report.name },
                  { label: "Model", value: report.model_name || "—" },
                  { label: "Scenario", value: report.scenario_name || "—" },
                  { label: "Type", value: report.report_type },
                  { label: "Status", value: report.status },
                  { label: "Created", value: report.date_created ? new Date(report.date_created).toLocaleString() : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Valuation metrics if present */}
            {(cd["valuation"] ?? []).length > 0 && (
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Valuation Metrics</h3>
                <div className="grid gap-3 text-sm">
                  {cd["valuation"].map((stmt: any) =>
                    Object.entries(stmt.values_by_period ?? {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between border-b border-border pb-2 last:border-0">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium text-primary">{fmt(Number(val))}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ── Additional Schedules ──────────────────────── */}
          {(cd["revenue"] ?? []).length > 0 && (
            <TabsContent value="revenue" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Revenue & Receivables Schedule</h3>
                <FinancialTable rows={cd["revenue"]} />
              </Card>
            </TabsContent>
          )}

          {(cd["opex"] ?? []).length > 0 && (
            <TabsContent value="opex" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Operating Expenses & Payables Schedule</h3>
                <FinancialTable rows={cd["opex"]} />
              </Card>
            </TabsContent>
          )}

          {(cd["fixed_assets"] ?? []).length > 0 && (
            <TabsContent value="fixed_assets" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Fixed Assets & Depreciation</h3>
                <FinancialTable rows={cd["fixed_assets"]} />
              </Card>
            </TabsContent>
          )}

          {(cd["tax"] ?? []).length > 0 && (
            <TabsContent value="tax" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Tax & Allowances Schedule</h3>
                <FinancialTable rows={cd["tax"]} />
              </Card>
            </TabsContent>
          )}

          {(cd["dividend"] ?? []).length > 0 && (
            <TabsContent value="dividend" className="mt-4 sm:mt-6 space-y-4">
              <Card className="p-4 sm:p-6 overflow-hidden">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Reserve Accounts & Dividends</h3>
                <FinancialTable rows={cd["dividend"]} />
              </Card>
            </TabsContent>
          )}

          {/* ── Exit & Terminal Value ─────────── */}
          {(cd["exit"] ?? []).length > 0 && (
            <TabsContent value="exit" className="mt-4 sm:mt-6">
              <Card className="p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">Exit & Terminal Value Schedule</h3>
                <FinancialTable rows={cd["exit"]} />
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}

// ─── Financial Table ──────────────────────────────────────────────────────────

function FinancialTable({
  rows,
  isRatio = false
}: {
  rows: Array<{ line_item: string; values_by_period: Record<string, number> }>
  isRatio?: boolean
}) {
  if (!rows || rows.length === 0) return <p className="text-sm text-muted-foreground">No data</p>

  // Collect and sort all unique periods
  const periods = Array.from(
    new Set(rows.flatMap(r => Object.keys(r.values_by_period ?? {})))
  ).sort()

  const format = (val: number) => {
    if (isRatio) return fmtPct(val)
    return fmt(val)
  }

  const isNegative = (val: number) => val < 0
  const isHighlight = (item: string) =>
    ["Total Revenue", "EBITDA", "Net Income", "Cash Flow from Operations", "Net Cash Flow"].includes(item)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-semibold text-foreground min-w-[180px] sticky left-0 bg-card">
              Line Item
            </th>
            {periods.map(p => (
              <th key={p} className="text-right py-2 px-3 font-semibold text-foreground whitespace-nowrap">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                isHighlight(row.line_item) ? "font-semibold bg-primary/5" : ""
              }`}
            >
              <td className="py-2 pr-4 text-foreground sticky left-0 bg-card">{row.line_item}</td>
              {periods.map(p => {
                const val = row.values_by_period?.[p]
                const num = Number(val ?? 0)
                return (
                  <td
                    key={p}
                    className={`py-2 px-3 text-right tabular-nums ${
                      isNegative(num) ? "text-red-500" : "text-foreground"
                    }`}
                  >
                    {val !== undefined ? format(num) : "—"}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
