"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Star, TrendingUp, Users, Building2, ShoppingCart, Briefcase } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"

const ALL_TEMPLATES = [
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

export default function CategoryTemplatesPage() {
    const router = useRouter()
    const params = useParams()

    const categorySlug = params.category as string
    const formattedCategory = categorySlug
        ? decodeURIComponent(categorySlug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : ''

    const categoryTemplates = ALL_TEMPLATES.filter(
        (t) => t.category.toLowerCase() === formattedCategory.toLowerCase()
    )

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
                    {categoryTemplates.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-foreground">No Templates Found</h3>
                            <p className="text-muted-foreground mb-6">There are currently no standard templates under this industry category.</p>
                            <Button onClick={() => router.push('/dashboard/templates')}>Browse All Templates</Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {categoryTemplates.map((template, idx) => {
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
                                                    className={`text-xs px-2 py-1 rounded ${template.complexity === "Beginner"
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
