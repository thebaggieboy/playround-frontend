"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const heroVideoUrl =
  "https://res.cloudinary.com/baggieboy/video/upload/v1770388607/plyground_input_variables_ivbvxn.mp4"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0f1b3d]">
      {/* Subtle ambient accents -- no gradients, just soft diffused shapes */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#1d3a6e]" />
      <div className="absolute top-20 right-0 w-[480px] h-[480px] rounded-full bg-[#1a3264]/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full bg-[#162d5a]/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#1a3264] text-blue-300 border border-[#264a82]">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Financial modeling made simple
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight tracking-tight text-balance"
            >
              Financial Analysis for{" "}
              <span className="text-blue-400">Everyone</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-400 max-w-xl leading-relaxed text-balance"
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
                  className="rounded-lg px-8 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg px-8 h-12 text-base font-semibold border-[#264a82] bg-transparent text-slate-300 hover:bg-[#1a3264] hover:text-white transition-all duration-200 w-full sm:w-auto"
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
              className="flex items-center gap-8 pt-6 border-t border-[#1d3a6e]"
            >
              <div>
                <p className="text-2xl font-bold text-white">2,900+</p>
                <p className="text-sm text-slate-500">Companies</p>
              </div>
              <div className="w-px h-10 bg-[#1d3a6e]" />
              <div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-sm text-slate-500">Active analysts</p>
              </div>
              <div className="w-px h-10 bg-[#1d3a6e]" />
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-sm text-slate-500">Uptime</p>
              </div>
            </motion.div>
          </div>

          {/* Right visual - Cloudinary collection embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden border border-[#264a82] bg-[#0c1630] shadow-2xl shadow-blue-950/30">
              {/* Browser-style top bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1328] border-b border-[#1d3a6e]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#1d3a6e]" />
                  <div className="w-3 h-3 rounded-full bg-[#1d3a6e]" />
                  <div className="w-3 h-3 rounded-full bg-[#1d3a6e]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#162d5a]/60 rounded-md px-3 py-1 text-xs text-slate-500 truncate max-w-xs">
                    playground.finance/demo
                  </div>
                </div>
              </div>
              {/* Video player */}
              <div className="aspect-video bg-[#080e20]">
                <video
                  src={heroVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
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
