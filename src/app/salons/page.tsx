import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ImageWithFallback from "@/components/shared/ImageWithFallback"

// Données de démonstration
const salons = [
  {
    id: "1",
    name: "Salon Élégance",
    description: "Le meilleur salon de coiffure de Douala avec des professionnels expérimentés",
    address: "Akkwa, Douala",
    city: "Douala",
    rating: 4.8,
    imageUrl: "/placeholder-salon-1.jpg",
    servicesCount: 12,
    priceRange: "5.000 - 25.000 FCFA"
  },
  {
    id: "2",
    name: "Coiffure Royal",
    description: "Spécialiste en tresses africaines et soins capillaires naturels",
    address: "Bonapriso, Douala",
    city: "Douala",
    rating: 4.9,
    imageUrl: "/placeholder-salon-2.jpg",
    servicesCount: 8,
    priceRange: "3.000 - 20.000 FCFA"
  },
  {
    id: "3",
    name: "Salon Glamour",
    description: "Coiffure moderne et tendance pour tous les styles",
    address: "Bastos, Yaoundé",
    city: "Yaoundé",
    rating: 4.7,
    imageUrl: "/placeholder-salon-3.jpg",
    servicesCount: 15,
    priceRange: "4.000 - 30.000 FCFA"
  },
  {
    id: "4",
    name: "Beauté Naturelle",
    description: "Soins capillaires bio et naturels pour cheveux afro",
    address: "Deido, Douala",
    city: "Douala",
    rating: 4.6,
    imageUrl: "/placeholder-salon-4.jpg",
    servicesCount: 10,
    priceRange: "2.500 - 15.000 FCFA"
  },
  {
    id: "5",
    name: "Style Africain",
    description: "Maître coiffeur spécialisé dans les tresses traditionnelles",
    address: "Mokolo, Yaoundé",
    city: "Yaoundé",
    rating: 4.5,
    imageUrl: "/placeholder-salon-5.jpg",
    servicesCount: 20,
    priceRange: "3.000 - 35.000 FCFA"
  },
  {
    id: "6",
    name: "Salon Prestige",
    description: "Service premium pour une expérience luxueuse",
    address: "Bonanjo, Douala",
    city: "Douala",
    rating: 4.9,
    imageUrl: "/placeholder-salon-6.jpg",
    servicesCount: 18,
    priceRange: "10.000 - 50.000 FCFA"
  }
]

export default function SalonsPage() {
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
              {salons.length} salons disponibles au Cameroun
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" size="sm">
            Toutes les villes
          </Button>
          <Button variant="outline" size="sm">
            Douala
          </Button>
          <Button variant="outline" size="sm">
            Yaoundé
          </Button>
          <Button variant="outline" size="sm">
            Note 4+
          </Button>
          <Button variant="outline" size="sm">
            Prix
          </Button>
        </div>
      </div>

      {/* Salons Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] relative bg-gray-100">
                <ImageWithFallback
                  src={salon.imageUrl}
                  alt={salon.name}
                  fill
                  type="salon"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{salon.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {salon.address} • {salon.city}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ⭐ {salon.rating}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {salon.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{salon.servicesCount} services</span>
                  <span className="font-medium text-gray-900">{salon.priceRange}</span>
                </div>
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
      </div>
    </div>
  )
}