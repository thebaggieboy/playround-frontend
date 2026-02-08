"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0f1b3d]">
      {/* Subtle ambient shapes */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1d3a6e]" />
      <div className="absolute -top-20 left-1/3 w-80 h-80 rounded-full bg-[#1a3264]/30 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-64 h-64 rounded-full bg-[#162d5a]/40 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance"
        >
          Ready to Transform Your{" "}
          <span className="text-blue-400">Financial Analysis?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join finance professionals who are already using Playground to make
          better decisions faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 h-12 text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg px-8 h-12 text-base font-semibold border-[#264a82] bg-transparent text-slate-300 hover:bg-[#1a3264] hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            Schedule Demo
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
