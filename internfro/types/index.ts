// ============ Auth ============
export type UserRole = "TALENT" | "COMPANY" | "ADMIN"

export interface AuthResponse {
  token: string
  role: UserRole
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role: UserRole
}

// ============ User ============
export interface User {
  id: number
  fullName: string
  email: string
  role: UserRole
  active: boolean
  verified: boolean
}

// ============ Opportunity ============
export type OpportunityType = "INTERNSHIP" | "GIG"
export type ExperienceLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type OpportunityStatus = "OPEN" | "CLOSED" | "DRAFT"

export interface OpportunityResponseDto {
  id: number
  companyName: string
  title: string
  description: string
  type: OpportunityType
  salary: number
  currency: string
  location: string
  requiredExperience: ExperienceLevel
  status: OpportunityStatus
  deadline: string
  requiredSkills: string[]
  paid: boolean
  remote: boolean
}

export interface OpportunityCreateDto {
  title: string
  description: string
  type: OpportunityType
  salary: number
  currency: string
  location: string
  requiredExperience: ExperienceLevel
  deadline: string
  requiredSkills: string[]
  paid: boolean
  remote: boolean
}

// ============ Application ============
export type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"

export interface ApplicationCreateDto {
  opportunityId: number
  coverLetter: string
}

export interface ApplicationResponseDto {
  id: number
  opportunityId: number
  opportunityTitle: string
  companyName: string
  coverLetter: string
  status: ApplicationStatus
  feedback: string
  createdAt: string
}

export interface ApplicationStatusUpdateDto {
  status: ApplicationStatus
  feedback: string
}

// ============ Training ============
export interface TrainingResponseDto {
  id: number
  title: string
  description: string
  category: string
  level: string
  price: number
  durationHours: number
  paid: boolean
}

export interface TrainingCreateDto {
  title: string
  description: string
  category: string
  level: string
  price: number
  durationHours: number
  paid: boolean
}

export interface TrainingEnrollmentDto {
  id: number
  trainingId: number
  trainingTitle: string
  progressPercentage: number
  completed: boolean
  enrolledAt: string
}

export interface EnrollmentProgressUpdateDto {
  progressPercentage: number
  completed: boolean
}

// ============ Company Profile ============
export interface CompanyProfile {
  id: number
  companyName: string
  industry: string
  website: string
  description: string
  location: string
}
