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

interface BookingDetails {
  id: string
  date: string | Date
  startTime: string | Date
  endTime?: string | Date
}

interface BookingModalProps {
  salonId: string
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ salonId, service, isOpen, onClose }: BookingModalProps) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)

  // Fonction pour formater l'heure de manière plus lisible
  const formatTime = (timeValue: string | Date) => {
    if (!timeValue) {
      return 'Heure à confirmer'
    }
    
    let timeString: string
    if (timeValue instanceof Date) {
      timeString = timeValue.toTimeString().slice(0, 5)
    } else {
      timeString = timeValue
    }
    
    if (timeString === '00:00') {
      return 'Heure à confirmer'
    }
    
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const min = minutes || '00'
    
    return `${hour}h${min !== '00' ? min : ''}`
  }

  const handleBookingSuccess = (booking: BookingDetails) => {
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
                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800">
                    <p className="font-medium">Détail de votre réservation :</p>
                    <p>📅 Date: {new Date(bookingDetails.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                    <p>🕰️ Heure: {formatTime(bookingDetails.startTime)}</p>
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