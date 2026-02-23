"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportCard } from "@/components/report-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Report {
  id: string
  name: string
  description: string
  model_name: string
  scenario_name: string
  report_type: string
  date_created: string
  status: "completed" | "processing" | "failed"
}

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const token = useSelector((state: any) => state.auth.token)

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  // Form generation states
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportType, setReportType] = useState("Summary")
  const [models, setModels] = useState<any[]>([])
  const [scenarios, setScenarios] = useState<any[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${API_BASE_URL}/reports/`, {
        headers: {
          'Authorization': `JWT ${token}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch reports")
      const data = await res.json()
      setReports(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error fetching reports",
        description: "Please check your connection and try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOptions = async () => {
    try {
      const headers = { 'Authorization': `JWT ${token}` }
      const [modelsRes, scenariosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/models/`, { headers }),
        fetch(`${API_BASE_URL}/scenarios/`, { headers })
      ])
      if (modelsRes.ok) setModels(await modelsRes.json())
      if (scenariosRes.ok) setScenarios(await scenariosRes.json())
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerateReport = async () => {
    if (!reportName || !selectedModelId || !selectedScenarioId) {
      toast({ title: "Validation Error", description: "Please fill out all required fields.", variant: "destructive" })
      return
    }

    try {
      setIsGenerating(true)
      const res = await fetch(`${API_BASE_URL}/reports/`, {
        method: "POST",
        headers: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: reportName,
          description: reportDescription,
          report_type: reportType,
          financial_model: selectedModelId,
          scenario: selectedScenarioId
        })
      })

      if (!res.ok) throw new Error("Failed to generate report")

      toast({ title: "Success", description: "Report generated successfully" })
      setIsGenerateModalOpen(false)
      fetchReports() // Refresh list
    } catch (e) {
      toast({ title: "Error", description: "Could not generate report", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchReports()
      fetchOptions()
    }
  }, [token])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (report.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (report.model_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && report.status === "completed") ||
      (activeTab === "processing" && report.status === "processing") ||
      (activeTab === "failed" && report.status === "failed")

    return matchesSearch && matchesTab
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto h-full space-y-8 p-5 md:p-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground mt-1">Generate, manage, and export comprehensive financial reports</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Generate New Report</DialogTitle>
                  <DialogDescription>
                    Create a new financial report based on your saved models and scenarios.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Report Name</Label>
                    <Input id="name" value={reportName} onChange={(e) => setReportName(e.target.value)} placeholder="Q4 Financial Summary" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} placeholder="Overview of Q4 performance..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Summary">Summary</SelectItem>
                        <SelectItem value="Forecast">Forecast</SelectItem>
                        <SelectItem value="Variance">Variance</SelectItem>
                        <SelectItem value="Analysis">Analysis</SelectItem>
                        <SelectItem value="Trend">Trend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="model">Financial Model</Label>
                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                      <SelectTrigger><SelectValue placeholder="Select a model" /></SelectTrigger>
                      <SelectContent>
                        {models.map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="scenario">Scenario</Label>
                    <Select value={selectedScenarioId} onValueChange={setSelectedScenarioId}>
                      <SelectTrigger><SelectValue placeholder="Select a scenario" /></SelectTrigger>
                      <SelectContent>
                        {scenarios.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleGenerateReport} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by name, model, or description..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Summary</DropdownMenuItem>
              <DropdownMenuItem>Forecast</DropdownMenuItem>
              <DropdownMenuItem>Variance</DropdownMenuItem>
              <DropdownMenuItem>Analysis</DropdownMenuItem>
              <DropdownMenuItem>Trend</DropdownMenuItem>
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} {...report} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No reports found. Try adjusting your search or generate a new report.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-3xl font-bold text-foreground">48</p>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-foreground">45</p>
            <p className="text-xs text-green-600">93.75% success rate</p>
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-xs text-blue-600">Avg. 5 min per report</p>
          </div>
        </Card>
      </div>

      {/* Report Generation Tips */}
      <Card className="p-6 border-l-4 border-l-primary bg-secondary/50">
        <h3 className="font-semibold text-foreground mb-3">Report Generation Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>Use Summary reports for high-level executive overviews</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>Generate Forecast reports for future planning and scenario analysis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span>Use Variance reports to track budget performance and variances</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
