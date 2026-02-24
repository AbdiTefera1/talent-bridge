import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)_0%,transparent_50%)] opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Now connecting talent across all industries
          </div>
          <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find your next
            <span className="text-primary"> opportunity</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
            Browse internships, gigs, and training programs from top companies. 
            Build your career with the right experience.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/auth/register">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#opportunities">Browse Opportunities</a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-border pt-10 md:mt-20">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground md:text-3xl">500+</p>
            <p className="mt-1 text-sm text-muted-foreground">Opportunities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground md:text-3xl">200+</p>
            <p className="mt-1 text-sm text-muted-foreground">Companies</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground md:text-3xl">50+</p>
            <p className="mt-1 text-sm text-muted-foreground">Training Programs</p>
          </div>
        </div>
      </div>
    </section>
  )
}
