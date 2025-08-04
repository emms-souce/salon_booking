import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    const body = await request.json()
    const { name, description, price, duration } = body

    // Vérifier que le service existe et appartient bien au salon de l'utilisateur
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        salon: true,
      },
    })

    if (!service) {
      return NextResponse.json({ error: "Service non trouvé" }, { status: 404 })
    }

    if (service.salon.ownerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        price,
        duration,
      },
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service:", error)
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    // Vérifier que le service existe et appartient bien au salon de l'utilisateur
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        salon: true,
      },
    })

    if (!service) {
      return NextResponse.json({ error: "Service non trouvé" }, { status: 404 })
    }

    if (service.salon.ownerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.service.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du service:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}