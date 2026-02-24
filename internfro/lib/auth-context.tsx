"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UserRole, AuthResponse, LoginRequest, RegisterRequest } from "@/types"
import { api } from "@/lib/api"

interface AuthContextType {
  token: string | null
  role: UserRole | null
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedRole = localStorage.getItem("role") as UserRole | null
    if (savedToken && savedRole) {
      setToken(savedToken)
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  const redirectByRole = useCallback(
    (userRole: UserRole) => {
      switch (userRole) {
        case "TALENT":
          router.push("/dashboard/talent")
          break
        case "COMPANY":
          router.push("/dashboard/company")
          break
        case "ADMIN":
          router.push("/dashboard/admin")
          break
      }
    },
    [router]
  )

  const login = async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>("/api/auth/login", data)
    localStorage.setItem("token", response.token)
    localStorage.setItem("role", response.role)
    setToken(response.token)
    setRole(response.role as UserRole)
    redirectByRole(response.role as UserRole)
  }

  const register = async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>("/api/auth/register", data)
    localStorage.setItem("token", response.token)
    localStorage.setItem("role", response.role)
    setToken(response.token)
    setRole(response.role as UserRole)
    redirectByRole(response.role as UserRole)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setToken(null)
    setRole(null)
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
