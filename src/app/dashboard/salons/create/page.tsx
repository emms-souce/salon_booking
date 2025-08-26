"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { CreateSalonForm } from "@/features/salons/components/create-salon-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateSalonPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer un nouveau salon</h1>
          <p className="mt-2 text-gray-600">
            Ajoutez votre salon de coiffure et commencez à recevoir des clients
          </p>
        </div>
        
        <CreateSalonForm />
      </div>
    </div>
  )
}