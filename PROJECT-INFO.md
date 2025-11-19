# 📋 Informations Projet Luxetime - Pour Portfolio

## 📝 Description courte (1-2 phrases)

**Luxetime** est une application e-commerce complète dédiée à la vente de montres de luxe, développée en fullstack avec React, Node.js et PostgreSQL. Le projet inclut un système d'authentification sécurisé, un panier d'achat, une gestion de commandes et une interface utilisateur moderne.

## 📖 Description complète

### Objectif du projet

Développer une application e-commerce complète pour démontrer mes compétences en développement fullstack. L'objectif était de créer une plateforme fonctionnelle avec toutes les fonctionnalités essentielles d'un site de vente en ligne : authentification, catalogue produits, panier, commandes, et gestion de profil utilisateur.

### Fonctionnalités principales

- **Authentification complète** : Inscription, connexion, gestion de profil avec JWT
- **Catalogue de produits** : Affichage avec filtres par catégorie, prix, et système de tri
- **Détails produits** : Fiches complètes avec galerie d'images et spécifications techniques
- **Panier d'achat** : Ajout, modification, suppression d'articles avec calcul en temps réel
- **Système de commandes** : Création, suivi et historique des commandes
- **Profil utilisateur** : Gestion des informations personnelles et adresses
- **Design responsive** : Interface adaptée mobile, tablette et desktop
- **Animations fluides** : Transitions avec Framer Motion

### Architecture technique

**Architecture client-serveur** avec séparation claire entre frontend et backend :

```
Frontend (React) ←→ API REST (Express) ←→ Base de données (PostgreSQL)
```

- **Frontend** : Application React SPA avec routing
- **Backend** : API RESTful avec Express.js
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : JWT stateless avec tokens sécurisés
- **Sécurité** : bcrypt pour hashage, Helmet, CORS, Rate Limiting

## 🛠 Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI
- **React Router v6** - Navigation SPA
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animations
- **React Query** - Gestion d'état serveur
- **React Hook Form** - Formulaires
- **Axios** - Client HTTP
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne
- **JWT** - Authentification par tokens
- **bcryptjs** - Hashage mots de passe
- **Helmet** - Sécurité headers HTTP
- **Express Validator** - Validation données
- **Rate Limiting** - Protection anti-abus

### DevOps & Tests
- **Jest** - Tests unitaires backend
- **Vitest** - Tests unitaires frontend
- **Docker** - Containerisation
- **Docker Compose** - Orchestration multi-services

### Services (prévus)
- **Stripe** - Paiement (intégration prévue)
- **Vercel** - Déploiement frontend (prévu)
- **Railway/Render** - Déploiement backend (prévu)

## 🔗 Liens

### GitHub
- **Repository principal** : https://github.com/jeyakishandev/luxetime
- **Frontend** : Dans `/client/`
- **Backend** : Dans `/server/`

### Démo en ligne
- **Portfolio** : https://portfolio-kishan-brown.vercel.app/
- **Site déployé** : *À déployer*
- **API déployée** : *À déployer*

## 📸 Images/Captures d'écran

**6 screenshots disponibles** dans `docs/screenshots/` :
- ✅ `home.png` - Page d'accueil
- ✅ `products.png` - Catalogue produits
- ✅ `product-detail.png` - Détail produit
- ✅ `login.png` - Page de connexion
- ✅ `cart.png` - Panier d'achat
- ✅ `profile.png` - Profil utilisateur

## ✨ Fonctionnalités principales (liste détaillée)

### Pour les clients
- ✅ Inscription et connexion sécurisées
- ✅ Navigation dans le catalogue de produits
- ✅ Filtres et recherche de produits
- ✅ Affichage détaillé des produits avec galerie
- ✅ Ajout/modification/suppression dans le panier
- ✅ Calcul automatique du total panier
- ✅ Processus de commande complet
- ✅ Suivi des commandes passées
- ✅ Gestion du profil utilisateur
- ✅ Modification des informations personnelles

### Pour les administrateurs (prévu)
- ⏳ Dashboard administrateur
- ⏳ Gestion CRUD des produits
- ⏳ Gestion des commandes
- ⏳ Gestion des utilisateurs
- ⏳ Statistiques de ventes

### Techniques
- ✅ Authentification JWT avec refresh tokens
- ✅ Hashage sécurisé des mots de passe (bcrypt)
- ✅ Validation des données côté client et serveur
- ✅ Gestion d'erreurs centralisée
- ✅ Protection CORS configurée
- ✅ Rate limiting anti-brute-force
- ✅ Headers HTTP sécurisés (Helmet)
- ✅ Tests unitaires (8 tests)
- ✅ Configuration Docker complète

## 📊 Statistiques du projet

### Durée de développement
- **Début** : Octobre 2024
- **Statut** : MVP fonctionnel complet
- **Durée estimée** : 2-3 semaines de développement

### Équipe
- **Solo** - Développement individuel

### Métriques techniques (approximatif)
- **Lignes de code** : ~15 000 lignes
  - Frontend : ~8 000 lignes
  - Backend : ~5 000 lignes
  - Tests : ~500 lignes
  - Configuration : ~1 500 lignes

- **Endpoints API** : 15+ endpoints
  - `/api/auth/*` - Authentification (4 endpoints)
  - `/api/products/*` - Produits (5 endpoints)
  - `/api/orders/*` - Commandes (4 endpoints)
  - `/api/cart/*` - Panier (4 endpoints)
  - `/api/users/*` - Utilisateurs (2 endpoints)

- **Composants React** : 30+ composants
  - Pages : 10+ pages
  - Composants réutilisables : 15+ composants
  - Hooks personnalisés : 5+ hooks
  - Contextes : 3 contextes

- **Tables base de données** : 6 tables
  - Users, Produits, Commandes, ItemsCommande, Images, Avis

- **Tests** : 8 tests unitaires
  - Backend : 4 tests (auth, produits)
  - Frontend : 4 tests (utils, composants)

## 🎥 Vidéo de démo

- **Statut** : À créer
- **Durée prévue** : 45-90 secondes
- **Contenu** : Navigation dans l'application, démonstration des fonctionnalités principales

## 🎯 Points forts du projet

1. **Architecture fullstack complète** : Frontend + Backend + Base de données
2. **Sécurité robuste** : JWT, bcrypt, validation, rate limiting
3. **Code testé** : Tests unitaires backend et frontend
4. **Docker ready** : Configuration complète pour déploiement
5. **Documentation complète** : README détaillé avec screenshots
6. **Design moderne** : Interface responsive avec animations
7. **Best practices** : Code propre, structure organisée, Git propre

## 🚀 Prochaines étapes

- [ ] Déploiement sur Vercel (frontend) et Railway (backend)
- [ ] Intégration Stripe pour les paiements
- [ ] Système d'avis et de notes produits
- [ ] Dashboard administrateur
- [ ] Tests E2E avec Cypress
- [ ] Vidéo de démo
- [ ] CI/CD avec GitHub Actions

---

**Dernière mise à jour** : Octobre 2024

