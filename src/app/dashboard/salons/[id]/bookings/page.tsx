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
import { useParams } from "next/navigation"

export default function SalonBookingsPage() {
  const params = useParams()
  const salonId = params.id as string
  const { bookings, loading, updateBookingStatus } = useBookings({ salonId })
  const [activeTab, setActiveTab] = useState("pending")

  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING")
  const confirmedBookings = bookings.filter((booking) => booking.status === "CONFIRMED")
  const completedBookings = bookings.filter((booking) => booking.status === "COMPLETED")
  const cancelledBookings = bookings.filter((booking) => booking.status === "CANCELLED")

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

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    await updateBookingStatus(bookingId, status)
  }

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card key={booking.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.service?.name}</CardTitle>
            <CardDescription>
              Réservé par {booking.user?.name || booking.user?.email}
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
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{booking.user?.email}</span>
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
                <>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirmer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </>
              )}
              {booking.status === "CONFIRMED" && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleUpdateStatus(booking.id, "COMPLETED")}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Marquer comme terminé
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(booking.id, "CANCELLED")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                </>
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Réservations</h1>
        <p className="text-muted-foreground">
          Gérez toutes les réservations de votre salon
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            En attente ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmées ({confirmedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length > 0 ? (
            pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation en attente</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedBookings.length > 0 ? (
            confirmedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation confirmée</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length > 0 ? (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation terminée</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réservation annulée</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}