"use client"

import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Award, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/hooks/useAuth"

export function ServicesHeader() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="mb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-2xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-full">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Services de Coiffure
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              au Cameroun
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Découvrez une large gamme de services professionnels dans les meilleurs salons 
            de Douala, Yaoundé et d&apos;autres villes du Cameroun
          </p>
          
          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Professionnels certifiés</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Users className="h-5 w-5 text-blue-400" />
              <span>Plus de 50 salons partenaires</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>Services de qualité premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tous nos services</h2>
          <p className="text-gray-600 mt-1">
            Trouvez le service parfait parmi notre sélection de prestations professionnelles
          </p>
        </div>
        
        {user && (
          <Button 
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white"
            onClick={() => router.push("/services/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un service
          </Button>
        )}
      </div>
    </div>
  )
}