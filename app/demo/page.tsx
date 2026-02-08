"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function DemoPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        country: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const features = [
    "Advanced financial modeling with real-time calculations",
    "Interactive dashboards for revenue forecasting",
    "Multi-scenario budget analysis and planning",
    "Comprehensive reporting and data export",
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Split Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left Side - Solid dark blue background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-[#0f1b3d] p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a3264]/40 rounded-full -mr-48 -mt-48 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#162d5a]/50 rounded-full -ml-36 -mb-36 blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-blue-300 text-sm font-semibold tracking-wide uppercase mb-4">
                CONTACT US TO SCHEDULE A LIVE DEMO
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight text-balance">
                Discover how Playground simplifies planning, analytics and
                reporting.
              </h1>
            </motion.div>

            <motion.ul
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-lg">{feature}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 lg:p-12 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full">
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Schedule Your Demo
              </h2>
              <p className="text-slate-500">
                Contact us for a demonstration tailored to your requirements.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-2"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="font-semibold text-green-900">Thank you!</h3>
                <p className="text-green-800 text-sm">
                  {"We'll be in touch within 24 hours."}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-900"
                    >
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-900"
                    >
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-900"
                    >
                      Work email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-slate-900"
                    >
                      Work phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="company"
                      className="text-sm font-medium text-slate-900"
                    >
                      Company name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                      placeholder="Your Company"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-slate-900"
                    >
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-900"
                    >
                      <option value="">- Please Select Country -</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                      <option value="de">Germany</option>
                      <option value="fr">France</option>
                      <option value="sg">Singapore</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Schedule Demo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                <p className="text-xs text-slate-500 text-center">
                  {"We'll contact you within 24 hours to confirm your preferred demo time."}
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              {"What You'll Discover"}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              During your personalized demo, explore how Playground transforms
              financial planning and analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Real-Time Models",
                desc: "Dynamic financial models that update instantly",
              },
              {
                title: "Scenario Planning",
                desc: "Compare multiple outcomes with ease",
              },
              {
                title: "Advanced Analytics",
                desc: "Deep insights into your financial data",
              },
              {
                title: "Custom Reports",
                desc: "Professional reports in minutes, not hours",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-3 hover:border-blue-300 transition-colors duration-200"
              >
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
