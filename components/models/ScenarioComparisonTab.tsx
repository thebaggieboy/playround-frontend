"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line
} from "recharts"
import { Loader2, TrendingUp, DollarSign, Activity, AlertCircle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

export function ScenarioComparisonTab({ model }: { model: any }) {
  const [scenarioA, setScenarioA] = useState<string>("")
  const [scenarioB, setScenarioB] = useState<string>("")
  const [resultsA, setResultsA] = useState<any>(null)
  const [resultsB, setResultsB] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = useSelector(selectToken)

  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && (token as any).access) return (token as any).access;
    return '';
  }

  useEffect(() => {
    // Default pick first two scenarios if available
    if (model?.scenarios && model.scenarios.length >= 2) {
      if (!scenarioA) setScenarioA(model.scenarios[0].id.toString())
      if (!scenarioB) setScenarioB(model.scenarios[1].id.toString())
    } else if (model?.scenarios && model.scenarios.length === 1) {
      if (!scenarioA) setScenarioA(model.scenarios[0].id.toString())
    }
  }, [model])

  useEffect(() => {
    const fetchResults = async () => {
      if (!scenarioA || !scenarioB || scenarioA === scenarioB) return

      try {
        setIsLoading(true)
        setError(null)
        setResultsA(null)
        setResultsB(null)

        const [resA, resB] = await Promise.all([
          fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${scenarioA}`, { headers: { 'Authorization': `JWT ${getAuthToken()}` } }),
          fetch(`${API_BASE_URL}/results/by_scenario/?scenario_id=${scenarioB}`, { headers: { 'Authorization': `JWT ${getAuthToken()}` } })
        ])

        if (!resA.ok || !resB.ok) throw new Error("Failed to fetch calculation results.")

        const dataA = await resA.json()
        const dataB = await resB.json()

        setResultsA(dataA)
        setResultsB(dataB)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [scenarioA, scenarioB, token])

  if (!model || !model.scenarios || model.scenarios.length < 2) {
    return (
      <Card className="p-8 text-center border-dashed border-2 bg-transparent mt-6">
        <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Not Enough Scenarios</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          You need at least two scenarios configured in this model to compare them.
        </p>
      </Card>
    )
  }

  // Helper to extract key metrics
  const getMetric = (results: any, type: string, lineItem: string) => {
    if (!results || !results[type]) return []
    const statement = results[type].find((s: any) => s.line_item === lineItem)
    return statement?.values_by_period || []
  }

  // Parse metrics for Chart Data
  let comparisonData: any[] = []
  
  if (resultsA && resultsB) {
    // Example: Compare Revenue array
    const revA = getMetric(resultsA, 'Income Statement', 'Total Revenue')
    const revB = getMetric(resultsB, 'Income Statement', 'Total Revenue')
    
    // Using the max length of periods available
    const periods = Math.max(revA.length, revB.length)
    
    for (let i = 0; i < periods; i++) {
        comparisonData.push({
            year: `Year ${i + 1}`,
            ScenarioA: revA[i] || 0,
            ScenarioB: revB[i] || 0,
        })
    }
  }

  const scA_Name = model.scenarios.find((s: any) => s.id.toString() === scenarioA)?.name || "Scenario A"
  const scB_Name = model.scenarios.find((s: any) => s.id.toString() === scenarioB)?.name || "Scenario B"

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-6 rounded-xl border object-contain border-border/60">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Baseline Scenario</label>
          <Select value={scenarioA} onValueChange={setScenarioA}>
            <SelectTrigger>
              <SelectValue placeholder="Select Base Scenario" />
            </SelectTrigger>
            <SelectContent>
              {model.scenarios.map((scen: any) => (
                <SelectItem key={scen.id} value={scen.id.toString()}>{scen.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Comparison Scenario</label>
          <Select value={scenarioB} onValueChange={setScenarioB}>
            <SelectTrigger>
              <SelectValue placeholder="Select Comparison Scenario" />
            </SelectTrigger>
            <SelectContent>
              {model.scenarios.map((scen: any) => (
                <SelectItem key={scen.id} value={scen.id.toString()}>{scen.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {scenarioA === scenarioB ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Same Scenario Selected</AlertTitle>
          <AlertDescription>
            Please select two different scenarios to compare.
          </AlertDescription>
        </Alert>
      ) : isLoading ? (
        <Card className="p-12 border-dashed border-2 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : resultsA && resultsB ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
          {/* Revenue Comparison */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> 
              Revenue Comparison
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                  />
                  <Legend />
                  <Bar dataKey="ScenarioA" name={scA_Name} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ScenarioB" name={scB_Name} fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Cash Flow Comparison */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" /> 
              Cash Flow from Operations
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={
                    // Rebuild data specifically for CFO
                    Array.from({ length: Math.max(getMetric(resultsA, 'Cash Flow Statement', 'Cash Flow from Operations').length, getMetric(resultsB, 'Cash Flow Statement', 'Cash Flow from Operations').length) }).map((_, i) => ({
                        year: `Year ${i+1}`,
                        ScenarioA: getMetric(resultsA, 'Cash Flow Statement', 'Cash Flow from Operations')[i] || 0,
                        ScenarioB: getMetric(resultsB, 'Cash Flow Statement', 'Cash Flow from Operations')[i] || 0,
                    }))
                } margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ScenarioA" name={scA_Name} stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                  <Line type="monotone" dataKey="ScenarioB" name={scB_Name} stroke="#ec4899" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>
      ) : null}
    </div>
  )
}
