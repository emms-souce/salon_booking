"use client"

import { Search, SlidersHorizontal, MapPin, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedCity: string
  onCityChange: (value: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (value: [number, number]) => void
  sortBy: "price" | "duration" | "rating"
  onSortChange: (value: "price" | "duration" | "rating") => void
  cities: string[]
}

const categories = [
  { value: "all", label: "Toutes les catégories" },
  { value: "haircut", label: "Coupe de cheveux" },
  { value: "coloring", label: "Coloration" },
  { value: "styling", label: "Coiffage" },
  { value: "treatment", label: "Soin capillaire" },
  { value: "braids", label: "Tresses" },
  { value: "makeup", label: "Maquillage" },
]

const sortOptions = [
  { value: "price", label: "Prix croissant" },
  { value: "duration", label: "Durée" },
  { value: "rating", label: "Note du salon" },
]

// Fonction pour formater le prix en FCFA
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('XAF', 'FCFA')
}

export function ServiceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  cities,
}: ServiceFiltersProps) {
  return (
    <Card className="bg-white shadow-sm border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Filtrer et trier</span>
          <SlidersHorizontal className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recherche */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Nom du service, salon, description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Ville
            </Label>
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger id="city">
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <Label htmlFor="sort" className="text-sm font-medium flex items-center">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Trier par
            </Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bouton reset */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-transparent">Actions</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onSearchChange("")
                onCategoryChange("all")
                onCityChange("all")
                onPriceRangeChange([0, 100000])
                onSortChange("price")
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Filtre prix */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Fourchette de prix</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="min-price" className="text-xs text-gray-500">Prix minimum</Label>
              <div className="relative">
                <Input
                  id="min-price"
                  type="number"
                  min="0"
                  max="100000"
                  step="5000"
                  value={priceRange[0] || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseInt(e.target.value)
                    onPriceRangeChange([isNaN(value) ? 0 : value, priceRange[1]])
                  }}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  FCFA
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-price" className="text-xs text-gray-500">Prix maximum</Label>
              <div className="relative">
                <Input
                  id="max-price"
                  type="number"
                  min="0"
                  max="100000"
                  step="5000"
                  value={priceRange[1] || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 100000 : parseInt(e.target.value)
                    onPriceRangeChange([priceRange[0], isNaN(value) ? 100000 : value])
                  }}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  FCFA
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}