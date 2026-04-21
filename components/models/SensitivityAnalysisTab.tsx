"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, TrendingDown, DollarSign, Activity, Percent } from "lucide-react"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

interface SensitivityAnalysisTabProps {
  model: any
}

export function SensitivityAnalysisTab({ model }: SensitivityAnalysisTabProps) {
  const token = useSelector(selectToken)

  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && (token as any).access) return (token as any).access;
    return '';
  }

  const [baseScenario, setBaseScenario] = useState<any>(null)
  
  const [overrides, setOverrides] = useState({
    revenue_growth_adj: 0,
    opex_margin_adj: 0,
    capex_cost_adj: 0,
    discount_rate_adj: 0
  })

  // Debounced overrides
  const [debouncedOverrides, setDebouncedOverrides] = useState(overrides)
  
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [baseResults, setBaseResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Find base scenario
  useEffect(() => {
    if (model?.scenarios && model.scenarios.length > 0) {
      // Find active or base case, fallback to first
      const base = model.scenarios.find((s: any) => s.scenario_type === 'base') || 
                   model.scenarios.find((s: any) => s.is_active) || 
                   model.scenarios[0]
      setBaseScenario(base)
    }
  }, [model])

  // Debounce the slider changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOverrides(overrides)
    }, 400) // 400ms debounce
    return () => clearTimeout(timer)
  }, [overrides])

  // Run calculation when debounced overrides change
  useEffect(() => {
    if (!baseScenario) return

    const runSensitivity = async () => {
      setIsCalculating(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/scenarios/${baseScenario.id}/sensitivity/`, {
          method: 'POST',
          headers: {
            'Authorization': `JWT ${getAuthToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(debouncedOverrides)
        })

        if (!response.ok) {
          throw new Error('Failed to run sensitivity analysis')
        }

        const data = await response.json()
        setResults(data)

        // Store first zero-override run as base
        if (!baseResults && 
            debouncedOverrides.revenue_growth_adj === 0 && 
            debouncedOverrides.opex_margin_adj === 0 &&
            debouncedOverrides.capex_cost_adj === 0 &&
            debouncedOverrides.discount_rate_adj === 0) {
          setBaseResults(data)
        }

      } catch (err: any) {
        console.error("Sensitivity Error:", err)
        setError(err.message || 'An error occurred during calculation')
      } finally {
        setIsCalculating(false)
      }
    }

    runSensitivity()
  }, [debouncedOverrides, baseScenario, baseResults])

  const handleSliderChange = (key: keyof typeof overrides, value: number[]) => {
    setOverrides(prev => ({
      ...prev,
      [key]: value[0] / 100 // Visual is percentage integers (-20 to +20), backend expects decimals (-0.20 to 0.20)
    }))
  }

  const formatCurrency = (val: number) => {
    if (val === undefined || val === null) return "-"
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`
    if (Math.abs(val) >= 1e3) return `$${(val / 1e3).toFixed(2)}K`
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  const calculateDelta = (current: number, base: number) => {
    if (!base || !current) return { pct: 0, val: 0 }
    const diff = current - base
    const pct = (diff / Math.abs(base)) * 100
    return { pct, val: diff }
  }

  if (!baseScenario) {
    return (
      <Card className="p-8 text-center flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-muted-foreground opacity-40 mb-4" />
        <h3 className="font-semibold text-lg text-foreground mb-2">No Scenario Available</h3>
        <p className="text-muted-foreground">You need at least one scenario to run a sensitivity analysis.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            Dynamic Sensitivity Analysis
            {isCalculating && <Loader2 className="w-4 h-4 ml-2 animate-spin text-primary" />}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Adjust key macro assumptions in real-time to see their immediate impact on top-line metrics based on the <strong className="text-foreground">{baseScenario.name}</strong>.
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-1.5 font-medium border-primary/20 bg-primary/5 text-primary">
          In-Memory Execution
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
          <Card className="p-6 space-y-8 border-border/60 shadow-sm">
            
            {/* Revenue Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Revenue Volume Growth
                </label>
                <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-secondary font-medium">
                  {overrides.revenue_growth_adj > 0 ? '+' : ''}{(overrides.revenue_growth_adj * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[overrides.revenue_growth_adj * 100]}
                min={-50}
                max={50}
                step={1}
                onValueChange={(val) => handleSliderChange('revenue_growth_adj', val)}
                className="py-2 cursor-pointer"
              />
            </div>

            {/* Opex Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  OPEX Margin Adjustment
                </label>
                <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-secondary font-medium">
                  {overrides.opex_margin_adj > 0 ? '+' : ''}{(overrides.opex_margin_adj * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[overrides.opex_margin_adj * 100]}
                min={-30}
                max={30}
                step={1}
                onValueChange={(val) => handleSliderChange('opex_margin_adj', val)}
                className="py-2 cursor-pointer [&_[role=slider]]:bg-red-500/10 [&_[role=slider]]:border-red-500"
              />
            </div>

            {/* Capex Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  CAPEX Cost Adjustment
                </label>
                <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-secondary font-medium">
                  {overrides.capex_cost_adj > 0 ? '+' : ''}{(overrides.capex_cost_adj * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={[overrides.capex_cost_adj * 100]}
                min={-30}
                max={50}
                step={1}
                onValueChange={(val) => handleSliderChange('capex_cost_adj', val)}
                className="py-2 cursor-pointer [&_[role=slider]]:bg-amber-500/10 [&_[role=slider]]:border-amber-500"
              />
            </div>

            {/* Discount Rate Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-500" />
                  Discount Rate (WACC)
                </label>
                <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-secondary font-medium">
                  {overrides.discount_rate_adj > 0 ? '+' : ''}{(overrides.discount_rate_adj * 100).toFixed(1)}%
                </span>
              </div>
              <Slider
                value={[overrides.discount_rate_adj * 100]}
                min={-10}
                max={15}
                step={0.5}
                onValueChange={(val) => handleSliderChange('discount_rate_adj', val)}
                className="py-2 cursor-pointer [&_[role=slider]]:bg-purple-500/10 [&_[role=slider]]:border-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setOverrides({ revenue_growth_adj: 0, opex_margin_adj: 0, capex_cost_adj: 0, discount_rate_adj: 0 })}
                className="text-muted-foreground hover:text-foreground"
              >
                Reset to Base
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
          <MetricResultCard 
            title="Net Present Value (NPV)" 
            value={results?.npv} 
            baseValue={baseResults?.npv}
            isCurrency
            isLoading={isCalculating && !results}
          />
          <MetricResultCard 
            title="Internal Rate of Return (IRR)" 
            value={results?.irr} 
            baseValue={baseResults?.irr}
            isPercent
            isLoading={isCalculating && !results}
          />
          <MetricResultCard 
            title="Peak Annual Revenue" 
            value={results?.peak_revenue} 
            baseValue={baseResults?.peak_revenue}
            isCurrency
            isLoading={isCalculating && !results}
          />
          <MetricResultCard 
            title="Peak EBITDA" 
            value={results?.peak_ebitda} 
            baseValue={baseResults?.peak_ebitda}
            isCurrency
            isLoading={isCalculating && !results}
          />
        </div>
      </div>
      
      {error && (
        <div className="p-4 rounded-md bg-red-500/10 text-red-500 text-sm border border-red-500/20">
          <span className="font-semibold">Calculation Error: </span> {error}
        </div>
      )}
    </div>
  )
}

function MetricResultCard({ 
  title, 
  value, 
  baseValue, 
  isCurrency = false, 
  isPercent = false,
  isLoading = false 
}: any) {
  
  const formatVal = (v: number) => {
    if (v === undefined || v === null) return "-"
    if (isCurrency) {
      if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
      if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
      return `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }
    if (isPercent) return `${v.toFixed(1)}%`
    return v.toLocaleString()
  }

  // Delta calculation
  let diffStr = ""
  let isPositive = false
  let isNeutral = true

  if (value !== undefined && baseValue !== undefined) {
    const diff = value - baseValue
    isPositive = diff > 0
    isNeutral = diff === 0 || Math.abs(diff) < 0.001
    
    if (!isNeutral) {
      if (isCurrency) {
        const pct = (diff / Math.abs(baseValue)) * 100
        diffStr = `${isPositive ? '+' : ''}${pct.toFixed(1)}%`
      } else if (isPercent) {
        diffStr = `${isPositive ? '+' : ''}${diff.toFixed(1)} pts`
      }
    }
  }

  return (
    <Card className={`p-6 flex flex-col justify-center space-y-3 relative overflow-hidden transition-all duration-300 ${!isNeutral ? (isPositive ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5') : 'border-border/50'}`}>
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      
      {isLoading ? (
        <div className="h-10 flex items-center">
          <Skeleton className="h-8 w-1/2" />
        </div>
      ) : (
        <div className="flex items-end justify-between">
          <h4 className="text-3xl font-bold tracking-tight text-foreground">
            {formatVal(value)}
          </h4>
          
          {!isNeutral && (
            <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'text-green-600 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {diffStr}
            </div>
          )}
        </div>
      )}
      
      {/* Base baseline info */}
      <div className="text-xs text-muted-foreground mt-2">
        Base: {formatVal(baseValue)}
      </div>
    </Card>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  )
}
