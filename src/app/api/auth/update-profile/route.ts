import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/better-auth"
import { prisma } from "@/lib/prisma"
import { getAuthSession } from "@/lib/auth-helpers"

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getAuthSession(request)

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, email, phone, image, bio, address } = data as Partial<{
      name: string
      email: string
      phone: string
      image: string
      bio: string
      address: string
    }>

    // Validation des données
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      )
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(image !== undefined && { image }),
        ...(bio !== undefined && { bio }),
        ...(address !== undefined && { address }),
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}