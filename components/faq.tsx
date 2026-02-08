"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "Can I use Playground for personal finance?",
    answer:
      "Yes! Playground is designed for both professional finance teams and individuals. Our Starter plan is perfect for personal use.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption and comply with SOC 2 Type II standards to ensure your financial data is always secure.",
  },
  {
    question: "Can I export my models?",
    answer:
      "Yes, all plans include export functionality. Starter includes CSV, while Professional and Enterprise include PDF and Excel exports.",
  },
  {
    question: "Do you offer API access?",
    answer:
      "API access is available on our Enterprise plan. Contact our sales team for more information about custom integrations.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Decorative pigments */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#e8e4df]" />
      <div className="absolute -top-16 right-1/4 w-64 h-64 rounded-full bg-[#f5f0ea]/40 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500">
            Find answers to common questions about Playground
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-[#e8e4df] rounded-xl overflow-hidden bg-[#faf9f7] shadow-sm shadow-[#e8e4df]/30 hover:border-blue-200 transition-all duration-300"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f5f0ea]/50 transition-colors duration-300"
              >
                <span className="font-semibold text-slate-900 text-left">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 border-t border-[#e8e4df] bg-[#f5f0ea]/30">
                  <p className="text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
