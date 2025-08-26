import { useState, useEffect, useCallback } from "react"
import { salonService, SalonWithDetails } from "../services/salon-service"
import { toast } from "sonner"

interface UseSalonsOptions {
  ownerId?: string
  autoFetch?: boolean
}

export function useSalons(options: UseSalonsOptions = {}) {
  const { ownerId, autoFetch = true } = options
  
  const [salons, setSalons] = useState<SalonWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSalons = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let data: SalonWithDetails[]
      
      if (ownerId) {
        data = await salonService.getSalonsByOwner(ownerId)
      } else {
        data = await salonService.getAllSalons()
      }
      
      setSalons(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération des salons"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Erreur lors de la récupération des salons:", error)
    } finally {
      setLoading(false)
    }
  }, [ownerId])

  const createSalon = useCallback(async (salonData: {
    name: string
    description?: string
    address: string
    city: string
    phone: string
    email?: string
    imageUrl?: string
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const newSalon = await salonService.createSalon(salonData)
      toast.success("Salon créé avec succès!")
      
      // Rafraîchir la liste des salons
      if (autoFetch) {
        await fetchSalons()
      }
      
      return newSalon
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création du salon"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Erreur lors de la création du salon:", error)
      return null
    } finally {
      setLoading(false)
    }
  }, [autoFetch, fetchSalons])

  // Auto-fetch des salons au chargement
  useEffect(() => {
    if (autoFetch) {
      fetchSalons()
    }
  }, [autoFetch, fetchSalons])

  return {
    salons,
    loading,
    error,
    fetchSalons,
    createSalon
  }
}