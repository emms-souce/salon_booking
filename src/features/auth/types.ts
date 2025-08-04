export interface User {
  id: string
  email: string
  name?: string | null
  phone?: string | null
  role: 'USER' | 'ADMIN' | 'SALON_OWNER'
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  image?: string | null
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  name: string
  phone?: string
  password: string
  confirmPassword: string
}