"use server"

import { getAuthSessionServer } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const createServiceSchema = z.object({
  name: z.string().min(2, "Le nom du service doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  price: z.number().positive("Le prix doit être positif"),
  duration: z.number().positive("La durée doit être positive"),
  category: z.string().min(2, "La catégorie doit contenir au moins 2 caractères"),
  salonId: z.string().cuid("ID de salon invalide"),
})

const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().cuid("ID de service invalide"),
  isActive: z.boolean().optional(),
})

export async function createService(data: z.infer<typeof createServiceSchema>) {
  try {
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Vous devez être connecté pour ajouter un service")
    }
    const user = session.user;

    // Valider les données
    const validatedData = createServiceSchema.parse(data)

    // Vérifier que l'utilisateur est bien le propriétaire du salon
    const salon = await prisma.salon.findUnique({
      where: { id: validatedData.salonId },
    })

    if (!salon || salon.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à ajouter des services à ce salon")
    }

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        isActive: true,
      },
    })

    revalidatePath(`/salons/${validatedData.salonId}`)
    revalidatePath("/dashboard")

    return { success: true, service }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.issues
      }
    }
    
    console.error("Erreur lors de la création du service:", error)
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création du service" 
    }
  }
}

export async function updateService(data: z.infer<typeof updateServiceSchema>) {
  try {
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Non authentifié")
    }
    const user = session.user;

    const validatedData = updateServiceSchema.parse(data)

    // Vérifier que l'utilisateur est bien le propriétaire du salon
    const service = await prisma.service.findUnique({
      where: { id: validatedData.id },
      include: { salon: true },
    })

    if (!service || service.salon.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à modifier ce service")
    }

    const updatedService = await prisma.service.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        duration: validatedData.duration,
        category: validatedData.category,
        isActive: validatedData.isActive,
      },
    })

    revalidatePath(`/salons/${service.salonId}`)
    revalidatePath("/dashboard")

    return { success: true, service: updatedService }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: error.issues
      }
    }
    
    console.error("Erreur lors de la mise à jour du service:", error)
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la mise à jour du service" 
    }
  }
}

export async function deleteService(serviceId: string) {
  try {
    const session = await getAuthSessionServer()

    if (!session?.user?.id) {
      throw new Error("Non authentifié")
    }
    const user = session.user;

    // Vérifier que l'utilisateur est bien le propriétaire
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { salon: true },
    })

    if (!service || service.salon.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce service")
    }

    // Soft delete en désactivant le service
    const deletedService = await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    })

    revalidatePath(`/salons/${service.salonId}`)
    revalidatePath("/dashboard")

    return { success: true, service: deletedService }
  } catch (error) {
    console.error("Erreur lors de la suppression du service:", error)
    return { success: false, error: "Impossible de supprimer le service" }
  }
}

export async function getSalonServices(salonId: string) {
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
      throw new Error("Vous n'êtes pas autorisé à voir les services de ce salon")
    }

    const services = await prisma.service.findMany({
      where: {
        salonId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return { success: true, services }
  } catch (error) {
    console.error("Erreur lors de la récupération des services:", error)
    return { success: false, error: "Impossible de récupérer les services" }
  }
}