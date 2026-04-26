"use client"

import { ArrowRight, BarChart3, FileUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroMain() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#Fdfbf7]">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  Financial Modeling Simplified
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-[1.1] text-slate-900 tracking-tight">
                Transform Your Financial Data Into{" "}
                <span 
                  className="text-blue-600 block mt-2 drop-shadow-sm"
                  style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.1em" }}
                >
                  Actionable Insights
                </span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                Upload CSV files, visualize KPIs with interactive charts, and
                leverage ready-made templates designed for every business model.
                All in one professional platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base transition-all duration-200 w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#e8e4df] bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-lg px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base transition-all duration-200 w-full sm:w-auto shadow-sm"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-[#e8e4df]">
              <div>
                <p className="text-2xl font-bold text-slate-900">500+</p>
                <p className="text-sm text-slate-500">Financial templates</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">10K+</p>
                <p className="text-sm text-slate-500">Active analysts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">99%</p>
                <p className="text-sm text-slate-500">Uptime guarantee</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="relative bg-white border border-[#e8e4df] shadow-sm rounded-xl p-8 space-y-6">
              {/* Feature highlight */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <FileUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Import & Analyze
                  </h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Upload CSV files directly and watch as your data transforms
                  into meaningful visualizations instantly.
                </p>
              </div>

              <div className="h-px bg-[#e8e4df]" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">
                    Interactive Charts
                  </h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  View detailed financial KPIs in beautiful, interactive charts
                  and tables. Drill down into the metrics that matter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
