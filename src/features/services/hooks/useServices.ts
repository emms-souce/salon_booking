"use client"

import { useState, useEffect } from "react"
import { Service } from "../types"

// Interface étendue pour inclure les informations du salon
export interface ServiceWithSalon extends Service {
  salon: {
    name: string
    city: string
    rating: number
  }
}

// Données mock pour démonstration
const mockServices: ServiceWithSalon[] = [
  {
    id: "1",
    name: "Coupe Homme",
    description: "Coupe de cheveux classique pour homme avec shampooing et coiffage",
    price: 15000, // Prix en FCFA
    duration: 45,
    category: "haircut",
    salonId: "1",
    features: ["Shampooing", "Coupe", "Coiffage", "Conseils"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "Salon Excellence",
      city: "Douala",
      rating: 4.5
    }
  },
  {
    id: "2",
    name: "Coloration Complète",
    description: "Coloration professionnelle avec produits de qualité supérieure",
    price: 45000, // Prix en FCFA
    duration: 120,
    category: "coloring",
    salonId: "1",
    features: ["Coloration", "Soin après-coloration", "Conseils d'entretien"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "Salon Excellence",
      city: "Douala",
      rating: 4.5
    }
  },
  {
    id: "3",
    name: "Tresses Box Braids",
    description: "Tresses africaines traditionnelles avec extensions de qualité",
    price: 75000, // Prix en FCFA
    duration: 240,
    category: "braids",
    salonId: "2",
    features: ["Extensions incluses", "Durée 4-6 semaines", "Entretien inclus"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "African Hair Studio",
      city: "Yaoundé",
      rating: 4.8
    }
  },
  {
    id: "4",
    name: "Maquillage Professionnel",
    description: "Maquillage de jour ou de soirée avec produits haut de gamme",
    price: 30000, // Prix en FCFA
    duration: 60,
    category: "makeup",
    salonId: "3",
    features: ["Analyse du teint", "Produits professionnels", "Conseils"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "Beauty Palace",
      city: "Douala",
      rating: 4.3
    }
  },
  {
    id: "5",
    name: "Soin Capillaire Intensif",
    description: "Soin nourrissant et réparateur pour cheveux abîmés",
    price: 25000, // Prix en FCFA
    duration: 60,
    category: "treatment",
    salonId: "2",
    features: ["Diagnostic capillaire", "Soin personnalisé", "Massage du cuir chevelu"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "African Hair Studio",
      city: "Yaoundé",
      rating: 4.8
    }
  },
  {
    id: "6",
    name: "Coiffage Mariage",
    description: "Coiffure élaborée pour événements spéciaux et mariages",
    price: 60000, // Prix en FCFA
    duration: 90,
    category: "styling",
    salonId: "4",
    features: ["Essai inclus", "Accessoires fournis", "Tenue garantie 24h"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "Prestige Coiffure",
      city: "Bafoussam",
      rating: 4.6
    }
  },
  {
    id: "7",
    name: "Défrisage Professionnel",
    description: "Défrisage en douceur avec produits sans ammoniaque",
    price: 35000, // Prix en FCFA
    duration: 90,
    category: "treatment",
    salonId: "1",
    features: ["Sans ammoniaque", "Soin protecteur", "Résultat durable"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "Salon Excellence",
      city: "Douala",
      rating: 4.5
    }
  },
  {
    id: "8",
    name: "Tissage Cheveux Naturels",
    description: "Pose de tissage avec cheveux naturels de qualité premium",
    price: 85000, // Prix en FCFA
    duration: 180,
    category: "styling",
    salonId: "2",
    features: ["Cheveux naturels", "Pose soignée", "Conseils d'entretien"],
    createdAt: new Date(),
    updatedAt: new Date(),
    salon: {
      name: "African Hair Studio",
      city: "Yaoundé",
      rating: 4.8
    }
  }
]

export function useServices() {
  const [services, setServices] = useState<ServiceWithSalon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Tenter de récupérer les services depuis l'API
        const response = await fetch("/api/services")
        
        if (response.ok) {
          const data = await response.json()
          // L'API retourne déjà les services avec les informations du salon
          setServices(data)
        } else {
          // Si l'API échoue, utiliser les données mock
          console.warn("API indisponible, utilisation des données mock")
          setServices(mockServices)
        }
      } catch (apiError) {
        console.warn("Erreur API, utilisation des données mock:", apiError)
        setServices(mockServices)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Fonctions utilitaires
  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category)
  }

  const getServicesBySalon = (salonId: string) => {
    return services.filter(service => service.salonId === salonId)
  }

  const getUniqueCategories = () => {
    return Array.from(new Set(services.map(service => service.category)))
  }

  const getUniqueCities = () => {
    return Array.from(new Set(services.map(service => service.salon.city)))
  }

  const getServicesStats = () => {
    return {
      total: services.length,
      categories: getUniqueCategories().length,
      salons: Array.from(new Set(services.map(service => service.salonId))).length,
      cities: getUniqueCities().length,
      averagePrice: services.length > 0 
        ? Math.round(services.reduce((acc, service) => acc + service.price, 0) / services.length) 
        : 0
    }
  }

  return { 
    services, 
    loading, 
    error,
    getServicesByCategory,
    getServicesBySalon,
    getUniqueCategories,
    getUniqueCities,
    getServicesStats
  }
}