"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent,  } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { getUserSalons, updateSalonStatus } from "@/features/salons/actions/create-salon"
import { toast } from "sonner"
import { Plus, Settings, Eye, Edit, PlusCircle } from "lucide-react"
import Image from "next/image"

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes salons</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos salons de coiffure et leurs services
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto">
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
                <CardContent className="p-4 sm:p-6">
                  {/* En-tête avec image et infos principales */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex items-start gap-4">
                      <Image
                        src={salon.imageUrl || "/placeholder-salon.jpg"}
                        alt={salon.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {salon.name}
                        </h3>
                        <p className="text-sm text-gray-600 break-words">
                          {salon.address}, {salon.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {salon.phone}
                        </p>
                      </div>
                    </div>
                    
                    {/* Switch statut - aligné à droite sur desktop, en dessous sur mobile */}
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Statut:</span>
                        <Switch
                          checked={salon.isActive}
                          onCheckedChange={(checked) => handleToggleStatus(salon.id, checked)}
                        />
                      </div>
                      <Badge 
                        variant={salon.isActive ? "default" : "secondary"}
                        className={salon.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {salon.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Badges statistiques */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="text-xs">
                      {salon.services.length} services
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {salon._count.bookings} réservations
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {salon._count.reviews} avis
                    </Badge>
                  </div>
                  
                  {/* Boutons d'action */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                      <Link href={`/dashboard/salons/${salon.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                      <Link href={`/dashboard/salons/${salon.id}/services`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Services
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                      <Link href={`/salons/${salon.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </Link>
                    </Button>
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