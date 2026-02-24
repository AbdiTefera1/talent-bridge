"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { FolderOpen } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { OpportunityResponseDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CompanyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOpportunities = useCallback(async () => {
    try {
      console.log("Before fetch data")
      const data = await api.get<OpportunityResponseDto[]>("/api/opportunities/my")
      console.log("Oppotunity data: ", data)
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Opportunities
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your posted internships and gigs
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/company/create">Create New</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderOpen className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No opportunities yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Create your first opportunity to start receiving applications
          </p>
          <Button asChild>
            <Link href="/dashboard/company/create">Create Opportunity</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="font-medium">{opp.title}</TableCell>
                  <TableCell>
                    <Badge variant={opp.type === "INTERNSHIP" ? "default" : "secondary"}>
                      {opp.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{opp.location}</TableCell>
                  <TableCell className="text-muted-foreground">{opp.requiredExperience}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/company/applications?opportunityId=${opp.id}`}>
                        View Applications
                      </Link>
                    </Button>
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
