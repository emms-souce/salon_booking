"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useBookings } from "../hooks/use-bookings"
import { Service } from "@/features/services/types"

const bookingFormSchema = z.object({
  date: z.date({
    message: "Veuillez sélectionner une date",
  }),
  startTime: z.string({
    message: "Veuillez sélectionner une heure",
  }),
  notes: z.string().optional(),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

interface BookingResult {
  id: string
  date: Date | string
  startTime: Date | string
  endTime?: Date | string
  status?: string
}

interface BookingFormProps {
  salonId: string
  service: Service
  onSuccess?: (booking: BookingResult) => void
  onCancel?: () => void
}

export function BookingForm({ salonId, service, onSuccess, onCancel }: BookingFormProps) {
  const { createBooking, checkAvailability, availability, loading } = useBookings()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // Fonction pour formater l'heure de manière lisible
  const formatTimeForDisplay = (timeValue: string) => {
    if (!timeValue) return ''
    
    // Si c'est une date ISO, extraire juste l'heure
    if (timeValue.includes('T')) {
      const date = new Date(timeValue)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return `${hours}h${minutes !== 0 ? minutes.toString().padStart(2, '0') : ''}`
    }
    
    // Si c'est déjà au format HH:MM, on le convertit
    if (timeValue.includes(':')) {
      const [hours, minutes] = timeValue.split(':')
      const hour = parseInt(hours)
      const min = parseInt(minutes)
      return `${hour}h${min !== 0 ? min.toString().padStart(2, '0') : ''}`
    }
    
    return timeValue
  }

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      notes: "",
    },
  })

  const selectedDateValue = form.watch("date")

  useEffect(() => {
    if (selectedDateValue) {
      checkAvailability(
        salonId,
        service.id,
        format(selectedDateValue, "yyyy-MM-dd")
      )
    }
  }, [selectedDateValue, salonId, service.id, checkAvailability])

  const onSubmit = async (data: BookingFormValues) => {
    if (!data.date) return

    const booking = await createBooking(
      salonId,
      service.id,
      format(data.date, "yyyy-MM-dd"),
      data.startTime,
      data.notes
    )

    if (booking && onSuccess) {
      onSuccess(booking)
    }
  }

  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de réservation</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      setSelectedDate(date)
                    }}
                    disabled={disabledDays}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Choisissez une date pour votre réservation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure de réservation</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedDateValue || availability.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une heure">
                      {field.value ? `À ${formatTimeForDisplay(field.value)}` : "Sélectionner une heure"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availability.map((slot) => (
                    <SelectItem key={slot.startTime} value={slot.startTime}>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {formatTimeForDisplay(slot.startTime)} - {formatTimeForDisplay(slot.endTime)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {availability.length === 0 && selectedDateValue
                  ? "Aucun créneau disponible pour cette date"
                  : "Sélectionnez l'heure de début de votre réservation"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes supplémentaires (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Des instructions spéciales pour votre réservation..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Toute information supplémentaire que vous souhaitez partager
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Service :</span>
            <span className="font-medium">{service.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Durée :</span>
            <span className="font-medium">{service.duration} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Prix :</span>
            <span className="font-medium">{service.price} €</span>
          </div>
        </div>

        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || !form.watch("date") || !form.watch("startTime")}
          >
            {loading ? "Réservation..." : "Réserver"}
          </Button>
        </div>
      </form>
    </Form>
  )
}