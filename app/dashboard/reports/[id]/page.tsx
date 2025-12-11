"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Share2, Download, Settings, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)

  // Sample report data
  const report = {
    id: params.id,
    name: "Q4 2024 Financial Summary",
    description: "Comprehensive financial overview with revenue, expenses, and profitability metrics",
    model: "Revenue Forecasting Model",
    type: "Summary",
    createdDate: "2025-01-18",
    lastModified: "2025-01-20",
    status: "completed",
    generatedBy: "John Doe",
    metrics: {
      totalRevenue: "$2,450,000",
      totalExpenses: "$1,680,000",
      netProfit: "$770,000",
      profitMargin: "31.4%",
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{report.name}</h1>
            <p className="text-muted-foreground">{report.description}</p>
            <div className="flex flex-wrap gap-2 mt-4 text-sm">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{report.type}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
              <span className="px-3 py-1 bg-secondary text-foreground rounded-full">{report.model}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">{report.metrics.totalRevenue}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-foreground">{report.metrics.totalExpenses}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-foreground">{report.metrics.netProfit}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
          <p className="text-2xl font-bold text-foreground">{report.metrics.profitMargin}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Executive Summary
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The Q4 2024 financial results demonstrate strong performance with total revenue reaching $2.45M,
                representing a healthy profit margin of 31.4%. Operating expenses were well-controlled at $1.68M,
                enabling net profit of $770K.
              </p>
              <p>
                Key performance highlights include sustained revenue growth from new market segments and improved
                operational efficiency. The company maintained consistent profitability while investing in strategic
                initiatives.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Report Metadata</h3>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-medium">{report.createdDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Modified</span>
                <span className="font-medium">{report.lastModified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generated By</span>
                <span className="font-medium">{report.generatedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Report Type</span>
                <span className="font-medium">{report.type}</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Financial Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: "Product Sales", value: "$1,850,000", percentage: 75 },
                { label: "Service Revenue", value: "$450,000", percentage: 18 },
                { label: "Other Income", value: "$150,000", percentage: 7 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="text-primary font-semibold">{item.value}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Visualization
            </h3>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization would be rendered here</p>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Report Settings
            </h3>
            <div className="space-y-4">
              <Button className="w-full justify-start">Regenerate Report</Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Schedule Recurring Report
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive bg-transparent">
                Delete Report
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
