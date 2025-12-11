"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Zap, Clock, FileText, Lightbulb } from "lucide-react"

export default function QuickAnalysisPage() {
  const steps = [
    {
      number: "1",
      title: "Upload Your File",
      description: "Drag and drop your CSV, Excel, or data file in seconds",
    },
    {
      number: "2",
      title: "Instant Analysis",
      description: "Playground automatically analyzes your data and generates insights",
    },
    {
      number: "3",
      title: "View Results",
      description: "Explore charts, tables, and key metrics instantly",
    },
    {
      number: "4",
      title: "Take Action",
      description: "Export findings or dive deeper into detailed analysis",
    },
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Instant Insights",
      description: "Get financial insights without complex setup or configuration",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Analyze financial data in minutes instead of hours",
    },
    {
      icon: FileText,
      title: "Quick Reports",
      description: "Generate professional reports from your data immediately",
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Receive AI-powered suggestions based on your financial data",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36" />

          <div className="relative z-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-white/80 text-sm font-semibold uppercase mb-4">Quick Analysis</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Financial Insights in Seconds
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                No complex setup required. Upload your financial data and instantly receive comprehensive analysis,
                visualizations, and actionable insights.
              </p>
            </motion.div>

            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {["Instant Analysis", "Zero Setup Time", "Smart Insights"].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white/90 flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card border-l border-border p-8 lg:p-12 flex items-center justify-center"
        >
          <div className="w-full h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-border">
            <Zap className="w-32 h-32 text-green-300" />
          </div>
        </motion.div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Key Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick, powerful analysis for busy professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Workflow Section */}
      <div className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Quick Analysis Workflow</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From upload to insights in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="bg-background border border-border rounded-lg p-6 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-green-500 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-12 text-center space-y-6"
        >
          <h2 className="text-3xl lg:text-4xl font-bold">Get Financial Insights Today</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Upload your data now and discover instant financial insights powered by Playground
          </p>
          <Link href="/dashboard/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 mx-auto"
            >
              Start Quick Analysis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </main>
  )
}
