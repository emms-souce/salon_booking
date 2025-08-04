import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { DashboardButton } from "@/components/shared/DashboardButton"
import ImageWithFallback from "@/components/shared/ImageWithFallback"

// Données de démonstration - sera remplacé par des données réelles
const featuredSalons = [
  {
    id: "1",
    name: "Salon Élégance",
    description: "Le meilleur salon de coiffure de Douala avec des professionnels expérimentés",
    address: "Akkwa, Douala",
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
    rating: 4.7,
    imageUrl: "/placeholder-salon-3.jpg",
    servicesCount: 15,
    priceRange: "4.000 - 30.000 FCFA"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span className="font-serif italic text-black transition-all duration-300 hover:scale-105 hover:text-gray-800 inline-block transform">
                Trouvez votre salon de coiffure
              </span>
              <span className="text-black font-serif italic transition-all duration-300 hover:scale-105 hover:text-gray-800 inline-block ml-3 transform">
                au Cameroun
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Réservez facilement votre créneau dans les meilleurs salons de coiffure du Cameroun. 
              Simple, rapide et sécurisé.
            </p>
            <DashboardButton />
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-200 transform">
                <Link href="/salons">
                  Explorer les salons
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/register">
                  S'inscrire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Une expérience de réservation simplifiée pour vos besoins capillaires
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                  Réservation instantanée
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Réservez votre créneau en quelques clics, 24h/24 et 7j/7 sans appel téléphonique.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                  Meilleurs salons
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Accédez aux salons les mieux notés de Douala, Yaoundé et partout au Cameroun.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                  Paiement sécurisé
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Payez en toute sécurité avec les méthodes de paiement locales populaires.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Salons Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Salons populaires
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Découvrez les salons les plus appréciés par nos utilisateurs
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {featuredSalons.map((salon) => (
              <Card key={salon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={salon.imageUrl}
                    alt={salon.name}
                    fill
                    type="salon"
                    className="rounded-lg"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{salon.name}</CardTitle>
                    <Badge variant="secondary" className="bg-gray-100 text-black">
                      ⭐ {salon.rating}
                    </Badge>
                  </div>
                  <CardDescription>{salon.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{salon.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{salon.servicesCount} services</span>
                    <span className="font-medium text-gray-900">{salon.priceRange}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/salons/${salon.id}`}>
                      Voir le salon
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vous êtes propriétaire de salon ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Rejoignez notre plateforme et augmentez votre visibilité. 
              Gagnez de nouveaux clients et gérez vos réservations facilement.
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/salons/register">
                  Inscrire mon salon
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
