"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Users, ShieldCheck, ShieldOff, CheckCircle2, XCircle } from "lucide-react"
import { api } from "@/lib/api"
import type { User } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.get<User[]>("/api/admin/users")
      setUsers(data)
    } catch {
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  async function toggleVerify(userId: number, currentVerified: boolean) {
    try {
      await api.patch(`/api/admin/users/${userId}/verify?verified=${!currentVerified}`)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, verified: !currentVerified } : u))
      )
      toast.success(`User ${!currentVerified ? "verified" : "unverified"} successfully`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  async function toggleActive(userId: number, currentActive: boolean) {
    try {
      await api.patch(`/api/admin/users/${userId}/active?active=${!currentActive}`)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, active: !currentActive } : u))
      )
      toast.success(`User ${!currentActive ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage all registered users, verify accounts, and control access
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-medium text-foreground">No users found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? "Try adjusting your search" : "No users have registered yet"}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "default" : "destructive"}>
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.verified ? (
                      <CheckCircle2 className="size-4 text-chart-2" />
                    ) : (
                      <XCircle className="size-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => toggleVerify(user.id, user.verified)}
                            >
                              {user.verified ? (
                                <ShieldOff className="size-4" />
                              ) : (
                                <ShieldCheck className="size-4" />
                              )}
                              <span className="sr-only">
                                {user.verified ? "Unverify" : "Verify"}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.verified ? "Remove verification" : "Verify user"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={user.active ? "ghost" : "ghost"}
                              size="icon"
                              className="size-8"
                              onClick={() => toggleActive(user.id, user.active)}
                            >
                              {user.active ? (
                                <XCircle className="size-4 text-destructive" />
                              ) : (
                                <CheckCircle2 className="size-4 text-chart-2" />
                              )}
                              <span className="sr-only">
                                {user.active ? "Deactivate" : "Activate"}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.active ? "Deactivate user" : "Activate user"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
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
