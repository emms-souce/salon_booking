import { Suspense } from "react"
import { ServicesList } from "@/features/services/components/ServicesList"
import { ServicesHeader } from "@/features/services/components/ServicesHeader"
import { ServicesSkeleton } from "@/features/services/components/ServicesSkeleton"

export const metadata = {
  title: "Nos Services - Salon de Coiffure",
  description: "Découvrez tous nos services de coiffure professionnels",
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ServicesHeader />
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesList />
      </Suspense>
    </div>
  )
}