"use client"

import { MapPin, DollarSign, Clock, Wifi, BriefcaseBusiness } from "lucide-react"
import type { OpportunityResponseDto } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface OpportunityCardProps {
  opportunity: OpportunityResponseDto
  onApply?: (id: number) => void
  showApply?: boolean
}

export function OpportunityCard({ opportunity, onApply, showApply = true }: OpportunityCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base leading-snug">{opportunity.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{opportunity.companyName}</p>
          </div>
          <Badge variant={opportunity.type === "INTERNSHIP" ? "default" : "secondary"}>
            {opportunity.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {opportunity.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="size-3" />
            <span>{opportunity.salary} {opportunity.currency}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BriefcaseBusiness className="size-3" />
            <span>{opportunity.requiredExperience}</span>
          </div>
          {opportunity.remote && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Wifi className="size-3" />
              <span>Remote</span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span>Due {new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {opportunity.requiredSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      {showApply && onApply && (
        <CardFooter className="pt-0">
          <Button className="w-full" size="sm" onClick={() => onApply(opportunity.id)}>
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
