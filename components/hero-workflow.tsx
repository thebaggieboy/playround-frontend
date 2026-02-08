"use client"

import { Check } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "Upload Your Data",
    description: "Import financial data via CSV with automatic validation and error detection.",
    highlight: "Multiple formats supported",
  },
  {
    number: "2",
    title: "Choose a Template",
    description: "Select from ready-made templates tailored to your business model or create from scratch.",
    highlight: "500+ professional templates",
  },
  {
    number: "3",
    title: "Customize & Analyze",
    description: "Adapt templates to your needs and visualize KPIs through interactive charts and tables.",
    highlight: "Full customization control",
  },
  {
    number: "4",
    title: "Export & Share",
    description: "Export financial reports as PDF or Excel and share with stakeholders seamlessly.",
    highlight: "Professional formatting",
  },
]

export function HeroWorkflow() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Your Financial Analysis Workflow
          </h2>
          <p className="text-lg text-foreground/60">
            Four simple steps from data to insights, all within Playground's intuitive platform.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="space-y-4">
                {/* Step number */}
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{step.description}</p>

                  {/* Highlight */}
                  <div className="flex items-center gap-2 text-sm text-primary font-medium pt-2">
                    <Check className="w-4 h-4" />
                    {step.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
