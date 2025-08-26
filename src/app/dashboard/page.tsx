"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  Star, 
  Scissors, 
  Store, 
  Users, 
  TrendingUp, 
  Plus,
  MapPin,
  Phone,
  Mail,
  Award,
  Target,
  Activity,
  ChevronRight,
  Eye,
  Edit,
  BarChart3
} from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface DashboardStats {
  totalBookings: number
  activeBookings: number
  totalSalons: number
  totalReviews: number
  averageRating: number
  monthlyGrowth: number
}

interface RecentBooking {
  id: string
  salonName: string
  serviceName: string
  date: string
  time: string
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeBookings: 0,
    totalSalons: 0,
    totalReviews: 0,
    averageRating: 0,
    monthlyGrowth: 0
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fonction pour formater l'heure de manière plus lisible
  const formatBookingTime = (timeString: string) => {
    if (!timeString || timeString === '00:00') {
      return 'Heure à confirmer'
    }
    
    // Si c'est déjà au format HH:MM, on l'améliore
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const min = minutes || '00'
    
    return `${hour}h${min !== '00' ? min : ''}`
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      
      try {
        // Récupérer les statistiques
        const statsResponse = await fetch('/api/dashboard/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Récupérer les réservations
        const bookingsResponse = await fetch('/api/dashboard/bookings')
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json()
          setRecentBookings(bookingsData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Conserver les données simulées en cas d'erreur
        setStats({
          totalBookings: 0,
          activeBookings: 0,
          totalSalons: 0,
          totalReviews: 0,
          averageRating: 0,
          monthlyGrowth: 0
        })
        setRecentBookings([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (!user) {
    return null
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const quickActions = [
    {
      title: "Trouver un salon",
      description: "Découvrez les meilleurs salons près de chez vous",
      href: "/salons",
      icon: MapPin,
      color: "bg-blue-500"
    },
    {
      title: "Mes réservations",
      description: "Gérez vos rendez-vous en cours et passés",
      href: "/dashboard/bookings",
      icon: Calendar,
      color: "bg-green-500"
    },
    {
      title: "Mes salons",
      description: "Administrez vos établissements",
      href: "/dashboard/salons",
      icon: Store,
      color: "bg-purple-500"
    },
    {
      title: "Créer un salon",
      description: "Ajoutez un nouveau salon à votre compte",
      href: "/dashboard/salons/create",
      icon: Plus,
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec salutation personnalisée */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Bonjour, {user.name?.split(' ')[0] || 'Utilisateur'} 👋
              </h1>
              <p className="text-lg text-gray-600">
                Voici un aperçu de votre activité aujourd&apos;hui
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Réservations totales</p>
                  <p className="text-3xl font-bold">{isLoading ? "..." : stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-200 mr-1" />
                <span className="text-sm text-blue-100">+{stats.monthlyGrowth}% ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Rendez-vous actifs</p>
                  <p className="text-3xl font-bold">{isLoading ? "..." : stats.activeBookings}</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
              <div className="mt-4">
                <Progress value={75} className="h-2 bg-green-400" />
                <span className="text-sm text-green-100 mt-1 block">75% confirmés</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Mes salons</p>
                  <p className="text-3xl font-bold">{isLoading ? "..." : stats.totalSalons}</p>
                </div>
                <Store className="h-8 w-8 text-purple-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Activity className="h-4 w-4 text-purple-200 mr-1" />
                <span className="text-sm text-purple-100">Tous actifs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Note moyenne</p>
                  <p className="text-3xl font-bold">{isLoading ? "..." : stats.averageRating}/5</p>
                </div>
                <Star className="h-8 w-8 text-orange-200" />
              </div>
              <div className="mt-4 flex items-center">
                <Award className="h-4 w-4 text-orange-200 mr-1" />
                <span className="text-sm text-orange-100">{stats.totalReviews} avis</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Actions rapides */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Actions rapides
                </CardTitle>
                <CardDescription>
                  Accédez rapidement aux fonctionnalités principales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="block w-full p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${action.color}`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{action.title}</p>
                        <p className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Prochains rendez-vous */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-xl">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      Prochains rendez-vous
                    </CardTitle>
                    <CardDescription>
                      Vos réservations à venir
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/bookings">
                      Voir tout
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking, index) => (
                      <div key={booking.id}>
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Scissors className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{booking.salonName}</p>
                              <p className="text-sm text-gray-600">{booking.serviceName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-3 mb-1">
                              <div className="flex items-center space-x-1 text-sm font-medium text-gray-900">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                <span>
                                  {new Date(booking.date).toLocaleDateString('fr-FR', { 
                                    day: 'numeric', 
                                    month: 'short',
                                    year: new Date(booking.date).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="font-medium">{formatBookingTime(booking.time)}</span>
                              </div>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </div>
                        {index < recentBookings.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Aucun rendez-vous prévu</p>
                    <Button asChild>
                      <Link href="/salons">
                        Réserver maintenant
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section supplémentaire pour les propriétaires de salons */}
        {stats.totalSalons > 0 && (
          <div className="mt-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🎯 Tableau de bord professionnel
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Gérez vos salons, analysez vos performances et développez votre activité
                    </p>
                    <div className="flex space-x-4">
                      <Button asChild>
                        <Link href="/dashboard/salons">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyser mes données
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/salons/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Nouveau salon
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <p className="text-2xl font-bold text-indigo-600">{stats.totalSalons}</p>
                        <p className="text-xs text-gray-500">Salons actifs</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <p className="text-2xl font-bold text-purple-600">{stats.averageRating}</p>
                        <p className="text-xs text-gray-500">Note moyenne</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}