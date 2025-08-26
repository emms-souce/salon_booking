import { getAuthSessionServer } from "@/lib/auth-helpers"
import { redirect } from "next/navigation"

export default async function TestSessionPage() {
  const session = await getAuthSessionServer()
  
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
            {session ? (
              <div className="text-green-600">
                ✅ Connecté
                <div className="text-sm text-gray-600 mt-1">
                  ID: {session.user.id}
                  <br />
                  Email: {session.user.email}
                  <br />
                  Rôle: {(session.user as any).role || "USER"}
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
                <a
                  href="/dashboard/salons/create"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Créer un salon
                </a>
                <a
                  href="/api/auth/signout"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Se déconnecter
                </a>
              </>
            ) : (
              <>
                <a
                  href="/auth/signin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Se connecter
                </a>
                <a
                  href="/auth/signup"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  S'inscrire
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}