"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Service } from "../types"
import { BookingModal } from "@/features/bookings/components/booking-modal"

interface ServiceModalProps {
  service: Service
  salonId: string
  isOpen: boolean
  onClose: () => void
}

export function ServiceModal({ service, salonId, isOpen, onClose }: ServiceModalProps) {
  const [showBookingModal, setShowBookingModal] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {service.name}
            <Badge>{service.category}</Badge>
          </DialogTitle>
          <DialogDescription>
            {service.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-primary">{service.price}€</p>
              <p className="text-sm text-gray-600">{service.duration} minutes</p>
            </div>
          </div>

          {service.features && service.features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Ce service comprend :</h4>
              <ul className="space-y-1">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Détails du service</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Prix :</span>
                <span className="font-medium">{service.price}€</span>
              </div>
              <div className="flex justify-between">
                <span>Durée :</span>
                <span className="font-medium">{service.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Catégorie :</span>
                <span className="font-medium">{service.category}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => setShowBookingModal(true)}>
            Réserver ce service
          </Button>
        </DialogFooter>
      </DialogContent>

      <BookingModal
        salonId={salonId}
        service={service}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </Dialog>
  )
}