"use client"

import { FileUp, BarChart3, Zap, Settings, Download, Lock } from "lucide-react"

const features = [
  {
    icon: FileUp,
    title: "Effortless CSV Upload",
    description:
      "Import financial data with a single click. Playground supports multiple formats and automatically validates your data for accuracy.",
  },
  {
    icon: BarChart3,
    title: "Rich Data Visualization",
    description:
      "View comprehensive financial KPIs through interactive charts and detailed tables. Customize dashboards to match your analysis needs.",
  },
  {
    icon: Zap,
    title: "Ready-Made Templates",
    description:
      "Choose from 500+ professionally built financial templates including balance sheets, cash flow models, and project valuations.",
  },
  {
    icon: Settings,
    title: "Full Customization",
    description:
      "Tailor templates to your project type. Adjust formulas, add custom metrics, and build financial models that reflect your business.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "Export your financial visuals and reports as PDF or Excel. Share professional reports with stakeholders instantly.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "Bank-level encryption, role-based access controls, and audit trails keep your sensitive financial data completely secure.",
  },
]

export function HeroFeatures() {
  return (
    <section className="py-20 md:py-32  border-t border-border" style={{background:"linear-gradient(to right bottom, rgb(26, 38, 84), rgb(26, 38, 84))"
}}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything You Need for Financial Analysis
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            From data import to professional reporting, Playground delivers a complete financial modeling platform built
            for modern analysts.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-300"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/50 transition-colors" />

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>

                  <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
