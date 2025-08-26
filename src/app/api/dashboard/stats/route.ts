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

    // Récupérer les réservations de l'utilisateur
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        salon: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        }
      }
    })

    // Récupérer les salons de l'utilisateur
    const salons = await prisma.salon.findMany({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    })

    // Récupérer les avis reçus
    const reviews = await prisma.review.findMany({
      where: {
        salon: {
          ownerId: user.id
        }
      }
    })

    // Calculer les statistiques
    const totalBookings = bookings.length
    const activeBookings = bookings.filter(booking => 
      booking.status === 'CONFIRMED' || booking.status === 'PENDING'
    ).length
    const totalSalons = salons.length
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 10) / 10
      : 0

    // Calculer la croissance mensuelle (simulée pour le moment)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const lastMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate.getMonth() === currentMonth - 1 && bookingDate.getFullYear() === currentYear
    }).length

    const thisMonthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
    }).length

    const monthlyGrowth = lastMonthBookings > 0 
      ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100)
      : thisMonthBookings > 0 ? 100 : 0

    return NextResponse.json({
      totalBookings,
      activeBookings,
      totalSalons,
      totalReviews,
      averageRating,
      monthlyGrowth: Math.max(0, monthlyGrowth) // Assurer une valeur positive
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}