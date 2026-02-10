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
import { LiveDashboardPreview } from "@/components/live-dashboard-preview"
import { ComparisonSection } from "@/components/comparison-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <Hero />
      <TrustedBy />
      <WhyMatters />
      <UseCases />
      <PlatformCapabilities />
      <LiveDashboardPreview />
      <IntegrationEcosystem />
      <ComparisonSection />
      <HeroMain />
      <HeroWorkflow />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
