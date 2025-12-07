"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Users, Zap, Target } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-card"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12 " >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">About Playground</h1>
              <p className="text-lg text-muted-foreground">Empowering financial professionals worldwide</p>
            </div>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-md transition-shadow"
              >
                Back Home
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16" style={{background: "linear-gradient(to right bottom, rgb(26, 38, 84), rgb(26, 38, 84))", fontFamily:"Poppins, Sans-serif"}}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
          {/* Mission Section */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-foreground">Our Mission</h2>
              <p className="text-sm text-white leading-relaxed">
                We believe that sophisticated financial modeling should be accessible to everyone. Playground was built
                to democratize financial analysis, giving professionals the tools they need to make confident,
                data-driven decisions.
              </p>
              <p className="text-lg text-xs text-white leading-relaxed">
                Whether you're forecasting revenue, analyzing budgets, or exploring scenarios, our platform provides the
                flexibility and power you need to succeed.
              </p>
            </div>
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-secondary to-secondary/50 rounded-lg p-12 h-full flex items-center justify-center border border-border"
            >
            <img src="/abb.jpg" alt="Team collaboration" className="w-full h-full object-cover" />
            </motion.div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white text-foreground">Why Choose Playground?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Real-time calculations and instant insights for rapid decision-making.",
                },
                {
                  icon: Users,
                  title: "Collaboration Ready",
                  description: "Share models and insights with your team seamlessly and securely.",
                },
                {
                  icon: Target,
                  title: "Purpose Built",
                  description: "Designed specifically for financial professionals by financial experts.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-lg p-8 space-y-4 hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Features Grid */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl text-white lg:text-4xl font-bold text-foreground">Key Features</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                "Advanced financial modeling templates",
                "Real-time data synchronization",
                "Customizable dashboards and reports",
                "Secure cloud storage and collaboration",
                "API access for integrations",
                "Advanced scenario analysis tools",
                "Multi-user permission management",
                "Audit logs and version control",
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-foreground text-muted-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stats Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white text-foreground">By The Numbers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: "10K+", label: "Active Users" },
                { number: "500K+", label: "Models Created" },
                { number: "99.9%", label: "Uptime" },
                { number: "24/7", label: "Support" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-card border border-border rounded-lg p-8 text-center space-y-2 hover:shadow-md transition-shadow"
                >
                  <p className="text-4xl font-bold text-primary">{stat.number}</p>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            variants={itemVariants}
            className="bg-primary text-primary-foreground rounded-lg p-8 lg:p-12 text-center space-y-6"
          >
            <h2 className="text-2xl lg:text-3xl font-bold ">Join the Playground Community</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Start building smarter financial models today. Get started with our free trial.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
                <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  Get Started Free
                </button>
              </Link>
            </motion.div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  )
}
