"use server"

import { getAuthSessionServer } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createSalonSchema = z.object({
  name: z.string().min(3, "Le nom du salon doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, "Numéro de téléphone invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export async function createSalon(data: z.infer<typeof createSalonSchema>) {
  try {
    // Vérifier l'authentification
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Vous devez être connecté pour créer un salon")
    }
    const user = session.user;

    // Valider les données
    const validatedData = createSalonSchema.parse(data)

    // Nettoyer les champs optionnels vides
    const cleanData = {
      ...validatedData,
      email: validatedData.email === "" ? null : validatedData.email,
      imageUrl: validatedData.imageUrl === "" ? null : validatedData.imageUrl,
      description: validatedData.description === "" ? null : validatedData.description,
    }

    // Créer le salon
    const salon = await prisma.salon.create({
      data: {
        ...cleanData,
        ownerId: user.id,
        isActive: true,
      },
    })

    revalidatePath("/salons")
    revalidatePath("/dashboard")

    return { success: true, salon }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.issues 
      }
    }
    
    console.error("Erreur lors de la création du salon:", error)
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création du salon" 
    }
  }
}

export async function getUserSalons() {
  try {
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Non authentifié")
    }
    const user = session.user;

    const salons = await prisma.salon.findMany({
      where: {
        ownerId: user.id,
      },
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, salons }
  } catch (error) {
    console.error("Erreur lors de la récupération des salons:", error)
    return { success: false, error: "Impossible de récupérer vos salons" }
  }
}

export async function updateSalonStatus(salonId: string, isActive: boolean) {
  try {
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Non authentifié")
    }
    const user = session.user;

    // Vérifier que l'utilisateur est bien le propriétaire
    const salon = await prisma.salon.findUnique({
      where: { id: salonId },
    })

    if (!salon || salon.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à modifier ce salon")
    }

    const updatedSalon = await prisma.salon.update({
      where: { id: salonId },
      data: { isActive },
    })

    revalidatePath("/dashboard")
    revalidatePath(`/salons/${salonId}`)

    return { success: true, salon: updatedSalon }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du salon:", error)
    return { success: false, error: "Impossible de modifier le salon" }
  }
}