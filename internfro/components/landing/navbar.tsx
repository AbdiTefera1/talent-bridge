"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BriefcaseBusiness, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { token, role } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardHref = role === "COMPANY"
    ? "/dashboard/company"
    : role === "ADMIN"
      ? "/dashboard/admin"
      : "/dashboard/talent"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
            <BriefcaseBusiness className="size-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">TalentBridge</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#opportunities" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Opportunities
          </a>
          <a href="#trainings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Trainings
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <Button asChild>
              <Link href={dashboardHref}>Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#opportunities"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Opportunities
            </a>
            <a
              href="#trainings"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Trainings
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              How It Works
            </a>
            <div className="flex flex-col gap-2 pt-2">
              {token ? (
                <Button asChild>
                  <Link href={dashboardHref}>Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/auth/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
