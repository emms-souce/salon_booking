import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { getAuthSession } from "@/lib/auth-helpers"

// Schéma de validation pour créer une réservation
const bookingSchema = z.object({
  salonId: z.string(),
  serviceId: z.string(),
  date: z.string(), // format ISO string
  startTime: z.string(), // format ISO string
  notes: z.string().optional(),
})

// GET - Récupérer les réservations de l'utilisateur connecté
export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const salonId = searchParams.get("salonId")

    // Si salonId est fourni, vérifier que l'utilisateur est propriétaire
    if (salonId) {
      const salon = await prisma.salon.findUnique({
        where: { id: salonId },
        select: { ownerId: true }
      })

      if (!salon) {
        return NextResponse.json({ error: "Salon non trouvé" }, { status: 404 })
      }

      if (salon.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }

      // Récupérer toutes les réservations du salon
      const bookings = await prisma.booking.findMany({
        where: { salonId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          service: {
            select: {
              name: true,
              price: true,
              duration: true
            }
          }
        },
        orderBy: { startTime: "desc" }
      })

      return NextResponse.json(bookings)
    }

    // Sinon, récupérer les réservations de l'utilisateur
    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        salon: {
          select: {
            name: true,
            address: true,
            city: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true,
            price: true,
            duration: true
          }
        }
      },
      orderBy: { startTime: "desc" }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validation avec Zod
    const validatedData = bookingSchema.parse(body)

    // Récupérer le service et le salon
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
      include: { salon: true }
    })

    if (!service) {
      return NextResponse.json({ error: "Service non trouvé" }, { status: 404 })
    }

    if (service.salon.id !== validatedData.salonId) {
      return NextResponse.json(
        { error: "Le service n'appartient pas au salon spécifié" },
        { status: 400 }
      )
    }

    // Calculer les dates
    const bookingDate = new Date(validatedData.date)
    const startTime = new Date(validatedData.startTime)
    const endTime = new Date(startTime.getTime() + (service.duration * 60 * 1000))

    // Vérifier que la date est future
    if (bookingDate < new Date()) {
      return NextResponse.json(
        { error: "La date doit être dans le futur" },
        { status: 400 }
      )
    }

    // Vérifier la disponibilité
    const existingBookings = await prisma.booking.findMany({
      where: {
        salonId: validatedData.salonId,
        date: bookingDate,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime }
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime }
          }
        ]
      }
    })

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: "Ce créneau horaire n'est pas disponible" },
        { status: 409 }
      )
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        startTime,
        endTime,
        totalPrice: service.price,
        notes: validatedData.notes,
        userId: session.user.id,
        salonId: validatedData.salonId,
        serviceId: validatedData.serviceId,
        status: "PENDING"
      },
      include: {
        salon: {
          select: {
            name: true,
            address: true,
            city: true,
            phone: true
          }
        },
        service: {
          select: {
            name: true,
            price: true,
            duration: true
          }
        }
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}