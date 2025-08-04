"use client"

import { useState, useEffect } from "react"
import { Service } from "../types"

// Données mock pour démonstration
const mockServices: Service[] = [
  {
    id: "1",
    name: "Coupe Homme",
    description: "Coupe de cheveux classique pour homme avec shampooing et coiffage",
    price: 25,
    duration: 45,
    category: "haircut",
    salonId: "1",
    features: ["Shampooing", "Coupe", "Coiffage", "Conseils"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Coloration Complète",
    description: "Coloration professionnelle avec produits de qualité supérieure",
    price: 80,
    duration: 120,
    category: "coloring",
    salonId: "1",
    features: ["Coloration", "Soin après-coloration", "Conseils d'entretien"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Tresses Box Braids",
    description: "Tresses africaines traditionnelles avec extensions de qualité",
    price: 150,
    duration: 240,
    category: "braids",
    salonId: "1",
    features: ["Extensions incluses", "Durée 4-6 semaines", "Entretien inclus"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Maquillage Professionnel",
    description: "Maquillage de jour ou de soirée avec produits haut de gamme",
    price: 60,
    duration: 60,
    category: "makeup",
    salonId: "1",
    features: ["Analyse du teint", "Produits professionnels", "Conseils"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Soin Capillaire Intensif",
    description: "Soin nourrissant et réparateur pour cheveux abîmés",
    price: 45,
    duration: 60,
    category: "treatment",
    salonId: "1",
    features: ["Diagnostic capillaire", "Soin personnalisé", "Massage du cuir chevelu"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    name: "Coiffage Mariage",
    description: "Coiffure élaborée pour événements spéciaux et mariages",
    price: 120,
    duration: 90,
    category: "styling",
    salonId: "1",
    features: ["Essai inclus", "Accessoires fournis", "Tenue garantie 24h"],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        
        // Utiliser les données mock si l'API échoue
        try {
          const response = await fetch("/api/services")
          if (response.ok) {
            const data = await response.json()
            setServices(data)
          } else {
            console.warn("API indisponible, utilisation des données mock")
            setServices(mockServices)
          }
        } catch (apiError) {
          console.warn("Erreur API, utilisation des données mock:", apiError)
          setServices(mockServices)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
        // En cas d'erreur, utiliser les données mock
        setServices(mockServices)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}