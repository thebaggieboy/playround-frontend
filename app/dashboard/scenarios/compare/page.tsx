"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
    ArrowLeft, Loader2, TrendingUp, TrendingDown, Target,
    BarChart3, DollarSign, Percent, Shield, Activity,
    ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from "recharts"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import Link from "next/link"

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

const SCENARIO_COLORS: Record<string, string> = {
    base: "#10b981", upside: "#3b82f6", downside: "#f59e0b", custom: "#8b5cf6",
}
const SCENARIO_LABELS: Record<string, string> = {
    base: "Base Case", upside: "Upside", downside: "Downside", custom: "Custom",
}

interface Model { id: number; name: string; scenarios: { id: number; name: string; scenario_type: string }[] }
interface ScenarioResult { id: number; name: string; scenario_type: string; statements: Record<string, any[]> }

const formatCurrency = (val: number | null | undefined): string => {
    if (val === undefined || val === null || isNaN(val)) return "—"
    const abs = Math.abs(val); const sign = val < 0 ? "-" : ""
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`
    return `${sign}$${abs.toFixed(0)}`
}

export default function ScenarioComparePage() {
    const router = useRouter()
    const token = useSelector(selectToken)
    const [models, setModels] = useState<Model[]>([])
    const [selectedModelId, setSelectedModelId] = useState<string>("")
    const [scenarioResults, setScenarioResults] = useState<ScenarioResult[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingResults, setIsLoadingResults] = useState(false)

    const getAuthToken = () => {
        if (!token) return ''
        if (typeof token === 'string') return token
        if (typeof token === 'object' && (token as any).access) return (token as any).access
        return ''
    }
    const headers: Record<string, string> = { 'Authorization': `JWT ${getAuthToken()}`, 'Content-Type': 'application/json' }

    useEffect(() => {
        if (!token) return
        const fetchModels = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/models/`, { headers })
                if (!res.ok) return
                const data = await res.json()
                const list = Array.isArray(data) ? data : data.results || []
                setModels(list)
                if (list.length > 0) setSelectedModelId(String(list[0].id))
            } catch (e) { console.error(e) } finally { setIsLoading(false) }
        }
        fetchModels()
    }, [token])

    useEffect(() => {
        if (!selectedModelId) return
        const model = models.find(m => String(m.id) === selectedModelId)
        if (!model?.scenarios?.length) { setScenarioResults([]); return }
        const fetchResults = async () => {
            setIsLoadingResults(true)
            try {
                const results: ScenarioResult[] = []
                for (const scenario of model.scenarios) {
                    const res = await fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${scenario.id}`, { headers })
                    if (res.ok) {
                        const statements = await res.json()
                        results.push({ id: scenario.id, name: scenario.name, scenario_type: scenario.scenario_type, statements })
                    }
                }
                setScenarioResults(results)
            } catch (e) { console.error(e) } finally { setIsLoadingResults(false) }
        }
        fetchResults()
    }, [selectedModelId, models])

    const comparisonMetrics = useMemo(() => {
        if (scenarioResults.length === 0) return []
        const getMetricValue = (result: ScenarioResult, stType: string, lineItem: string): number | null => {
            const stmts = result.statements[stType]
            if (!stmts) return null
            const stmt = stmts.find((s: any) => s.line_item === lineItem)
            if (!stmt?.values_by_period) return null
            const periods = Object.keys(stmt.values_by_period).sort()
            return stmt.values_by_period[periods[periods.length - 1]] ?? null
        }
        const getValuation = (result: ScenarioResult, key: string): number | null => {
            const stmts = result.statements['Valuation Metrics']
            if (!stmts?.length) return null
            return stmts[0].values_by_period?.[key] ?? null
        }

        const metrics = [
            { name: "NPV", category: "Valuation", icon: DollarSign, format: "currency" as const },
            { name: "IRR", category: "Valuation", icon: TrendingUp, format: "pct" as const },
            { name: "Terminal Value", category: "Valuation", icon: Target, format: "currency" as const },
            { name: "Total Revenue", category: "Income Statement", icon: BarChart3, format: "currency" as const },
            { name: "EBITDA", category: "Income Statement", icon: Activity, format: "currency" as const },
            { name: "Net Income", category: "Income Statement", icon: DollarSign, format: "currency" as const },
            { name: "EBITDA Margin (%)", category: "Financial Ratios", icon: Percent, format: "pct_raw" as const },
            { name: "Net Margin (%)", category: "Financial Ratios", icon: Percent, format: "pct_raw" as const },
            { name: "DSCR", category: "Financial Ratios", icon: Shield, format: "ratio" as const },
            { name: "ROE (%)", category: "Financial Ratios", icon: TrendingUp, format: "pct_raw" as const },
        ]

        return metrics.map(metric => {
            const values = scenarioResults.map(result => {
                let val: number | null = metric.category === "Valuation"
                    ? getValuation(result, metric.name)
                    : getMetricValue(result, metric.category, metric.name)
                return { scenarioId: result.id, scenarioName: result.name, scenarioType: result.scenario_type, value: val }
            })
            const nums = values.filter(v => v.value !== null).map(v => v.value!)
            return { ...metric, values, best: nums.length > 0 ? Math.max(...nums) : null, worst: nums.length > 0 ? Math.min(...nums) : null }
        })
    }, [scenarioResults])

    const chartData = useMemo(() => {
        return comparisonMetrics.filter(m => m.values.some(v => v.value !== null)).slice(0, 6).map(metric => {
            const row: any = { name: metric.name }
            metric.values.forEach(v => { row[v.scenarioName] = v.value })
            return row
        })
    }, [comparisonMetrics])

    const selectedModel = models.find(m => String(m.id) === selectedModelId)

    const fmtVal = (val: number | null, format: string) => {
        if (val === null) return "—"
        if (format === "currency") return formatCurrency(val)
        if (format === "pct") return `${(val * 100).toFixed(1)}%`
        if (format === "pct_raw") return `${val.toFixed(1)}%`
        if (format === "ratio") return val.toFixed(2) + "x"
        return String(val)
    }

    return (
        <div className="flex flex-col h-full overflow-hidden flex-1 w-full bg-background">
            <div className="flex-1 overflow-auto p-6 md:p-8">
                <div className="space-y-6 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/scenarios')} className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">Compare Scenarios</h2>
                            </div>
                            <p className="text-muted-foreground ml-11">Side-by-side comparison of scenario outcomes.</p>
                        </div>
                        <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                            <SelectTrigger className="w-[260px]"><SelectValue placeholder="Select a model..." /></SelectTrigger>
                            <SelectContent>{models.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    {isLoading || isLoadingResults ? (
                        <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
                    ) : scenarioResults.length === 0 ? (
                        <Card className="py-16"><CardContent className="text-center">
                            <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-lg font-medium mb-1">No Calculated Scenarios</p>
                            <p className="text-sm text-muted-foreground mb-4">{selectedModel ? `"${selectedModel.name}" has no results yet.` : "Select a model."}</p>
                            <Link href="/dashboard/models/input/advanced"><Button>Create & Calculate Model</Button></Link>
                        </CardContent></Card>
                    ) : (
                        <Tabs defaultValue="table" className="space-y-6">
                            <TabsList><TabsTrigger value="table">Comparison Table</TabsTrigger><TabsTrigger value="chart">Visual Comparison</TabsTrigger></TabsList>
                            <div className="flex items-center gap-4 flex-wrap">
                                {scenarioResults.map(s => (
                                    <div key={s.id} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS[s.scenario_type] || "#888" }} />
                                        <span className="text-sm font-medium">{s.name}</span>
                                        <Badge variant="secondary" className="text-[10px]">{SCENARIO_LABELS[s.scenario_type] || s.scenario_type}</Badge>
                                    </div>
                                ))}
                            </div>

                            <TabsContent value="table">
                                <Card><CardContent className="p-0"><div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b bg-muted/30">
                                            <th className="text-left p-4 font-semibold min-w-[200px]">Metric</th>
                                            {scenarioResults.map(s => (
                                                <th key={s.id} className="text-right p-4 font-semibold min-w-[150px]">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SCENARIO_COLORS[s.scenario_type] || "#888" }} />{s.name}
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="text-right p-4 font-semibold text-muted-foreground min-w-[100px]">Δ Range</th>
                                        </tr></thead>
                                        <tbody>
                                            {comparisonMetrics.map((metric, idx) => {
                                                if (!metric.values.some(v => v.value !== null)) return null
                                                const Icon = metric.icon
                                                const range = metric.best !== null && metric.worst !== null ? Math.abs(metric.best - metric.worst) : null
                                                return (
                                                    <tr key={idx} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                                                        <td className="p-4"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-muted-foreground" /><span className="font-medium">{metric.name}</span></div><span className="text-xs text-muted-foreground ml-6">{metric.category}</span></td>
                                                        {metric.values.map(v => {
                                                            const isBest = v.value !== null && v.value === metric.best && metric.values.filter(x => x.value === metric.best).length === 1
                                                            const isWorst = v.value !== null && v.value === metric.worst && metric.values.filter(x => x.value === metric.worst).length === 1
                                                            return (
                                                                <td key={v.scenarioId} className={`p-4 text-right font-mono text-sm ${isBest ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : isWorst ? 'text-red-500 dark:text-red-400' : ''}`}>
                                                                    <div className="flex items-center justify-end gap-1">
                                                                        {isBest && <ArrowUpRight className="w-3.5 h-3.5" />}
                                                                        {isWorst && <ArrowDownRight className="w-3.5 h-3.5" />}
                                                                        {fmtVal(v.value, metric.format)}
                                                                    </div>
                                                                </td>
                                                            )
                                                        })}
                                                        <td className="p-4 text-right text-xs text-muted-foreground font-mono">{range !== null ? fmtVal(range, metric.format) : "—"}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div></CardContent></Card>
                            </TabsContent>

                            <TabsContent value="chart">
                                <Card><CardHeader><CardTitle className="text-base">Key Metrics Comparison</CardTitle><CardDescription>Side-by-side bar chart</CardDescription></CardHeader>
                                    <CardContent><div className="h-[400px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                                <XAxis dataKey="name" fontSize={11} angle={-25} textAnchor="end" height={80} />
                                                <YAxis fontSize={11} tickFormatter={(v) => formatCurrency(v)} />
                                                <Tooltip formatter={(value: any) => formatCurrency(value)} contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                                {scenarioResults.map(s => <Bar key={s.id} dataKey={s.name} fill={SCENARIO_COLORS[s.scenario_type] || "#888"} radius={[4, 4, 0, 0]} />)}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div></CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    )
}
