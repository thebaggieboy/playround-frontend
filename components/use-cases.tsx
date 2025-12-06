"use client"

import { TrendingUp, PieChart, BarChart3, Zap, ArrowRight } from "lucide-react"
import { useState } from "react"

const colors = {
  primary: "#FF1B6D",
  secondary: "#1A2654",
  tertiary: "#7C3AED",
  background: "#0F1419",
  card: "#1A1F2E",
  border: "#2D3748",
  text: "#F5F7FA",
  textMuted: "#A0AEC0",
}

export function UseCases() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const useCases = [
    {
      icon: <TrendingUp size={24} />,
      title: "Investment Analysis",
      description:
        "Evaluate investment opportunities with DCF and NPV models. Compare multiple scenarios with real-time data integration.",
      details: ["Automated DCF models", "Multi-scenario analysis", "Real-time data"],
      gradient: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.tertiary}20 100%)`,
    },
    {
      icon: <PieChart size={24} />,
      title: "Portfolio Management",
      description:
        "Track and analyze portfolio performance metrics across multiple asset classes with advanced visualizations.",
      details: ["Performance tracking", "Risk assessment", "Asset allocation"],
      gradient: `linear-gradient(135deg, ${colors.tertiary}20 0%, ${colors.primary}20 100%)`,
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Financial Forecasting",
      description:
        "Create accurate forecasts with built-in templates and historical data modeling for predictive analytics.",
      details: ["Template library", "Trend analysis", "Predictive models"],
      gradient: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}25 100%)`,
    },
    {
      icon: <Zap size={24} />,
      title: "Quick Analysis",
      description: "Get insights in minutes, not hours. Transform raw data into actionable intelligence instantly.",
      details: ["Instant calculations", "Auto-insights", "Export ready"],
      gradient: `linear-gradient(135deg, ${colors.tertiary}15 0%, ${colors.primary}20 100%)`,
    },
  ]

  return (
    <section
      style={{
        padding: "80px 32px",
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.secondary}10 50%, ${colors.background} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "400px",
          height: "400px",
          background: colors.primary,
          opacity: 0.07,
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: colors.tertiary,
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "48px", fontWeight: 700, marginBottom: "16px", color: colors.text }}>
            Use Cases for <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Every Role
            </span>
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: colors.textMuted,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Whether you're a CFO, analyst, or finance novice, our platform adapts to your needs and expertise level
          </p>
        </div>

        {/* Use Cases Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {useCases.map((useCase, index) => (
            <div
              key={index}
              style={{
                background: colors.card,
                borderRadius: "16px",
                padding: "32px 24px",
                border: `1px solid ${colors.border}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                transform: hoveredIndex === index ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoveredIndex === index
                    ? `0 20px 40px ${colors.primary}25, inset 0 1px 0 ${colors.primary}20`
                    : `0 10px 20px rgba(0,0,0,0.2)`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: useCase.gradient,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: colors.primary,
                  transition: "all 0.3s ease",
                  boxShadow: hoveredIndex === index ? `0 12px 24px ${colors.primary}30` : "none",
                  transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                }}
              >
                {useCase.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: "12px",
                  transition: "color 0.3s ease",
                }}
              >
                {useCase.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: colors.textMuted,
                  marginBottom: "16px",
                  lineHeight: "1.6",
                  transition: "color 0.3s ease",
                }}
              >
                {useCase.description}
              </p>

              {/* Details List - CHANGE: Added feature details with tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                {useCase.details.map((detail, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: "12px",
                      padding: "4px 12px",
                      background: `${colors.primary}15`,
                      color: colors.primary,
                      borderRadius: "20px",
                      fontWeight: 500,
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>

              {/* CTA - CHANGE: Added explore button with arrow */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: colors.primary,
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  transform: hoveredIndex === index ? "translateX(4px)" : "translateX(0)",
                }}
              >
                Explore <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - CHANGE: Added bottom stats bar */}
        <div
          style={{
            marginTop: "80px",
            padding: "40px",
            background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.tertiary}10 100%)`,
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {[
            { stat: "500K+", label: "Financial Models Created" },
            { stat: "99.9%", label: "System Uptime" },
            { stat: "<30s", label: "Model Generation Time" },
            { stat: "50+", label: "Pre-built Templates" },
          ].map((item, idx) => (
            <div key={idx}>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                }}
              >
                {item.stat}
              </div>
              <div style={{ fontSize: "14px", color: colors.textMuted }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
