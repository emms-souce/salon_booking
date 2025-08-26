"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useSalons } from "@/features/salons/hooks/use-salons"
import { SalonWithDetails } from "@/features/salons/services/salon-service"
import { AlertCircle, MapPin, Star, Users, Scissors } from "lucide-react"

interface SalonFilters {
  city: string | null
  minRating: number | null
}

export default function SalonsPage() {
  const { salons, loading, error, fetchSalons } = useSalons()
  const [filters, setFilters] = useState<SalonFilters>({
    city: null,
    minRating: null,
  })

  // Debug: afficher le nombre de salons chargés
  console.log('Debug: Nombre de salons chargés:', salons.length)
  console.log('Debug: État loading:', loading)
  console.log('Debug: État error:', error)

  // Fonction pour formater la gamme de prix basée sur les services
  const getPriceRange = (salon: SalonWithDetails) => {
    if (!salon.services || salon.services.length === 0) {
      return "Prix sur demande"
    }
    
    const prices = salon.services.map(service => service.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    if (minPrice === maxPrice) {
      return `${minPrice.toLocaleString()} FCFA`
    }
    
    return `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} FCFA`
  }

  // Filtrer les salons selon les critères
  const filteredSalons = salons.filter(salon => {
    if (filters.city && salon.city !== filters.city) {
      return false
    }
    
    if (filters.minRating && salon.rating < filters.minRating) {
      return false
    }
    
    return true
  })

  // Obtenir la liste unique des villes
  const cities = Array.from(new Set(salons.map(salon => salon.city)))

  const handleCityFilter = (city: string | null) => {
    setFilters(prev => ({ ...prev, city }))
  }

  const handleRatingFilter = (minRating: number | null) => {
    setFilters(prev => ({ ...prev, minRating }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Tous les salons de coiffure
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Chargement des salons...
              </p>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Tous les salons de coiffure
              </h1>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchSalons}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tous les salons de coiffure
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {filteredSalons.length} salon{filteredSalons.length > 1 ? 's' : ''} disponible{filteredSalons.length > 1 ? 's' : ''} au Cameroun
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4">
          <Button 
            variant={filters.city === null ? "default" : "outline"} 
            size="sm"
            onClick={() => handleCityFilter(null)}
          >
            Toutes les villes
          </Button>
          
          {cities.map((city) => (
            <Button 
              key={city}
              variant={filters.city === city ? "default" : "outline"} 
              size="sm"
              onClick={() => handleCityFilter(city)}
            >
              {city}
            </Button>
          ))}
          
          <Button 
            variant={filters.minRating === 4 ? "default" : "outline"} 
            size="sm"
            onClick={() => handleRatingFilter(filters.minRating === 4 ? null : 4)}
          >
            <Star className="w-4 h-4 mr-1" />
            Note 4+
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchSalons}
            disabled={loading}
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Salons Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {filteredSalons.length === 0 ? (
          <div className="text-center py-12">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun salon trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              {salons.length === 0 
                ? "Aucun salon n'est encore disponible."
                : "Aucun salon ne correspond à vos critères de recherche."}
            </p>
            {filters.city || filters.minRating ? (
              <Button 
                variant="outline" 
                onClick={() => setFilters({ city: null, minRating: null })}
              >
                Effacer les filtres
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSalons.map((salon) => (
              <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] relative bg-gray-100">
                  <Image
                    src={(
                      salon.imageUrl && 
                      salon.imageUrl.startsWith('http') && 
                      !salon.imageUrl.includes('/search/') &&
                      !salon.imageUrl.includes('/browse/') &&
                      !salon.imageUrl.includes('/free-backgrounds-photos/') &&
                      !salon.imageUrl.includes('/category/')
                    ) ? salon.imageUrl : "/placeholder-service.jpg"}
                    alt={salon.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "/placeholder-service.jpg") {
                        target.src = "/placeholder-service.jpg";
                      }
                    }}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{salon.name}</CardTitle>
                      <CardDescription className="text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{salon.address} • {salon.city}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 flex-shrink-0 ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      {salon.rating > 0 ? salon.rating.toFixed(1) : 'Nouveau'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {salon.description || 'Salon de coiffure professionnel'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Scissors className="w-4 h-4 mr-1" />
                      <span>{salon.services?.length || 0} service{(salon.services?.length || 0) > 1 ? 's' : ''}</span>
                    </div>
                    <span className="font-medium text-gray-900">{getPriceRange(salon)}</span>
                  </div>
                  {salon._count.reviews > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{salon._count.reviews} avis</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/salons/${salon.id}`}>
                      Voir les disponibilités
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}