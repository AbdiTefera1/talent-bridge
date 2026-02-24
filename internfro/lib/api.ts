const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        window.location.href = "/auth/login"
      }
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      )
    }

    const text = await response.text()
    return text ? JSON.parse(text) : ({} as T)
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient(API_BASE_URL)
