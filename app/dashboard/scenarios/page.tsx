"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    FileText,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Activity,
    ArrowRight,
    Loader2,
    Calendar,
    Layers,
    ArrowUpDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSelector } from "react-redux"
import { selectToken } from "@/features/token/tokenSlice"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://playground-backend-1t0f.onrender.com/api'
    : 'http://localhost:8000/api'


interface Scenario {
    id: number
    name: string
    scenario_type: "base" | "upside" | "downside" | "custom"
    is_active: boolean
    created_at: string
}

export default function ScenariosPage() {
    const token = useSelector(selectToken)
    const { toast } = useToast()
    const router = useRouter()

    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    const getAuthToken = () => {
        if (!token) return '';
        if (typeof token === 'string') return token;
        if (typeof token === 'object' && token.access) return token.access;
        return '';
    }

    useEffect(() => {
        fetchScenarios()
    }, [])

    const fetchScenarios = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_BASE_URL}/scenarios/`, {
                headers: {
                    'Authorization': `JWT ${getAuthToken()}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch scenarios')
            }

            const data = await response.json()
            // Sort to have the newest first
            const sortedData = data.sort((a: Scenario, b: Scenario) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            setScenarios(sortedData)
        } catch (error) {
            console.error('Error fetching scenarios:', error)
            toast({
                title: "Error",
                description: "Failed to load scenarios. Please try again later.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'base': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case 'upside': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'downside': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        }
    }

    const filteredScenarios = scenarios.filter(scenario =>
        scenario.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
            {/* Header section designed to match the analytics/models pages */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Scenarios</h2>
                    <p className="text-muted-foreground mt-1">Manage, analyze, and compare financial scenarios.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/scenarios/compare">
                        <Button variant="outline" className="gap-2">
                            <ArrowUpDown className="w-4 h-4" />
                            Compare Scenarios
                        </Button>
                    </Link>
                    <Link href="/dashboard/models/input/advanced">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Model
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="border-border">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search scenarios by name..."
                            className="pl-9 w-full bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="icon" className="shrink-0" onClick={fetchScenarios}>
                            <Activity className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Scenarios Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredScenarios.length === 0 ? (
                <Card className="border-dashed border-2 bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No scenarios found</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            {searchQuery ? "No scenarios match your search query." : "You haven't generated any financial scenarios yet."}
                        </p>
                        {!searchQuery && (
                            <Link href="/dashboard/models/input/advanced">
                                <Button>Create Your First Model</Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScenarios.map((scenario, index) => (
                        <motion.div
                            key={scenario.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="group hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col h-full bg-card overflow-hidden">
                                <div className="h-2 w-full bg-gradient-to-r from-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={`${getTypeColor(scenario.scenario_type)} border-none capitalize`}>
                                                    {scenario.scenario_type} Case
                                                </Badge>
                                                {scenario.is_active && (
                                                    <Badge variant="outline" className="border-green-200 text-green-600 bg-green-50">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-xl line-clamp-1" title={scenario.name}>
                                                {scenario.name}
                                            </CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/scenarios/${scenario.id}`)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/dashboard/scenarios/compare?ids=${scenario.id}`)}>
                                                    Compare
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4 flex-1">
                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Created: {new Date(scenario.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</span>
                                    </div>

                                    {/* Visual placeholder for metrics */}
                                    <div className="bg-secondary/50 rounded-lg p-3 grid grid-cols-2 gap-2 mt-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Model Output</span>
                                            <div className="h-2 w-2/3 bg-primary/20 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-muted-foreground block">Key Result</span>
                                            <div className="h-2 w-full bg-primary/20 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-4">
                                    <Link href={`/dashboard/scenarios/${scenario.id}`} className="w-full">
                                        <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
