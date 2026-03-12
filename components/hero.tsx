"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const heroVideoUrl =
  "https://res.cloudinary.com/baggieboy/video/upload/v1770388607/plyground_input_variables_ivbvxn.mp4"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Subtle ambient accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-20 right-0 w-[480px] h-[480px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 px-4  rounded-full text-xs font-xs bg-white/[0.03] text-blue-300 border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <span className="w-2 h-2 text-xs rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                Financial modeling made simple
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight text-balance"
            >
              Financial Analysis for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-[0_0_16px_rgba(96,165,250,0.3)]">Everyone</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/60 max-w-xl leading-relaxed text-balance font-light"
            >
              Playground is a one-stop financial analysis platform that makes
              complex financial modeling accessible to both experienced
              professionals and novices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-xl px-8 h-14 text-base font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.2)] transition-all duration-300 w-full sm:w-auto hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 h-14 text-base font-semibold border-white/10 bg-white/[0.03] backdrop-blur-md text-white hover:bg-white/[0.08] hover:text-white transition-all duration-300 w-full sm:w-auto hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-8 pt-8 mt-4 border-t border-white/[0.08]"
            >
              <div>
                <p className="text-3xl font-bold text-white drop-shadow-md">2,900+</p>
                <p className="text-sm text-white/50 mt-1 font-medium">Companies</p>
              </div>
              <div className="w-px h-12 bg-white/[0.08]" />
              <div>
                <p className="text-3xl font-bold text-white drop-shadow-md">10K+</p>
                <p className="text-sm text-white/50 mt-1 font-medium">Active analysts</p>
              </div>
              <div className="w-px h-12 bg-white/[0.08]" />
              <div>
                <p className="text-3xl font-bold text-white drop-shadow-md">99.9%</p>
                <p className="text-sm text-white/50 mt-1 font-medium">Uptime</p>
              </div>
            </motion.div>
          </div>

          {/* Right visual - Glass container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Outer glass glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-50" />

            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
              {/* Browser-style top bar - Glassy */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/[0.04] rounded-md px-3 py-1.5 text-xs text-white/40 truncate max-w-xs text-center border border-white/[0.02]">
                    playground.finance/demo
                  </div>
                </div>
              </div>
              {/* Video player */}
              <div className="aspect-video bg-black/50">
                <video
                  src={heroVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover mix-blend-lighten opacity-90"
                  title="Playground financial platform demo"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
