"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function DashboardButton() {
  const { user, isLoadingAuth } = useAuth()

  if (isLoadingAuth || !user) {
    return null
  }

  return (
    <div className="mb-6">
      <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Accéder à mon tableau de bord
        </Link>
      </Button>
    </div>
  )
}