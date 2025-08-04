"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ServiceFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (value: [number, number]) => void
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

export function ServiceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: ServiceFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtrer les services</h2>
        <SlidersHorizontal className="h-5 w-5 text-gray-500" />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search">Rechercher</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Rechercher un service..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Sélectionner une catégorie" />
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

        <div>
          <Label htmlFor="price-range">Prix (€)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price" className="text-xs">Min</Label>
              <Input
                id="min-price"
                type="number"
                min="0"
                max="500"
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="max-price" className="text-xs">Max</Label>
              <Input
                id="max-price"
                type="number"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 500])}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onSearchChange("")
            onCategoryChange("all")
            onPriceRangeChange([0, 500])
          }}
        >
          Réinitialiser les filtres
        </Button>
      </div>
    </div>
  )
}