# 🕰️ Luxetime - Boutique de Montres de Luxe

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

Application e-commerce fullstack pour la vente de montres de luxe, développée avec React, Node.js et PostgreSQL.

🌐 **Application en ligne** : [https://luxetime-three.vercel.app/](https://luxetime-three.vercel.app/)

⚠️ **Note :** Lors du premier chargement, le backend peut prendre 30-60 secondes à démarrer. Un message informatif s'affichera automatiquement.

## 📋 À propos du projet

**Luxetime** est une application e-commerce complète que j'ai développée pour démontrer mes compétences en développement fullstack. Le projet comprend une interface utilisateur moderne, une API REST sécurisée et une base de données PostgreSQL.

## ✨ Fonctionnalités principales

- 🔐 **Authentification sécurisée** (JWT, bcrypt, reset password)
- 🛍️ **Catalogue complet** avec filtres, tri et recherche
- 🛒 **Gestion du panier** avec calcul en temps réel
- 📦 **Système de commandes** complet avec suivi
- ⭐ **Système d'avis et notes** avec moyenne calculée
- ❤️ **Wishlist** (liste de souhaits)
- 👤 **Profil utilisateur** avec historique des commandes
- 🔍 **Produits récemment consultés** (localStorage)
- 👨‍💼 **Panel administrateur** (gestion produits & commandes)
- 📱 **Design responsive** (mobile-first)
- 🎨 **Animations fluides** (Framer Motion)
- 🚀 **Lazy loading** pour optimiser les performances
- 🔒 **Sécurité** (Helmet, CORS, Rate Limiting)

## 🛠 Technologies utilisées

**Frontend :**
- React 18
- React Router v6
- Styled Components
- Framer Motion
- React Query
- Axios
- Vite

**Backend :**
- Node.js & Express
- PostgreSQL
- Prisma ORM
- JWT pour l'authentification
- bcrypt pour le hashage des mots de passe
- Helmet, CORS, Rate Limiting

**Tests & DevOps :**
- Jest (Backend)
- Vitest (Frontend)
- Docker & Docker Compose

## 🚀 Installation et démarrage

### Prérequis

- Node.js (v16+)
- PostgreSQL (v14+)
- npm

### Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/jeyakishandev/luxetime.git
   cd luxetime
   ```

2. **Installer les dépendances**
   ```bash
   npm run install-all
   ```

3. **Configurer PostgreSQL**
   ```bash
   createdb luxetime
   ```

4. **Configurer les variables d'environnement**
   ```bash
   cd server
   cp ENV.example config.env
   # Éditer config.env avec vos paramètres
   ```

5. **Initialiser la base de données**
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

6. **Démarrer l'application**
   ```bash
   # Option 1 : Avec le script
   bash restart.sh
   
   # Option 2 : Manuellement
   # Terminal 1 - Backend
   cd server && npm run dev
   # Terminal 2 - Frontend
   cd client && npm start
   ```

7. **Accéder à l'application**
   - Frontend : http://localhost:3000
   - Backend : http://localhost:5000

   ⚠️ **Note importante :** Lors du premier chargement ou après une période d'inactivité, le backend peut prendre 30-60 secondes à démarrer (cold start). Veuillez patienter, cela est normal pour les services serverless. Un message informatif s'affichera automatiquement.

### Compte de test

```
Email : test@luxetime.fr
Mot de passe : Luxetime2024!
```

## 🐳 Installation avec Docker (Alternative)

Si vous préférez utiliser Docker :

```bash
# Cloner le projet
git clone https://github.com/jeyakishandev/luxetime.git
cd luxetime

# Lancer avec Docker Compose
bash docker-setup.sh

# Ou manuellement
docker-compose up -d
```

L'application sera disponible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000

**Commandes Docker utiles :**
```bash
docker-compose logs -f      # Voir les logs
docker-compose down         # Arrêter les conteneurs
docker-compose restart      # Redémarrer
```

## 📚 Documentation API

La documentation complète de l'API REST est disponible via Swagger UI :

- **Local** : http://localhost:5000/api-docs
- **Production** : https://luxetime-three.vercel.app/api-docs

La documentation interactive permet de :
- 📖 Voir tous les endpoints disponibles
- 🧪 Tester les endpoints directement depuis le navigateur
- 🔑 Authentification JWT intégrée
- 📝 Schémas de données détaillés

## 🧪 Tests

Le projet inclut des tests unitaires pour assurer la qualité du code.

### Lancer les tests backend

```bash
cd server
npm test
```

### Lancer les tests frontend

```bash
cd client
npm test
```

**Coverage des tests :**
- Tests d'authentification (hashing, JWT)
- Tests de validation des produits
- Tests des fonctions utilitaires

## 📁 Structure du projet

```
luxetime/
├── client/                  # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── __tests__/      # Tests frontend
│   └── package.json
├── server/                  # API Node.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   ├── __tests__/          # Tests backend
│   └── package.json
├── docker-compose.yml       # Configuration Docker
├── Dockerfile.client        # Image Docker frontend
├── Dockerfile.server        # Image Docker backend
└── package.json
```

## 📸 Aperçu du projet

### Page d'accueil
![Page d'accueil](docs/screenshots/home.png)
*Interface d'accueil avec bannière et sélection de montres*

### Catalogue de produits
![Catalogue](docs/screenshots/products.png)
*Catalogue complet avec système de filtres et tri*

### Détail d'un produit
![Détail produit](docs/screenshots/product-detail.png)
*Page de détail avec spécifications techniques complètes*

### Panier d'achat
![Panier](docs/screenshots/cart.png)
*Gestion du panier avec calcul en temps réel*

### Authentification
![Connexion](docs/screenshots/login.png)
*Interface de connexion sécurisée*

### Profil utilisateur
![Profil](docs/screenshots/profile.png)
*Tableau de bord utilisateur avec historique des commandes*

---

## 🔑 Variables d'environnement

Le fichier `server/config.env` doit contenir :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/luxetime"
JWT_SECRET=votre_secret_jwt
PORT=5000
NODE_ENV=development
```

## 🎯 Améliorations futures

- [ ] Intégration Stripe pour les paiements réels (simulé actuellement - OK pour portfolio)
- [x] ~~Notifications email~~ ✅ **IMPLÉMENTÉ** (confirmation commande, reset password, bienvenue)
- [ ] Services backend pour certificats d'authenticité, garanties, livraisons, retours
- [ ] Interfaces frontend pour les fonctionnalités luxe
- [ ] Tests E2E avec Cypress
- [x] ~~CI/CD avec GitHub Actions~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Documentation API (Swagger/OpenAPI)~~ ✅ **IMPLÉMENTÉ**
- [ ] Analytics et métriques
- [ ] Mode sombre/clair
- [ ] Internationalisation (i18n)

## 👨‍💻 Auteur

**KARUNANITHY Jeya Kishan**

Développeur Web Full-Stack | React, Node.js, SQL | Paris

- Portfolio : [portfolio-kishan-brown.vercel.app](https://portfolio-kishan-brown.vercel.app/)
- LinkedIn : [linkedin.com/in/jeya-kishan-karunanithy](https://www.linkedin.com/in/jeya-kishan-karunanithy)
- GitHub : [@jeyakishandev](https://github.com/jeyakishandev)

## 📝 License

Ce projet est sous licence MIT.

---

💡 *Projet développé dans le cadre de mon portfolio professionnel*
