"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Award, Lock, CheckCircle2 } from "lucide-react"

const logoNames = [
  "Goldman Sachs",
  "Morgan Stanley",
  "Deloitte",
  "KPMG",
  "McKinsey",
  "JP Morgan",
  "BlackRock",
  "Fidelity",
]

const trustBadges = [
  {
    icon: Shield,
    label: "SOC 2 Type II",
    description: "Enterprise security certified",
  },
  {
    icon: Lock,
    label: "256-bit Encryption",
    description: "Bank-grade data protection",
  },
  {
    icon: Award,
    label: "GDPR Compliant",
    description: "Full EU data regulation",
  },
  {
    icon: CheckCircle2,
    label: "99.9% Uptime SLA",
    description: "Guaranteed availability",
  },
]

export function TrustedBy() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-slate-200" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Logo marquee */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Trusted by finance teams at leading institutions
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="flex animate-[scroll_25s_linear_infinite]">
              {[...logoNames, ...logoNames].map((name, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-slate-800">
                      {name[0]}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {badge.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
