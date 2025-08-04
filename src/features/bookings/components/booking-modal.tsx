"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookingForm } from "./booking-form"
import { Service } from "@/features/services/types"
import { CheckCircle } from "lucide-react"

interface BookingModalProps {
  salonId: string
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ salonId, service, isOpen, onClose }: BookingModalProps) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const handleBookingSuccess = (booking: any) => {
    setBookingDetails(booking)
    setBookingConfirmed(true)
  }

  const handleClose = () => {
    onClose()
    setBookingConfirmed(false)
    setBookingDetails(null)
  }

  const handleBookAnother = () => {
    setBookingConfirmed(false)
    setBookingDetails(null)
  }

  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {bookingConfirmed ? "Réservation confirmée" : "Réserver un service"}
          </DialogTitle>
          <DialogDescription>
            {bookingConfirmed
              ? "Votre réservation a été confirmée avec succès."
              : `Réservez ${service.name} pour ${service.price}€`}
          </DialogDescription>
        </DialogHeader>

        {bookingConfirmed ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Réservation confirmée!</h3>
                <p className="text-sm text-muted-foreground">
                  Votre réservation pour {service.name} est confirmée.
                </p>
                {bookingDetails && (
                  <div className="text-sm text-muted-foreground">
                    <p>Date: {new Date(bookingDetails.date).toLocaleDateString('fr-FR')}</p>
                    <p>Heure: {bookingDetails.startTime}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Fermer
              </Button>
              <Button className="flex-1" onClick={handleBookAnother}>
                Réserver un autre créneau
              </Button>
            </div>
          </div>
        ) : (
          <BookingForm
            salonId={salonId}
            service={service}
            onSuccess={handleBookingSuccess}
            onCancel={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}