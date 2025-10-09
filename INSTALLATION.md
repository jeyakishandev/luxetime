# 📘 Guide d'Installation - Luxetime

Guide complet pour installer et lancer le projet Luxetime sur votre machine.

## 📦 Prérequis

- **Node.js** (v16 ou plus) - [Télécharger](https://nodejs.org/)
- **PostgreSQL** (v14 ou plus) - [Télécharger](https://www.postgresql.org/download/)
- **Git** - [Télécharger](https://git-scm.com/)

## 🚀 Installation rapide

### 1. Cloner le projet

```bash
git clone https://github.com/jeyakishandev/luxetime.git
cd luxetime
```

### 2. Installer les dépendances

```bash
npm run install-all
```

Cela installe toutes les dépendances pour le frontend et le backend en une seule commande.

### 3. Configurer PostgreSQL

Créez une nouvelle base de données :

```bash
# Via la ligne de commande
createdb luxetime

# Ou via psql
psql -U postgres
CREATE DATABASE luxetime;
\q
```

### 4. Variables d'environnement

Copiez le fichier d'exemple et configurez-le :

```bash
cd server
cp ENV.example config.env
```

Éditez `server/config.env` :

```env
DATABASE_URL="postgresql://postgres:votre_mot_de_passe@localhost:5432/luxetime?schema=public"
JWT_SECRET=votre_secret_jwt_ici
PORT=5000
NODE_ENV=development
```

**Important** : Remplacez `votre_mot_de_passe` par votre mot de passe PostgreSQL.

### 5. Initialiser la base de données

```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

### 6. Démarrer l'application

**Option 1 - Script rapide (recommandé) :**
```bash
bash restart.sh
```

**Option 2 - Manuel :**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm start
```

### 7. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000

**Compte de test :**
- Email : `test@luxetime.fr`
- Mot de passe : `Luxetime2024!`

## 🔧 Problèmes courants

### PostgreSQL ne démarre pas

```bash
# Windows
# Services → Démarrer "PostgreSQL"

# macOS (Homebrew)
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Port déjà utilisé

Si le port 5000 ou 3003 est déjà utilisé, changez-le dans `server/config.env` :

```env
PORT=5001
```

### Erreur de connexion à la base

Vérifiez que :
1. PostgreSQL est bien démarré
2. La base `luxetime` existe
3. Les identifiants dans `config.env` sont corrects

### Prisma Client non généré

```bash
cd server
npx prisma generate
```

## 📝 Scripts disponibles

**Racine :**
- `npm run dev` - Démarre frontend + backend
- `npm run install-all` - Installe toutes les dépendances

**Frontend (client/) :**
- `npm start` - Serveur de développement
- `npm run build` - Build de production
- `npm run lint` - Vérifier le code

**Backend (server/) :**
- `npm run dev` - Serveur avec auto-reload
- `npm start` - Serveur production
- `npx prisma studio` - Interface de BD

## 🎉 C'est prêt !

Votre installation est terminée. Vous pouvez maintenant explorer l'application et tester toutes les fonctionnalités.

Si vous rencontrez d'autres problèmes, consultez le [README.md](README.md) ou vérifiez les logs du serveur.
