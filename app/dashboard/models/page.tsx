"use client"

import { useState } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelCard } from "@/components/model-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data
const MODELS = [
  {
    id: "1",
    name: "Revenue Forecasting Model",
    description: "Advanced revenue projection with seasonal adjustments and growth scenarios",
    category: "Financial",
    lastModified: "2 days ago",
    type: "custom" as const,
  },
  {
    id: "2",
    name: "Cash Flow Analysis",
    description: "Monthly cash flow projections with multiple scenarios",
    category: "Liquidity",
    lastModified: "5 days ago",
    type: "custom" as const,
  },
  {
    id: "3",
    name: "Startup Financial Projection",
    description: "Complete startup financial model template",
    category: "Template",
    lastModified: "Today",
    type: "template" as const,
  },
  {
    id: "4",
    name: "Break-even Analysis",
    description: "Determine break-even point and profitability timeline",
    category: "Analysis",
    lastModified: "1 week ago",
    type: "template" as const,
  },
  {
    id: "5",
    name: "Budget Planning 2025",
    description: "Department-wise budget allocation and tracking",
    category: "Planning",
    lastModified: "3 days ago",
    type: "custom" as const,
  },
  {
    id: "6",
    name: "Expense Tracking",
    description: "Monthly expense monitoring and variance analysis",
    category: "Tracking",
    lastModified: "1 day ago",
    type: "custom" as const,
  },
]

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredModels = MODELS.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "custom" && model.type === "custom") ||
      (activeTab === "template" && model.type === "template")
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-8 p-5">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Models</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and analyze your financial models</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Model
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
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
              <DropdownMenuItem>Financial</DropdownMenuItem>
              <DropdownMenuItem>Liquidity</DropdownMenuItem>
              <DropdownMenuItem>Analysis</DropdownMenuItem>
              <DropdownMenuItem>Planning</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="custom">My Models</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} {...model} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No models found. Try adjusting your search or create a new model.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6 border-l-4 border-l-primary bg-secondary/50">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Import from Template
          </Button>
          <Button variant="outline" size="sm">
            Duplicate Model
          </Button>
          <Button variant="outline" size="sm">
            Export Model
          </Button>
        </div>
      </Card>
    </div>
  )
}
