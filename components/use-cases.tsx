"use client"

import { TrendingUp, PieChart, BarChart3, Zap, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

const colors = {
  primary: "#1e40af",
  secondary: "#1a2654",
  tertiary: "#7C3AED",
  background: "#ffffff",
  card: "#f9fafb",
  border: "#e5e7eb",
  text: "#111827",
  textMuted: "#6b7280",
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
      bgColor: colors.primary,
      accent: "🎯",
    },
    {
      icon: <PieChart size={24} />,
      title: "Portfolio Management",
      description:
        "Track and analyze portfolio performance metrics across multiple asset classes with advanced visualizations.",
      details: ["Performance tracking", "Risk assessment", "Asset allocation"],
      bgColor: colors.primary,
      accent: "📊",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Financial Forecasting",
      description:
        "Create accurate forecasts with built-in templates and historical data modeling for predictive analytics.",
      details: ["Template library", "Trend analysis", "Predictive models"],
      bgColor: colors.primary,
      accent: "📈",
    },
    {
      icon: <Zap size={24} />,
      title: "Quick Analysis",
      description: "Get insights in minutes, not hours. Transform raw data into actionable intelligence instantly.",
      details: ["Instant calculations", "Auto-insights", "Export ready"],
      bgColor: colors.primary,
      accent: "⚡",
    },
  ]

  return (
    <section
      style={{
        padding: "80px 32px",
        background: colors.background,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent 0%, ${colors.primary}20 50%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              padding: "8px 16px",
              backgroundColor: `${colors.primary}10`,
              borderRadius: "8px",
              borderLeft: `2px solid ${colors.primary}`,
            }}
          >
            <Sparkles size={16} style={{ color: colors.primary }} />
            <span style={{ color: colors.primary, fontSize: "12px", fontWeight: 600 }}>Multiple Solutions</span>
          </div>
          <h2 style={{ fontSize: "36px", fontWeight: 400, marginBottom: "16px", color: colors.text }}>
            Use Cases for <br />
            <span style={{ color: colors.primary }}>Every Role</span>
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
                borderRadius: "12px",
                padding: "32px 24px",
                border: `1px solid ${colors.border}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                transform: hoveredIndex === index ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hoveredIndex === index ? "0 12px 24px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "24px",
                  right: "24px",
                  height: "3px",
                  background: hoveredIndex === index ? colors.primary : `${colors.primary}20`,
                  borderRadius: "0 0 2px 2px",
                  transition: "all 0.3s ease",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: `${useCase.bgColor}10`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: useCase.bgColor,
                    transition: "all 0.3s ease",
                    boxShadow: hoveredIndex === index ? `0 4px 12px ${useCase.bgColor}15` : "none",
                  }}
                >
                  {useCase.icon}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    opacity: hoveredIndex === index ? 1 : 0.5,
                    transition: "all 0.3s ease",
                  }}
                >
                  {useCase.accent}
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: colors.text,
                  marginBottom: "12px",
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
                }}
              >
                {useCase.description}
              </p>

              {/* Details List */}
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
                      background: `${colors.primary}08`,
                      color: colors.primary,
                      borderRadius: "16px",
                      fontWeight: 500,
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>

              {/* CTA */}
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

        {/* Stats Section */}
        <div
          style={{
            marginTop: "80px",
            padding: "40px",
            background: colors.card,
            borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              borderRadius: "12px 12px 0 0",
              background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
            }}
          />

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
                  color: colors.primary,
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
