"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, TrendingUp, BarChart3, PieChart, Zap } from "lucide-react"

export default function InvestmentAnalysisPage() {
  const steps = [
    {
      number: "1",
      title: "Import Investment Data",
      description: "Upload your portfolio data, holdings, and market information via CSV",
    },
    {
      number: "2",
      title: "Analyze Performance",
      description: "View detailed performance metrics, returns, and risk indicators",
    },
    {
      number: "3",
      title: "Compare Scenarios",
      description: "Evaluate different investment strategies and market conditions",
    },
    {
      number: "4",
      title: "Generate Reports",
      description: "Export professional investment analysis reports for stakeholders",
    },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Monitor ROI, volatility, and correlation metrics across your investments",
    },
    {
      icon: BarChart3,
      title: "Sector Analysis",
      description: "Understand exposure across different sectors and asset classes",
    },
    {
      icon: PieChart,
      title: "Portfolio Optimization",
      description: "Identify rebalancing opportunities and optimize asset allocation",
    },
    {
      icon: Zap,
      title: "Real-Time Insights",
      description: "Access instantly updated analysis reflecting market changes",
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
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36" />

          <div className="relative z-10 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-white/80 text-sm font-semibold uppercase mb-4">Investment Analysis</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Master Your Investment Portfolio
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Leverage sophisticated financial modeling to analyze investment opportunities, track performance, and
                optimize your portfolio with data-driven insights.
              </p>
            </motion.div>

            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {["Comprehensive ROI Analysis", "Risk-Adjusted Returns", "Comparative Benchmarking"].map((item, i) => (
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
          <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center border border-border">
            <TrendingUp className="w-32 h-32 text-blue-300" />
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
              Unlock powerful analytical capabilities tailored for investment professionals
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
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
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
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to analyze your investments
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
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
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
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-12 text-center space-y-6"
        >
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to Optimize Your Investments?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Start analyzing your investment portfolio with Playground's powerful tools today
          </p>
          <Link href="/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 mx-auto"
            >
              Schedule Demo
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </main>
  )
}
