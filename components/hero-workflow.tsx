"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    number: "1",
    title: "Upload Your Data",
    description:
      "Import financial data via CSV with automatic validation and error detection.",
    highlight: "Multiple formats supported",
  },
  {
    number: "2",
    title: "Choose a Template",
    description:
      "Select from ready-made templates tailored to your business model or create from scratch.",
    highlight: "500+ professional templates",
  },
  {
    number: "3",
    title: "Customize & Analyze",
    description:
      "Adapt templates to your needs and visualize KPIs through interactive charts and tables.",
    highlight: "Full customization control",
  },
  {
    number: "4",
    title: "Export & Share",
    description:
      "Export financial reports as PDF or Excel and share with stakeholders seamlessly.",
    highlight: "Professional formatting",
  },
]

export function HeroWorkflow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] relative overflow-hidden"
    >
      {/* Decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute top-32 right-0 w-64 h-64 rounded-full bg-blue-50/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-[#f0ece7]/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance">
            Your Financial Analysis <span className="text-blue-600 block sm:inline mt-1 sm:mt-0" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.25em" }}>Workflow</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Four simple steps from data to insights, all within Playground's
            intuitive platform.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 -right-3 w-6 h-px bg-[#e8e4df]" />
              )}

              <div className="space-y-4 p-6 rounded-xl bg-white border border-[#e8e4df] shadow-sm shadow-[#e8e4df]/30 hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300">
                {/* Step number */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300">
                  {step.number}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Highlight */}
                  <div className="flex items-center gap-2 text-sm text-blue-600 font-medium pt-2">
                    <Check className="w-4 h-4" />
                    {step.highlight}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
