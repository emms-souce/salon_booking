# Guide de Test - Système d'Authentification

## 🎯 Objectif
Ce guide vous permet de tester rapidement le système d'authentification implémenté.

## 📋 Prérequis
1. Avoir configuré PostgreSQL (voir SETUP_GUIDE.md)
2. Avoir exécuté les migrations Prisma
3. Avoir démarré le serveur de développement

## 🔧 Configuration rapide

### 1. Configuration PostgreSQL
```bash
# Option Docker (recommandé)
docker run --name salon-postgres -e POSTGRES_DB=salon_cameroun -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# Mettre à jour .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/salon_Booking"
```

### 2. Exécuter les migrations
```bash
npx prisma migrate dev --name init_auth
npx prisma generate
```

### 3. Démarrer le serveur
```bash
npm run dev
```

## 🧪 Tests à effectuer

### Test 1: Inscription
1. Naviguer vers `http://localhost:3000/auth/register`
2. Remplir le formulaire:
   - Nom: "Jean Dupont"
   - Email: "jean@example.com"
   - Mot de passe: "password123"
   - Confirmer le mot de passe: "password123"
   - Téléphone: "+237 6 12 34 56 78"
3. Cliquer sur "Créer un compte"
4. Vérifier la redirection vers le tableau de bord

### Test 2: Connexion
1. Se déconnecter (via le menu utilisateur)
2. Naviguer vers `http://localhost:3000/auth/login`
3. Entrer les identifiants:
   - Email: "jean@example.com"
   - Mot de passe: "password123"
4. Cliquer sur "Se connecter"
5. Vérifier la connexion réussie

### Test 3: Session utilisateur
1. Une fois connecté, vérifier:
   - L'avatar s'affiche dans le header
   - Le menu déroulant contient "Mon profil", "Paramètres", "Se déconnecter"
   - La page `/dashboard` est accessible
   - Les pages `/auth/login` et `/auth/register` redirigent vers `/dashboard`

### Test 4: Déconnexion
1. Cliquer sur l'avatar dans le header
2. Sélectionner "Se déconnecter"
3. Vérifier la déconnexion et la redirection vers la page d'accueil

## 🔍 Vérification de la base de données

### Vérifier les utilisateurs
```bash
# Via Prisma Studio
npx prisma studio

# Ou via SQL
psql -h localhost -U salon_user salon_cameroun
SELECT * FROM "User";
```

### Vérifier les sessions
```bash
SELECT * FROM "Session";
```

## 🐛 Dépannage

### Erreur: "Can't reach database server"
- Vérifier que PostgreSQL est démarré
- Vérifier le port et les identifiants dans .env.local
- Essayer: `docker ps` pour voir les conteneurs actifs

### Erreur: "NEXTAUTH_URL is not defined"
- Ajouter dans .env.local: `NEXTAUTH_URL="http://localhost:3000"`

### Erreur: "Invalid login"
- Vérifier que l'utilisateur existe dans la base de données
- Vérifier que le mot de passe est correct
- Réinitialiser la base: `npx prisma migrate reset`

### Erreur: "Module not found"
- Réinstaller les dépendances: `npm install`
- Vérifier que tous les composants shadcn/ui sont installés

## 📊 Vérification finale

### Liste de contrôle
- [ ] PostgreSQL est en cours d'exécution
- [ ] Les migrations ont été exécutées
- [ ] Le serveur Next.js démarre sans erreur
- [ ] L'inscription fonctionne
- [ ] La connexion fonctionne
- [ ] La déconnexion fonctionne
- [ ] Le middleware protège les routes
- [ ] L'interface utilisateur affiche correctement l'état de connexion

### Commandes utiles
```bash
# Voir les logs
npm run dev

# Vérifier la base de données
npx prisma db pull

# Réinitialiser complètement
npx prisma migrate reset --force
```

## 🎉 Succès
Si tous les tests passent, votre système d'authentification est fonctionnel et prêt pour les prochaines étapes du développement!