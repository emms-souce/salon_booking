"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Star, Scissors, Store } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const stats = [
    { title: "Réservations actives", value: "3", icon: Calendar },
    { title: "Prochains rendez-vous", value: "2", icon: Clock },
    { title: "Avis reçus", value: "5", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.name || user.email}
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenue dans votre tableau de bord
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Prochains rendez-vous</CardTitle>
              <CardDescription>Vos réservations à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Salon Belle Étoile</p>
                    <p className="text-sm text-gray-600">Coupe de cheveux</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">15 déc 2024</p>
                    <p className="text-sm text-gray-600">14:00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Coiffure Divine</p>
                    <p className="text-sm text-gray-600">Tresses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">18 déc 2024</p>
                    <p className="text-sm text-gray-600">10:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Accès rapide aux principales fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/salons">Trouver un salon</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/profile">Modifier mon profil</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/bookings">Voir mes réservations</Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/dashboard/salons">
                  <Store className="mr-2 h-4 w-4" />
                  Mes salons
                </Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/dashboard/salons/create">
                  <Scissors className="mr-2 h-4 w-4" />
                  Créer un salon
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}