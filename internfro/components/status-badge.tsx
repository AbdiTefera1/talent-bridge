import type { ApplicationStatus } from "@/types"
import { Badge } from "@/components/ui/badge"

const statusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  SHORTLISTED: { label: "Shortlisted", variant: "default" },
  ACCEPTED: { label: "Accepted", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  WITHDRAWN: { label: "Withdrawn", variant: "outline" },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const }
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}
