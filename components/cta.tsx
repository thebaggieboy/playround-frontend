"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-6"
        >
          Ready to Transform Your <span className="text-primary">Financial Analysis?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto"
        >
          Join finance professionals who are already using Playground to make better decisions faster.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 h-12 text-base font-semibold transition-smooth-lg hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg px-8 h-12 text-base font-semibold border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-smooth-lg bg-transparent hover:shadow-md w-full sm:w-auto"
          >
            Schedule Demo
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
