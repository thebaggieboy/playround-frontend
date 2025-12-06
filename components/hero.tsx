"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/95">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 right-1/3 w-72 h-72 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-primary/20 text-primary font-semibold text-sm border border-primary/40 hover:border-primary/60 transition-smooth hover:shadow-lg hover:shadow-primary/25 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Financial modeling made simple
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight text-balance tracking-tight"
            >
              Financial Analysis for{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-tertiary bg-clip-text text-transparent">
                Everyone
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 max-w-xl text-balance leading-relaxed"
            >
              Playground is a one-stop financial analysis platform that makes complex financial modeling accessible to
              both experienced professionals and novices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg px-8 h-12 text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 hover:scale-105 w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg px-8 h-12 text-base font-semibold border-2 border-white/30 text-white hover:border-primary/80 hover:bg-primary/10 transition-all duration-300 hover:shadow-lg w-full sm:w-auto backdrop-blur-sm hover:scale-105 bg-transparent"
              >
                View Demo
              </Button>
            </motion.div>

            <div className="pt-4 flex items-center gap-4 text-white/70 text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/40 border-2 border-secondary"></div>
                <div className="w-8 h-8 rounded-full bg-tertiary/40 border-2 border-secondary"></div>
                <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-secondary"></div>
              </div>
              <span>Join 2,900+ companies already growing</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-96 md:h-full min-h-96"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-tertiary/5 to-primary/5 rounded-2xl overflow-hidden border border-primary/30 shadow-2xl hover:shadow-3xl transition-shadow duration-500 hover:border-primary/50">
              <img src="/fn.jpg" alt="Playground Dashboard" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
