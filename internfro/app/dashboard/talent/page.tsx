"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Search, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import type { OpportunityResponseDto } from "@/types"
import { OpportunityCard } from "@/components/opportunity-card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function TalentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [applyDialogOpen, setApplyDialogOpen] = useState(false)
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const fetchOpportunities = useCallback(async () => {
    try {
      const data = await api.get<OpportunityResponseDto[]>("/api/opportunities")
      setOpportunities(data)
    } catch {
      toast.error("Failed to load opportunities")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  function handleApplyClick(id: number) {
    setSelectedOpportunityId(id)
    setCoverLetter("")
    setApplyDialogOpen(true)
  }

  async function handleApplySubmit() {
    if (!selectedOpportunityId) return
    setIsApplying(true)
    try {
      await api.post("/api/applications", {
        opportunityId: selectedOpportunityId,
        coverLetter,
      })
      toast.success("Application submitted successfully!")
      setApplyDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application")
    } finally {
      setIsApplying(false)
    }
  }

  const filtered = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Browse Opportunities
        </h1>
        <p className="text-sm text-muted-foreground">
          Discover internships and gigs that match your skills
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, company, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No opportunities found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or check back later
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onApply={handleApplyClick}
            />
          ))}
        </div>
      )}

      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to Opportunity</DialogTitle>
            <DialogDescription>
              Write a cover letter to stand out from other applicants.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell the company why you're a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplySubmit} disabled={isApplying || !coverLetter.trim()}>
                {isApplying && <Loader2 className="mr-2 size-4 animate-spin" />}
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
