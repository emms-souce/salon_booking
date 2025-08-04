"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { getUserSalons, updateSalonStatus } from "@/features/salons/actions/create-salon"
import { getSalonServices } from "@/features/salons/actions/service-management"
import { toast } from "sonner"
import { Plus, Settings, Eye, EyeOff, Edit, PlusCircle } from "lucide-react"
import ImageWithFallback from "@/components/shared/ImageWithFallback"

interface Salon {
  id: string
  name: string
  description: string | null
  address: string
  city: string
  phone: string
  email: string | null
  imageUrl: string | null
  rating: number
  isActive: boolean
  createdAt: Date
  services: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  _count: {
    bookings: number
    reviews: number
  }
}

export default function DashboardSalonsPage() {
  const { user } = useAuth()
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadSalons()
    }
  }, [user])

  async function loadSalons() {
    try {
      const result = await getUserSalons()
      if (result.success) {
        setSalons(result.salons as Salon[])
      } else {
        toast.error(result.error || "Impossible de charger vos salons")
      }
    } catch (error) {
      toast.error("Impossible de charger vos salons")
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleStatus(salonId: string, isActive: boolean) {
    try {
      const result = await updateSalonStatus(salonId, isActive)
      if (result.success) {
        toast.success(isActive ? "Salon activé" : "Salon désactivé")
        loadSalons()
      } else {
        toast.error(result.error || "Impossible de modifier le statut")
      }
    } catch (error) {
      toast.error("Impossible de modifier le statut")
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes salons</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos salons de coiffure et leurs services
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/salons/create">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un salon
              </Link>
            </Button>
          </div>
        </div>

        {salons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun salon pour le moment
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez par créer votre premier salon de coiffure
                </p>
                <Button asChild>
                  <Link href="/dashboard/salons/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Créer un salon
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {salons.map((salon) => (
              <Card key={salon.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={salon.imageUrl}
                        alt={salon.name}
                        width={80}
                        height={80}
                        type="salon"
                        className="rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {salon.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {salon.address}, {salon.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {salon.phone}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">
                            {salon.services.length} services
                          </Badge>
                          <Badge variant="outline">
                            {salon._count.bookings} réservations
                          </Badge>
                          <Badge variant="outline">
                            {salon._count.reviews} avis
                          </Badge>
                          <Badge 
                            variant={salon.isActive ? "default" : "secondary"}
                            className={salon.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {salon.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Statut:</span>
                        <Switch
                          checked={salon.isActive}
                          onCheckedChange={(checked) => handleToggleStatus(salon.id, checked)}
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/salons/${salon.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/salons/${salon.id}/services`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Services
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/salons/${salon.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}