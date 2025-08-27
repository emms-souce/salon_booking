import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { DashboardButton } from "@/components/shared/DashboardButton"
import { AuthLink } from "@/components/shared/AuthLink"
import { Star, MapPin, Clock, Users, CheckCircle, Sparkles, TrendingUp, Shield, Heart, Plus } from "lucide-react"

// Données de démonstration - sera remplacé par des données réelles
const featuredSalons = [
  {
    id: "1",
    name: "Salon Excellence Douala",
    description: "Spécialiste en coupes modernes et soins capillaires premium avec plus de 10 ans d'expérience",
    address: "Akkwa, Douala",
    city: "Douala",
    rating: 4.8,
    reviewsCount: 124,
    imageUrl: "/placeholder-salon-1.jpg",
    servicesCount: 12,
    priceRange: "8.000 - 45.000",
    specialities: ["Coupes tendance", "Coloration", "Soins"],
    openTime: "8h00",
    verified: true
  },
  {
    id: "2",
    name: "African Hair Studio",
    description: "Experts en tresses africaines, tissages et soins naturels pour sublimer vos cheveux",
    address: "Bonapriso, Douala",
    city: "Douala",
    rating: 4.9,
    reviewsCount: 89,
    imageUrl: "/placeholder-salon-2.jpg",
    servicesCount: 8,
    priceRange: "15.000 - 75.000",
    specialities: ["Tresses", "Tissages", "Soins naturels"],
    openTime: "9h00",
    verified: true
  },
  {
    id: "3",
    name: "Prestige Coiffure Yaoundé",
    description: "Salon haut de gamme proposant des coiffures élégantes pour toutes occasions",
    address: "Bastos, Yaoundé",
    city: "Yaoundé",
    rating: 4.7,
    reviewsCount: 156,
    imageUrl: "/placeholder-salon-3.jpg",
    servicesCount: 15,
    priceRange: "10.000 - 60.000",
    specialities: ["Coiffures mariage", "Maquillage", "Manucure"],
    openTime: "8h30",
    verified: true
  }
]

// Témoignages clients
const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    city: "Douala",
    avatar: "/placeholder-avatar-1.jpg",
    rating: 5,
    comment: "Service exceptionnel ! J'ai trouvé le salon parfait près de chez moi. La réservation en ligne est très pratique.",
    service: "Coupe et coloration"
  },
  {
    id: 2,
    name: "Amina Bakari",
    city: "Yaoundé",
    avatar: "/placeholder-avatar-2.jpg",
    rating: 5,
    comment: "Mes tresses sont magnifiques ! Le salon recommandé était parfait, professionnel et accueillant.",
    service: "Tresses africaines"
  },
  {
    id: 3,
    name: "Sarah Nkomo",
    city: "Bafoussam",
    avatar: "/placeholder-avatar-3.jpg",
    rating: 5,
    comment: "Excellente expérience ! Paiement sécurisé et service client réactif. Je recommande vivement.",
    service: "Coiffage mariage"
  }
]

// Statistiques de la plateforme
const stats = [
  {
    number: "50+",
    label: "Salons partenaires",
    icon: Users,
    description: "À travers le Cameroun"
  },
  {
    number: "1,200+",
    label: "Clients satisfaits",
    icon: Heart,
    description: "Et ça continue à grandir"
  },
  {
    number: "15+",
    label: "Villes couvertes",
    icon: MapPin,
    description: "Dans tout le pays"
  },
  {
    number: "95%",
    label: "Taux de satisfaction",
    icon: Star,
    description: "Notes 4+ étoiles"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Amélioré */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="mb-6">
              <Badge className="bg-yellow-500/10 text-yellow-300 border-yellow-500/20 mb-4">
                🇨🇲 Plateforme #1 au Cameroun
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">Votre salon de</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                coiffure idéal
              </span>
              <span className="block">vous attend</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
              Découvrez et réservez dans les meilleurs salons de coiffure du Cameroun. 
              De Douala à Yaoundé, trouvez le service parfait pour sublimer votre style.
            </p>
            
            {/* Statistiques rapides */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
            <DashboardButton  />
            </div>

            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Link href="/salons">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explorer les salons
                </Link>
              </Button>
              <Button size="lg" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold transition-all duration-300 backdrop-blur-sm" asChild>
                <Link href="/services">
                  Voir les services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Pourquoi choisir Salon Cameroun ?
            </h2>
            <p className="text-lg leading-8 text-gray-600">
              Une expérience de réservation simplifiée et sécurisée, adaptée à vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Réservation instantanée</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Réservez votre créneau en quelques clics, 24h/24 et 7j/7. 
                  Plus besoin d&apos;appeler ou de vous déplacer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Salons vérifiés</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Tous nos salons partenaires sont vérifiés et notés par de vrais clients. 
                  Qualité et sécurité garanties.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Paiement local</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Payez avec MTN Mobile Money, Orange Money ou en espèces. 
                  Méthodes sécurisées et adaptées au Cameroun.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Salons populaires */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Salons populaires
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez les salons les plus appréciés par nos utilisateurs
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/salons">
                Voir tous les salons
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSalons.map((salon) => (
              <Card key={salon.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image
                    src={salon.imageUrl || "/placeholder-salon.jpg"}
                    alt={salon.name}
                    fill
                    className="group-hover:scale-110 transition-transform duration-300 object-cover"
                  />
                  {salon.verified && (
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold group-hover:text-yellow-600 transition-colors">
                        {salon.name}
                      </CardTitle>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {salon.address}
                      </div>
                    </div>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{salon.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({salon.reviewsCount})</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{salon.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {salon.specialities.slice(0, 2).map((speciality, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {speciality}
                      </Badge>
                    ))}
                    {salon.specialities.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{salon.specialities.length - 2}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Ouvert dès {salon.openTime}</span>
                    </div>
                    <span className="font-medium text-gray-900">{salon.priceRange} FCFA</span>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{salon.servicesCount} services</span>
                    <span className="text-green-600 font-medium">Disponible</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium">
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

      {/* Section Témoignages */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-gray-600">
              Des milliers de camerounais nous font confiance pour leurs besoins capillaires
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 italic text-center mb-3">
                    &ldquo;{testimonial.comment}&rdquo;
                  </blockquote>
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section pour les salons */}
      <section className="bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="mb-6">
              <Sparkles className="mx-auto h-12 w-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Vous êtes propriétaire de salon ?
            </h2>
            <p className="mx-auto max-w-2xl text-xl leading-8 text-gray-300 mb-8">
              Rejoignez notre plateforme et augmentez votre visibilité. 
              Gagnez de nouveaux clients et gérez vos réservations facilement.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Plus de visibilité</h3>
                <p className="text-sm text-gray-400">Atteignez des milliers de clients potentiels</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Gestion simplifiée</h3>
                <p className="text-sm text-gray-400">Tableau de bord intuitif pour vos réservations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Communauté active</h3>
                <p className="text-sm text-gray-400">Rejoignez 50+ salons déjà partenaires</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-8" 
                asChild
              >
                <AuthLink href="/dashboard/salons/create">
                  <Plus className="mr-2 h-5 w-5" />
                  Inscrire mon salon
                </AuthLink>
              </Button>
              <Button size="lg" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold transition-all duration-300 backdrop-blur-sm" asChild>
                <Link href="/auth/register">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
