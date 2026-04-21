"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Loader2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelCard } from "@/components/model-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { motion } from "framer-motion"

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://playground-backend-1t0f.onrender.com/api'
  : 'http://localhost:8000/api'

interface ModelData {
  id: string
  name: string
  description?: string
  category?: string
  created_at?: string
  updated_at?: string
  model_type?: string
  type?: string
}

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [models, setModels] = useState<ModelData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const token = useSelector(selectToken)
  const { toast } = useToast()

  const getAuthToken = () => {
    if (!token) return '';
    if (typeof token === 'string') return token;
    if (typeof token === 'object' && token.access) return token.access;
    return '';
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/models/`, {
        headers: {
          'Authorization': `JWT ${getAuthToken()}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch models')

      const data = await response.json()
      const results = Array.isArray(data) ? data : (data.results || [])

      // Sort to have the newest first
      const sortedData = results.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      setModels(sortedData)
    } catch (error) {
      console.error('Error fetching models:', error)
      toast({
        title: "Error",
        description: "Failed to load models. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredModels = models.filter((model) => {
    const nameMatch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const descMatch = model.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesSearch = nameMatch || descMatch

    // In our simplified mock, we treat all fetched as "custom" unless specified
    const mType = model.model_type || model.type || "custom"
    const isTemplate = mType === "template"

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "custom" && !isTemplate) ||
      (activeTab === "template" && isTemplate)

    return matchesSearch && matchesTab
  })

  return (
    <div className="flex-1 overflow-y-auto h-full max-h-[calc(100vh-1rem)] space-y-8 p-5 md:p-8 pt-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Financial Models</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and analyze your financial models</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/dashboard/models/input/basic">
              <Button className="gap-2 w-full">
                <Plus className="w-4 h-4" />
                New Model
              </Button>
            </Link>
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
              className="pl-10 bg-background"
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
              <DropdownMenuItem onClick={fetchModels}>Refresh Items</DropdownMenuItem>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  id={model.id.toString()}
                  name={model.name || "Untitled Model"}
                  description={model.description || "No description provided."}
                  category={model.category || "Financial"}
                  lastModified={model.updated_at ? new Date(model.updated_at).toLocaleDateString() : (model.created_at ? new Date(model.created_at).toLocaleDateString() : "Recently")}
                  type={model.model_type === "template" || model.type === "template" ? "template" : "custom"}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="col-span-1 md:col-span-2 lg:col-span-3 border-dashed border-2 border-border/60 bg-card/40 backdrop-blur-md rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5 shadow-inner backdrop-blur-sm">
                  <Layers className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold tracking-tight mb-3 relative z-10 text-foreground">No models found</h3>
              <p className="text-muted-foreground max-w-md mb-8 leading-relaxed relative z-10 text-sm">
                {searchTerm 
                  ? "We couldn't find any models matching your search query. Try adjusting your filters." 
                  : "You haven't generated any financial models yet. Create your first model to start projecting your company's future."}
              </p>
              
              {!searchTerm && (
                <Link href="/dashboard/models/input/basic" className="relative z-10">
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="relative overflow-hidden bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-lg shadow-primary/25 flex items-center gap-2 hover:bg-primary/90 transition-all custom-group-btn"
                  >
                    <Plus className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Create Your First Model</span>
                  </motion.button>
                </Link>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6 bg-secondary/50">
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
