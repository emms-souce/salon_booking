import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const salonId = searchParams.get("salonId")
    const category = searchParams.get("category")

    const where: { isActive: boolean; salonId?: string; category?: string } = { isActive: true }
    
    if (salonId) {
      where.salonId = salonId
    }
    
    if (category && category !== "all") {
      where.category = category
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        salon: {
          select: {
            name: true,
            city: true,
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des services" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthSession(request)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    const body = await request.json()
    const { name, description, price, duration, category, salonId, features, image } = body

    // Validation basique
    if (!name || !price || !duration || !category || !salonId) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur est bien le propriétaire du salon
    const salon = await prisma.salon.findUnique({
      where: { id: salonId },
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
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        salonId,
        isActive: true,
      },
      include: {
        salon: {
          select: {
            name: true,
            city: true,
            rating: true
          }
        }
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du service" },
      { status: 500 }
    )
  }
}