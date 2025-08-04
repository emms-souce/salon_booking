# Salon Cameroun - Plateforme de Réservation de Salons de Coiffure

Une plateforme moderne et épurée pour la réservation de salons de coiffure au Cameroun, développée avec Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Prisma et PostgreSQL.

## 🚀 Fonctionnalités

### Pour les clients
- **Recherche de salons** par ville, services, prix et notation
- **Réservation instantanée** 24h/24 et 7j/7
- **Gestion des réservations** (annulation, modification)
- **Système d'avis et notation**
- **Paiement sécurisé** (intégration MTN Mobile Money, Orange Money)
- **Notifications par email/SMS**

### Pour les propriétaires de salons
- **Inscription de salon** avec vérification
- **Gestion des services et tarifs**
- **Calendrier de disponibilités**
- **Gestion des réservations** (confirmation, annulation)
- **Tableau de bord analytique**
- **Gestion des employés**

## 🛠️ Stack Technique

- **Frontend**: Next.js 14 avec App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **TypeScript**: Pour la sécurité de type
- **Validation**: Zod
- **Paiement**: Intégration MTN Mobile Money, Orange Money

## 📁 Structure du Projet

```
salon-cameroun-coiffure/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Pages d'authentification
│   │   ├── salons/            # Pages des salons
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants UI (shadcn/ui)
│   ├── features/              # Structure par fonctionnalité
│   │   ├── auth/
│   │   ├── salons/
│   │   ├── services/
│   │   ├── bookings/
│   │   └── reviews/
│   ├── lib/                   # Utilitaires
│   ├── services/              # Services API
│   ├── store/                 # État global (Zustand)
│   ├── hooks/                 # Hooks personnalisés
│   └── constants/             # Constantes globales
├── prisma/
│   └── schema.prisma         # Schéma de base de données
└── public/                   # Fichiers statiques
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd salon-cameroun-coiffure
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configurer la base de données**
   ```bash
   # Mettre à jour DATABASE_URL dans .env.local
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Variables d'environnement

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/salon_cameroun_coiffure"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Email (optionnel)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@saloncameroun.com"

# Paiement (MTN Mobile Money, Orange Money)
MTN_API_KEY="your-mtn-api-key"
ORANGE_API_KEY="your-orange-api-key"
```

## 📊 Modèles de Données

### User
- Informations de base (nom, email, téléphone)
- Rôle (USER, SALON_OWNER, ADMIN)
- Relations avec bookings et reviews

### Salon
- Informations du salon (nom, adresse, ville, téléphone)
- Coordonnées GPS
- Images et description
- Relations avec services, bookings, reviews

### Service
- Nom et description
- Prix et durée
- Catégorie
- Relations avec salon et bookings

### Booking
- Date et heure
- Statut (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- Notes du client
- Relations avec user, salon, service

### Review
- Note (1-5 étoiles)
- Commentaire
- Relations avec user et salon

## 🎯 Roadmap

### Phase 1 - MVP (Actuel)
- [x] Structure de base du projet
- [x] Pages d'accueil et listing des salons
- [x] Pages d'authentification
- [x] Design épuré et minimaliste
- [ ] Intégration base de données
- [ ] Système de réservation basique
- [ ] Dashboard propriétaire

### Phase 2 - Fonctionnalités avancées
- [ ] Système de paiement
- [ ] Notifications push/email
- [ ] Calendrier interactif
- [ ] Gestion des employés
- [ ] Analytics et statistiques

### Phase 3 - Optimisations
- [ ] Optimisation SEO
- [ ] PWA (Progressive Web App)
- [ ] Application mobile
- [ ] Support multi-langues

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support:
- Email: contact@saloncameroun.com
- WhatsApp: +237 6 XX XX XX XX
- Documentation: [docs.saloncameroun.com](https://docs.saloncameroun.com)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI
- [Prisma](https://www.prisma.io/) - ORM
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel](https://vercel.com/) - Hébergement
# salon_booking
