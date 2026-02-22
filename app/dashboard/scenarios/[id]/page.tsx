"use client"

import { useState, useEffect } from "react"
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
    Layers
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'

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

    const getAuthToken = () => {
        if (!token) return '';
        if (typeof token === 'string') return token;
        if (typeof token === 'object' && token.access) return token.access;
        return '';
    }

    useEffect(() => {
        if (id) {
            fetchScenarioData()
        }
    }, [id])

    // Fetch both the scenario details and the calculation results
    const fetchScenarioData = async () => {
        setIsLoading(true)
        try {
            const headers = { 'Authorization': `JWT ${getAuthToken()}` }

            // Fetch Scenario Detail
            const scenarioRes = await fetch(`${API_BASE_URL}/scenarios/${id}/`, { headers })
            if (!scenarioRes.ok) throw new Error('Failed to fetch scenario details')
            const scenarioData = await scenarioRes.json()
            setScenario(scenarioData)

            // Fetch Results specific to this scenario
            const resultsRes = await fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${id}`, { headers })
            if (resultsRes.ok) {
                const resultsData = await resultsRes.json()
                setResults(resultsData)
            } else {
                console.warn("No calculated results found.")
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Could not load scenario data.",
                variant: "destructive"
            })
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

            toast({
                title: "Success",
                description: "Scenario calculated successfully",
            })

            // Refresh the page data to get the new results
            fetchScenarioData()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to run calculation.",
                variant: "destructive"
            })
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

            // Handle file download
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${scenario?.name || 'Scenario'}_Export.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({ title: "Export Started", description: "Your download should begin shortly." })
        } catch (error) {
            toast({ title: "Error", description: "Failed to export Excel.", variant: "destructive" })
        } finally {
            setIsExporting(false)
        }
    }

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
            case 'base': return 'bg-blue-100 text-blue-800'
            case 'upside': return 'bg-green-100 text-green-800'
            case 'downside': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
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
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportExcel} disabled={isExporting}>
                        {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        Export Excel
                    </Button>
                    <Button onClick={handleCalculate} disabled={isCalculating}>
                        {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
                        Run Calculation
                    </Button>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted p-1 rounded-lg">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="inputs">Model Inputs</TabsTrigger>
                    <TabsTrigger value="results">Outputs & Results</TabsTrigger>
                </TabsList>

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

                        {/* Financial Assumptions */}
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

                    {/* Output Preview */}
                    {!results || Object.keys(results).length === 0 ? (
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
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Calculation Status</CardTitle>
                                    <CardDescription>Results generated successfully</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm">Summary metrics will appear here once the calculation payload structure is mapped for charts.</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

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

                <TabsContent value="results" className="space-y-6">
                    {!results || Object.keys(results).length === 0 ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                <Activity className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-2">Outputs Not Generated</h3>
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Please run the calculation engine from the Overview tab to view detailed statement results.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Calculated Output Data</CardTitle>
                                <CardDescription>Full JSON representation of the calculated statement payload</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted rounded-md p-4 overflow-auto max-h-[600px] text-xs font-mono">
                                    <pre>{JSON.stringify(results, null, 2)}</pre>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

            </Tabs>
        </div>
    )
}
