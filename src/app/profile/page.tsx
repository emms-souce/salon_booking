"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/features/profile/components/ProfileForm"
import { ProfilePictureUpload } from "@/features/profile/components/ProfilePictureUpload"

// Type étendu pour l'utilisateur avec les propriétés optionnelles
type ExtendedUser = {
  id: string
  name?: string | null
  email: string
  image?: string | null
  phone?: string | null
  bio?: string | null
  address?: string | null
  createdAt: Date
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  
  // Cast de l'utilisateur vers le type étendu
  const extendedUser = user as ExtendedUser | null

  if (!extendedUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Veuillez vous connecter pour accéder à votre profil.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600 mt-2">Gérez vos informations personnelles et préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle>Photo de profil</CardTitle>
                <CardDescription>Ajoutez ou modifiez votre photo de profil</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePictureUpload 
                  currentImage={extendedUser.image} 
                  onUploadComplete={(url) => updateProfile({ image: url })}
                />
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm 
                  user={{
                    id: extendedUser.id,
                    name: extendedUser.name,
                    email: extendedUser.email,
                    phone: extendedUser.phone,
                    bio: extendedUser.bio,
                    address: extendedUser.address,
                  }}
                  onSave={async (data) => {
                    await updateProfile(data)
                  }}
                />
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle>Coordonnées</CardTitle>
                <CardDescription>Vos informations de contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span>
                <p>{extendedUser.email}</p>
              </div>
              <div>
                <span className="font-medium">Téléphone:</span>
                <p>{extendedUser.phone || "Non renseigné"}</p>
              </div>
              <div>
                <span className="font-medium">Membre depuis:</span>
                <p>{new Date(extendedUser.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <span className="font-medium">Adresse:</span>
                <p>{extendedUser.address || "Non renseignée"}</p>
              </div>
            </div>
            {extendedUser.bio && (
              <div>
                <span className="font-medium">Bio:</span>
                <p className="text-sm text-gray-600 mt-1">{extendedUser.bio}</p>
              </div>
            )}
          </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>Gérez vos préférences et paramètres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifications email</Label>
                    <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                  </div>
                  <input type="checkbox" id="notifications" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms">Notifications SMS</Label>
                    <p className="text-sm text-gray-500">Recevoir des rappels par SMS</p>
                  </div>
                  <input type="checkbox" id="sms" className="rounded" />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="language">Langue préférée</Label>
                  <select id="language" className="mt-1 block w-full rounded-md border-gray-300">
                    <option>Français</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>Gérez la sécurité de votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Modifier le mot de passe
                </Button>
                <Button variant="outline" className="w-full">
                  Activer l&apos;authentification à deux facteurs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}