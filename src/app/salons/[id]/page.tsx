"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/features/services/components/ServiceCard";
import { BookingModal } from "@/features/bookings/components/booking-modal";
import { Service, ServiceCategory } from "@/features/services/types";

// Données de démonstration
const salonData: {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
  services: Service[];
  openingHours: { day: string; open: string; close: string }[];
} = {
  id: "1",
  name: "Salon Élégance",
  description: "Le meilleur salon de coiffure de Douala avec des professionnels expérimentés et une ambiance moderne. Nous offrons une large gamme de services pour tous vos besoins capillaires.",
  address: "123 Rue des Palmiers, Akkwa",
  city: "Douala",
  phone: "+237 6 98 76 54 32",
  email: "contact@salonelegance.com",
  rating: 4.8,
  reviewsCount: 124,
  imageUrl: "/placeholder-salon-detail.jpg",
  latitude: 4.0483,
  longitude: 9.7043,
  services: [
    {
      id: "1",
      name: "Coupe homme",
      description: "Coupe moderne pour homme",
      price: 5000,
      duration: 30,
      category: "haircut",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "2",
      name: "Coiffure femme",
      description: "Coiffure élégante pour femme",
      price: 15000,
      duration: 60,
      category: "styling",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "3",
      name: "Tresses africaines",
      description: "Tresses traditionnelles africaines",
      price: 25000,
      duration: 120,
      category: "braids",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "4",
      name: "Soin capillaire",
      description: "Soin nourrissant pour cheveux",
      price: 8000,
      duration: 45,
      category: "treatment",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "5",
      name: "Coloration",
      description: "Coloration professionnelle",
      price: 20000,
      duration: 90,
      category: "coloring",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      id: "6",
      name: "Lissage",
      description: "Lissage brésilien ou japonais",
      price: 30000,
      duration: 120,
      category: "treatment",
      salonId: "1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  ],
  openingHours: [
    { day: "Lundi", open: "08:00", close: "18:00" },
    { day: "Mardi", open: "08:00", close: "18:00" },
    { day: "Mercredi", open: "08:00", close: "18:00" },
    { day: "Jeudi", open: "08:00", close: "18:00" },
    { day: "Vendredi", open: "08:00", close: "18:00" },
    { day: "Samedi", open: "08:00", close: "16:00" },
    { day: "Dimanche", open: "Fermé", close: "Fermé" }
  ]
};

export default function SalonDetailPage({ params }: { params: { id: string } }) {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-64 bg-gray-200">
          <Image
            src={salonData.imageUrl}
            alt={salonData.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-bold">{salonData.name}</h1>
            <p className="text-lg opacity-90">{salonData.address}</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>À propos</CardTitle>
                  <CardDescription>{salonData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1 font-medium">{salonData.rating}</span>
                      <span className="ml-1 text-gray-500">({salonData.reviewsCount} avis)</span>
                    </div>
                    <Badge variant="outline">{salonData.city}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Nos services</CardTitle>
                  <CardDescription>
                    Choisissez le service qui vous convient
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salonData.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={{
                          ...service,
                          image: `/placeholder-service-${service.id}.jpg`,
                          features: [`${service.duration} min`, service.category]
                        }}
                        salonId={params.id}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Horaires d'ouverture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {salonData.openingHours.map((hour) => (
                      <div key={hour.day} className="flex justify-between">
                        <span className="font-medium">{hour.day}</span>
                        <span className="text-gray-600">
                          {hour.open === "Fermé" ? "Fermé" : `${hour.open} - ${hour.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-gray-600">{salonData.phone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">{salonData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-sm text-gray-600">{salonData.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Réserver</CardTitle>
                  <CardDescription>
                    Choisissez votre créneau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Réserver un service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        salonId={params.id}
        service={selectedService}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}