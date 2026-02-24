import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BriefcaseBusiness, ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <>
      <section className="bg-primary py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-lg leading-relaxed text-primary-foreground/80">
            Join thousands of talents and companies already connecting through TalentBridge.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 px-8 text-foreground"
              asChild
            >
              <Link href="/auth/register">
                Create Free Account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/auth/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <BriefcaseBusiness className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">TalentBridge</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#opportunities" className="text-xs text-muted-foreground hover:text-foreground">
              Opportunities
            </a>
            <a href="#trainings" className="text-xs text-muted-foreground hover:text-foreground">
              Trainings
            </a>
            <a href="#how-it-works" className="text-xs text-muted-foreground hover:text-foreground">
              How It Works
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            {'© 2026 TalentBridge. All rights reserved.'}
          </p>
        </div>
      </footer>
    </>
  )
}
