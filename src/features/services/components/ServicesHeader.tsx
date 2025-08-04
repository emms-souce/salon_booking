"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export function ServicesHeader() {
  const router = useRouter()

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nos Services</h1>
          <p className="text-gray-600 mt-2">
            Découvrez notre gamme complète de services de coiffure professionnels
          </p>
        </div>
        
        <Button 
          className="w-full sm:w-auto"
          onClick={() => router.push("/services/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>
    </div>
  )
}