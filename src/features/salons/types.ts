export interface Salon {
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
  services?: Service[]
  reviews?: Review[]
}

export interface CreateSalonData {
  name: string
  description?: string
  address: string
  city: string
  phone: string
  email?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
}

export interface UpdateSalonData {
  name?: string
  description?: string
  address?: string
  city?: string
  phone?: string
  email?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  isActive?: boolean
}

// Types partagés entre features
export interface Service {
  id: string
  name: string
  description?: string | null
  price: number
  duration: number
  category: string
  isActive: boolean
  salonId: string
  bookings?: Booking[]
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  salonId: string
  user?: {
    name?: string | null
    email: string
  }
}

export interface Booking {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string | null
  totalPrice: number
  userId: string
  salonId: string
  serviceId: string
  service?: Service
}