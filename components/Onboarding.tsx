"use client"

import { useState } from "react"
import { Building2, User } from "lucide-react"

export function Onboarding() {
  const [selected, setSelected] = useState<"individual" | "business" | null>(null)

  const handleContinue = () => {
    if (selected) {
      console.log("[v0] User selected:", selected)
      // Handle navigation or state update here
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Welcome to Professional Financial Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Let's get you started by identifying your account type. This helps us tailor financial insights and models
            specifically for your needs.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Individual Card */}
          <button
            onClick={() => setSelected("individual")}
            className={`relative group p-8 rounded-xl border-2 transition-all duration-300 ${
              selected === "individual"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            {/* Top accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300 ${
                selected === "individual" ? "bg-primary" : "bg-border group-hover:bg-primary/30"
              }`}
            />

            <div className="flex flex-col items-center">
              <div
                className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                  selected === "individual"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                }`}
              >
                <User size={32} />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">Individual</h3>

              <p className="text-muted-foreground text-sm mb-6">
                Personal financial planning, investment analysis, and wealth management tools designed for individual
                investors.
              </p>

              {/* Features list */}
              <ul className="space-y-2 w-full text-left mb-6">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Portfolio management</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Tax optimization</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Retirement planning</span>
                </li>
              </ul>

              <div
                className={`text-sm font-semibold transition-all duration-300 ${
                  selected === "individual" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Select this option →
              </div>
            </div>
          </button>

          {/* Business Card */}
          <button
            onClick={() => setSelected("business")}
            className={`relative group p-8 rounded-xl border-2 transition-all duration-300 ${
              selected === "business" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            {/* Top accent line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300 ${
                selected === "business" ? "bg-primary" : "bg-border group-hover:bg-primary/30"
              }`}
            />

            <div className="flex flex-col items-center">
              <div
                className={`p-4 rounded-full mb-4 transition-all duration-300 ${
                  selected === "business"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary/20"
                }`}
              >
                <Building2 size={32} />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">Business</h3>

              <p className="text-muted-foreground text-sm mb-6">
                Enterprise-grade financial modeling, forecasting, and analytics for companies and organizations.
              </p>

              {/* Features list */}
              <ul className="space-y-2 w-full text-left mb-6">
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Financial forecasting</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Scenario analysis</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  <span>Business analytics</span>
                </li>
              </ul>

              <div
                className={`text-sm font-semibold transition-all duration-300 ${
                  selected === "business" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Select this option →
              </div>
            </div>
          </button>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              selected
                ? "bg-primary text-primary-foreground hover:shadow-lg hover:scale-105"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continue
          </button>

          <button className="px-8 py-3 rounded-lg font-semibold border-2 border-border text-foreground hover:border-primary/50 transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          You can change your account type anytime in settings.
        </p>
      </div>
    </div>
  )
}
