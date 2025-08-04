import { Booking } from "@/features/salons/types"

export interface CreateBookingData {
  salonId: string
  serviceId: string
  date: string
  startTime: string
  notes?: string
}

export interface AvailabilityResponse {
  availableSlots: Array<{
    startTime: string
    endTime: string
  }>
  serviceDuration: number
  salonHours: {
    opening: number
    closing: number
  }
}

class BookingService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  async getUserBookings(): Promise<Booking[]> {
    const response = await fetch(`/api/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération des réservations")
    }

    return response.json()
  }

  async getSalonBookings(salonId: string): Promise<Booking[]> {
    const response = await fetch(`/api/bookings?salonId=${salonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération des réservations")
    }

    return response.json()
  }

  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await fetch(`/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la création de la réservation")
    }

    return response.json()
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la mise à jour de la réservation")
    }

    return response.json()
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de l'annulation de la réservation")
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la suppression de la réservation")
    }
  }

  async checkAvailability(
    salonId: string,
    serviceId: string,
    date: string
  ): Promise<AvailabilityResponse> {
    const response = await fetch(
      `/api/bookings/availability?salonId=${salonId}&serviceId=${serviceId}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la vérification de la disponibilité")
    }

    return response.json()
  }

  async getBooking(bookingId: string): Promise<Booking> {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération de la réservation")
    }

    return response.json()
  }
}

export const bookingService = new BookingService()