import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z, ZodError } from "zod"
import { prisma } from "@/lib/prisma"

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Validation des données
  const validationResult = registerSchema.safeParse(body)
  if (!validationResult.success) {
    const errorDetails = validationResult.error.issues
    return NextResponse.json(
      { error: "Données invalides", details: errorDetails },
      { status: 400 }
    )
  }
  const validatedData = validationResult.data
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      )
    }
    
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user },
      { status: 201 }
    )
    
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}