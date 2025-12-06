"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { BarChart3, Upload, PieChart, FileText, TrendingUp, Zap, Share2 } from "lucide-react"

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const mvpFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Model Templates",
      description: "DCF, IRR, NPV and more pre-built templates",
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "File Upload",
      description: "Upload and parse CSV/XLSX files instantly",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Visual Charts",
      description: "Beautiful, interactive charts for analysis",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Export PDF",
      description: "Generate professional reports",
    },
  ]

  const futureFeatures = [
    { icon: <TrendingUp className="w-5 h-5" />, text: "Stock/portfolio features" },
    { icon: <Share2 className="w-5 h-5" />, text: "Collaboration tools" },
    { icon: <Zap className="w-5 h-5" />, text: "AI-powered insights" },
  ]

  return (
    <section
      ref={ref}
      id="features"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-primary/4 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            MVP <span className="text-primary">Scope</span>
          </h2>
          <p className="text-lg text-foreground/70">Powerful features available now</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {mvpFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/40 transition-smooth-lg hover:shadow-lg hover:-translate-y-1.5 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-smooth-lg group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                {feature.title}
              </h3>
              <p className="text-sm text-foreground/70 group-hover:text-foreground/80 transition-smooth">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-card rounded-2xl p-8 md:p-12 border border-border hover:border-primary/30 transition-smooth-lg hover:shadow-lg hover:-translate-y-1 group"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-primary transition-smooth">
            Coming Soon
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 group/item transition-smooth"
              >
                <span className="text-primary mt-1 flex-shrink-0 group-hover/item:scale-125 transition-smooth-lg">
                  {feature.icon}
                </span>
                <span className="text-foreground/80 group-hover/item:text-foreground transition-smooth group-hover/item:translate-x-1">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
