"use client"

import { useState, useEffect } from "react"
import { ServiceCard } from "@/features/services/components/ServiceCard"
import { ServiceFilters } from "@/features/services/components/ServiceFilters"
import { useServices } from "@/features/services/hooks/useServices"
import { Service } from "@/features/services/types"

export function ServicesList() {
  const { services, loading, error } = useServices()
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  useEffect(() => {
    let filtered = services

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((service) => service.category === selectedCategory)
    }

    filtered = filtered.filter(
      (service) => service.price >= priceRange[0] && service.price <= priceRange[1]
    )

    setFilteredServices(filtered)
  }, [services, searchTerm, selectedCategory, priceRange])

  if (loading) {
    return <div className="text-center">Chargement des services...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">Erreur: {error}</div>
  }

  return (
    <div className="space-y-6">
      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
      />

      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun service trouvé</p>
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