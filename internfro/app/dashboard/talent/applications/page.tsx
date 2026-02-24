"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { FileText } from "lucide-react"
import { api } from "@/lib/api"
import type { ApplicationResponseDto } from "@/types"
import { StatusBadge } from "@/components/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TalentApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchApplications = useCallback(async () => {
    try {
      const data = await api.get<ApplicationResponseDto[]>("/api/applications/my")
      setApplications(data)
    } catch {
      toast.error("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Track the status of your opportunity applications
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No applications yet</h3>
          <p className="text-sm text-muted-foreground">
            Browse opportunities and submit your first application
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Applied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.opportunityTitle}</TableCell>
                  <TableCell className="text-muted-foreground">{app.companyName}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {app.feedback || "No feedback yet"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
