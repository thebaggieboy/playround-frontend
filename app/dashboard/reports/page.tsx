"use client"

import { useState } from "react"
import { Plus, Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportCard } from "@/components/report-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample report data
const REPORTS = [
  {
    id: "1",
    name: "Q4 2024 Financial Summary",
    description: "Comprehensive financial overview with revenue, expenses, and profitability metrics",
    model: "Revenue Forecasting Model",
    type: "Summary",
    createdDate: "2 days ago",
    status: "completed" as const,
  },
  {
    id: "2",
    name: "Cash Flow Projection 2025",
    description: "Monthly cash flow forecast with scenario analysis",
    model: "Cash Flow Analysis",
    type: "Forecast",
    createdDate: "1 week ago",
    status: "completed" as const,
  },
  {
    id: "3",
    name: "Budget vs Actual Analysis",
    description: "Variance analysis between budgeted and actual spending",
    model: "Budget Planning 2025",
    type: "Variance",
    createdDate: "3 days ago",
    status: "completed" as const,
  },
  {
    id: "4",
    name: "Break-even Point Report",
    description: "Detailed break-even analysis with sensitivity analysis",
    model: "Break-even Analysis",
    type: "Analysis",
    createdDate: "5 days ago",
    status: "processing" as const,
  },
  {
    id: "5",
    name: "Expense Trend Report",
    description: "Historical expense trends and forecasted spending patterns",
    model: "Expense Tracking",
    type: "Trend",
    createdDate: "1 day ago",
    status: "completed" as const,
  },
  {
    id: "6",
    name: "Performance Dashboard",
    description: "Executive summary with KPI tracking and benchmarks",
    model: "Revenue Forecasting Model",
    type: "Dashboard",
    createdDate: "Today",
    status: "completed" as const,
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredReports = REPORTS.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.model.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "completed" && report.status === "completed") ||
      (activeTab === "processing" && report.status === "processing") ||
      (activeTab === "failed" && report.status === "failed")

    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground mt-1">Generate, manage, and export comprehensive financial reports</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Generate Report
            </Button>
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
