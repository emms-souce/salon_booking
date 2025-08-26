import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { AuthProvider } from "@/features/auth/components/AuthProvider"
import { Navbar } from "@/components/shared/Navbar"
import { AuthLink } from "@/components/shared/AuthLink"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })
const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Salon Cameroun - Réservation de coiffure",
  description: "Trouvez et réservez facilement dans les meilleurs salons de coiffure au Cameroun",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
        
        <main>
          {children}
          </main>

          <footer className="border-t bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-3xl brand-title">Salon Cameroun</h3>
                <p className="text-sm text-gray-600">
                  La plateforme de réservation de salons de coiffure au Cameroun.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Pour les clients</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/salons" className="hover:text-black">Trouver un salon</Link></li>
                  <li><Link href="/bookings" className="hover:text-black">Mes réservations</Link></li>
                  <li><Link href="/help" className="hover:text-black">Aide</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Pour les salons</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><AuthLink href="/dashboard/salons/create" className="hover:text-black">Inscrire mon salon</AuthLink></li>
                  <li><Link href="/owner/dashboard" className="hover:text-black">Tableau de bord</Link></li>
                  <li><Link href="/owner/pricing" className="hover:text-black">Tarifs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>contact@saloncameroun.com</li>
                  <li>+237 6 XX XX XX XX</li>
                  <li>Douala, Cameroun</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              <p>&copy; 2024 Salon Cameroun. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
        <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
