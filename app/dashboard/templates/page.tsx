"use client"

import { motion } from "framer-motion"
import { Plus, Search, Star, TrendingUp, Users, Building2, ShoppingCart, Briefcase } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const templates = [
  {
    id: 1,
    name: "Manufacturing Model",
    description: "Complete 3-statement model for manufacturing businesses with COGS breakdown",
    category: "Manufacturing",
    icon: Building2,
    complexity: "Advanced",
    useCount: 245,
  },
  {
    id: 2,
    name: "SaaS Startup",
    description: "Revenue model with MRR, churn, and customer acquisition metrics",
    category: "Technology",
    icon: TrendingUp,
    complexity: "Intermediate",
    useCount: 532,
  },
  {
    id: 3,
    name: "E-commerce Business",
    description: "Multi-channel retail model with inventory and fulfillment tracking",
    category: "Retail",
    icon: ShoppingCart,
    complexity: "Intermediate",
    useCount: 328,
  },
  {
    id: 4,
    name: "Professional Services",
    description: "Billable hours model with resource allocation and utilization",
    category: "Services",
    icon: Briefcase,
    complexity: "Beginner",
    useCount: 412,
  },
  {
    id: 5,
    name: "Real Estate Investment",
    description: "Property investment analysis with cash flow and valuation",
    category: "Real Estate",
    icon: Building2,
    complexity: "Advanced",
    useCount: 189,
  },
  {
    id: 6,
    name: "Restaurant Operations",
    description: "Food service model with cost of goods, labor, and location analysis",
    category: "Hospitality",
    icon: Users,
    complexity: "Intermediate",
    useCount: 267,
  },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Manufacturing", "Technology", "Retail", "Services", "Real Estate", "Hospitality"]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col overflow-hidden flex-1">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground mt-1">Ready-made financial models for common business types</p>
          </div>
          <Button className="gap-2 w-fit">
            <Plus className="w-4 h-4" />
            Create Custom Template
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="border-b border-border bg-card px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-secondary/20">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTemplates.map((template, idx) => {
              const Icon = template.icon
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-muted-foreground hover:text-yellow-500"
                      >
                        <Star className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground">
                        {template.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          template.complexity === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : template.complexity === "Intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {template.complexity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{template.useCount} uses</span>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
