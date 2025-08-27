import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: salonId } = await params;

    const salon = await prisma.salon.findUnique({
      where: { 
        id: salonId,
        isActive: true 
      },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    if (!salon) {
      return NextResponse.json({ error: "Salon non trouvé" }, { status: 404 })
    }

    return NextResponse.json(salon)
  } catch (error) {
    console.error("Erreur lors de la récupération du salon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getAuthSession(request)
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    const body = await request.json()
    const { name, description, address, city, phone, email, imageUrl } = body

    // Vérifier que le salon existe et appartient à l'utilisateur
    const existingSalon = await prisma.salon.findUnique({
      where: { id },
    })

    if (!existingSalon) {
      return NextResponse.json({ error: "Salon non trouvé" }, { status: 404 })
    }

    if (existingSalon.ownerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updatedSalon = await prisma.salon.update({
      where: { id },
      data: {
        name,
        description,
        address,
        city,
        phone,
        email,
        imageUrl,
      },
    })

    return NextResponse.json(updatedSalon)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du salon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getAuthSession(request)
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    // Vérifier que le salon existe et appartient à l'utilisateur
    const salon = await prisma.salon.findUnique({
      where: { id },
    })

    if (!salon) {
      return NextResponse.json({ error: "Salon non trouvé" }, { status: 404 })
    }

    if (salon.ownerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.salon.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du salon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}