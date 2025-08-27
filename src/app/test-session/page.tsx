import { getAuthSessionServer } from "@/lib/auth-helpers"
import Link from "next/link"

// Type pour l'utilisateur étendu
type ExtendedUser = {
  id: string
  email: string
  role?: string
}

export default async function TestSessionPage() {
  const session = await getAuthSessionServer()
  const user = session?.user as ExtendedUser | undefined
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-center">Test de Session</h1>
          <p className="text-gray-600 text-center mt-2">
            Vérifiez votre état de connexion
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">État de connexion :</h2>
            {session && user ? (
              <div className="text-green-600">
                ✅ Connecté
                <div className="text-sm text-gray-600 mt-1">
                  ID: {user.id}
                  <br />
                  Email: {user.email}
                  <br />
                  Rôle: {user.role || "USER"}
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Non connecté
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {session ? (
              <>
                <Link
                  href="/dashboard/salons/create"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Créer un salon
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Se déconnecter
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Se connecter
                </Link>
                <Link
                  href="/auth/signup"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}