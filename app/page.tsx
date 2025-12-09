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
import {HeroMain} from "@/components/HeroMain"
import { HeroWorkflow } from "@/components/hero-workflow"
import { HeroFeatures } from "@/components/hero-features"
export default function Home() {
  return (
    <main className="min-h-screen bg-background" style={{fontFamily:"Poppins, Sans-serif", lineHeight:1}}>
    
      <Hero />
      <Overview />
      <WhyMatters />
      <UseCases />
      <HeroMain/>
      <HeroWorkflow/>
    
     
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
