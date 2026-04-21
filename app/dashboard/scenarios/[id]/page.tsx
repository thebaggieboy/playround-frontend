"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Loader2,
    Calendar,
    Building2,
    Settings,
    DollarSign,
    TrendingDown,
    TrendingUp,
    Download,
    FileText,
    Activity,
    Layers,
    CheckCircle2,
    AlertTriangle,
    BarChart3,
    PieChart as PieChartIcon,
    Target,
    Percent,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Shield,
    Clock,
    Sliders,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, AreaChart, Area
} from "recharts"

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface StatementRow {
    id: number
    line_item: string
    statement_type: string
    values_by_period: Record<string, number>
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
const formatCurrency = (val: number | null | undefined): string => {
    if (val === undefined || val === null) return "—"
    const abs = Math.abs(val)
    if (abs >= 1e9) return `${val < 0 ? '-' : ''}$${(abs / 1e9).toFixed(2)}B`
    if (abs >= 1e6) return `${val < 0 ? '-' : ''}$${(abs / 1e6).toFixed(2)}M`
    if (abs >= 1e3) return `${val < 0 ? '-' : ''}$${(abs / 1e3).toFixed(1)}K`
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

const formatPercent = (val: number | null | undefined): string => {
    if (val === undefined || val === null) return "—"
    return `${val.toFixed(1)}%`
}

const formatNumber = (val: number | null | undefined): string => {
    if (val === undefined || val === null) return "—"
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function ScenarioDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const token = useSelector(selectToken)
    const { toast } = useToast()

    const [scenario, setScenario] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCalculating, setIsCalculating] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isExportingPdf, setIsExportingPdf] = useState(false)

    const getAuthToken = () => {
        if (!token) return '';
        if (typeof token === 'string') return token;
        if (typeof token === 'object' && token.access) return token.access;
        return '';
    }

    useEffect(() => {
        if (id) fetchScenarioData()
    }, [id])

    const fetchScenarioData = async () => {
        setIsLoading(true)
        try {
            const headers = { 'Authorization': `JWT ${getAuthToken()}` }
            const scenarioRes = await fetch(`${API_BASE_URL}/scenarios/${id}/`, { headers })
            if (!scenarioRes.ok) throw new Error('Failed to fetch scenario details')
            const scenarioData = await scenarioRes.json()
            setScenario(scenarioData)

            const resultsRes = await fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${id}`, { headers })
            if (resultsRes.ok) {
                const resultsData = await resultsRes.json()
                setResults(resultsData)
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Error", description: "Could not load scenario data.", variant: "destructive" })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCalculate = async () => {
        setIsCalculating(true)
        try {
            const res = await fetch(`${API_BASE_URL}/scenarios/${id}/calculate/`, {
                method: "GET",
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (!res.ok) throw new Error("Calculation failed")
            toast({ title: "Success", description: "Scenario calculated successfully" })
            fetchScenarioData()
        } catch (error) {
            toast({ title: "Error", description: "Failed to run calculation.", variant: "destructive" })
        } finally {
            setIsCalculating(false)
        }
    }

    const handleExportExcel = async () => {
        setIsExporting(true)
        try {
            const res = await fetch(`${API_BASE_URL}/scenarios/${id}/export_excel/`, {
                method: "GET",
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (!res.ok) throw new Error("Export failed")
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${scenario?.name || 'Scenario'}_Export.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast({ title: "Export Started", description: "Your Excel download should begin shortly." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to export Excel.", variant: "destructive" })
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportPdf = async () => {
        setIsExportingPdf(true)
        try {
            const res = await fetch(`${API_BASE_URL}/scenarios/${id}/export_pdf/`, {
                method: "GET",
                headers: { 'Authorization': `JWT ${getAuthToken()}` }
            })
            if (!res.ok) throw new Error("PDF Export failed")
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${scenario?.name || 'Scenario'}_Report.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast({ title: "Export Started", description: "Your PDF download should begin shortly." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to export PDF.", variant: "destructive" })
        } finally {
            setIsExportingPdf(false)
        }
    }

    // ─── Parse Results into Structured Data ─────────────────────────────────
    const parsed = useMemo(() => {
        if (!results) return null

        const getStatements = (typeName: string): StatementRow[] => {
            return results[typeName] || []
        }

        const getLineItem = (typeName: string, lineItem: string): Record<string, number> | null => {
            const stmts = getStatements(typeName)
            const found = stmts.find((s: any) => s.line_item === lineItem)
            return found?.values_by_period || null
        }

        const getValuationMetrics = (): Record<string, number> => {
            const stmts = getStatements('Valuation Metrics')
            if (stmts.length > 0) return stmts[0].values_by_period || {}
            return {}
        }

        const incomeStatement = getStatements('Income Statement')
        const balanceSheet = getStatements('Balance Sheet')
        const cashFlow = getStatements('Cash Flow Statement')
        const ratios = getStatements('Financial Ratios')
        const debtSchedule = getStatements('Debt Schedule')
        const valuation = getValuationMetrics()

        // Extract periods from first IS line item
        const periods = incomeStatement.length > 0
            ? Object.keys(incomeStatement[0].values_by_period || {}).sort()
            : []

        // Key line items
        const totalRevenue = getLineItem('Income Statement', 'Total Revenue')
        const ebitda = getLineItem('Income Statement', 'EBITDA')
        const netIncome = getLineItem('Income Statement', 'Net Income')
        const balanceCheck = getLineItem('Balance Sheet', 'Balance Check (should be 0)')

        // Check if balanced
        const isBalanced = balanceCheck
            ? Object.values(balanceCheck).every(v => Math.abs(v) < 0.1)
            : null

        // Peak values
        const peakRevenue = totalRevenue ? Math.max(...Object.values(totalRevenue)) : null
        const peakEbitda = ebitda ? Math.max(...Object.values(ebitda)) : null

        // DSCR values
        const dscrLine = getLineItem('Financial Ratios', 'DSCR')
        const dscrValues = dscrLine ? Object.values(dscrLine).filter(v => v > 0) : []
        const minDscr = dscrValues.length > 0 ? Math.min(...dscrValues) : null
        const avgDscr = dscrValues.length > 0 ? dscrValues.reduce((a, b) => a + b, 0) / dscrValues.length : null

        // Revenue trend chart data
        const trendData = periods.map(p => ({
            period: p,
            revenue: totalRevenue?.[p] || 0,
            ebitda: ebitda?.[p] || 0,
            netIncome: netIncome?.[p] || 0,
        }))

        // Margins chart data
        const ebitdaMargin = getLineItem('Financial Ratios', 'EBITDA Margin (%)')
        const netMargin = getLineItem('Financial Ratios', 'Net Margin (%)')
        const marginData = periods.map(p => ({
            period: p,
            ebitdaMargin: ebitdaMargin?.[p] || 0,
            netMargin: netMargin?.[p] || 0,
        }))

        return {
            incomeStatement,
            balanceSheet,
            cashFlow,
            ratios,
            debtSchedule,
            valuation,
            periods,
            peakRevenue,
            peakEbitda,
            isBalanced,
            minDscr,
            avgDscr,
            trendData,
            marginData,
        }
    }, [results])

    const hasResults = parsed && parsed.periods.length > 0

    // ─── LOADING / NOT FOUND ────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading scenario details...</p>
            </div>
        )
    }

    if (!scenario) {
        return (
            <div className="flex-1 p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Scenario Not Found</h2>
                <Button onClick={() => router.push('/dashboard/scenarios')}>Return to Scenarios</Button>
            </div>
        )
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'base': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'upside': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            case 'downside': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/scenarios')} className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">{scenario.name}</h2>
                        <Badge className={`${getTypeColor(scenario.scenario_type)} border-none capitalize`}>
                            {scenario.scenario_type} Case
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-11">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {new Date(scenario.created_at).toLocaleDateString()}
                        </span>
                        {scenario.project_info?.industry_sector && (
                            <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {scenario.project_info.industry_sector}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto [&>*]:shrink-0">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/scenarios/${id}/sensitivity`)} className="gap-2" disabled={!hasResults}>
                        <Sliders className="w-4 h-4" />
                        Sensitivity
                    </Button>
                    <Button variant="outline" onClick={handleExportExcel} disabled={isExporting} className="gap-2">
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Excel
                    </Button>
                    <Button variant="outline" onClick={handleExportPdf} disabled={isExportingPdf} className="gap-2">
                        {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        PDF
                    </Button>
                    <Button onClick={handleCalculate} disabled={isCalculating} className="gap-2">
                        {isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                        Run Calculation
                    </Button>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue={hasResults ? "dashboard" : "overview"} className="space-y-6">
                <TabsList className="bg-muted p-1 rounded-lg">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="dashboard" disabled={!hasResults}>
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="charts" disabled={!hasResults}>
                        Charts
                    </TabsTrigger>
                    <TabsTrigger value="statements" disabled={!hasResults}>
                        Statements
                    </TabsTrigger>
                    <TabsTrigger value="ratios" disabled={!hasResults}>
                        Ratios & Valuation
                    </TabsTrigger>
                    <TabsTrigger value="inputs">Inputs</TabsTrigger>
                </TabsList>

                {/* ═══════════ OVERVIEW TAB ═══════════ */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Project Summary */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Project Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Type</p>
                                        <p className="font-medium">{scenario.project_info?.project_type || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Location</p>
                                        <p className="font-medium">{scenario.project_info?.project_location || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Capacity</p>
                                        <p className="font-medium">
                                            {scenario.project_info?.total_capacity?.toLocaleString()} {scenario.project_info?.capacity_unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Operations Duration</p>
                                        <p className="font-medium">{scenario.project_info?.operations_duration_years} Years</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Macro Assumptions */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Macro Assumptions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Currency</p>
                                        <p className="font-medium uppercase">{scenario.macro_assumptions?.reporting_currency || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Base Year</p>
                                        <p className="font-medium">{scenario.macro_assumptions?.base_year || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Discount Rate (WACC)</p>
                                        <p className="font-medium">{scenario.macro_assumptions?.discount_rate_wacc}%</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Local Inflation</p>
                                        <p className="font-medium">{scenario.macro_assumptions?.local_inflation_rate}%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financing */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Financing
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Debt/Equity Split</p>
                                        <p className="font-medium">{scenario.debt_financing?.debt_percentage}% / {scenario.debt_financing?.equity_percentage}%</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Loan Tenor</p>
                                        <p className="font-medium">{scenario.debt_financing?.loan_tenor_years} Years</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Base Rate</p>
                                        <p className="font-medium">{scenario.debt_financing?.base_rate_value}% ({scenario.debt_financing?.base_rate_type})</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Exit Multiple (EBITDA)</p>
                                        <p className="font-medium">{scenario.exit_valuation?.exit_multiple_ev_ebitda}x</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* No Results CTA */}
                    {!hasResults && (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <Layers className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">No Results Available</h3>
                                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                                    Run calculation to generate financial statements, metrics, and charts for this scenario.
                                </p>
                                <Button onClick={handleCalculate} disabled={isCalculating}>
                                    {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
                                    Calculate Now
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* ═══════════ DASHBOARD TAB ═══════════ */}
                <TabsContent value="dashboard" className="space-y-6">
                    {parsed && (
                        <>
                            {/* KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <KPICard
                                    label="NPV"
                                    value={formatCurrency(parsed.valuation['NPV'])}
                                    icon={Target}
                                    trend={parsed.valuation['NPV'] > 0 ? 'up' : parsed.valuation['NPV'] < 0 ? 'down' : undefined}
                                    color="blue"
                                />
                                <KPICard
                                    label="IRR"
                                    value={formatPercent(parsed.valuation['IRR (%)'])}
                                    icon={Percent}
                                    trend={parsed.valuation['IRR (%)'] > 15 ? 'up' : parsed.valuation['IRR (%)'] > 0 ? undefined : 'down'}
                                    color="emerald"
                                />
                                <KPICard
                                    label="Terminal Value"
                                    value={formatCurrency(parsed.valuation['Terminal Value'])}
                                    icon={DollarSign}
                                    color="purple"
                                />
                                <KPICard
                                    label="Peak Revenue"
                                    value={formatCurrency(parsed.peakRevenue)}
                                    icon={TrendingUp}
                                    color="amber"
                                />
                                <KPICard
                                    label="Peak EBITDA"
                                    value={formatCurrency(parsed.peakEbitda)}
                                    icon={BarChart3}
                                    color="cyan"
                                />
                                <KPICard
                                    label="Min DSCR"
                                    value={parsed.minDscr ? `${parsed.minDscr.toFixed(2)}x` : '—'}
                                    icon={Shield}
                                    trend={parsed.minDscr && parsed.minDscr >= 1.3 ? 'up' : parsed.minDscr ? 'down' : undefined}
                                    color="rose"
                                />
                            </div>

                            {/* Validation Badges */}
                            <div className="flex flex-wrap gap-3">
                                {parsed.isBalanced !== null && (
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                        parsed.isBalanced
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                        {parsed.isBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        Balance Sheet {parsed.isBalanced ? 'Balanced ✓' : 'IMBALANCED ✗'}
                                    </div>
                                )}
                                {parsed.minDscr !== null && (
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                                        parsed.minDscr >= 1.3
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : parsed.minDscr >= 1.0
                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                        <Shield className="w-4 h-4" />
                                        DSCR: {parsed.minDscr >= 1.3 ? 'Adequate' : parsed.minDscr >= 1.0 ? 'Marginal' : 'Below Threshold'}
                                        ({parsed.minDscr.toFixed(2)}x min)
                                    </div>
                                )}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Revenue & EBITDA Trend */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-primary" />
                                            Revenue & EBITDA Trend
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={parsed.trendData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => {
                                                        if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(0)}B`
                                                        if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(0)}M`
                                                        return `${(v / 1e3).toFixed(0)}K`
                                                    }} />
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                    <Legend />
                                                    <Bar dataKey="revenue" name="Total Revenue" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                                                    <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[2, 2, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Profitability Margins */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <PieChartIcon className="w-4 h-4 text-primary" />
                                            Profitability Margins (%)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={parsed.marginData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                                                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                                                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                                                    <Legend />
                                                    <Area type="monotone" dataKey="ebitdaMargin" name="EBITDA Margin" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                                                    <Area type="monotone" dataKey="netMargin" name="Net Margin" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* ═══════════ CHARTS TAB ═══════════ */}
                <TabsContent value="charts" className="space-y-6">
                    {parsed && (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Revenue & EBITDA & Net Income */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-primary" />
                                            Revenue, EBITDA & Net Income
                                        </CardTitle>
                                        <CardDescription>Annual financial performance trend</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={parsed.trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                    <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => {
                                                        if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(0)}B`
                                                        if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(0)}M`
                                                        return `${(v / 1e3).toFixed(0)}K`
                                                    }} />
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                                    <Bar dataKey="ebitda" name="EBITDA" fill="#10b981" radius={[2, 2, 0, 0]} />
                                                    <Bar dataKey="netIncome" name="Net Income" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Profitability Margins */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Percent className="w-4 h-4 text-primary" />
                                            Profitability Margins (%)
                                        </CardTitle>
                                        <CardDescription>EBITDA and Net margins over time</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={parsed.marginData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                    <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                                                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                                    <Legend wrapperStyle={{ fontSize: 11 }} />
                                                    <Area type="monotone" dataKey="ebitdaMargin" name="EBITDA Margin" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                                                    <Area type="monotone" dataKey="netMargin" name="Net Margin" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Net Income Area */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-primary" />
                                            Net Income Trend
                                        </CardTitle>
                                        <CardDescription>Bottom line performance over project life</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={parsed.trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                    <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => {
                                                        if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(0)}B`
                                                        if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(0)}M`
                                                        return `${(v / 1e3).toFixed(0)}K`
                                                    }} />
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                                    <Area type="monotone" dataKey="netIncome" name="Net Income" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* DSCR Over Time */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-primary" />
                                            Debt Service Coverage Ratio (DSCR)
                                        </CardTitle>
                                        <CardDescription>DSCR over time with 1.3x threshold</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[350px]">
                                            {(() => {
                                                const dscrLine = parsed.ratios.find((r: any) => r.line_item === 'DSCR')
                                                const dscrData = dscrLine ? parsed.periods.map((p: string) => ({
                                                    period: p,
                                                    dscr: dscrLine.values_by_period[p] || 0,
                                                    threshold: 1.3,
                                                })) : []
                                                return (
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={dscrData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                                            <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                                                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}x`} />
                                                            <Tooltip formatter={(value: number) => `${value.toFixed(2)}x`} contentStyle={{ borderRadius: "8px", fontSize: 12 }} />
                                                            <Legend wrapperStyle={{ fontSize: 11 }} />
                                                            <Line type="monotone" dataKey="dscr" name="DSCR" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                                                            <Line type="monotone" dataKey="threshold" name="Min Threshold (1.3x)" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    )}
                </TabsContent>

                {/* ═══════════ STATEMENTS TAB ═══════════ */}
                <TabsContent value="statements" className="space-y-6">
                    {parsed && (
                        <Tabs defaultValue="is" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="is">Income Statement</TabsTrigger>
                                <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
                                <TabsTrigger value="cfs">Cash Flow</TabsTrigger>
                                <TabsTrigger value="debt">Debt Schedule</TabsTrigger>
                            </TabsList>

                            <TabsContent value="is">
                                <FinancialStatementTable
                                    title="Income Statement"
                                    rows={parsed.incomeStatement}
                                    periods={parsed.periods}
                                    highlightRows={['Total Revenue', 'EBITDA', 'EBIT', 'Net Income']}
                                />
                            </TabsContent>

                            <TabsContent value="bs">
                                <FinancialStatementTable
                                    title="Balance Sheet"
                                    rows={parsed.balanceSheet}
                                    periods={parsed.periods}
                                    highlightRows={['Total Assets', 'Total Liabilities', 'Total Equity']}
                                    validationRow="Balance Check (should be 0)"
                                />
                            </TabsContent>

                            <TabsContent value="cfs">
                                <FinancialStatementTable
                                    title="Cash Flow Statement"
                                    rows={parsed.cashFlow}
                                    periods={parsed.periods}
                                    highlightRows={['Cash Flow from Operations', 'Cash Flow from Investing', 'Cash Flow from Financing', 'Net Cash Flow', 'Cash Balance (End)']}
                                />
                            </TabsContent>

                            <TabsContent value="debt">
                                <FinancialStatementTable
                                    title="Debt Schedule"
                                    rows={parsed.debtSchedule}
                                    periods={parsed.periods}
                                    highlightRows={['Closing Balance']}
                                />
                            </TabsContent>
                        </Tabs>
                    )}
                </TabsContent>

                {/* ═══════════ RATIOS & VALUATION TAB ═══════════ */}
                <TabsContent value="ratios" className="space-y-6">
                    {parsed && (
                        <>
                            {/* Valuation Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Valuation Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {Object.entries(parsed.valuation).map(([key, value]) => (
                                            <div key={key} className="space-y-1">
                                                <p className="text-sm text-muted-foreground">{key}</p>
                                                <p className="text-xl font-bold">
                                                    {key.includes('%') ? formatPercent(value as number)
                                                        : formatCurrency(value as number)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ratios Table */}
                            <FinancialStatementTable
                                title="Financial Ratios"
                                rows={parsed.ratios}
                                periods={parsed.periods}
                                highlightRows={['DSCR']}
                                isRatio
                            />
                        </>
                    )}
                </TabsContent>

                {/* ═══════════ INPUTS TAB ═══════════ */}
                <TabsContent value="inputs" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Raw Input Data</CardTitle>
                            <CardDescription>Full JSON representation of the currently saved input state</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted rounded-md p-4 overflow-auto max-h-[600px] text-xs font-mono">
                                <pre>{JSON.stringify(scenario, null, 2)}</pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// ─── KPI Card Component ─────────────────────────────────────────────────────
function KPICard({
    label, value, icon: Icon, trend, color = 'blue'
}: {
    label: string
    value: string
    icon: any
    trend?: 'up' | 'down'
    color?: string
}) {
    const colorMap: Record<string, string> = {
        blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20',
        emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
        purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
        amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
        cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
        rose: 'from-rose-500/10 to-rose-500/5 border-rose-500/20',
    }

    const iconColorMap: Record<string, string> = {
        blue: 'text-blue-600', emerald: 'text-emerald-600', purple: 'text-purple-600',
        amber: 'text-amber-600', cyan: 'text-cyan-600', rose: 'text-rose-600',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`bg-gradient-to-br ${colorMap[color]} p-4 flex flex-col gap-2 relative overflow-hidden`}>
                <div className="flex items-center justify-between">
                    <Icon className={`w-4 h-4 ${iconColorMap[color]}`} />
                    {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-600" />}
                    {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{value}</p>
                </div>
            </Card>
        </motion.div>
    )
}

// ─── Financial Statement Table ──────────────────────────────────────────────
function FinancialStatementTable({
    title, rows, periods, highlightRows = [], validationRow, isRatio = false
}: {
    title: string
    rows: StatementRow[]
    periods: string[]
    highlightRows?: string[]
    validationRow?: string
    isRatio?: boolean
}) {
    if (rows.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground opacity-40 mb-3" />
                    <h3 className="font-medium text-lg mb-1">No {title} Data</h3>
                    <p className="text-muted-foreground text-sm">Run calculation to generate this statement.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="text-left p-3 font-semibold sticky left-0 bg-muted/50 z-10 min-w-[200px] border-b border-border">
                                    Line Item
                                </th>
                                {periods.map(p => (
                                    <th key={p} className="text-right p-3 font-semibold border-b border-border min-w-[120px]">
                                        {p}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => {
                                const isHighlight = highlightRows.includes(row.line_item)
                                const isValidation = row.line_item === validationRow
                                const allZero = isValidation && Object.values(row.values_by_period).every(v => Math.abs(v) < 0.1)

                                return (
                                    <tr
                                        key={row.id || idx}
                                        className={`
                                            border-b border-border/50 hover:bg-muted/30 transition-colors
                                            ${isHighlight ? 'bg-primary/5 font-semibold' : ''}
                                            ${isValidation ? (allZero ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20') : ''}
                                        `}
                                    >
                                        <td className={`p-3 sticky left-0 bg-card z-10 ${isHighlight ? 'font-bold text-foreground' : 'text-foreground/80'}`}>
                                            <div className="flex items-center gap-2">
                                                {row.line_item}
                                                {isValidation && (
                                                    allZero
                                                        ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                        : <AlertTriangle className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        {periods.map(p => {
                                            const val = row.values_by_period[p]
                                            return (
                                                <td
                                                    key={p}
                                                    className={`p-3 text-right font-mono text-xs ${
                                                        val < 0 ? 'text-red-600 dark:text-red-400' :
                                                        isHighlight ? 'font-bold' : ''
                                                    }`}
                                                >
                                                    {isRatio
                                                        ? (row.line_item.includes('%') ? formatPercent(val) : formatNumber(val))
                                                        : formatCurrency(val)}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
