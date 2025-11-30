# 🕰️ Luxetime - Boutique de Montres de Luxe

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)

Application e-commerce fullstack pour la vente de montres de luxe, développée avec React, Node.js et PostgreSQL.

🌐 **Application en ligne** : [https://luxetime-three.vercel.app/](https://luxetime-three.vercel.app/)

⚠️ **Note :** Lors du premier chargement, le backend peut prendre 30-60 secondes à démarrer. Un message informatif s'affichera automatiquement.

## 📋 À propos du projet

**Luxetime** est une application e-commerce complète que j'ai développée pour démontrer mes compétences en développement fullstack. Le projet comprend une interface utilisateur moderne et premium, une API REST sécurisée et une base de données PostgreSQL robuste.

### 🎯 Objectifs du projet

- Démonstration de compétences fullstack (React, Node.js, PostgreSQL)
- Application e-commerce complète avec fonctionnalités avancées
- Design premium et responsive (mobile-first)
- Bonnes pratiques de développement (tests, CI/CD, documentation)
- Fonctionnalités spécifiques au secteur du luxe

## ✨ Fonctionnalités principales

### 🔐 Authentification & Sécurité
- **Authentification JWT** sécurisée
- **Hashage bcrypt** pour les mots de passe
- **Reset password** avec token temporaire
- **Rôles utilisateurs** (CLIENT, ADMIN)
- **Protection CORS** et **Rate Limiting**
- **Helmet.js** pour la sécurité HTTP

### 🛍️ Catalogue & Produits
- **Catalogue complet** avec images multiples
- **Filtres avancés** (catégorie, prix, marque, note)
- **Tri dynamique** (prix, popularité, nouveautés)
- **Recherche en temps réel**
- **Détails produits** avec spécifications techniques
- **Système d'avis et notes** avec moyenne calculée
- **Produits récemment consultés** (localStorage)

### 🛒 Panier & Commandes
- **Gestion du panier** avec calcul en temps réel
- **Système de commandes** complet avec suivi
- **Historique des commandes** détaillé
- **Simulation de paiement** (Stripe - mode test)
- **Statuts de commande** (EN_ATTENTE, CONFIRMEE, EXPEDIEE, LIVREE, ANNULEE)

### ❤️ Expérience Utilisateur
- **Wishlist** (liste de souhaits) persistante
- **Profil utilisateur** complet
- **Animations fluides** avec Framer Motion
- **Skeleton Loaders** pour une meilleure UX
- **Error Boundary** pour la gestion d'erreurs
- **Scroll automatique** vers le haut lors de la navigation

### 🏆 Fonctionnalités Luxe
- **Certificats d'authenticité** numériques avec QR codes
- **Gestion des garanties** (constructeur + extension)
- **Suivi de livraison** avancé avec numéros de suivi
- **Système de retours et remboursements**
- **Historique de propriété** pour les certificats

### 📧 Notifications
- **Emails transactionnels** (Nodemailer)
  - Email de bienvenue
  - Confirmation de commande
  - Mise à jour de livraison
  - Reset de mot de passe

### 👨‍💼 Administration
- **Panel administrateur** complet
- **Gestion des produits** (CRUD)
- **Gestion des commandes**
- **Gestion des utilisateurs**
- **Statistiques et analytics**

### 📱 Design & Responsive
- **Design premium** avec glassmorphism
- **Mobile-first** et entièrement responsive
- **Animations et transitions** fluides
- **Thème cohérent** avec Styled Components
- **Accessibilité** améliorée (ARIA labels)

### 🔍 SEO & Performance
- **SEO optimisé** avec react-helmet-async
- **Meta tags dynamiques** (Open Graph, Twitter Cards)
- **Schema.org JSON-LD** pour les produits
- **Lazy loading** des composants
- **Code splitting** automatique

## 🛠 Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **React Router v6** - Routage
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animations
- **React Query** - Gestion d'état serveur
- **Axios** - Client HTTP
- **React Hook Form** - Gestion de formulaires
- **React Hot Toast** - Notifications
- **React Helmet Async** - SEO
- **Vite** - Build tool

### Backend
- **Node.js & Express** - Serveur API
- **PostgreSQL** - Base de données
- **Prisma ORM** - ORM et migrations
- **JWT** - Authentification
- **bcrypt** - Hashage des mots de passe
- **Nodemailer** - Envoi d'emails
- **Multer** - Upload de fichiers
- **Express Validator** - Validation
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - Protection contre les abus
- **Swagger/OpenAPI** - Documentation API

### DevOps & Tests
- **Jest** - Tests backend
- **Vitest** - Tests frontend
- **GitHub Actions** - CI/CD
- **Docker & Docker Compose** - Containerisation
- **Vercel** - Déploiement

## 🚀 Installation et démarrage

### Prérequis

- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

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

### 🔑 Compte de test

Pour tester l'application, vous pouvez utiliser le compte suivant :

| Champ | Valeur |
|-------|--------|
| **Email** | `test@luxetime.fr` |
| **Mot de passe** | `Luxetime2024!` |

> 💡 **Note :** Ce compte est créé automatiquement lors de l'exécution du script `npm run seed` dans le dossier `server`.

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

### Endpoints principaux

- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détail d'un produit
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/cart` - Ajouter au panier
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Liste des commandes
- `GET /api/certificates` - Certificats d'authenticité
- `GET /api/warranties` - Garanties
- Et bien plus...

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

### CI/CD

Le projet utilise **GitHub Actions** pour :
- ✅ Tests automatiques (backend et frontend)
- ✅ Linting automatique
- ✅ Validation des builds

**Coverage des tests :**
- Tests d'authentification (hashing, JWT)
- Tests de validation des produits
- Tests des fonctions utilitaires
- Tests des services

## 📁 Structure du projet

```
luxetime/
├── client/                  # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── ui/          # Composants UI (Button, Card, etc.)
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── SEO.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── pages/           # Pages de l'application
│   │   ├── contexts/        # Contextes React (Auth, Cart, Wishlist)
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── services/        # Services API
│   │   ├── styles/          # Styles globaux et thème
│   │   └── utils/           # Utilitaires
│   └── package.json
├── server/                  # API Node.js
│   ├── controllers/        # Contrôleurs
│   ├── middleware/         # Middleware (auth, validation)
│   ├── routes/             # Routes API
│   ├── services/           # Services métier
│   ├── prisma/            # Schéma Prisma
│   ├── config/            # Configuration (Swagger)
│   ├── __tests__/         # Tests backend
│   └── package.json
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── docker-compose.yml     # Configuration Docker
├── Dockerfile.client      # Image Docker frontend
├── Dockerfile.server      # Image Docker backend
└── package.json
```

## 🎨 Fonctionnalités Design

### Design Premium
- **Glassmorphism** pour les cartes et modals
- **Gradients dorés** pour l'identité de marque
- **Typographie élégante** (Playfair Display, Cormorant Garamond)
- **Animations subtiles** et professionnelles
- **Shimmer effects** pour les loaders

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** optimisés (mobile, tablet, desktop)
- **Touch-friendly** (boutons min 44px)
- **Flexible grids** avec `clamp()` et `minmax()`
- **Images responsives** avec tailles adaptatives

### Accessibilité
- **ARIA labels** sur tous les éléments interactifs
- **Navigation clavier** optimisée
- **Contraste** respecté (WCAG)
- **Focus management** dans les modals

## 🔑 Variables d'environnement

Le fichier `server/config.env` doit contenir :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/luxetime"

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Serveur
PORT=5000
NODE_ENV=development

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe (optionnel - mode test)
STRIPE_SECRET_KEY=sk_test_...
```

## 🎯 Améliorations futures

- [ ] Intégration Stripe pour les paiements réels (simulé actuellement - OK pour portfolio)
- [x] ~~Notifications email~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Certificats d'authenticité~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Gestion des garanties~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Système de livraison avancé~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Retours et remboursements~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Error Boundary~~ ✅ **IMPLÉMENTÉ**
- [x] ~~SEO amélioré~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Skeleton Loaders~~ ✅ **IMPLÉMENTÉ**
- [x] ~~CI/CD avec GitHub Actions~~ ✅ **IMPLÉMENTÉ**
- [x] ~~Documentation API (Swagger/OpenAPI)~~ ✅ **IMPLÉMENTÉ**
- [ ] Tests E2E avec Cypress
- [ ] Analytics et métriques
- [ ] Mode sombre/clair
- [ ] Internationalisation (i18n)
- [ ] PWA (Progressive Web App)

## 📊 Statistiques du projet

- **Lignes de code** : ~15,000+
- **Composants React** : 50+
- **Endpoints API** : 30+
- **Modèles de données** : 15+
- **Tests** : Backend + Frontend
- **Temps de développement** : Portfolio project

## 👨‍💻 Auteur

**KARUNANITHY Jeya Kishan**

Développeur Web Full-Stack | React, Node.js, SQL | Paris

- 🌐 Portfolio : [portfolio-kishan-brown.vercel.app](https://portfolio-kishan-brown.vercel.app/)
- 💼 LinkedIn : [linkedin.com/in/jeya-kishan-karunanithy](https://www.linkedin.com/in/jeya-kishan-karunanithy)
- 🐙 GitHub : [@jeyakishandev](https://github.com/jeyakishandev)

## 📝 License

Ce projet est sous licence MIT.

---

💡 *Projet développé dans le cadre de mon portfolio professionnel pour démontrer mes compétences en développement fullstack, design UI/UX et bonnes pratiques de développement.*

🌟 *N'hésitez pas à explorer le code, tester l'application et me faire part de vos retours !*
