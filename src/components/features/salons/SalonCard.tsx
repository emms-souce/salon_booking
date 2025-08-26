import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export interface SalonCardProps {
  id: string
  name: string
  description: string
  address: string
  city?: string
  rating: number
  imageUrl?: string | null
  servicesCount: number
  priceRange: string
  showPriceRange?: boolean
}

/**
 * Composant SalonCard avec images par défaut depuis internet
 * Affiche les informations d'un salon avec une image de fallback
 */
export function SalonCard({
  id,
  name,
  description,
  address,
  city,
  rating,
  imageUrl,
  servicesCount,
  priceRange,
  showPriceRange = true
}: SalonCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
        <Image
          src={imageUrl || "/placeholder-salon.jpg"}
          alt={name}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg line-clamp-1">{name}</CardTitle>
          <Badge variant="secondary" className="bg-gray-100 text-black flex items-center gap-1">
            ⭐ {rating}
          </Badge>
        </div>
        <CardDescription className="line-clamp-1">
          {address}{city && `, ${city}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{servicesCount} services</span>
          {showPriceRange && (
            <span className="font-medium text-gray-900">{priceRange}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/salons/${id}`}>
            Voir le salon
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}