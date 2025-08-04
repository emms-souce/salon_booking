export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: ServiceCategory
  image?: string
  features?: string[]
  salonId: string
  createdAt: Date
  updatedAt: Date
}

export type ServiceCategory = 
  | "haircut"
  | "coloring" 
  | "styling"
  | "treatment"
  | "braids"
  | "makeup"

export interface CreateServiceInput {
  name: string
  description: string
  price: number
  duration: number
  category: ServiceCategory
  image?: string
  features?: string[]
  salonId: string
}

export interface UpdateServiceInput {
  name?: string
  description?: string
  price?: number
  duration?: number
  category?: ServiceCategory
  image?: string
  features?: string[]
}