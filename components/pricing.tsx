"use client"

import { Check } from "lucide-react"
import { useState } from "react"

export function Pricing() {
  const colors = {
    primary: "#FF1B6D",
    secondary: "#1A2654",
    tertiary: "#7C3AED",
    accent: "#FF6B9D",
    lightBg: "#F8FAFC",
  }

  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)

  const plans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for individuals and small projects",
      features: [
        "Up to 5 financial models",
        "50+ basic templates",
        "CSV export",
        "Email support",
        "1GB cloud storage",
        "Basic charting tools",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$99",
      description: "For growing finance teams",
      features: [
        "Unlimited models",
        "All 200+ templates",
        "PDF & Excel export",
        "Priority support (4hr)",
        "100GB cloud storage",
        "Advanced analytics",
        "Real-time collaboration",
        "Custom branding",
      ],
      cta: "Start Free Trial",
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Custom templates",
        "Full API access",
        "Dedicated support (1hr)",
        "Unlimited storage",
        "White-label solution",
        "Advanced security",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ]

  return (
    <section
      style={{ background: `linear-gradient(to bottom, ${colors.secondary}, rgba(26, 38, 84, 0.6))` }}
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${colors.tertiary}, transparent)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Choose the perfect plan for your financial analysis needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                background: plan.highlighted
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.tertiary})`
                  : `linear-gradient(135deg, rgba(255, 27, 109, 0.08), rgba(124, 58, 237, 0.08))`,
                border: `2px solid ${
                  plan.highlighted ? colors.primary : hoveredPlan === index ? colors.primary : "rgba(255, 27, 109, 0.2)"
                }`,
                boxShadow:
                  hoveredPlan === index ? `0 25px 50px rgba(255, 27, 109, 0.2)` : `0 10px 30px rgba(0, 0, 0, 0.1)`,
                transform: plan.highlighted
                  ? "scale(1.05)"
                  : hoveredPlan === index
                    ? "scale(1.02) translateY(-8px)"
                    : "scale(1)",
              }}
              className="rounded-2xl p-8 transition-all duration-300 relative"
            >
              {plan.badge && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: colors.accent }}
                >
                  {plan.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2" style={{ color: plan.highlighted ? "#FFFFFF" : "#FFFFFF" }}>
                {plan.name}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: plan.highlighted ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.7)" }}
              >
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-5xl font-bold" style={{ color: plan.highlighted ? "#FFFFFF" : colors.primary }}>
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span style={{ color: plan.highlighted ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.7)" }}>
                    /month
                  </span>
                )}
              </div>

              <button
                style={{
                  background: plan.highlighted ? "#FFFFFF" : colors.primary,
                  color: plan.highlighted ? colors.primary : "#FFFFFF",
                  boxShadow: hoveredPlan === index ? `0 10px 25px rgba(255, 27, 109, 0.3)` : "none",
                }}
                className="w-full py-3 rounded-lg font-semibold mb-8 transition-all duration-300 hover:opacity-90"
              >
                {plan.cta}
              </button>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: plan.highlighted ? "#FFFFFF" : colors.primary }}
                    />
                    <span
                      style={{ color: plan.highlighted ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)" }}
                      className="text-sm"
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-16" style={{ borderTop: `1px solid rgba(255, 27, 109, 0.1)` }}>
          <p className="text-center text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            All plans include a 14-day free trial. No credit card required. Access to all features during trial period.
          </p>
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            {[
              { label: "99.9% Uptime", value: "Guaranteed" },
              { label: "ROI", value: "Within 30 days" },
              { label: "Support", value: "Always Available" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <p style={{ color: colors.primary }} className="font-bold">
                  {item.value}
                </p>
                <p style={{ color: "rgba(255, 255, 255, 0.6)" }} className="text-sm">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
