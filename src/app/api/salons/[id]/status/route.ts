import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/better-auth"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

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
    const { isActive } = body

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Le statut doit être un booléen" },
        { status: 400 }
      )
    }

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

    const updatedSalon = await prisma.salon.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({
      success: true,
      salon: updatedSalon,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}