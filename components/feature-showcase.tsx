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
                            <div className="flex-1 w-full max-w-2xl lg:max-w-none relative group">
                                {/* Ambient back-glow to make it pop like a high-end monitor */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 60, rotateX: 15, scale: 0.95 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ transformPerspective: "1200px" }}
                                    className="relative rounded-[1.25rem] overflow-hidden border border-white/[0.1] bg-[#030712] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/5"
                                >
                                    {/* Safari/macOS Window Header */}
                                    <div className="bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.05] flex items-center px-4 h-10 w-full relative z-20">
                                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#333] group-hover:bg-[#FF5F56] transition-colors duration-300" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#333] group-hover:bg-[#FFBD2E] transition-colors duration-300 delay-75" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#333] group-hover:bg-[#27C93F] transition-colors duration-300 delay-150" />
                                        </div>
                                    </div>

                                    {/* Responsive container for the screenshot (no exact aspect forced) */}
                                    <div className="relative w-full h-full transform-gpu transition-all duration-700 ease-out group-hover:scale-[1.03]">
                                        {/* Inner subtle glass glare */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent z-20 pointer-events-none" />

                                        <Image
                                            src={feature.imageSrc}
                                            alt={feature.imageAlt}
                                            width={1800}
                                            height={1200}
                                            className="w-full h-auto object-contain relative z-10"
                                            onError={(e) => {
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
