"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Loader2,
    ArrowUpDown,
    Plus,
    RefreshCcw,
    CheckCircle,
    X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'


interface Scenario {
    id: number
    name: string
    scenario_type: string
    created_at: string
}

export default function CompareScenariosPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = useSelector(selectToken)
    const { toast } = useToast()

    const initialIds = searchParams.get('ids')?.split(',').map(Number) || []

    const [selectedIds, setSelectedIds] = useState<number[]>(initialIds)
    const [allScenarios, setAllScenarios] = useState<Scenario[]>([])
    const [comparedData, setComparedData] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingList, setIsFetchingList] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(initialIds.length === 0)
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(initialIds)

    const getAuthToken = () => {
        if (!token) return '';
        if (typeof token === 'string') return token;
        if (typeof token === 'object' && token.access) return token.access;
        return '';
    }

    // Fetch all available scenarios to populate the selection dialog
    useEffect(() => {
        const fetchAllScenarios = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/scenarios/`, {
                    headers: { 'Authorization': `JWT ${getAuthToken()}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setAllScenarios(Array.isArray(data) ? data : (data?.results || []))
                }
            } catch (error) {
                console.error("Failed to load scenario list", error)
            } finally {
                setIsFetchingList(false)
            }
        }

        fetchAllScenarios()
    }, [])

    // Fetch the data for the selected scenarios whenever the selected IDs change
    useEffect(() => {
        if (selectedIds.length > 0) {
            fetchComparisonData()
        } else {
            setComparedData({})
        }
    }, [selectedIds])

    const fetchComparisonData = async () => {
        setIsLoading(true)
        const newData: any = {}

        try {
            // We will perform Promise.all to fetch both details and results concurrently for all selected IDs
            await Promise.all(selectedIds.map(async (id) => {
                const headers = { 'Authorization': `JWT ${getAuthToken()}` }

                try {
                    const [detailsRes, resultsRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/scenarios/${id}/`, { headers }),
                        fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${id}`, { headers })
                    ])

                    if (detailsRes.ok) {
                        const details = await detailsRes.json()
                        const results = resultsRes.ok ? await resultsRes.json() : null

                        newData[id] = {
                            scenario: details,
                            results: results
                        }
                    }
                } catch (e) {
                    console.error(`Failed to fetch for scenario ID ${id}`, e)
                }
            }))

            setComparedData(newData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApplySelection = () => {
        if (tempSelectedIds.length > 4) {
            toast({
                title: "Too many scenarios",
                description: "Please select up to 4 scenarios for comparison.",
                variant: "destructive"
            })
            return
        }

        setSelectedIds(tempSelectedIds)
        setIsDialogOpen(false)

        // Update URL manually without triggering full reload 
        // to allow sharing the specific comparison view
        const newParams = new URLSearchParams(searchParams.toString())
        if (tempSelectedIds.length > 0) {
            newParams.set('ids', tempSelectedIds.join(','))
        } else {
            newParams.delete('ids')
        }
        router.replace(`/dashboard/scenarios/compare?${newParams.toString()}`)
    }

    const toggleScenarioSelection = (id: number) => {
        setTempSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const removeScenarioFromComparison = (id: number) => {
        const updated = selectedIds.filter(x => x !== id)
        setSelectedIds(updated)
        setTempSelectedIds(updated)

        const newParams = new URLSearchParams(searchParams.toString())
        if (updated.length > 0) {
            newParams.set('ids', updated.join(','))
        } else {
            newParams.delete('ids')
        }
        router.replace(`/dashboard/scenarios/compare?${newParams.toString()}`)
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3 mb-1">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/scenarios')} className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Compare Scenarios</h2>
                        <p className="text-muted-foreground mt-1">Select and compare assumptions side-by-side.</p>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            {selectedIds.length > 0 ? 'Edit Selection' : 'Select Scenarios'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Select Scenarios to Compare</DialogTitle>
                            <DialogDescription>
                                Choose up to 4 scenarios to evaluate side-by-side.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto space-y-2 mt-4">
                            {isFetchingList ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                </div>
                            ) : allScenarios.length === 0 ? (
                                <p className="text-center text-muted-foreground p-8">No scenarios found.</p>
                            ) : (
                                allScenarios.map(scenario => (
                                    <label
                                        key={scenario.id}
                                        className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer hover:bg-secondary/50 transition-colors ${tempSelectedIds.includes(scenario.id) ? 'border-primary bg-primary/5' : 'border-border'
                                            }`}
                                    >
                                        <Checkbox
                                            checked={tempSelectedIds.includes(scenario.id)}
                                            onCheckedChange={() => toggleScenarioSelection(scenario.id)}
                                        />
                                        <div className="flex-1 flex justify-between items-center">
                                            <span className="font-medium">{scenario.name}</span>
                                            <Badge className={`${getTypeColor(scenario.scenario_type)} border-none capitalize`}>
                                                {scenario.scenario_type}
                                            </Badge>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleApplySelection}
                                disabled={tempSelectedIds.length === 0 || tempSelectedIds.length > 4}
                            >
                                Apply Selection ({tempSelectedIds.length})
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {selectedIds.length === 0 && !isDialogOpen && (
                <Card className="border-dashed mt-8">
                    <CardContent className="flex flex-col items-center justify-center p-16 text-center">
                        <ArrowUpDown className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-xl font-medium mb-2">No Scenarios Selected</h3>
                        <p className="text-muted-foreground mb-6">Select two or more scenarios to compare their metrics and assumptions.</p>
                        <Button onClick={() => setIsDialogOpen(true)}>Choose Scenarios</Button>
                    </CardContent>
                </Card>
            )}

            {selectedIds.length > 0 && (
                <div className="mt-8 space-y-8">
                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full pb-4">
                            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b border-border bg-muted/30 font-semibold w-1/4 sticky left-0 z-10 shadow-[1px_0_0_0_#ccc]">
                                            Category / Metric
                                        </th>
                                        {selectedIds.map(id => {
                                            const data = comparedData[id]?.scenario
                                            if (!data) return <th key={id} className="p-4 border-b border-border min-w-[250px]"><Loader2 className="w-4 h-4 animate-spin" /></th>
                                            return (
                                                <th key={id} className="p-4 border-b border-l border-border bg-card align-top min-w-[250px]">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-base">{data.name}</h3>
                                                            <Badge className={`mt-1 ${getTypeColor(data.scenario_type)} border-none capitalize text-xs`}>
                                                                {data.scenario_type}
                                                            </Badge>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => removeScenarioFromComparison(id)}>
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground font-normal">
                                                        Model: {data.project_info?.project_type || 'Unknown'}
                                                    </p>
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {/* Project Assumptions */}
                                    <tr className="bg-muted/10">
                                        <td colSpan={selectedIds.length + 1} className="p-3 font-semibold text-primary uppercase text-xs tracking-wider border-b border-border">
                                            Project Details
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Capacity</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                {comparedData[id]?.scenario?.project_info?.total_capacity?.toLocaleString() || '-'}
                                                {' '}{comparedData[id]?.scenario?.project_info?.capacity_unit || ''}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Op. Duration</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                {comparedData[id]?.scenario?.project_info?.operations_duration_years || '-'} Years
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Macro Assumptions */}
                                    <tr className="bg-muted/10">
                                        <td colSpan={selectedIds.length + 1} className="p-3 font-semibold text-primary uppercase text-xs tracking-wider border-y border-border">
                                            Macro Assumptions
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Discount Rate (WACC)</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                {comparedData[id]?.scenario?.macro_assumptions?.discount_rate_wacc || '-'}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Inflation (Local)</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                {comparedData[id]?.scenario?.macro_assumptions?.local_inflation_rate || '-'}%
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Financing Details */}
                                    <tr className="bg-muted/10">
                                        <td colSpan={selectedIds.length + 1} className="p-3 font-semibold text-primary uppercase text-xs tracking-wider border-y border-border">
                                            Capital & Financing
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Debt / Equity</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                {comparedData[id]?.scenario?.debt_financing?.debt_percentage || '-'}% / {comparedData[id]?.scenario?.debt_financing?.equity_percentage || '-'}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Land Cost</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                $ {comparedData[id]?.scenario?.capital_expenditure?.land_cost?.toLocaleString() || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="hover:bg-muted/5">
                                        <td className="p-4 border-r border-border font-medium bg-card sticky left-0 z-10">Construction Cost</td>
                                        {selectedIds.map(id => (
                                            <td key={id} className="p-4 border-l border-border">
                                                $ {comparedData[id]?.scenario?.capital_expenditure?.construction_building_cost?.toLocaleString() || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
