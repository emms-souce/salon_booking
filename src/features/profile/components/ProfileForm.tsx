"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const profileFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  bio: z.string().max(500, "La bio ne peut pas dépasser 500 caractères").optional(),
  address: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    phone?: string | null
    bio?: string | null
    address?: string | null
  }
  onSave: (data: Partial<ProfileFormValues>) => Promise<void>
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      address: user.address || "",
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      await onSave(data)
      toast.success("Profil mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom complet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="votre@email.com" {...field} />
              </FormControl>
              <FormDescription>
                Cette adresse email sera utilisée pour les notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+237 6 XX XX XX XX" {...field} />
              </FormControl>
              <FormDescription>
                Optionnel - pour les rappels par SMS
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Votre adresse" {...field} />
              </FormControl>
              <FormDescription>
                Optionnel - pour les recommandations de salons proches
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>À propos de vous</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Dites-nous en plus sur vous..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optionnel - une courte description de vous
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour le profil
        </Button>
      </form>
    </Form>
  )
}