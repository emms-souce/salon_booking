"use client"

import { useState, useEffect } from "react"
import { ServiceCard } from "@/features/services/components/ServiceCard"
import { ServiceFilters } from "@/features/services/components/ServiceFilters"
import { useServices, ServiceWithSalon } from "@/features/services/hooks/useServices"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, MapPin, Tag, Building } from "lucide-react"

export function ServicesList() {
  const { services, loading, error, getServicesStats } = useServices()
  const [filteredServices, setFilteredServices] = useState<ServiceWithSalon[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortBy, setSortBy] = useState<"price" | "duration" | "rating">("price")

  const stats = getServicesStats()

  useEffect(() => {
    let filtered = services

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.salon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrage par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    // Filtrage par ville
    if (selectedCity !== "all") {
      filtered = filtered.filter((service) => service.salon.city === selectedCity)
    }

    // Filtrage par prix
    filtered = filtered.filter(
      (service) => service.price >= priceRange[0] && service.price <= priceRange[1]
    )

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "duration":
          return a.duration - b.duration
        case "rating":
          return b.salon.rating - a.salon.rating
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }, [services, searchTerm, selectedCategory, selectedCity, priceRange, sortBy])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
        <p className="text-gray-600">Chargement des services...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Services</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Salons</p>
                <p className="text-2xl font-bold text-green-900">{stats.salons}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Villes</p>
                <p className="text-2xl font-bold text-purple-900">{stats.cities}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Prix moyen</p>
                <p className="text-2xl font-bold text-orange-900">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.averagePrice).replace('XAF', 'FCFA')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        cities={Array.from(new Set(services.map(service => service.salon.city)))}
      />

      {/* Résultats */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredServices.length} service(s) trouvé(s)
          </h2>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-1">
              Résultats pour &ldquo;<span className="font-medium">{searchTerm}</span>&rdquo;
            </p>
          )}
        </div>
        {(searchTerm || selectedCategory !== "all" || selectedCity !== "all") && (
          <Badge variant="secondary" className="text-sm">
            Filtres actifs
          </Badge>
        )}
      </div>

      {/* Liste des services */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Tag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Essayez de modifier vos critères de recherche ou de navigation.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedCity("all")
                setPriceRange([0, 100000])
              }}
              className="text-black hover:text-gray-700 font-medium"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}