"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { CheckCircle2, Target } from "lucide-react"

export function WhyMatters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const benefits = [
    {
      title: "Accuracy of forecasts",
      description: "Enhance prediction precision with advanced modeling",
    },
    {
      title: "Decision-making",
      description: "Make data-driven decisions with confidence",
    },
    {
      title: "Team efficiency",
      description: "Streamline workflows and reduce manual work by 60%",
    },
    {
      title: "Collaboration and transparency",
      description: "Enable seamless cross-team communication",
    },
  ]

  return (
    <section
      ref={ref}
      id="why"
      className="relative overflow-hidden py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]"
    >
      {/* Subtle decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-200" />
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-slate-200/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-lg font-medium text-blue-600">
              Why It Matters
            </span>
          </div>

        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm"
        >
          <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed font-light">
            Our goal is to empower finance teams with flexible tools to
            customize, visualize, and interpret complex models easily. Transform
            your financial workflows with enterprise-grade modeling capabilities.
          </p>

          <p className="text-slate-900 font-semibold mb-5 text-lg uppercase tracking-wider flex items-center gap-2">
            This <span className="text-blue-600 lowercase" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.3em", letterSpacing: "normal" }}>improves</span>:
          </p>

          <div className="flex flex-col gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                }
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${hoveredIndex === index
                    ? "bg-slate-50 translate-x-2 shadow-sm border-slate-200 border"
                    : "bg-transparent border border-transparent"
                  }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 transition-transform duration-300 ${hoveredIndex === index ? "scale-110 drop-shadow-sm" : "scale-100"
                    }`}
                />
                <div>
                  <div className="text-slate-900 font-semibold flex items-center gap-2">
                    {benefit.title}
                  </div>
                  <div className="text-slate-500 text-xs md:text-sm mt-1">
                    {benefit.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
