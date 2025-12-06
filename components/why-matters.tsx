"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { CheckCircle2, Sparkles } from "lucide-react"

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

export function WhyMatters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const benefits = [
    { title: "Accuracy of forecasts", description: "Enhance prediction precision with advanced modeling" },
    { title: "Decision-making", description: "Make data-driven decisions with confidence" },
    { title: "Team efficiency", description: "Streamline workflows and reduce manual work by 60%" },
    { title: "Collaboration and transparency", description: "Enable seamless cross-team communication" },
  ]

  return (
    <section
      ref={ref}
      id="why"
      className="relative overflow-hidden"
      style={{
        padding: "80px 32px",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.secondary}15 50%, ${colors.background} 100%)`,
      }}
    >
      {/* Animated background blurs */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "400px",
          height: "400px",
          background: colors.primary,
          opacity: 0.08,
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-200px",
          width: "300px",
          height: "300px",
          background: colors.tertiary,
          opacity: 0.06,
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", height: "400px" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.tertiary}15 100%)`,
                borderRadius: "20px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
              }}
            >
              <img
                src="/team-collaboration-financial-analysis.jpg"
                alt="Team collaboration"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
              style={{
                position: "absolute",
                bottom: -20,
                right: -30,
                background: colors.card,
                padding: "16px 24px",
                borderRadius: "12px",
                border: `1px solid ${colors.primary}40`,
                boxShadow: `0 20px 40px ${colors.primary}20`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: colors.primary }}>
                <Sparkles size={16} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>AI-Powered Analysis</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: "48px", fontWeight: 700, marginBottom: "24px", color: colors.text }}>
              Why This <span style={{ color: colors.primary }}>Matters</span>
            </h2>

            <div
              style={{
                background: colors.card,
                borderRadius: "20px",
                padding: "40px",
                border: `1px solid ${colors.border}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIndex(-1)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <p
                style={{
                  fontSize: "18px",
                  color: colors.textMuted,
                  marginBottom: "32px",
                  lineHeight: "1.6",
                  fontWeight: 500,
                  transition: "color 0.3s ease",
                }}
              >
                Our goal is to empower finance teams with flexible tools to customize, visualize, and interpret complex
                models easily. Transform your financial workflows with enterprise-grade modeling capabilities.
              </p>

              <p style={{ color: colors.text, fontWeight: 600, marginBottom: "20px" }}>This improves:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "8px",
                      background: hoveredIndex === index ? `${colors.primary}10` : "transparent",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <CheckCircle2
                      size={20}
                      style={{
                        color: colors.primary,
                        marginTop: "2px",
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                        transform: hoveredIndex === index ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          color: colors.text,
                          fontWeight: 600,
                          fontSize: "15px",
                          marginBottom: "2px",
                        }}
                      >
                        {benefit.title}
                      </div>
                      <div style={{ color: colors.textMuted, fontSize: "13px" }}>{benefit.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
