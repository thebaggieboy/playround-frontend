"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, FileUp, BarChart3, Download } from "lucide-react"

export function Overview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Template-Based Models",
      description: "Pre-built financial models like DCF, IRR, and NPV ready to use",
    },
    {
      icon: <FileUp className="w-6 h-6" />,
      title: "Upload & Parse",
      description: "Seamlessly upload and parse XLSM/CSV files",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Visualize & Analyze",
      description: "Create beautiful charts and analyze key metrics",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Reports",
      description: "Generate professional PDF reports instantly",
    },
  ]

  return (
    <section
      ref={ref}
      id="overview"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A comprehensive financial analysis solution designed for finance professionals who need powerful tools
            without the complexity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-lg p-8 border border-border hover:border-primary/40 transition-smooth-lg hover:shadow-lg hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-smooth text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
