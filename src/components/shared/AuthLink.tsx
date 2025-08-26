"use client"

import Link from "next/link"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

interface AuthLinkProps {
  href: string
  children: ReactNode
  className?: string
  requireAuth?: boolean
}

/**
 * Composant Link intelligent qui vérifie l'authentification
 * Si l'utilisateur n'est pas connecté et que requireAuth est true,
 * il redirige vers la page de connexion avec l'URL de callback
 */
export function AuthLink({ href, children, className, requireAuth = true }: AuthLinkProps) {
  const { user, isLoadingAuth } = useAuth()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (requireAuth && !isLoadingAuth && !user) {
      e.preventDefault()
      // Créer une URL de redirection avec callback
      const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(href)}`
      router.push(loginUrl)
    }
  }

  // Si pas besoin d'auth ou si utilisateur connecté, comportement normal
  if (!requireAuth || user) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  // Si authentification requise mais utilisateur non connecté
  return (
    <span onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  )
}