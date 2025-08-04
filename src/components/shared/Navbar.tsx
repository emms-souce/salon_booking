"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/features/auth/components/UserNav"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoadingAuth } = useAuth()

  const navigation = [
    { name: "Salons", href: "/salons" },
    { name: "Services", href: "/services" },
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
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <UserNav />
            </div>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden border-t border-gray-200 transition-all duration-200 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pb-3 pt-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isLoadingAuth && user && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  Tableau de bord
                </div>
              </Link>
            )}
          </div>
          <div className="mt-4 px-3">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
}