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
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Logo marquee */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-8">
            Trusted by finance teams at leading institutions
          </p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030712] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030712] to-transparent z-10" />
            <div className="flex animate-[scroll_25s_linear_infinite]">
              {[...logoNames, ...logoNames].map((name, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-8 flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/[0.05]">
                    <span className="text-xs font-bold text-white/80">
                      {name[0]}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-white/80 whitespace-nowrap">
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
                className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {badge.label}
                  </p>
                  <p className="text-xs text-white/50">
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
