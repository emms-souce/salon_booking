'use client'

import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/better-auth-client"
import { BetterAuthUser } from "@/types/auth"

type AuthUser = BetterAuthUser

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Utiliser le hook de session de Better Auth
  const { data: session, isPending: isLoadingAuth } = authClient.useSession()
  const user = session?.user as AuthUser | undefined

  const login = async (email: string, password: string, callbackUrl?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        const errorMessage = result.error.message || "Email ou mot de passe incorrect"
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      }

      // Attendre que la session soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Rafraîchir manuellement la session
      await authClient.getSession()
      
      toast.success("Connexion réussie")
      
      // Utiliser un délai pour s'assurer que la session est bien mise à jour
      setTimeout(() => {
        const redirectUrl = callbackUrl || "/dashboard"
        
        // Si on est sur une page d'authentification, forcer une redirection complète
        if (pathname.startsWith('/auth/')) {
          window.location.href = redirectUrl
        } else {
          router.push(redirectUrl)
        }
      }, 200)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion"
      console.error("Erreur de connexion:", err)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authClient.signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.name,
      })

      if (result.error) {
        const errorMessage = result.error.message || "Erreur lors de l'inscription"
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      }

      toast.success("Compte créé avec succès")
      // Connexion automatique après inscription
      await login(userData.email, userData.password)
      
      return { success: true, data: result.data }
    } catch (err) {
      const errorMessage = "Une erreur est survenue"
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authClient.signOut()
    router.push("/")
  }

  const updateProfile = async (data: Partial<{
    name?: string
    email?: string
    phone?: string
    image?: string
    bio?: string
    address?: string
  }>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil')
      }

      const result = await response.json()
      
      // Rafraîchir la session
      await authClient.getSession()
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      toast.error(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isLoadingAuth,
    login,
    register,
    logout,
    updateProfile,
  }
}