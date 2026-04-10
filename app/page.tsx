import { Hero } from "@/components/hero"
import { WhyMatters } from "@/components/why-matters"
import { UseCases } from "@/components/use-cases"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { HeroMain } from "@/components/HeroMain"
import { HeroWorkflow } from "@/components/hero-workflow"
import { TrustedBy } from "@/components/trusted-by"
import { PlatformCapabilities } from "@/components/platform-capabilities"
import { IntegrationEcosystem } from "@/components/integration-ecosystem"
import { FeatureShowcase } from "@/components/feature-showcase"
import { ComparisonSection } from "@/components/comparison-section"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Playground | AI-Powered Financial Intelligence",
  description: "Create, analyze, and automate complex financial models and reports in minutes using Playground's intelligent financial platform.",
  keywords: ["financial modeling", "AI finance", "financial reports", "business intelligence", "automated models", "startup finance"],
  openGraph: {
    title: "Playground | AI-Powered Financial Intelligence",
    description: "Create, analyze, and automate complex financial models and reports in minutes using Playground's intelligent financial platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground | AI-Powered Financial Intelligence",
    description: "Create, analyze, and automate complex financial models and reports in minutes using Playground's intelligent financial platform.",
  }
}

export default function Home() {
  return (
    <main className="min-h-screen font-sans relative overflow-x-hidden bg-[#030712] text-white">
      {/* Sleek Global Background Orbs */}
      <div className="absolute top-0 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[80px] sm:blur-[128px] pointer-events-none opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-60 sm:w-80 md:w-[30rem] h-60 sm:h-80 md:h-[30rem] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[80px] sm:blur-[128px] pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-[40rem] h-64 sm:h-80 md:h-[40rem] bg-violet-600/10 rounded-full mix-blend-screen filter blur-[80px] sm:blur-[120px] pointer-events-none opacity-30" />

      <div className="relative z-10 w-full">
        <Hero />
        <TrustedBy />
        <WhyMatters />
        <UseCases />
        <PlatformCapabilities />
        <FeatureShowcase />
        <IntegrationEcosystem />
        <ComparisonSection />
        <HeroMain />
        <HeroWorkflow />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
