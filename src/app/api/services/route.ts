import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const salonId = searchParams.get("salonId")
    const category = searchParams.get("category")

    const where: any = { isActive: true }
    
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
    const body = await request.json()
    const { name, description, price, duration, category, salonId, features, image } = body

    // Validation basique
    if (!name || !price || !duration || !category || !salonId) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        salonId,
        features: features || [],
        image: image || null,
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