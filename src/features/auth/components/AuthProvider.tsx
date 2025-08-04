'use client'

import { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

// Better Auth n'a pas besoin de Provider global comme NextAuth
export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>
}