import { User } from "@prisma/client"

export interface ExtendedUser extends User {
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  phone?: string | null
  bio?: string | null
  address?: string | null
  role: "USER" | "ADMIN" | "SALON_OWNER"
  createdAt: Date
}

export interface BetterAuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  phone?: string | null
  bio?: string | null
  address?: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}