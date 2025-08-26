import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/better-auth"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")

    if (ownerId) {
      // Vérifier l'authentification pour récupérer les salons d'un propriétaire spécifique
      const session = await getAuthSession(request)
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
      }
      
      // S'assurer que l'utilisateur ne peut récupérer que ses propres salons
      if (session.user.id !== ownerId) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
      
      const salons = await prisma.salon.findMany({
        where: { ownerId },
        include: {
          services: {
            where: { isActive: true },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(salons)
    }

    // Pour la page publique - récupérer tous les salons actifs
    const salons = await prisma.salon.findMany({
      where: { isActive: true },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(salons)
  } catch (error) {
    console.error("Erreur lors de la récupération des salons:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession(request)
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    const user = session.user;

    const body = await request.json()
    const { name, description, address, city, phone, email, imageUrl } = body

    // Validation basique
    if (!name || !address || !city || !phone) {
      return NextResponse.json(
        { error: "Tous les champs requis ne sont pas remplis" },
        { status: 400 }
      )
    }

    const salon = await prisma.salon.create({
      data: {
        name,
        description,
        address,
        city,
        phone,
        email,
        imageUrl,
        ownerId: user.id,
        isActive: true,
        rating: 0,
      },
      include: {
        services: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    })

    return NextResponse.json(salon, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du salon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}