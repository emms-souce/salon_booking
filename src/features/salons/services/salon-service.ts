import { Salon } from "../types"

// Fonction utilitaire pour valider les URLs d'images
function validateImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  
  // Vérifier que c'est une URL valide
  if (!url.startsWith('http')) return null
  
  // Vérifier que ce n'est pas une page de recherche ou similaire
  const invalidPaths = ['/search/', '/browse/', '/category/', '/free-backgrounds-photos/', '/collection/', '/tag/']
  if (invalidPaths.some(path => url.includes(path))) {
    return null
  }
  
  // Vérifier que l'URL se termine par une extension d'image ou vient d'un CDN connu
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']
  const knownImageCDNs = [
    'images.unsplash.com', 
    'images.pexels.com', 
    'cdn.', 
    'image.shutterstock.com',
    'res.cloudinary.com',
    'i.imgur.com'
  ]
  
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext))
  const isFromKnownCDN = knownImageCDNs.some(cdn => url.includes(cdn))
  
  // Cas spéciaux pour des domaines connus qui hébergent des pages plutôt que des images directes
  const problematicDomains = ['pngtree.com', 'shutterstock.com/fr/']
  const isProblematicDomain = problematicDomains.some(domain => url.includes(domain))
  
  if (isProblematicDomain && !hasImageExtension) {
    return null
  }
  
  return (hasImageExtension || isFromKnownCDN) ? url : null
}

export interface SalonWithDetails {
  id: string
  name: string
  description?: string | null
  address: string
  city: string
  phone: string
  email?: string | null
  imageUrl?: string | null
  rating: number
  latitude?: number | null
  longitude?: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  ownerId: string
  services: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  _count: {
    bookings: number
    reviews: number
  }
}

class SalonService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  async getAllSalons(): Promise<SalonWithDetails[]> {
    const response = await fetch(`/api/salons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération des salons")
    }

    const salons = await response.json()
    
    // Valider et nettoyer les URLs d'images
    return salons.map((salon: SalonWithDetails) => ({
      ...salon,
      imageUrl: validateImageUrl(salon.imageUrl)
    }))
  }

  async getSalonsByOwner(ownerId: string): Promise<SalonWithDetails[]> {
    const response = await fetch(`/api/salons?ownerId=${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération des salons")
    }

    const salons = await response.json()
    
    // Valider et nettoyer les URLs d'images
    return salons.map((salon: SalonWithDetails) => ({
      ...salon,
      imageUrl: validateImageUrl(salon.imageUrl)
    }))
  }

  async getSalonById(salonId: string): Promise<SalonWithDetails> {
    const response = await fetch(`/api/salons/${salonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la récupération du salon")
    }

    const salon = await response.json()
    
    // Valider et nettoyer l'URL d'image
    return {
      ...salon,
      imageUrl: validateImageUrl(salon.imageUrl)
    }
  }

  async createSalon(salonData: {
    name: string
    description?: string
    address: string
    city: string
    phone: string
    email?: string
    imageUrl?: string
  }): Promise<SalonWithDetails> {
    const response = await fetch(`/api/salons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(salonData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Erreur lors de la création du salon")
    }

    return response.json()
  }
}

export const salonService = new SalonService()