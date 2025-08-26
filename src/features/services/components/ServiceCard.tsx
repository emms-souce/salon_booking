"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ServiceModal } from "./ServiceModal"
import Image from "next/image"
import { ServiceWithSalon } from "../hooks/useServices"
import { MapPin, Star, Clock } from "lucide-react"

interface ServiceCardProps {
  service: ServiceWithSalon
}

// Fonction pour formater le prix en FCFA
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('XAF', 'FCFA')
}

// Fonction pour traduire les catégories
const getCategoryLabel = (category: string) => {
  const categories = {
    haircut: "Coupe",
    coloring: "Coloration", 
    styling: "Coiffage",
    treatment: "Soin",
    braids: "Tresses",
    makeup: "Maquillage"
  }
  return categories[category as keyof typeof categories] || category
}

// Fonction pour obtenir la couleur du badge selon la catégorie
const getCategoryColor = (category: string) => {
  const colors = {
    haircut: "bg-blue-500",
    coloring: "bg-purple-500", 
    styling: "bg-pink-500",
    treatment: "bg-green-500",
    braids: "bg-orange-500",
    makeup: "bg-red-500"
  }
  return colors[category as keyof typeof colors] || "bg-gray-500"
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white border border-gray-200">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={service.image || "/placeholder-service.jpg"}
            alt={service.name}
            fill
            className="transition-transform duration-300 hover:scale-110 object-cover"
          />
          <Badge className={`absolute top-3 right-3 text-white border-0 ${getCategoryColor(service.category)}`}>
            {getCategoryLabel(service.category)}
          </Badge>
          {/* Badge prix en overlay */}
          <div className="absolute bottom-3 left-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(service.price)}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
            {service.name}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-gray-600">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4">
          {/* Informations du salon */}
          <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{service.salon.name}</span>
              <span className="text-gray-400">•</span>
              <span>{service.salon.city}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{service.salon.rating}</span>
            </div>
          </div>
          
          {/* Durée */}
          <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{service.duration} minutes</span>
          </div>
          
          {/* Caractéristiques */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 mb-2">Inclus :</p>
              {service.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                  {feature}
                </div>
              ))}
              {service.features.length > 3 && (
                <p className="text-xs text-gray-500 mt-1">
                  +{service.features.length - 3} autre(s) avantage(s)
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white" 
            onClick={() => setIsModalOpen(true)}
          >
            Réserver maintenant
          </Button>
        </CardFooter>
      </Card>
      
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
        salonId={service.salonId}
      />
    </>
  )
}