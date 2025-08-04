import { NextRequest } from "next/server"
import { auth } from "@/lib/better-auth"

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthSession {
  user: SessionUser
  session: {
    id: string
    userId: string
    expiresAt: Date
  }
}

// Pour les API routes avec NextRequest
export async function getAuthSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    const headers = request?.headers || new Headers()
    const session = await auth.api.getSession({
      headers: headers,
    })
    
    if (!session) {
      return null
    }
    
    return session as AuthSession
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error)
    return null
  }
}

// Pour les server actions (sans paramètres)
export async function getAuthSessionServer(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    })
    
    if (!session) {
      return null
    }
    
    return session as AuthSession
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error)
    return null
  }
}

export function requireAuth(session: AuthSession | null): AuthSession {
  if (!session) {
    throw new Error("Non authentifié")
  }
  return session
}