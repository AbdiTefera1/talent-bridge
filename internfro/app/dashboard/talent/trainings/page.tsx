"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { GraduationCap, Clock, DollarSign, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import type { TrainingResponseDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TalentTrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState<number | null>(null)

  const fetchTrainings = useCallback(async () => {
    try {
      const data = await api.get<TrainingResponseDto[]>("/api/trainings")
      setTrainings(data)
    } catch {
      toast.error("Failed to load trainings")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrainings()
  }, [fetchTrainings])

  async function handleEnroll(trainingId: number) {
    setEnrollingId(trainingId)
    try {
      await api.post(`/api/trainings/${trainingId}/enroll`)
      toast.success("Enrolled successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to enroll")
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Browse Trainings
        </h1>
        <p className="text-sm text-muted-foreground">
          Explore training programs to boost your skills
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : trainings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <GraduationCap className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No trainings available</h3>
          <p className="text-sm text-muted-foreground">
            Check back later for new training programs
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training) => (
            <Card key={training.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{training.title}</CardTitle>
                  <Badge variant="outline">{training.level}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{training.category}</p>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                  {training.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{training.durationHours}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="size-3" />
                    <span>{training.paid ? `$${training.price}` : "Free"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => handleEnroll(training.id)}
                  disabled={enrollingId === training.id}
                >
                  {enrollingId === training.id && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Enroll
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
