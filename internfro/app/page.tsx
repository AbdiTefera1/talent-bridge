"use client"

import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { OpportunitiesSection } from "@/components/landing/opportunities-section"
import { TrainingsSection } from "@/components/landing/trainings-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <main>
        <Hero />
        <OpportunitiesSection />
        <TrainingsSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
