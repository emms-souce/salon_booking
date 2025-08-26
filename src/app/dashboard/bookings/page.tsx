"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Clock, MapPin, User, Calendar, X, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBookings } from "@/features/bookings/hooks/use-bookings"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface BookingWithDetails {
  id: string
  status: string
  date: string | Date
  startTime?: string | Date
  endTime?: string | Date
  notes?: string | null
  totalPrice: number
  service?: {
    name: string
  }
  salon?: {
    name: string
    address: string
  }
  user?: {
    name?: string
    email: string
  }
}

export default function BookingsDashboard() {
  const { user } = useAuth()
  const { bookings, loading, updateBookingStatus, cancelBooking, fetchBookings } = useBookings()
  const [activeTab, setActiveTab] = useState("upcoming")

  // Debug: afficher le nombre de réservations
  console.log('Debug: Nombre de réservations chargées:', bookings.length)

  // Fonction pour formater l'heure de manière plus lisible
  const formatTime = (timeValue: string | Date) => {
    if (!timeValue) {
      return 'Non défini'
    }
    
    let timeString: string
    if (timeValue instanceof Date) {
      timeString = timeValue.toTimeString().slice(0, 5)
    } else {
      timeString = timeValue
    }
    
    if (timeString === '00:00') {
      return 'Non défini'
    }
    
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const min = minutes || '00'
    
    return `${hour}h${min !== '00' ? min : ''}`
  }

  const formatTimeRange = (startTime?: string | Date, endTime?: string | Date) => {
    if (!startTime && !endTime) {
      return 'Horaire à confirmer'
    }
    
    if (startTime && endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`
    }
    
    return formatTime(startTime || endTime || '')
  }

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED" || booking.status === "PENDING"
  )
  const pastBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED" || booking.status === "CANCELLED"
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "success"
      case "PENDING":
        return "warning"
      case "CANCELLED":
        return "destructive"
      case "COMPLETED":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmé"
      case "PENDING":
        return "En attente"
      case "CANCELLED":
        return "Annulé"
      case "COMPLETED":
        return "Terminé"
      default:
        return status
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      await cancelBooking(bookingId)
    }
  }

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    await updateBookingStatus(bookingId, status)
  }

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => (
    <Card key={booking.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.service?.name}</CardTitle>
            <CardDescription>
              {booking.salon?.name} - {booking.salon?.address}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(booking.status)}>
            {getStatusText(booking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {format(new Date(booking.date), "EEEE dd MMMM yyyy", { locale: fr })}
            </span>
          </div>
          <div className="flex items-center text-sm bg-blue-50 p-2 rounded-md">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium text-blue-900">
              {formatTimeRange(booking.startTime, booking.endTime)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{booking.salon?.address}</span>
          </div>
          {booking.notes && (
            <div className="text-sm">
              <strong>Notes :</strong> {booking.notes}
            </div>
          )}
          <div className="flex justify-between items-center pt-3">
            <span className="text-lg font-semibold">{booking.totalPrice}€</span>
            <div className="flex gap-2">
              {booking.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirmer
                </Button>
              )}
              {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
              )}
              {booking.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Terminer
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Aucune réservation</h2>
          <p className="text-muted-foreground">
            Vous n&apos;avez aucune réservation pour le moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Réservations</h1>
            <p className="text-muted-foreground">
              Gérez toutes vos réservations en un seul endroit
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchBookings}
            disabled={loading}
          >
            {loading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            À venir ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Passées ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation à venir</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation passée</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}