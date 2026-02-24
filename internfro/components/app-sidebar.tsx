"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  Search,
  FileText,
  GraduationCap,
  BookOpen,
  Plus,
  FolderOpen,
  Inbox,
  Building2,
  Users,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/types"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const talentNav = [
  {
    label: "Explore",
    items: [
      { title: "Browse Opportunities", href: "/dashboard/talent", icon: Search },
      { title: "Browse Trainings", href: "/dashboard/talent/trainings", icon: GraduationCap },
    ],
  },
  {
    label: "My Activity",
    items: [
      { title: "My Applications", href: "/dashboard/talent/applications", icon: FileText },
      { title: "My Enrollments", href: "/dashboard/talent/enrollments", icon: BookOpen },
    ],
  },
]

const companyNav = [
  {
    label: "Opportunities",
    items: [
      { title: "Create Opportunity", href: "/dashboard/company/create", icon: Plus },
      { title: "My Opportunities", href: "/dashboard/company", icon: FolderOpen },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Applications", href: "/dashboard/company/applications", icon: Inbox },
      { title: "Company Profile", href: "/dashboard/company/profile", icon: Building2 },
    ],
  },
]

const adminNav = [
  {
    label: "Administration",
    items: [
      { title: "Users", href: "/dashboard/admin", icon: Users },
    ],
  },
]

function getNavForRole(role: UserRole | null) {
  switch (role) {
    case "TALENT":
      return talentNav
    case "COMPANY":
      return companyNav
    case "ADMIN":
      return adminNav
    default:
      return []
  }
}

function getRoleLabel(role: UserRole | null) {
  switch (role) {
    case "TALENT":
      return "Talent"
    case "COMPANY":
      return "Company"
    case "ADMIN":
      return "Administrator"
    default:
      return "User"
  }
}

export function AppSidebar() {
  const pathname = usePathname()
  const { role, logout } = useAuth()
  const navGroups = getNavForRole(role)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
                  <Briefcase className="size-4 text-sidebar-primary-foreground" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TalentBridge</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {getRoleLabel(role)}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className="mx-2 w-auto bg-sidebar-border" />
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Sign out">
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
