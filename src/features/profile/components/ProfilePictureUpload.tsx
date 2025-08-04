"use client"

import { useState } from "react"
import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface ProfilePictureUploadProps {
  currentImage?: string | null
  onUploadComplete: (url: string) => void
}

export function ProfilePictureUpload({ currentImage, onUploadComplete }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB')
      return
    }

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simuler l'upload (dans une vraie app, vous uploaderez vers votre serveur)
    setIsUploading(true)
    try {
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Dans une vraie app, vous uploaderez le fichier et obtiendrez l'URL
      const fakeUrl = URL.createObjectURL(file)
      onUploadComplete(fakeUrl)
      toast.success('Photo de profil mise à jour')
      setPreview(null)
    } catch (error) {
      toast.error('Erreur lors de l\'upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setPreview(null)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center space-x-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview || currentImage || undefined} />
        <AvatarFallback className="text-2xl">
          {currentImage ? '?' : 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {currentImage ? 'Changer' : 'Uploader'}
          </Button>
          
          {currentImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <p className="text-xs text-gray-500">
          JPG, PNG ou GIF. Max 5MB.
        </p>
      </div>
    </div>
  )
}