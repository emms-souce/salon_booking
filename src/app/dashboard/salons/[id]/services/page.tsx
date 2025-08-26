"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { getSalonServices, createSalonService, updateSalonService, deleteService } from "@/features/salons/actions/service-management"
import { toast } from "sonner"
import { Plus, Edit, Trash2, PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const serviceSchema = z.object({
  name: z.string().min(1, "Le nom du service est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  duration: z.number().min(15, "La durée minimale est 15 minutes"),
  category: z.string().min(1, "La catégorie est requise"),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
  salonId: string
  createdAt: Date
}

export default function SalonServicesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const salonId = params.id as string
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)


  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "haircut",
    },
  })

  useEffect(() => {
    if (user && salonId) {
      loadServices()
    }
  }, [user, salonId])

  async function loadServices() {
    try {
      const result = await getSalonServices(salonId)
      if (result.success) {
        setServices(result.services as Service[])
      } else {
        toast.error(result.error || "Impossible de charger les services")
      }
    } catch (error) {
      toast.error("Impossible de charger les services")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: ServiceFormData) {
    try {
      let result
      if (editingService) {
        result = await updateSalonService(editingService.id, data)
      } else {
        result = await createSalonService(salonId, data)
      }

      if (result.success) {
        toast.success(result.message || "Opération réussie")
        setOpen(false)
        setEditingService(null)
        form.reset()
        loadServices()
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  async function handleDelete(serviceId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return
    }

    try {
      const result = await deleteService(serviceId)
      if (result.success) {
        toast.success("Le service a été supprimé avec succès")
        loadServices()
      } else {
        toast.error(result.error || "Impossible de supprimer le service")
      }
    } catch (error) {
      toast.error("Impossible de supprimer le service")
    }
  }

  function openEditDialog(service: Service) {
    setEditingService(service)
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
    })
    setOpen(true)
  }

  function openCreateDialog() {
    setEditingService(null)
    form.reset()
    setOpen(true)
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services du salon</h1>
              <p className="mt-2 text-gray-600">
                Gérez les services proposés par votre salon
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingService ? "Modifier le service" : "Créer un service"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingService 
                      ? "Modifiez les informations du service" 
                      : "Ajoutez un nouveau service à votre salon"
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du service</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={form.watch("price") || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 0 : parseFloat(e.target.value)
                        form.setValue("price", isNaN(value) ? 0 : value)
                      }}
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="15"
                      step="15"
                      value={form.watch("duration") || ""}
                      onChange={(e) => {
                        const value = e.target.value === "" ? 30 : parseInt(e.target.value)
                        form.setValue("duration", isNaN(value) ? 30 : value)
                      }}
                    />
                    {form.formState.errors.duration && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.duration.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={form.watch("category")}
                      onValueChange={(value) => form.setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="haircut">Coupe de cheveux</SelectItem>
                        <SelectItem value="coloring">Coloration</SelectItem>
                        <SelectItem value="styling">Coiffage</SelectItem>
                        <SelectItem value="treatment">Soin capillaire</SelectItem>
                        <SelectItem value="braids">Tresses</SelectItem>
                        <SelectItem value="makeup">Maquillage</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingService ? "Mettre à jour" : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun service pour le moment
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez par ajouter votre premier service
                </p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un service
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prix:</span>
                      <Badge>{service.price} FCFA</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Durée:</span>
                      <Badge variant="outline">{service.duration} min</Badge>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}