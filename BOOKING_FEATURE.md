# Fonctionnalité de Réservation - Documentation Complète

## Vue d'ensemble
Cette documentation présente la fonctionnalité complète de réservation de services implémentée dans l'application Salon Cameroun Coiffure.

## Architecture

### 1. API Routes (Backend)

#### `/api/bookings/route.ts`
- **GET**: Récupère les réservations d'un utilisateur ou d'un salon
- **POST**: Crée une nouvelle réservation avec validation Zod

#### `/api/bookings/[id]/route.ts`
- **GET**: Récupère une réservation spécifique
- **PATCH**: Met à jour le statut d'une réservation
- **DELETE**: Supprime une réservation

#### `/api/bookings/availability/route.ts`
- **GET**: Vérifie la disponibilité des créneaux horaires

### 2. Services (Frontend)

#### `booking-service.ts`
Fonctions pour interagir avec l'API:
- `getUserBookings()` - Récupère les réservations de l'utilisateur
- `getSalonBookings()` - Récupère les réservations du salon
- `createBooking()` - Crée une nouvelle réservation
- `updateBookingStatus()` - Met à jour le statut d'une réservation
- `deleteBooking()` - Supprime une réservation
- `checkAvailability()` - Vérifie la disponibilité des créneaux
- `getBooking()` - Récupère une réservation spécifique

### 3. Hooks (Frontend)

#### `use-bookings.ts`
Hook React personnalisé qui expose:
- `bookings` - Liste des réservations
- `isLoading` - État de chargement
- `createBooking()` - Fonction de création
- `cancelBooking()` - Fonction d'annulation
- `checkAvailability()` - Vérification de disponibilité

### 4. Composants UI

#### `booking-form.tsx`
Formulaire de réservation avec:
- Sélection de date et heure
- Vérification de disponibilité en temps réel
- Validation des données
- Affichage des détails du service

#### `booking-modal.tsx`
Modal principal pour la réservation:
- Affiche le formulaire de réservation
- Affiche la confirmation après réservation
- Gère l'ouverture/fermeture

#### `ServiceCard.tsx` (Mis à jour)
- Affiche les services avec bouton "Réserver"
- Intègre le salonId pour la réservation

### 5. Pages Dashboard

#### `/dashboard/bookings/page.tsx`
- Vue d'ensemble des réservations pour les utilisateurs
- Onglets: À venir / Passées
- Actions: Annuler, Voir les détails

#### `/dashboard/salons/[id]/bookings/page.tsx`
- Vue de gestion des réservations pour les propriétaires de salon
- Onglets: En attente / Confirmées / Terminées / Annulées
- Actions: Confirmer, Annuler, Marquer comme terminée

## Fonctionnalités Clés

### 1. Réservation de Services
- Sélection de service et salon
- Choix de date et heure
- Vérification de disponibilité en temps réel
- Confirmation immédiate

### 2. Gestion des Réservations
- Vue utilisateur: voir ses réservations
- Vue salon: gérer les réservations
- Mise à jour du statut (en attente → confirmée → terminée)
- Annulation possible

### 3. Sécurité et Validation
- Validation côté serveur avec Zod
- Vérification des autorisations
- Prévention des créneaux doubles
- Vérification des horaires d'ouverture

### 4. UX/UI
- Interface responsive
- Feedback utilisateur clair
- États de chargement
- Messages d'erreur explicites

## Utilisation

### Pour les Utilisateurs
1. Naviguer vers un salon
2. Choisir un service
3. Cliquer sur "Réserver"
4. Sélectionner date et heure
5. Confirmer la réservation

### Pour les Propriétaires de Salon
1. Accéder au dashboard
2. Naviguer vers "Mes Réservations"
3. Gérer les réservations (confirmer, annuler, marquer comme terminée)

## Endpoints API

### Créer une réservation
```
POST /api/bookings
Body: {
  salonId: string,
  serviceId: string,
  date: string,
  time: string,
  notes?: string
}
```

### Vérifier la disponibilité
```
GET /api/bookings/availability?salonId=xxx&serviceId=xxx&date=2024-01-01
```

### Mettre à jour une réservation
```
PATCH /api/bookings/[id]
Body: {
  status: "confirmed" | "cancelled" | "completed",
  notes?: string
}
```

## Structure de Données

### Booking (Réservation)
```typescript
interface Booking {
  id: string
  userId: string
  salonId: string
  serviceId: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

## Tests et Validation

### Tests à effectuer
1. Création de réservation avec créneau disponible
2. Tentative de création avec créneau occupé
3. Mise à jour du statut par propriétaire
4. Annulation par utilisateur
5. Vérification des permissions

### Cas d'erreur gérés
- Créneau non disponible
- Service non trouvé
- Salon fermé
- Données invalides
- Permissions insuffisantes

## Améliorations Futures

1. Notifications par email/SMS
2. Système de paiement
3. Rappels automatiques
4. Calendrier synchronisé
5. Évaluation après service
6. Historique détaillé
7. Statistiques pour les salons

## Dépendances

### Backend
- Next.js 14
- Zod (validation)
- Prisma (base de données)

### Frontend
- React Hook Form
- Zod Resolver
- Toast (notifications)
- Tailwind CSS (styling)

## Installation et Configuration

1. Installer les dépendances:
```bash
npm install react-hook-form @hookform/resolvers zod
```

2. Configurer la base de données Prisma (si nécessaire)

3. Lancer le serveur de développement:
```bash
npm run dev
```

La fonctionnalité de réservation est maintenant complètement implémentée et prête à l'emploi!