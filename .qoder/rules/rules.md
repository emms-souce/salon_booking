---
trigger: manual
---

# Règles de Développement - Salon Cameroun Coiffure

## Architecture et Organisation du Code

### Structure du Projet
- Suivre la **Feature-Sliced Design** : organiser le code par fonctionnalité dans `/src/features/`
- Utiliser l'**App Router de Next.js 15.4.5** pour le routage
- Séparer les composants UI réutilisables dans `/src/components/ui/` (shadcn/ui)
- Placer les composants partagés dans `/src/components/shared/`
- Centraliser les utilitaires dans `/src/lib/`

### API Routes
- Toutes les routes API doivent être dans `/src/app/api/`
- Utiliser **Zod** pour la validation des données d'entrée
- Implémenter une gestion d'erreur cohérente avec les codes HTTP appropriés
- Utiliser **Prisma ORM** pour les interactions avec la base de données PostgreSQL
- Vérifier l'authentification avec `getAuthSession()` pour les routes protégées

## Standards de Code TypeScript

### Types et Interfaces
- Utiliser TypeScript strict pour tous les fichiers
- Définir les types dans `/src/types/` pour les types globaux
- Créer des types spécifiques aux fonctionnalités dans chaque module `features/*/types.ts`
- Éviter le type `any` - utiliser des types précis

### Composants React
- Utiliser `"use client"` uniquement quand nécessaire (interactivité côté client)
- Privilégier les React Server Components par défaut
- Utiliser `useAuth()` hook pour la gestion de l'authentification
- Implémenter des states de chargement et d'erreur appropriés

## Styling et UI

### Tailwind CSS
- Utiliser **Tailwind CSS** pour tous les styles
- Utiliser la fonction `cn()` de `/src/lib/utils.ts` pour combiner les classes
- Respecter le design système cohérent (gris pour le texte, noir pour les hovers)

### shadcn/ui
- Utiliser exclusivement les composants **shadcn/ui** pour l'interface
- Ne pas créer de composants UI personnalisés sans justification
- Respecter les variantes des composants (default, secondary, outline, ghost)

### Iconographie
- Utiliser **Lucide React** pour toutes les icônes
- Taille standard des icônes : `h-4 w-4` ou `h-5 w-5`

## Authentification et Sécurité

### Better Auth
- Utiliser **Better Auth v1.3.4** (pas NextAuth.js)
- Importer depuis `/src/lib/better-auth-client` côté client
- Utiliser `getAuthSession()` pour vérifier l'authentification côté serveur
- Hash des mots de passe avec **bcryptjs**

### Validation
- Utiliser **Zod** pour toute validation de données
- Valider côté client ET côté serveur
- Utiliser **React Hook Form** avec le resolver Zod

## Base de Données

### Prisma
- Utiliser **Prisma ORM v6.13.0** exclusivement
- Importer le client depuis `/src/lib/prisma.ts`
- Gérer les relations avec `include` et `select` appropriés
- Utiliser les transactions pour les opérations complexes

### Migrations
- Toujours créer des migrations avec `npx prisma migrate dev`
- Nommer les migrations de manière descriptive
- Tester les migrations en développement avant la production

## Gestion des États et Données

### Hooks Personnalisés
- Créer des hooks dans `/src/features/*/hooks/`
- Utiliser `useState` et `useEffect` de manière optimisée
- Implémenter des fallbacks avec des données mock si l'API échoue
- Gérer les states de loading, error et success

### Navigation
- Utiliser `next/navigation` pour la navigation programmatique
- Utiliser `Link` de Next.js pour les liens
- Respecter la structure de navigation cohérente (Navbar + UserNav)

## Gestion des Erreurs

### Frontend
- Utiliser **Sonner** pour les notifications toast
- Afficher des messages d'erreur en français
- Implémenter des états de fallback pour les échecs d'API

### Backend
- Retourner des codes HTTP appropriés (200, 201, 400, 401, 403, 404, 500)
- Utiliser des messages d'erreur en français
- Logger les erreurs avec `console.error()` pour le debugging

## Règles Spécifiques au Projet

### Fonctionnalités Salon
- Routes salons : `/dashboard/salons/*` pour la gestion propriétaire
- Routes publiques : `/salons/*` pour la consultation
- Vérifier la propriété des salons dans les API protégées

### Fonctionnalités Réservations
- Routes : `/dashboard/bookings/*` pour la gestion utilisateur
- Statuts : PENDING, CONFIRMED, CANCELLED, COMPLETED
- Vérifier la disponibilité avant création

### Paiements (À Implémenter)
- Préparer l'intégration MTN Mobile Money et Orange Money
- Sécuriser les clés API dans les variables d'environnement

## Conventions de Nommage

### Fichiers
- Pages : `page.tsx` (App Router)
- Composants : `PascalCase.tsx`
- Hooks : `use*.ts` (camelCase)
- Types : `types.ts`
- Actions : `kebab-case.ts`

### Variables et Fonctions
- `camelCase` pour les variables et fonctions
- `PascalCase` pour les composants et types
- `UPPER_CASE` pour les constantes

## Règles ESLint Spécifiques

### React
- Échapper les apostrophes avec `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
- Utiliser des clés uniques pour les listes
- Éviter les dépendances manquantes dans useEffect

### Next.js
- Utiliser `next/image` pour les images optimisées
- Implémenter des fallbacks avec `ImageWithFallback`
- Utiliser `next/link` pour la navigation interne

## Performance et Optimisation

### Images
- Utiliser le composant `ImageWithFallback` personnalisé
- Spécifier les dimensions d'image quand possible
- Utiliser des images optimisées pour le web

### Requêtes
- Optimiser les requêtes Prisma avec `select` et `include`
- Implémenter la pagination pour les listes importantes
- Utiliser des indexes sur les champs fréquemment interrogés

## Variables d'Environnement

### Sécurité
- Préfixer les variables publiques avec `NEXT_PUBLIC_`
- Protéger `DATABASE_URL`, `BETTER_AUTH_SECRET`, clés API
- Ne jamais commiter les fichiers `.env*`

### Configuration
- Utiliser `.env.local` pour le développement
- Documenter toutes les variables requises

## Tests et Qualité

### Développement
- Tester manuellement toutes les fonctionnalités modifiées
- Vérifier la responsivité mobile et desktop
- Valider l'accessibilité des composants shadcn/ui

### Production
- Exécuter `npm run build` avant le déploiement
- Vérifier les migrations de base de données
- Tester l'authentification et les autorisations

## Localisation

### Langue
- Interface utilisateur en **français**
- Messages d'erreur en français
- Formats de date avec `date-fns` et locale `fr`
- Devise en FCFA (Franc CFA)

### Contexte Cameroun
- Supporter les villes principales : Douala, Yaoundé
- Intégrer les méthodes de paiement locales (MTN, Orange Money)
- Respecter les formats de téléphone camerounais