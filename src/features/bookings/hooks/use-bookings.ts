import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { bookingService } from "../services/booking-service"
import { Booking } from "@/features/salons/types"
import { toast } from "sonner"

interface UseBookingsOptions {
  salonId?: string
  autoFetch?: boolean
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { salonId, autoFetch = true } = options
  const { user } = useAuth()
  
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<Array<{
    startTime: string
    endTime: string
  }>>([])

  const fetchBookings = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      let data: Booking[]
      
      if (salonId) {
        data = await bookingService.getSalonBookings(salonId)
      } else {
        data = await bookingService.getUserBookings()
      }
      
      setBookings(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error)
      toast.error("Impossible de charger les réservations")
    } finally {
      setLoading(false)
    }
  }, [user, salonId])

  // Auto-fetch des réservations au chargement
  useEffect(() => {
    if (autoFetch && user) {
      fetchBookings()
    }
  }, [autoFetch, user, fetchBookings])

  const createBooking = useCallback(async (
    salonId: string,
    serviceId: string,
    date: string,
    startTime: string,
    notes?: string
  ) => {
    if (!user) {
      toast.error("Veuillez vous connecter pour réserver")
      return null
    }

    setLoading(true)
    try {
      const booking = await bookingService.createBooking({
        salonId,
        serviceId,
        date,
        startTime,
        notes
      })

      toast.success("Réservation créée avec succès!")
      
      // Rafraîchir la liste des réservations
      if (autoFetch) {
        await fetchBookings()
      }

      return booking
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la réservation")
      return null
    } finally {
      setLoading(false)
    }
  }, [user, autoFetch, fetchBookings])

  const cancelBooking = useCallback(async (bookingId: string) => {
    setLoading(true)
    try {
      await bookingService.cancelBooking(bookingId)
      toast.success("Réservation annulée avec succès")
      
      if (autoFetch) {
        await fetchBookings()
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      toast.error("Impossible d'annuler la réservation")
    } finally {
      setLoading(false)
    }
  }, [autoFetch, fetchBookings])

  const checkAvailability = useCallback(async (
    salonId: string,
    serviceId: string,
    date: string
  ) => {
    // Validation des paramètres avant l'appel API
    if (!salonId || !serviceId || !date) {
      console.error("Paramètres manquants pour checkAvailability:", { salonId, serviceId, date });
      toast.error("Paramètres de recherche manquants");
      return [];
    }
    
    try {
      const response = await bookingService.checkAvailability(salonId, serviceId, date)
      setAvailability(response.availableSlots)
      console.log(`${response.availableSlots.length} créneaux disponibles trouvés`);
      return response.availableSlots
    } catch (error) {
      console.error("Erreur lors de la vérification de la disponibilité:", {
        error: error instanceof Error ? error.message : error,
        salonId,
        serviceId,
        date
      });
      
      // Afficher le message d'erreur spécifique de l'API
      const errorMessage = error instanceof Error ? error.message : "Impossible de vérifier la disponibilité";
      toast.error(errorMessage);
      
      return []
    }
  }, [])

  const updateBookingStatus = useCallback(async (
    bookingId: string,
    status: string
  ) => {
    setLoading(true)
    try {
      const updated = await bookingService.updateBookingStatus(bookingId, status)
      toast.success(`Réservation ${status.toLowerCase()} avec succès`)
      
      if (autoFetch) {
        await fetchBookings()
      }
      
      return updated
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast.error("Impossible de mettre à jour la réservation")
      return null
    } finally {
      setLoading(false)
    }
  }, [autoFetch, fetchBookings])

  return {
    bookings,
    loading,
    availability,
    fetchBookings,
    createBooking,
    cancelBooking,
    checkAvailability,
    updateBookingStatus
  }
}