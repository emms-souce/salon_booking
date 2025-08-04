import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/better-auth'

// Routes protégées - nécessitent une authentification
const protectedRoutes = ['/dashboard', '/profile', '/bookings', '/salons/manage']

// Routes d'authentification - rediriger si déjà connecté
const authRoutes = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Vérifier si c'est une route d'authentification
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Récupérer la session via auth() pour les routes protégées
  if (isProtectedRoute || isAuthRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    
    // Si la route est protégée et pas de session, rediriger vers login
    if (isProtectedRoute && !session) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Si c'est une route d'authentification et l'utilisateur est connecté, rediriger vers dashboard
    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}