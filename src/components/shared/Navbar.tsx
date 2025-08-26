"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/features/auth/components/UserNav"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useActiveRoute } from "@/hooks/useActiveRoute"
import { LucideIcon } from "lucide-react"

interface NavigationItem {
  name: string
  href: string
  authenticated?: boolean
  icon?: LucideIcon
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoadingAuth } = useAuth()
  const { isActive } = useActiveRoute()

  const navigation: NavigationItem[] = [
    { name: "Salons", href: "/salons" },
    { name: "Services", href: "/services" },
  ]

  const userNavigation: NavigationItem[] = [
    { name: "Tableau de bord", href: "/dashboard", authenticated: true, icon: LayoutDashboard },
    { name: "Mes Réservations", href: "/dashboard/bookings", authenticated: true },
    { name: "Mes Salons", href: "/dashboard/salons", authenticated: true },
  ]

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl brand-title">
                Salon Cameroun
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    isActive(item.href)
                      ? "text-orange-600 font-bold after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-orange-600"
                      : "text-gray-700 hover:text-black"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {!isLoadingAuth && user && (
                <>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors relative",
                        isActive(item.href)
                          ? "text-orange-600 font-bold after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-orange-600"
                          : "text-gray-700 hover:text-black"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <UserNav />
              </div>
              
              {/* Mobile menu button - Burger moderne */}
              <button
                type="button"
                className="md:hidden relative p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-300 group"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300 ease-out",
                    isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                  )} />
                  <span className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300 ease-out",
                    isOpen ? "opacity-0" : "opacity-100"
                  )} />
                  <span className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300 ease-out",
                    isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                  )} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsOpen(false)} />

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out z-50 md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              type="button"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="px-6">
              {/* Navigation principale */}
              <div className="space-y-1 mb-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 group relative",
                      isActive(item.href)
                        ? "text-orange-600 bg-orange-50 font-bold border-l-4 border-orange-600 after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-orange-600"
                        : "text-gray-700 hover:text-black hover:bg-gray-50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={cn(
                      "transition-transform duration-200",
                      !isActive(item.href) && "group-hover:translate-x-1"
                    )}>
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Navigation utilisateur */}
              {!isLoadingAuth && user && (
                <div className="space-y-1 mb-8">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Mon compte
                  </h3>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 group relative",
                        isActive(item.href)
                          ? "text-orange-600 bg-orange-50 font-bold border-l-4 border-orange-600 after:content-[''] after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-orange-600"
                          : "text-gray-700 hover:text-black hover:bg-gray-50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon && (
                        <item.icon className={cn(
                          "h-5 w-5 mr-3 transition-colors duration-200",
                          isActive(item.href) ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"
                        )} />
                      )}
                      <span className={cn(
                        "transition-transform duration-200",
                        !isActive(item.href) && "group-hover:translate-x-1"
                      )}>
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>

          {/* Footer avec UserNav */}
          <div className="border-t border-gray-200 p-6">
            <UserNav />
          </div>
        </div>
      </div>
    </>
  )
}