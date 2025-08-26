"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, LayoutDashboard, Calendar, Building2 } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function UserNav() {
  const { user, isLoadingAuth, logout } = useAuth()

  if (isLoadingAuth) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto justify-center">
          <Link href="/auth/login">Se connecter</Link>
        </Button>
        <Button size="sm" asChild className="w-full sm:w-auto justify-center">
          <Link href="/auth/register">S&apos;inscrire</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-medium">{user.name}</p>
            )}
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Tableau de bord</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/bookings" className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Mes Réservations</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/salons" className="cursor-pointer">
            <Building2 className="mr-2 h-4 w-4" />
            <span>Mes Salons</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600"
          onSelect={(event) => {
            event.preventDefault()
            logout()
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}