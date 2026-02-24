"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Inbox, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import type { ApplicationResponseDto, ApplicationStatus, OpportunityResponseDto } from "@/types"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CompanyApplicationsPage() {
  const searchParams = useSearchParams()
  const opportunityId = searchParams.get("opportunityId")

  const [applications, setApplications] = useState<ApplicationResponseDto[]>([])
  const [opportunities, setOpportunities] = useState<OpportunityResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOppId, setSelectedOppId] = useState<string>(opportunityId || "")

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("PENDING")
  const [feedback, setFeedback] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await api.get<OpportunityResponseDto[]>("/api/opportunities/my")
      setOpportunities(data)
      if (!selectedOppId && data.length > 0) {
        setSelectedOppId(String(data[0].id))
      }
    } catch {
      toast.error("Failed to load opportunities")
    }
  }, [selectedOppId])

  const fetchApplications = useCallback(async (oppId: string) => {
    if (!oppId) return
    setIsLoading(true)
    try {
      const data = await api.get<ApplicationResponseDto[]>(
        `/api/applications/opportunity/${oppId}`
      )
      setApplications(data)
    } catch {
      toast.error("Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  useEffect(() => {
    if (selectedOppId) {
      fetchApplications(selectedOppId)
    } else {
      setIsLoading(false)
    }
  }, [selectedOppId, fetchApplications])

  function openUpdateDialog(appId: number, currentStatus: ApplicationStatus) {
    setSelectedAppId(appId)
    setNewStatus(currentStatus)
    setFeedback("")
    setUpdateDialogOpen(true)
  }

  async function handleUpdateStatus() {
    if (!selectedAppId) return
    setIsUpdating(true)
    try {
      await api.patch(`/api/applications/${selectedAppId}/status`, {
        status: newStatus,
        feedback,
      })
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedAppId ? { ...a, status: newStatus, feedback } : a
        )
      )
      toast.success("Application status updated!")
      setUpdateDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Applications
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and manage applications for your opportunities
        </p>
      </div>

      <div className="max-w-xs">
        <Label className="mb-2 block text-sm font-medium">Select Opportunity</Label>
        <Select value={selectedOppId} onValueChange={setSelectedOppId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose an opportunity" />
          </SelectTrigger>
          <SelectContent>
            {opportunities.map((opp) => (
              <SelectItem key={opp.id} value={String(opp.id)}>
                {opp.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : !selectedOppId ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">Select an opportunity</h3>
          <p className="text-sm text-muted-foreground">
            Choose an opportunity above to view its applications
          </p>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No applications yet</h3>
          <p className="text-sm text-muted-foreground">
            No one has applied to this opportunity yet
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Cover Letter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.companyName || `Applicant #${app.id}`}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {app.coverLetter}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUpdateDialog(app.id, app.status)}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status and provide feedback to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={(val) => setNewStatus(val as ApplicationStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Feedback</Label>
              <Textarea
                placeholder="Provide feedback to the applicant..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 size-4 animate-spin" />}
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
