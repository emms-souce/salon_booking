# Guide de Configuration - Salon Cameroun

## Étape 1: Configuration de PostgreSQL

### Option A: PostgreSQL local
1. **Installer PostgreSQL**:
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`
   - Windows: Télécharger depuis postgresql.org

2. **Démarrer PostgreSQL**:
   ```bash
   # macOS
   brew services start postgresql
   
   # Ubuntu
   sudo systemctl start postgresql
   
   # Windows
   # Démarrer via Services ou pgAdmin
   ```

3. **Créer la base de données**:
   ```bash
   # Se connecter en tant que superuser
   psql -U postgres
   
   # Dans psql, créer la base
   CREATE DATABASE salon_cameroun;
   CREATE USER salon_user WITH PASSWORD 'salon_password';
   GRANT ALL PRIVILEGES ON DATABASE salon_cameroun TO salon_user;
   \q
   ```

4. **Mettre à jour .env.local**:
   ```
   DATABASE_URL="postgresql://salon_user:salon_password@localhost:5432/salon_cameroun?schema=public"
   ```

### Option B: PostgreSQL via Docker (Recommandé)
```bash
# Lancer PostgreSQL via Docker
docker run --name salon-postgres -e POSTGRES_DB=salon_cameroun -e POSTGRES_USER=salon_user -e POSTGRES_PASSWORD=salon_password -p 5432:5432 -d postgres:15

# Mettre à jour .env.local
DATABASE_URL="postgresql://salon_user:salon_password@localhost:5432/salon_cameroun?schema=public"
```

### Option C: Supabase (Cloud gratuit)
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier l'URL de connexion depuis Settings > Database
4. Coller dans .env.local

## Étape 2: Exécuter les migrations

```bash
# Après avoir configuré PostgreSQL
npx prisma migrate dev --name init_auth

# Générer le client Prisma
npx prisma generate

# Vérifier la connexion
npx prisma db push
```

## Étape 3: Démarrer l'application

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Démarrer le serveur de développement
npm run dev
```

## Étape 4: Tester l'authentification

1. Ouvrir http://localhost:3000
2. Naviguer vers /auth/register pour créer un compte
3. Naviguer vers /auth/login pour se connecter
4. Vérifier la session utilisateur

## Problèmes courants

### Erreur de connexion PostgreSQL
- Vérifier que PostgreSQL est bien démarré
- Vérifier le port (5432 par défaut)
- Vérifier les identifiants dans .env.local
- Essayer de se connecter manuellement: `psql -h localhost -U salon_user salon_cameroun`

### Erreur NextAuth.js
- Vérifier que NEXTAUTH_URL est correctement défini
- Vérifier que NEXTAUTH_SECRET est défini (peut être n'importe quelle chaîne en développement)

### Commandes de débogage
```bash
# Vérifier l'état de PostgreSQL
brew services list  # macOS
sudo systemctl status postgresql  # Ubuntu

# Vérifier les variables d'environnement
cat .env.local

# Vérifier la connexion Prisma
npx prisma db pull
```

## Scripts utiles

```bash
# Réinitialiser la base de données (attention: supprime toutes les données)
npx prisma migrate reset

# Ouvrir Prisma Studio pour gérer les données
npx prisma studio

# Voir les logs de migration
npx prisma migrate status
```