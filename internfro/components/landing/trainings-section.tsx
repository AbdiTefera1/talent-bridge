"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { TrainingResponseDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, BarChart3, ArrowRight } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

function TrainingCard({ training }: { training: TrainingResponseDto }) {
  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="size-5 text-primary" />
        </div>
        <CardTitle className="text-base leading-snug text-card-foreground group-hover:text-primary transition-colors">
          {training.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {training.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BarChart3 className="size-3.5" />
            <span className="capitalize">{training.level.toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{training.durationHours}h</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {training.category}
          </Badge>
        </div>
        <div className="mt-3">
          {training.paid ? (
            <p className="text-sm font-semibold text-foreground">
              ${training.price.toLocaleString()}
            </p>
          ) : (
            <Badge variant="secondary" className="text-xs">Free</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function TrainingsSection() {
  const [trainings, setTrainings] = useState<TrainingResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    api
      .get<TrainingResponseDto[]>("/api/trainings")
      .then((data) => {
        setTrainings(data)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="trainings" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Training Programs
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Upskill with curated programs across categories and experience levels.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="text-muted-foreground">Unable to load training programs right now.</p>
          </div>
        ) : trainings.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <p className="text-muted-foreground">No training programs available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.slice(0, 6).map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        )}

        {trainings.length > 6 && (
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link href="/auth/register">
                View All Programs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
