"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { OpportunityResponseDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, DollarSign, BriefcaseBusiness, Wifi, Clock, ArrowRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

function OpportunityListCard({ opp }: { opp: OpportunityResponseDto }) {
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base leading-snug text-card-foreground group-hover:text-primary transition-colors">
              {opp.title}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{opp.companyName}</p>
          </div>
          <Badge variant={opp.type === "INTERNSHIP" ? "default" : "secondary"} className="shrink-0">
            {opp.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {opp.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{opp.location}</span>
          </div>
          {opp.salary > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="size-3.5" />
              <span>{opp.salary.toLocaleString()} {opp.currency}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BriefcaseBusiness className="size-3.5" />
            <span className="capitalize">{opp.requiredExperience.toLowerCase()}</span>
          </div>
          {opp.remote && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wifi className="size-3.5" />
              <span>Remote</span>
            </div>
          )}
          {opp.deadline && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              <span>Due {new Date(opp.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {opp.requiredSkills && opp.requiredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {opp.requiredSkills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs font-normal">
                {skill}
              </Badge>
            ))}
            {opp.requiredSkills.length > 5 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{opp.requiredSkills.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function OpportunitiesSection() {
  const [opportunities, setOpportunities] = useState<OpportunityResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .get<OpportunityResponseDto[]>("/api/opportunities")
      .then((data) => {
        setOpportunities(data)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const internships = opportunities.filter((o) => o.type === "INTERNSHIP" && o.status === "OPEN")
  const gigs = opportunities.filter((o) => o.type === "GIG" && o.status === "OPEN")
  const allOpen = opportunities.filter((o) => o.status === "OPEN")

  return (
    <section id="opportunities" className="bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Browse Opportunities
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Discover internships and gig positions from verified companies, curated just for you.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="text-muted-foreground">Unable to load opportunities right now. Please check back later.</p>
          </div>
        ) : allOpen.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="text-muted-foreground">No opportunities available at the moment.</p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-8 flex justify-center">
              <TabsList>
                <TabsTrigger value="all">
                  All ({allOpen.length})
                </TabsTrigger>
                <TabsTrigger value="internships">
                  Internships ({internships.length})
                </TabsTrigger>
                <TabsTrigger value="gigs">
                  Gigs ({gigs.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allOpen.slice(0, 6).map((opp) => (
                  <OpportunityListCard key={opp.id} opp={opp} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="internships">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {internships.slice(0, 6).map((opp) => (
                  <OpportunityListCard key={opp.id} opp={opp} />
                ))}
              </div>
              {internships.length === 0 && (
                <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
                  <p className="text-muted-foreground">No internships available right now.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="gigs">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {gigs.slice(0, 6).map((opp) => (
                  <OpportunityListCard key={opp.id} opp={opp} />
                ))}
              </div>
              {gigs.length === 0 && (
                <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
                  <p className="text-muted-foreground">No gigs available right now.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {allOpen.length > 6 && (
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/auth/register">
                View All Opportunities
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
