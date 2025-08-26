"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { CreateServiceInput, ServiceCategory } from "@/features/services/types"
import { useAuth } from "@/features/auth/hooks/useAuth"

const categories = [
  { value: "haircut", label: "Coupe de cheveux" },
  { value: "coloring", label: "Coloration" },
  { value: "styling", label: "Coiffage" },
  { value: "treatment", label: "Soin capillaire" },
  { value: "braids", label: "Tresses" },
  { value: "makeup", label: "Maquillage" },
]

interface Salon {
  id: string
  name: string
  city: string
}

export default function NewServicePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [salons, setSalons] = useState<Salon[]>([])
  const [loadingSalons, setLoadingSalons] = useState(true)
  const [formData, setFormData] = useState<CreateServiceInput>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    category: "haircut",
    salonId: "",
    features: [],
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadUserSalons()
  }, [user, router])

  async function loadUserSalons() {
    try {
      const response = await fetch(`/api/salons?ownerId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setSalons(data)
        if (data.length === 1) {
          // Si l'utilisateur n'a qu'un salon, le sélectionner automatiquement
          setFormData(prev => ({ ...prev, salonId: data[0].id }))
        }
      } else {
        toast.error("Impossible de charger vos salons")
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des salons")
    } finally {
      setLoadingSalons(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.salonId) {
      toast.error("Veuillez sélectionner un salon")
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la création du service")
      }

      toast.success("Service créé avec succès")
      router.push("/services")
    } catch (error) {
      console.error("Error creating service:", error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création du service")
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureChange = (value: string) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f)
    setFormData(prev => ({ ...prev, features }))
  }

  if (!user) {
    return null
  }

  if (loadingSalons) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (salons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun salon trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Vous devez d&apos;abord créer un salon avant d&apos;ajouter des services
              </p>
              <Button onClick={() => router.push("/dashboard/salons/create")}>
                Créer un salon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/services")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux services
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un nouveau service</CardTitle>
          <CardDescription>
            Créez un nouveau service pour votre salon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salon">Salon</Label>
              <Select
                value={formData.salonId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, salonId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un salon" />
                </SelectTrigger>
                <SelectContent>
                  {salons.map((salon) => (
                    <SelectItem key={salon.id} value={salon.id}>
                      {salon.name} - {salon.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom du service</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Ex: Coupe homme"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Décrivez le service en détail..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (FCFA)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
                    setFormData(prev => ({ ...prev, price: isNaN(value) ? 0 : value }))
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={formData.duration || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 30 : parseInt(e.target.value)
                    setFormData(prev => ({ ...prev, duration: isNaN(value) ? 30 : value }))
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ServiceCategory }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Fonctionnalités (séparées par des virgules)</Label>
              <Input
                id="features"
                placeholder="Shampooing, coupe, brushing"
                onChange={(e) => handleFeatureChange(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/services")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer le service"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}