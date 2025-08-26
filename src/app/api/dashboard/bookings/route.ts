import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession(request)
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    
    const user = session.user

    // Récupérer les prochaines réservations
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date()
        },
        status: {
          in: ['CONFIRMED', 'PENDING']
        }
      },
      include: {
        salon: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 5
    })

    // Formater les données pour le frontend
    const formattedBookings = upcomingBookings.map(booking => {
      // Améliorer le formatage de l'heure
      const startTimeString = booking.startTime ? 
        booking.startTime.toTimeString().slice(0, 5) : '09:00'
      
      return {
        id: booking.id,
        salonName: booking.salon.name,
        serviceName: booking.service.name,
        date: booking.date.toISOString().split('T')[0],
        time: startTimeString,
        status: booking.status
      }
    })

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}