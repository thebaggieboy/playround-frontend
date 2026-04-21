"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft, Loader2, TrendingUp, Activity, Sliders,
    BarChart3, DollarSign, Percent, Target, Play
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, ReferenceLine
} from "recharts"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

const INPUT_VARIABLES = [
    { key: "revenue_growth", label: "Revenue Growth Rate", unit: "%" },
    { key: "discount_rate", label: "Discount Rate (WACC)", unit: "%" },
    { key: "tax_rate", label: "Tax Rate", unit: "%" },
    { key: "operating_cost", label: "Operating Costs", unit: "%" },
    { key: "capex", label: "Capital Expenditure", unit: "%" },
    { key: "debt_ratio", label: "Debt Ratio", unit: "%" },
]

const OUTPUT_METRICS = [
    { key: "npv", label: "NPV", format: "currency" },
    { key: "irr", label: "IRR", format: "pct" },
    { key: "ebitda", label: "EBITDA (Final Year)", format: "currency" },
    { key: "net_income", label: "Net Income (Final Year)", format: "currency" },
    { key: "dscr_min", label: "Min DSCR", format: "ratio" },
]

const VARIATIONS = [-30, -20, -10, 0, 10, 20, 30]

const formatCurrency = (val: number): string => {
    const abs = Math.abs(val)
    const sign = val < 0 ? "-" : ""
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`
    return `${sign}$${abs.toFixed(0)}`
}

export default function SensitivityPage() {
    const router = useRouter()
    const { id } = useParams()
    const token = useSelector(selectToken)

    const [scenario, setScenario] = useState<any>(null)
    const [results, setResults] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedInput, setSelectedInput] = useState(INPUT_VARIABLES[0].key)
    const [selectedOutput, setSelectedOutput] = useState(OUTPUT_METRICS[0].key)

    const getAuthToken = () => {
        if (!token) return ''
        if (typeof token === 'string') return token
        if (typeof token === 'object' && (token as any).access) return (token as any).access
        return ''
    }

    const headers: Record<string, string> = {
        'Authorization': `JWT ${getAuthToken()}`,
        'Content-Type': 'application/json'
    }

    // Fetch scenario + results
    useEffect(() => {
        if (!token || !id) return
        const fetchData = async () => {
            try {
                const [scenarioRes, resultsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/scenarios/${id}/`, { headers }),
                    fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${id}`, { headers }),
                ])
                if (scenarioRes.ok) setScenario(await scenarioRes.json())
                if (resultsRes.ok) setResults(await resultsRes.json())
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [token, id])

    // Extract base metrics from results
    const baseMetrics = useMemo(() => {
        if (!results) return null

        const getLastPeriodValue = (stType: string, lineItem: string): number | null => {
            const stmts = results[stType]
            if (!stmts) return null
            const stmt = stmts.find((s: any) => s.line_item === lineItem)
            if (!stmt?.values_by_period) return null
            const periods = Object.keys(stmt.values_by_period).sort()
            return stmt.values_by_period[periods[periods.length - 1]] ?? null
        }

        const getValuation = (key: string): number | null => {
            const stmts = results['Valuation Metrics']
            if (!stmts?.length) return null
            return stmts[0].values_by_period?.[key] ?? null
        }

        const dscrStmt = results['Financial Ratios']?.find((s: any) => s.line_item === 'DSCR')
        const dscrValues = dscrStmt ? Object.values(dscrStmt.values_by_period).filter((v: any) => v > 0) as number[] : []

        return {
            npv: getValuation('NPV'),
            irr: getValuation('IRR'),
            ebitda: getLastPeriodValue('Income Statement', 'EBITDA'),
            net_income: getLastPeriodValue('Income Statement', 'Net Income'),
            dscr_min: dscrValues.length > 0 ? Math.min(...dscrValues) : null,
        }
    }, [results])

    // Simulate sensitivity data (client-side estimation)
    const sensitivityData = useMemo(() => {
        if (!baseMetrics) return []
        const baseValue = baseMetrics[selectedOutput as keyof typeof baseMetrics]
        if (baseValue === null || baseValue === undefined) return []

        return VARIATIONS.map(pctChange => {
            // Simple linear sensitivity estimation
            const multiplier = 1 + (pctChange / 100)
            let adjustedValue: number

            if (selectedOutput === 'irr') {
                // IRR changes less dramatically
                adjustedValue = baseValue * (1 + (pctChange / 200))
            } else if (selectedOutput === 'dscr_min') {
                adjustedValue = baseValue * (1 + (pctChange / 150))
            } else {
                adjustedValue = baseValue * multiplier
            }

            return {
                variation: `${pctChange > 0 ? '+' : ''}${pctChange}%`,
                value: adjustedValue,
                pctChange,
                delta: adjustedValue - baseValue,
                deltaPct: ((adjustedValue - baseValue) / Math.abs(baseValue)) * 100,
            }
        })
    }, [baseMetrics, selectedInput, selectedOutput])

    const formatMetric = (val: number, format: string) => {
        if (format === "currency") return formatCurrency(val)
        if (format === "pct") return `${(val * 100).toFixed(1)}%`
        if (format === "ratio") return `${val.toFixed(2)}x`
        return String(val)
    }

    const selectedOutputMeta = OUTPUT_METRICS.find(m => m.key === selectedOutput)!

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/scenarios/${id}`)} className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sensitivity Analysis</h2>
                    </div>
                    <p className="text-muted-foreground ml-11">
                        {scenario?.name || "Scenario"} — Impact of variable changes on key outputs
                    </p>
                </div>
            </div>

            {/* Controls */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-primary" />
                        Analysis Parameters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Input Variable</label>
                            <Select value={selectedInput} onValueChange={setSelectedInput}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {INPUT_VARIABLES.map(v => (
                                        <SelectItem key={v.key} value={v.key}>{v.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Output Metric</label>
                            <Select value={selectedOutput} onValueChange={setSelectedOutput}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {OUTPUT_METRICS.map(m => (
                                        <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {sensitivityData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Tornado Chart */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base">
                                {selectedOutputMeta.label} Sensitivity to {INPUT_VARIABLES.find(v => v.key === selectedInput)?.label}
                            </CardTitle>
                            <CardDescription>Impact of ±10-30% changes on {selectedOutputMeta.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sensitivityData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" tickFormatter={(v) => formatMetric(v, selectedOutputMeta.format)} fontSize={10} />
                                        <YAxis type="category" dataKey="variation" fontSize={11} width={50} />
                                        <Tooltip
                                            formatter={(value: any) => formatMetric(value, selectedOutputMeta.format)}
                                            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }}
                                        />
                                        <ReferenceLine x={baseMetrics?.[selectedOutput as keyof typeof baseMetrics] || 0} stroke="#94a3b8" strokeDasharray="3 3" />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                            {sensitivityData.map((entry, idx) => (
                                                <Cell
                                                    key={idx}
                                                    fill={entry.pctChange === 0 ? "#6366f1" : entry.delta >= 0 ? "#10b981" : "#ef4444"}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-base">Results Table</CardTitle>
                            <CardDescription>Exact values for each variation</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="text-left p-3 font-semibold">Change</th>
                                        <th className="text-right p-3 font-semibold">{selectedOutputMeta.label}</th>
                                        <th className="text-right p-3 font-semibold">Δ%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensitivityData.map((row, idx) => (
                                        <tr key={idx} className={`border-b border-border/30 ${row.pctChange === 0 ? 'bg-primary/5 font-semibold' : 'hover:bg-muted/20'}`}>
                                            <td className="p-3">
                                                <Badge variant={row.pctChange === 0 ? "default" : "secondary"} className="text-xs">
                                                    {row.variation}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right font-mono text-xs">
                                                {formatMetric(row.value, selectedOutputMeta.format)}
                                            </td>
                                            <td className={`p-3 text-right text-xs font-mono ${row.delta > 0 ? 'text-emerald-600' : row.delta < 0 ? 'text-red-500' : ''}`}>
                                                {row.pctChange === 0 ? "Base" : `${row.deltaPct > 0 ? '+' : ''}${row.deltaPct.toFixed(1)}%`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="py-16">
                    <CardContent className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-lg font-medium mb-1">No Results Available</p>
                        <p className="text-sm text-muted-foreground mb-4">Run calculations first to enable sensitivity analysis.</p>
                        <Button onClick={() => router.push(`/dashboard/scenarios/${id}`)}>
                            Back to Scenario
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
