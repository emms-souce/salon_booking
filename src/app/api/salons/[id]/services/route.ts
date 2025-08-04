import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/better-auth"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

export async function GET(
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

    const salon = await prisma.salon.findUnique({
      where: { id },
    })

    if (!salon) {
      return NextResponse.json({ error: "Salon non trouvé" }, { status: 404 })
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (salon.ownerId !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const services = await prisma.service.findMany({
      where: { salonId: id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const { name, description, price, duration, category } = body

    // Validation
    if (!name || !description || price === undefined || duration === undefined || !category) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
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

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration,
        category,
        salonId: id,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du service:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}