import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"
import { z } from "zod"

// Schéma de validation pour mettre à jour une réservation
const updateBookingSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  notes: z.string().optional(),
})

// GET - Récupérer une réservation spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
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
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur a le droit de voir cette réservation
    if (booking.userId !== session.user.id) {
      // Vérifier si l'utilisateur est propriétaire du salon
      const salon = await prisma.salon.findUnique({
        where: { id: booking.salonId },
        select: { ownerId: true }
      })

      if (!salon || salon.ownerId !== session.user.id) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour une réservation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateBookingSchema.parse(body)

    // Récupérer la réservation
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        salon: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut modifier cette réservation
    const isOwner = booking.salon.ownerId === session.user.id
    const isUser = booking.userId === session.user.id

    if (!isOwner && !isUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Si l'utilisateur est le propriétaire, il peut confirmer/annuler
    // Si l'utilisateur est le client, il peut annuler ses propres réservations
    if (validatedData.status) {
      if (isOwner && ["CONFIRMED", "CANCELLED", "COMPLETED"].includes(validatedData.status)) {
        // Le propriétaire peut confirmer, annuler ou compléter
      } else if (isUser && validatedData.status === "CANCELLED") {
        // Le client peut seulement annuler ses réservations
      } else {
        return NextResponse.json(
          { error: "Action non autorisée" },
          { status: 403 }
        )
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: validatedData,
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
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la mise à jour de la réservation:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une réservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        salon: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Vérifier que l'utilisateur peut supprimer cette réservation
    const isOwner = booking.salon.ownerId === session.user.id
    const isUser = booking.userId === session.user.id

    if (!isOwner && !isUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Ne permettre la suppression que si la réservation n'est pas complétée
    if (booking.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Impossible de supprimer une réservation complétée" },
        { status: 400 }
      )
    }

    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}