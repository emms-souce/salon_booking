import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schéma de validation pour vérifier la disponibilité
const availabilitySchema = z.object({
  salonId: z.string(),
  serviceId: z.string(),
  date: z.string(), // format ISO string
})

// GET - Vérifier la disponibilité des créneaux horaires
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const salonId = searchParams.get("salonId")
    const serviceId = searchParams.get("serviceId")
    const date = searchParams.get("date")

    if (!salonId || !serviceId || !date) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      )
    }

    // Validation
    const validatedData = availabilitySchema.parse({
      salonId,
      serviceId,
      date
    })

    // Récupérer le service pour connaître la durée
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      select: { duration: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service non trouvé" },
        { status: 404 }
      )
    }

    // Date de la réservation
    const bookingDate = new Date(validatedData.date)
    
    // Vérifier que la date est future
    if (bookingDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json(
        { error: "La date doit être dans le futur" },
        { status: 400 }
      )
    }

    // Récupérer les réservations existantes pour ce salon et cette date
    const existingBookings = await prisma.booking.findMany({
      where: {
        salonId: validatedData.salonId,
        date: bookingDate,
        status: { in: ["PENDING", "CONFIRMED"] }
      },
      select: {
        startTime: true,
        endTime: true
      }
    })

    // Générer les créneaux disponibles (9h à 18h par défaut)
    const openingHour = 9
    const closingHour = 18
    const slotDuration = service.duration
    
    const availableSlots = []
    
    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(bookingDate)
        slotStart.setHours(hour, minute, 0, 0)
        
        const slotEnd = new Date(slotStart.getTime() + (slotDuration * 60 * 1000))
        
        // Vérifier si le créneau est dans le futur
        if (slotStart < new Date()) {
          continue
        }
        
        // Vérifier si le créneau ne dépasse pas l'heure de fermeture
        if (slotEnd.getHours() > closingHour || 
            (slotEnd.getHours() === closingHour && slotEnd.getMinutes() > 0)) {
          continue
        }
        
        // Vérifier si le créneau est disponible
        const isAvailable = !existingBookings.some(booking => {
          const bookingStart = new Date(booking.startTime)
          const bookingEnd = new Date(booking.endTime)
          
          return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
          )
        })
        
        if (isAvailable) {
          availableSlots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString()
          })
        }
      }
    }

    return NextResponse.json({
      availableSlots,
      serviceDuration: slotDuration,
      salonHours: {
        opening: openingHour,
        closing: closingHour
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la vérification de la disponibilité:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}