"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Star, FileText, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { selectToken } from '@/features/token/tokenSlice'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function CategoryTemplatesPage() {
    const router = useRouter()
    const params = useParams()

    const categorySlug = params.category as string
    const formattedCategory = categorySlug
        ? decodeURIComponent(categorySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : ''

    const tokenFromTokenSlice = useSelector(selectToken)
    const tokenFromAuth = useSelector((state: any) => state.auth?.token)
    const token = tokenFromTokenSlice || tokenFromAuth

    const [allTemplates, setAllTemplates] = useState<any[]>([])
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
                        setAllTemplates(data)
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

    const categoryTemplates = allTemplates.filter((t) => {
        const type = t.project_type || ""
        // E.g. "real_estate" -> "real estate"
        const friendlyType = type.toLowerCase().replace(/_/g, ' ')
        return friendlyType === formattedCategory.toLowerCase()
    })

    return (
        <div className="flex flex-col overflow-hidden flex-1">
            {/* Header */}
            <header className="border-b border-border bg-card px-6 lg:px-8 py-5 lg:py-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/templates')} className="h-8 w-8 shrink-0">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {formattedCategory} Templates
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Select a specialized template below to quickly build a financial model.
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-secondary/20">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="ml-3">Loading templates...</span>
                        </div>
                    ) : categoryTemplates.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-foreground">No Templates Found</h3>
                            <p className="text-muted-foreground mb-6">There are currently no templates under this industry category.</p>
                            <Button onClick={() => router.push('/dashboard/templates')}>Browse All Templates</Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {categoryTemplates.map((template, idx) => {
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
                                                    <FileText className="w-6 h-6 text-blue-600" />
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
                                            <p className="text-sm text-muted-foreground mb-4 flex-1">
                                                {template.description || "No description provided."}
                                            </p>

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
                                                <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/templates/${template.id}`)}>
                                                    Use Template
                                                </Button>
                                            </div>
                                        </Card>
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
