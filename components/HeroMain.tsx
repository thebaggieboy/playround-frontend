"use client"

import { ArrowRight, BarChart3, FileUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroMain() {
  return (
    <section className="relative min-h-screen bg-background flex items-center overflow-hidden" style={{ background:"linear-gradient(to right bottom, rgb(26, 38, 84), rgb(26, 38, 84))" }}>
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Financial Modeling Simplified</span>
              </div>

              <h1 className="text-4xl sm:text-5xl text-white lg:text-6xl font-bold text-balance leading-tight text-foreground">
                Transform Your Financial Data Into Actionable Insights
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                Upload CSV files, visualize KPIs with interactive charts, and leverage ready-made templates designed for
                every business model. All in one professional platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-foreground/60">Financial templates</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">10K+</p>
                <p className="text-sm text-foreground/60">Active analysts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">99%</p>
                <p className="text-sm text-foreground/60">Uptime guarantee</p>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
            <div className="relative bg-card border border-border rounded-2xl p-8 space-y-6">
              {/* Feature highlight */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileUp className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-foreground">Import & Analyze</h3>
                </div>
                <p className="text-sm text-foreground/60">
                  Upload CSV files directly and watch as your data transforms into meaningful visualizations instantly.
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-foreground">Interactive Charts</h3>
                </div>
                <p className="text-sm text-foreground/60">
                  View detailed financial KPIs in beautiful, interactive charts and tables. Drill down into the metrics
                  that matter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
