"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const { scrollY } = useScroll()
  
  // Apple-style parallax fade on scroll
  const y1 = useTransform(scrollY, [0, 500], [0, 100])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent perspective-1000">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      ` }} />
      {/* Subtle ambient accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Sleek, deep background flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] rounded-[100%] bg-indigo-500/10 blur-[100px] pointer-events-none mt-20" />

      <motion.div 
        style={{ y: y1, opacity, scale }}
        className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center text-center mt-10 md:mt-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/[0.03] text-slate-300 border border-white/[0.08] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            Introducing intelligent financial workflows
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 relative z-20 w-full items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-semibold text-white leading-[1.05] tracking-[-0.04em] text-balance"
            style={{ 
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif" 
            }}
          >
            Financial analysis,{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
              beautifully simple.
            </span>
          </motion.h1>

          <div className="h-[40px] sm:h-[48px] md:h-[60px] w-full relative overflow-hidden mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={titleIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 text-xl sm:text-2xl md:text-3xl text-blue-400 font-medium tracking-tight flex items-center justify-center"
                style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif" }}
              >
                {["Predictive Forecasting.", "Dynamic Modeling.", "Data-Driven Insights."][titleIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-base sm:text-lg md:text-xl text-slate-400/80 max-w-2xl leading-relaxed text-balance font-light tracking-[-0.01em] mb-12"
          style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, sans-serif" }}
        >
          Playground merges enterprise-grade engine power with a stunning, consumer-grade experience. Zero setup, zero friction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto"
        >
          <Link href="/signup" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base font-medium bg-white text-black hover:bg-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-300 w-full hover:scale-105"
            >
              Get Started Free
            </Button>
          </Link>
          <Link href="/demo" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base font-medium border-white/10 bg-white/[0.02] backdrop-blur-xl text-white hover:bg-white/[0.08] hover:text-white transition-all duration-300 w-full hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              Contact Sales
            </Button>
          </Link>
        </motion.div>

        {/* Minimalist Apple-style stats */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-center justify-center gap-6 sm:gap-12 pt-16 mt-6 sm:mt-12"
        >
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">2,900+</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium tracking-wide uppercase">Teams</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">99.9%</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium tracking-wide uppercase">Reliability</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center">
            <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">&lt;1ms</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium tracking-wide uppercase">Latency</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
