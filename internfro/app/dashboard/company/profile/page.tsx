"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Building2, Globe, MapPin, Briefcase } from "lucide-react"
import { api } from "@/lib/api"
import type { CompanyProfile } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.get<CompanyProfile>("/api/company/profile")
      setProfile(data)
    } catch {
      toast.error("Failed to load company profile")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="mb-4 size-12 text-muted-foreground/40" />
        <h3 className="text-lg font-medium text-foreground">No profile found</h3>
        <p className="text-sm text-muted-foreground">
          Your company profile has not been set up yet.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Company Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Your public company information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            {profile.companyName}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">{profile.description}</p>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Industry:</span>
              <span className="font-medium text-foreground">{profile.industry}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium text-foreground">{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:col-span-2">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Website:</span>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {profile.website}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
