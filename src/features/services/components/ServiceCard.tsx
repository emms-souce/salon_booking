"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Service } from "../types"
import { ServiceModal } from "./ServiceModal"
import ImageWithFallback from "@/components/shared/ImageWithFallback"

interface ServiceCardProps {
  service: Service
  salonId: string
}

export function ServiceCard({ service, salonId }: ServiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          <ImageWithFallback
            src={service.image}
            alt={service.name}
            fill
            type="service"
            className="rounded-lg"
          />
          <Badge className="absolute top-2 right-2 bg-black text-white">
            {service.category}
          </Badge>
        </div>
        
        <CardHeader>
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {service.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-black">
            {service.price}€
          </span>
            <span className="text-sm text-gray-500">
              {service.duration} min
            </span>
          </div>
          
          {service.features && service.features.length > 0 && (
            <div className="space-y-1">
              {service.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  {feature}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => setIsModalOpen(true)}
          >
            Réserver
          </Button>
        </CardFooter>
      </Card>
      
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
        salonId={salonId}
      />
    </>
  )
}