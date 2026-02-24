"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/auth/login")
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  if (!token) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
