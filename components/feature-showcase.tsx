"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { CheckCircle2, MessageSquare, LayoutDashboard, LineChart } from "lucide-react"

const features = [
    {
        id: "dashboard",
        title: "Your Operations, Centralized",
        heading: "Intelligent Dashboard",
        description: "Monitor your active models, generated reports, and track key financial metrics like Average Target IRR and Modeled Capex in a sleek, centralized overview.",
        icon: LayoutDashboard,
        imageSrc: "/dashboard-screenshot.png", // USER: Save your dashboard screenshot as this filename in the public/ folder
        imageAlt: "Playground Dashboard Interface",
        benefits: [
            "Real-time overview of active financial models",
            "Instant access to recent reports and scenarios",
            "Track aggregated KPIs across all projects"
        ],
        reversed: false
    },
    {
        id: "chat",
        title: "AI-Powered Intelligence",
        heading: "Conversational Finance",
        description: "Ask questions directly to your financial models. Our integrated AI assistant can analyze your scenarios, explain variances, and provide actionable intelligence instantly.",
        icon: MessageSquare,
        imageSrc: "/chat-screenshot.png", // USER: Save your chat screenshot as this filename in the public/ folder
        imageAlt: "Playground AI Chat Interface",
        benefits: [
            "Natural language querying of complex data",
            "Instant multi-scenario variance analysis",
            "Context-aware financial explanations"
        ],
        reversed: true
    },
    {
        id: "analytics",
        title: "Deep Dive Metrics",
        heading: "Comprehensive Analytics",
        description: "Drill down into the exact performance of your models. Visualize total revenue, track equity modeled, and understand payback periods across your entire portfolio.",
        icon: LineChart,
        imageSrc: "/analytics-screenshot.png", // USER: Save your analytics screenshot as this filename in the public/ folder
        imageAlt: "Playground Analytics Interface",
        benefits: [
            "Visualize revenue trends over time",
            "Track average loan tenors and payback periods",
            "Compare performance across different project types"
        ],
        reversed: false
    }
]

export function FeatureShowcase() {
    return (
        <section className="py-14 sm:py-24 bg-[#030712] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1d3a6e] to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                        Everything you need for <span className="text-blue-400">financial clarity</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                        A complete suite of tools designed to transform complex financial data into beautiful, actionable insights.
                    </p>
                </div>

                <div className="space-y-16 sm:space-y-32">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className={`flex flex-col ${feature.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 sm:gap-12 lg:gap-20 items-center`}
                        >
                            {/* Content Side */}
                            <div className="flex-1 space-y-8 w-full">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a3264] border border-[#264a82]">
                                        <feature.icon className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm font-medium text-blue-300">
                                            {feature.title}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        {feature.heading}
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {feature.benefits.map((benefit, i) => (
                                        <motion.li
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i}
                                            className="flex items-center gap-3 text-slate-300"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                            <span>{benefit}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Image Side */}
                            <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="relative rounded-2xl overflow-hidden border border-[#264a82] bg-[#0c162d] shadow-2xl group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Aspect ratio container for the screenshot */}
                                    <div className="relative aspect-[16/10] w-full">
                                        {/* Fallback styling in case image hasn't been uploaded yet by user */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1128] text-slate-500 text-sm">
                                            <feature.icon className="w-12 h-12 mb-4 opacity-50" />
                                            Uploading screenshot...
                                        </div>

                                        <Image
                                            src={feature.imageSrc}
                                            alt={feature.imageAlt}
                                            fill
                                            className="object-cover object-top relative z-10"
                                            onError={(e) => {
                                                // Hide broken image icon if image doesn't exist yet
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
