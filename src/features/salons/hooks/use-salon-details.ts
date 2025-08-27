import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

interface SalonDetails {
  id: string
  name: string
  description?: string
  address: string
  city: string
  phone: string
  email?: string
  imageUrl?: string
  rating: number
  latitude?: number
  longitude?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  services: {
    id: string
    name: string
    description?: string
    price: number
    duration: number
    category: string
  }[]
  reviews: {
    id: string
    rating: number
    comment?: string
    createdAt: Date
    user: {
      name?: string
      email: string
    }
  }[]
  _count: {
    bookings: number
    reviews: number
  }
}

export function useSalonDetails(salonId: string) {
  const [salon, setSalon] = useState<SalonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSalon = useCallback(async () => {
    if (!salonId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/salons/${salonId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Salon non trouvé")
        }
        throw new Error("Erreur lors du chargement du salon")
      }

      const data = await response.json()
      setSalon(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [salonId])

  useEffect(() => {
    fetchSalon()
  }, [salonId, fetchSalon])

  return {
    salon,
    loading,
    error,
    refetch: () => {
      if (salonId) {
        setLoading(true)
        setError(null)
        fetchSalon()
      }
    }
  }
}