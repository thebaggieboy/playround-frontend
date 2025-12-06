"use client"

import { Star } from "lucide-react"
import { useState } from "react"

export function Testimonials() {
  const colors = {
    primary: "#FF1B6D",
    secondary: "#1A2654",
    tertiary: "#7C3AED",
    lightBg: "#F8FAFC",
    darkBg: "#0F1419",
    accent: "#FF6B9D",
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CFO, Tech Startup",
      content:
        "Playground cut our financial analysis time in half. The templates are incredibly intuitive and saved our team hundreds of hours annually.",
      image: "/professional-woman.png",
      company: "TechVentures Inc",
    },
    {
      name: "Michael Rodriguez",
      role: "Financial Analyst",
      content:
        "Finally, a tool that doesn't require a PhD in finance. The visualizations are beautiful, clear, and help us communicate insights to stakeholders effortlessly.",
      image: "/professional-man.png",
      company: "Capital Analytics",
    },
    {
      name: "Emma Thompson",
      role: "Investment Manager",
      content:
        "The export functionality is game-changing. Our clients love the professional reports, and we've increased engagement by 40% since implementation.",
      image: "/professional-woman.png",
      company: "Global Investments Ltd",
    },
    {
      name: "David Park",
      role: "Startup Founder",
      content:
        "Best financial tool we've invested in. Real-time collaboration features mean our entire team stays aligned on financial metrics and forecasts.",
      image: "/professional-man.png",
      company: "InnovateLabs",
    },
    {
      name: "Jessica Martinez",
      role: "Controller",
      content:
        "The automated reporting saved us an entire week per month. Accuracy improved significantly and we can focus on strategic analysis instead.",
      image: "/professional-woman.png",
      company: "Enterprise Solutions Co",
    },
    {
      name: "Alex Thompson",
      role: "Data Director",
      content:
        "Exceptional platform with outstanding support. The learning curve is minimal and ROI was visible within the first week of implementation.",
      image: "/professional-man.png",
      company: "Analytics Pro Group",
    },
  ]

  return (
    <section
      style={{ background: `linear-gradient(to bottom, ${colors.darkBg}, rgba(26, 38, 84, 0.4))` }}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: `radial-gradient(circle, ${colors.primary}, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: `radial-gradient(circle, ${colors.tertiary}, transparent)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Loved by Finance{" "}
            <span
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Professionals
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            See what industry leaders are saying about Playground and how it transforms their financial workflows
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                background: `linear-gradient(135deg, rgba(255, 27, 109, 0.08), rgba(124, 58, 237, 0.08))`,
                border: `1px solid ${hoveredIndex === index ? colors.primary : "rgba(255, 27, 109, 0.2)"}`,
                boxShadow:
                  hoveredIndex === index ? `0 20px 40px rgba(255, 27, 109, 0.15)` : "0 4px 6px rgba(0, 0, 0, 0.1)",
                transform: hoveredIndex === index ? "translateY(-8px)" : "translateY(0)",
              }}
              className="rounded-xl p-8 transition-all duration-300 group backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ fill: colors.primary, color: colors.primary }} />
                  ))}
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: `rgba(${Number.parseInt(colors.primary.slice(1, 3), 16)}, ${Number.parseInt(colors.primary.slice(3, 5), 16)}, ${Number.parseInt(colors.primary.slice(5, 7), 16)}, 0.1)`,
                    color: colors.primary,
                  }}
                >
                  Verified
                </span>
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "15px" }}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid rgba(255, 27, 109, 0.1)` }}>
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                  style={{ border: `2px solid ${colors.primary}` }}
                />
                <div>
                  <p className="font-semibold" style={{ color: "#FFFFFF" }}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    {testimonial.role}
                  </p>
                  <p className="text-xs font-medium mt-1" style={{ color: colors.primary }}>
                    {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-16 pt-16" style={{ borderTop: `1px solid rgba(255, 27, 109, 0.1)` }}>
          {[
            { label: "Active Users", value: "10,000+" },
            { label: "Financial Models Created", value: "500K+" },
            { label: "Customer Satisfaction", value: "98%" },
          ].map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-bold" style={{ color: colors.primary }}>
                {metric.value}
              </p>
              <p className="text-sm mt-2" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
