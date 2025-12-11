"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Share2, Download, Edit2, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)

  // Sample model data
  const model = {
    id: params.id,
    name: "Revenue Forecasting Model",
    description: "Advanced revenue projection with seasonal adjustments and growth scenarios",
    category: "Financial",
    createdDate: "2025-01-15",
    lastModified: "2025-01-20",
    owner: "John Doe",
    type: "custom",
    datasets: 3,
    versions: 5,
    status: "Active",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/dashboard/models">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Models
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{model.name}</h1>
            <p className="text-muted-foreground">{model.description}</p>
            <div className="flex flex-wrap gap-2 mt-4 text-sm">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">{model.category}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">{model.status}</span>
              <span className="px-3 py-1 bg-secondary text-foreground rounded-full">v{model.versions}</span>
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
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Model
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Created</p>
          <p className="font-semibold text-foreground">{model.createdDate}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Last Modified</p>
          <p className="font-semibold text-foreground">{model.lastModified}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Datasets</p>
          <p className="font-semibold text-foreground">{model.datasets}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground mb-1">Owner</p>
          <p className="font-semibold text-foreground">{model.owner}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Model Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy Score</span>
                <span className="font-semibold">94.2%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "94.2%" }}></div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Model Details</h3>
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{model.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Inputs</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Outputs</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scenarios</span>
                <span className="font-medium">5</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Linked Datasets</h3>
            <div className="space-y-3">
              {["Historical Revenue Data", "Market Growth Trends", "Seasonal Factors"].map((dataset, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="font-medium text-foreground">{dataset}</span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Scenario Analysis</h3>
            <div className="space-y-3">
              {[
                { name: "Base Case", value: "$2.5M" },
                { name: "Optimistic", value: "$3.2M" },
                { name: "Pessimistic", value: "$1.8M" },
              ].map((scenario, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="font-medium text-foreground">{scenario.name}</span>
                  <span className="text-primary font-semibold">{scenario.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Model Settings
            </h3>
            <div className="space-y-4">
              <Button className="w-full justify-start">Update Model</Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Create New Version
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive bg-transparent">
                Delete Model
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
