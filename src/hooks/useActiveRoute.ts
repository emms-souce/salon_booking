"use client"

import { usePathname } from "next/navigation"

export function useActiveRoute() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    // Pour la page d'accueil
    if (href === "/" && pathname === "/") {
      return true
    }
    
    // Pour les autres routes, vérifier si le pathname commence par href
    if (href !== "/" && pathname.startsWith(href)) {
      return true
    }
    
    return false
  }

  return { isActive, pathname }
}