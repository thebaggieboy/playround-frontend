"use client"

import { motion } from "framer-motion"
import { Plus, Search, Star, FileText, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { selectToken } from '@/features/token/tokenSlice'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", "Manufacturing", "Technology", "Retail", "Services", "Real Estate", "Hospitality", "Energy & Power", "Oil & Gas", "Healthcare", "Agriculture", "Infrastructure", "General"]

  const tokenFromTokenSlice = useSelector(selectToken)
  const tokenFromAuth = useSelector((state: any) => state.auth?.token)
  const token = tokenFromTokenSlice || tokenFromAuth

  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchTemplates = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${API_BASE_URL}/templates/`, {
          headers: { 'Authorization': `JWT ${token}` }
        });
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setTemplates(data)
          }
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    fetchTemplates()

    return () => {
      isMounted = false;
    }
  }, [token])

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const friendlyType = (template.project_type || "general").toLowerCase().replace(/_/g, ' ')
    const matchesCategory = selectedCategory === "All" || friendlyType === selectedCategory.toLowerCase()

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
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
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
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-3">Loading templates...</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found matching your criteria</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTemplates.map((template, idx) => {
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/dashboard/templates/category/${(template.project_type || 'general').toLowerCase().replace(/_/g, '-')}`}>
                      <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer border hover:border-primary/50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-muted-foreground hover:text-yellow-500"
                            onClick={(e) => { e.preventDefault() }}
                          >
                            <Star className="w-5 h-5" />
                          </motion.button>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 flex-1">{template.description || "No description provided."}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground capitalize">
                            {template.project_type?.replace(/_/g, ' ') || "General"}
                          </span>
                          {template.is_public && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              Public
                            </span>
                          )}
                          {template.is_system_template && (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              System
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <span className="text-xs text-muted-foreground">
                            {template.created_at ? new Date(template.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                          <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); /* router.push logic maybe later */ }}>
                            Use Template
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
