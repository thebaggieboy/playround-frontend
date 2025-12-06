"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { CheckCircle2 } from "lucide-react"

export function WhyMatters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const benefits = ["Accuracy of forecasts", "Decision-making", "Team efficiency", "Collaboration and transparency"]

  return (
    <section ref={ref} id="why" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-primary/5 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.95, x: -20 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 md:h-full min-h-96"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-2xl overflow-hidden border border-primary/20">
              <img
                src="/team-collaboration-and-financial-analysis-meeting.jpg"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why This <span className="text-primary">Matters</span>
            </h2>

            <div className="bg-card rounded-2xl p-8 md:p-10 border border-border hover:border-primary/30 transition-smooth-lg hover:shadow-lg hover:-translate-y-1 group">
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed font-medium group-hover:text-foreground transition-smooth">
                Our goal is to empower finance teams with flexible tools to customize, visualize, and interpret complex
                models easily.
              </p>

              <div className="space-y-4">
                <p className="text-foreground font-semibold">This improves:</p>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3 group/item transition-smooth"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-smooth-lg" />
                      <span className="text-foreground/80 group-hover/item:text-foreground transition-smooth group-hover/item:translate-x-1">
                        {benefit}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
