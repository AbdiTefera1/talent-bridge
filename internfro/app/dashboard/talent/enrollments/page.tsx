"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { BookOpen, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import type { TrainingEnrollmentDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function TalentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<TrainingEnrollmentDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchEnrollments = useCallback(async () => {
    try {
      const data = await api.get<TrainingEnrollmentDto[]>("/api/trainings/my-enrollments")
      setEnrollments(data)
    } catch {
      toast.error("Failed to load enrollments")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  async function handleUpdateProgress(enrollmentId: number, progressPercentage: number) {
    setUpdatingId(enrollmentId)
    const completed = progressPercentage >= 100
    try {
      await api.patch(`/api/trainings/enrollments/${enrollmentId}/progress`, {
        progressPercentage,
        completed,
      })
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId ? { ...e, progressPercentage, completed } : e
        )
      )
      toast.success("Progress updated!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update progress")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Enrollments
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your training progress
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No enrollments yet</h3>
          <p className="text-sm text-muted-foreground">
            Browse trainings and enroll in a program to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{enrollment.trainingTitle}</CardTitle>
                  <Badge variant={enrollment.completed ? "default" : "secondary"}>
                    {enrollment.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{enrollment.progressPercentage}%</span>
                  </div>
                  <Progress value={enrollment.progressPercentage} className="h-2" />
                  {!enrollment.completed && (
                    <div className="flex items-center gap-4 pt-2">
                      <Slider
                        defaultValue={[enrollment.progressPercentage]}
                        max={100}
                        step={5}
                        className="flex-1"
                        onValueCommit={(value) =>
                          handleUpdateProgress(enrollment.id, value[0])
                        }
                      />
                      {updatingId === enrollment.id && (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateProgress(enrollment.id, 100)}
                        disabled={updatingId === enrollment.id}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
