"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const salonSchema = z.object({
  name: z.string().min(1, "Le nom du salon est requis"),
  description: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").optional(),
  imageUrl: z.string().url("URL invalide").optional(),
})

type SalonFormData = z.infer<typeof salonSchema>

export default function EditSalonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: salonId } = use(params);
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const form = useForm<SalonFormData>({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      imageUrl: "",
    },
  })

  useEffect(() => {
    if (user && salonId) {
      loadSalon()
    }
  }, [user, salonId])

  async function loadSalon() {
    try {
      const response = await fetch(`/api/salons/${salonId}`)
      if (response.ok) {
        const salon = await response.json()
        form.reset({
          name: salon.name,
          description: salon.description || "",
          address: salon.address,
          city: salon.city,
          phone: salon.phone,
          email: salon.email || "",
          imageUrl: salon.imageUrl || "",
        })
      } else {
        toast.error("Impossible de charger les informations du salon")
        router.push("/dashboard/salons")
      }
    } catch (error) {
      toast.error("Impossible de charger les informations du salon")
      router.push("/dashboard/salons")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: SalonFormData) {
    setSaving(true)
    try {
      const response = await fetch(`/api/salons/${salonId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success("Les informations du salon ont été mises à jour")
        router.push("/dashboard/salons")
      } else {
        const error = await response.json()
        toast.error(error.error || "Impossible de mettre à jour le salon")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setSaving(false)
    }
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier le salon</h1>
          <p className="mt-2 text-gray-600">
            Mettez à jour les informations de votre salon
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations du salon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du salon</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Nom de votre salon"
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
                  placeholder="Description de votre salon"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Adresse complète"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Ville"
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="Numéro de téléphone"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="email@exemple.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="imageUrl">URL de l&apos;image (optionnel)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  {...form.register("imageUrl")}
                  placeholder="https://exemple.com/image.jpg"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.imageUrl.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/salons")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}