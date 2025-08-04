'use client'

import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const { login, isLoading } = useAuth()

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email invalide"
    }

    if (!password) {
      errors.password = "Le mot de passe est requis"
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await login(email, password)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte Salon Cameroun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setValidationErrors(prev => ({ ...prev, password: '' }))
              }}
              required
              className={validationErrors.password ? "border-red-500" : ""}
            />
            {validationErrors.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <Link href="/auth/register" className="text-black hover:underline">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}