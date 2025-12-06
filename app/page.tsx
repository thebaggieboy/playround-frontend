import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Overview } from "@/components/overview"
import { WhyMatters } from "@/components/why-matters"
import { UseCases } from "@/components/use-cases"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Overview />
      <WhyMatters />
      <UseCases />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
