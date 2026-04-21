"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useSelector } from "react-redux"
import {
  ArrowLeft,
  MoreVertical,
  Share2,
  Download,
  Edit2,
  BarChart3,
  Settings,
  Loader2,
  Activity,
  FileText,
  AlertCircle,
  PlayCircle,
  Clock,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts"
import { SensitivityAnalysisTab } from "@/components/models/SensitivityAnalysisTab"
import { ScenarioComparisonTab } from "@/components/models/ScenarioComparisonTab"
import { QuickEditPanel } from "@/components/models/QuickEditPanel"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function MetricCard({
  label, value, icon: Icon, colorClass
}: {
  label: string; value: React.ReactNode; icon: any; colorClass: string
}) {
  return (
    <Card className={`p-5 flex items-start gap-4 border-l-4 ${colorClass} hover:shadow-md transition-shadow dark:bg-card/50 backdrop-blur-sm`}>
      <div className={`p-2 rounded-lg ${colorClass.replace('border-l-', 'bg-').replace('-500', '-500/10')}`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('border-l-', 'text-')}`} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function ModelDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [model, setModel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const token = useSelector(selectToken)
  const { toast } = useToast()

  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && (token as any).access) return (token as any).access;
    return '';
  }

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/models/${id}/`, {
          headers: { 'Authorization': `JWT ${getAuthToken()}` }
        })

        if (!response.ok) throw new Error('Failed to fetch model details')

        const data = await response.json()
        setModel(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load model details. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id && token) {
      fetchModelDetails()
    }
  }, [id, token])

  const handleCalculate = async () => {
    try {
      setIsCalculating(true)
      const res = await fetch(`${API_BASE_URL}/models/${id}/calculate/`, {
        method: "POST",
        headers: { "Authorization": `JWT ${getAuthToken()}` }
      })
      
      if (!res.ok) {
        let errDetail = "Failed to calculate model"
        try {
          const errData = await res.json()
          errDetail = errData.message || errData.error || errDetail
        } catch (_) {}
        throw new Error(errDetail)
      }
      
      toast({ title: "Success", description: "Model has been calculated successfully." })
      window.location.reload()
      
    } catch (err: any) {
      toast({ title: "Calculation Error", description: err.message, variant: "destructive" })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this model?")) return;
    try {
      setIsDeleting(true)
      const res = await fetch(`${API_BASE_URL}/models/${id}/`, {
        method: "DELETE",
        headers: { "Authorization": `JWT ${getAuthToken()}` }
      })
      if (!res.ok) throw new Error("Failed to delete model")
      
      toast({ title: "Success", description: "Model deleted successfully." })
      window.location.href = "/dashboard/models"
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
      setIsDeleting(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/models/${id}/export_excel/`, {
        headers: { 'Authorization': `JWT ${getAuthToken()}` }
      })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${model?.name || 'Model'}_Export.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'Export Started', description: 'Your Excel download should begin shortly.' })
    } catch (err: any) {
      toast({ title: 'Export Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    try {
      const res = await fetch(`${API_BASE_URL}/models/${id}/export_pdf/`, {
        headers: { 'Authorization': `JWT ${getAuthToken()}` }
      })
      if (!res.ok) throw new Error('PDF Export failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${model?.name || 'Model'}_Report.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({ title: 'Export Started', description: 'Your PDF download should begin shortly.' })
    } catch (err: any) {
      toast({ title: 'Export Error', description: err.message, variant: 'destructive' })
    } finally {
      setIsExportingPdf(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex flex-1 h-full items-center justify-center flex-col gap-5">
        <FileText className="w-16 h-16 text-muted-foreground opacity-50" />
        <h2 className="text-2xl font-bold text-foreground">Model not found</h2>
        <Link href="/dashboard/models">
          <Button variant="default">Return to Models</Button>
        </Link>
      </div>
    )
  }

  const createdDate = model.created_at ? new Date(model.created_at).toLocaleDateString() : "N/A"
  const updatedDate = model.updated_at ? new Date(model.updated_at).toLocaleDateString() : "N/A"
  const lastCalcDate = model.last_calculated_at ? new Date(model.last_calculated_at).toLocaleString() : "Never"
  
  const compPct = model.completion_percentage || 0
  const completionData = [
    { name: 'Completed', value: compPct, color: '#10b981' },
    { name: 'Pending', value: 100 - compPct, color: 'hsl(var(--muted))' }
  ]

  return (
    <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden bg-background">
      <div className="p-5 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="space-y-6">
          <Link href="/dashboard/models">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Models
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{model.name}</h1>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  model.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                  model.status === 'draft' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                  'bg-secondary text-secondary-foreground border-border'
                } uppercase tracking-wider`}>
                  {model.status || 'Draft'}
                </span>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                {model.description || "No description provided for this financial model."}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  {model.project_type_display || model.project_type || "General Financial"}
                </div>
                {model.is_calculation_in_progress && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating Engine...
                  </div>
                )}
                {model.calculation_error && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Calculation Error
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <QuickEditPanel model={model} />
              <Link href={`/dashboard/models/input/advanced?modelId=${id}`} passHref className="flex-1 lg:flex-none">
                <Button className="w-full lg:w-auto gap-2" size="lg">
                  <Edit2 className="w-4 h-4" />
                  Edit Inputs
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="px-3">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleCalculate} disabled={isCalculating || model.is_calculation_in_progress}>
                    {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                    {isCalculating ? "Calculating..." : "Run Calculation"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel} disabled={isExporting}>
                    {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    {isExporting ? 'Exporting...' : 'Export as Excel'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPdf} disabled={isExportingPdf}>
                    {isExportingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                    {isExportingPdf ? 'Exporting...' : 'Export as PDF'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Model
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Global Key Metrics + Model Health */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          <MetricCard label="Completion" value={`${compPct}%`} icon={CheckCircle2} colorClass="border-l-primary" />
          <MetricCard label="Scenarios" value={model.scenarios?.length || 0} icon={FileText} colorClass="border-l-blue-500" />
          <MetricCard label="Created On" value={createdDate} icon={Clock} colorClass="border-l-amber-500" />
          <MetricCard label="Last Calculated" value={lastCalcDate !== "Never" ? "Done" : "Never"} icon={Activity} colorClass={lastCalcDate !== "Never" ? "border-l-green-500" : "border-l-neutral-400"} />
          
          {/* Model Health Indicator */}
          <Card className="p-5 flex items-start gap-4 border-l-4 hover:shadow-md transition-shadow dark:bg-card/50 backdrop-blur-sm" style={{
            borderLeftColor: compPct >= 80 && !model.calculation_error ? '#10b981' : compPct >= 50 ? '#f59e0b' : '#ef4444'
          }}>
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none"
                  stroke={compPct >= 80 && !model.calculation_error ? '#10b981' : compPct >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3" strokeDasharray={`${(compPct / 100) * 97.4} 97.4`} strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                {compPct >= 80 && !model.calculation_error ? '✅' : compPct >= 50 ? '⚠️' : '❌'}
              </span>
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground">Model Health</p>
              <p className="text-sm font-bold text-foreground">
                {compPct >= 80 && !model.calculation_error ? 'Healthy' : compPct >= 50 ? 'Needs Review' : 'Incomplete'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {compPct}% complete{model.calculation_error ? ' · Has errors' : lastCalcDate !== "Never" ? ' · Calculated' : ''}
              </p>
            </div>
          </Card>
        </div>

        {/* Main Tabs Area */}
        <Tabs defaultValue="scenarios" className="w-full animate-in fade-in duration-500">
          <TabsList className="flex w-full justify-start overflow-x-auto rounded-none text-muted-foreground border-b border-border bg-transparent h-auto p-0 gap-6">
            <TabsTrigger 
              value="scenarios" 
              className="px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none truncate"
            >
              Scenarios Overview
            </TabsTrigger>
            <TabsTrigger 
              value="metadata" 
              className="px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none truncate"
            >
              Project Metadata
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none truncate"
            >
              Settings & Config
            </TabsTrigger>
            <TabsTrigger 
              value="sensitivity" 
              className="px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none truncate"
            >
              Sensitivity Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="px-0 pb-3 pt-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none truncate text-primary"
            >
              Scenario Comparison
            </TabsTrigger>
          </TabsList>

          {/* Scenarios Content */}
          <TabsContent value="scenarios" className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Configured Scenarios</h3>
                <p className="text-muted-foreground text-sm">Review the active assumptions sets configured for this model.</p>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">Add Scenario</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {model.scenarios && model.scenarios.length > 0 ? (
                model.scenarios.map((scen: any) => (
                  <Card key={scen.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">{scen.name}</h4>
                          <p className="text-xs text-muted-foreground uppercase font-medium tracking-wider">{scen.scenario_type} Case</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${scen.is_active ? 'bg-green-500' : 'bg-muted'}`} />
                      </div>
                      <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Status</p>
                          <p className="text-sm font-medium">{scen.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Created</p>
                          <p className="text-sm font-medium">{new Date(scen.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary/50 p-3 px-6 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="text-primary h-8 px-3">View Details &rarr;</Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full p-12 flex flex-col items-center justify-center border-dashed text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
                  <h3 className="font-semibold text-lg">No scenarios exist</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-6">You need at least one scenario to run calculations.</p>
                  <Button>Initialize Base Case</Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Metadata Content */}
          <TabsContent value="metadata" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="p-6 col-span-1 lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Model Details</h3>
                  <p className="text-sm text-muted-foreground">Detailed technical attributes of the underlying model.</p>
                </div>
                
                <div className="bg-secondary/30 rounded-xl border border-border/50 divide-y divide-border/50">
                  {[
                    { l: 'System ID', v: model.id },
                    { l: 'Project Type', v: model.project_type_display || model.project_type },
                    { l: 'Created', v: new Date(model.created_at).toLocaleString() },
                    { l: 'Updated', v: new Date(model.updated_at).toLocaleString() },
                    { l: 'Last Calculated', v: lastCalcDate }
                  ].map(row => (
                    <div key={row.l} className="flex justify-between p-4 hover:bg-secondary/50 transition-colors">
                      <span className="text-sm font-medium text-muted-foreground">{row.l}</span>
                      <span className="text-sm font-semibold">{row.v}</span>
                    </div>
                  ))}
                </div>
                
                {model.calculation_error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
                    <p className="text-sm font-bold mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Latest Exception Dump
                    </p>
                    <code className="text-xs block whitespace-pre-wrap p-2 bg-background/50 rounded mt-2">
                      {model.calculation_error}
                    </code>
                  </div>
                )}
              </Card>

              <Card className="p-6 col-span-1 flex flex-col">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Completion</h3>
                  <p className="text-sm text-muted-foreground">Input completion rate.</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center mt-6 relative">
                  <div className="h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={completionData}
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {completionData.map((e, index) => (
                            <Cell key={`cell-${index}`} fill={e.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(val: number) => [`${val}%`, '']}
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold">{compPct}%</span>
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mt-1">Done</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Content */}
          <TabsContent value="settings" className="mt-8">
            <Card className="p-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold mb-1">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-6">Irreversible and destructive actions.</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Reset Outputs</h4>
                    <p className="text-sm text-muted-foreground">Clear all calculated statements.</p>
                  </div>
                  <Button variant="secondary">Reset</Button>
                </div>
                <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-600 dark:text-red-400">Delete Model</h4>
                    <p className="text-sm text-red-600/70 dark:text-red-400/80">Permanently delete this model and all related scenarios.</p>
                  </div>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sensitivity Analysis Content */}
          <TabsContent value="sensitivity" className="mt-8">
            <SensitivityAnalysisTab model={model} />
          </TabsContent>

          {/* Scenario Comparison Content */}
          <TabsContent value="comparison" className="mt-8">
            <ScenarioComparisonTab model={model} />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
