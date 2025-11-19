# 📋 Informations Complètes - Luxetime pour Portfolio

## 🎯 Description courte (1 phrase)

**Luxetime** est une application e-commerce fullstack complète pour la vente de montres de luxe, développée avec React, Node.js et PostgreSQL, incluant authentification JWT, panier d'achat, gestion de commandes et interface moderne responsive.

---

## 📖 Description complète (2-3 paragraphes)

**Luxetime** est une application e-commerce fullstack que j'ai développée pour démontrer mes compétences en développement web moderne. L'objectif était de créer une plateforme fonctionnelle avec toutes les fonctionnalités essentielles d'un site de vente en ligne : authentification sécurisée, catalogue de produits avec filtres avancés, panier d'achat, système de commandes, et gestion de profil utilisateur.

L'application utilise une architecture client-serveur avec séparation claire entre frontend et backend. Le frontend est une SPA React avec routing, animations fluides et design responsive. Le backend est une API RESTful Express.js connectée à une base de données PostgreSQL via Prisma ORM. La sécurité est assurée par JWT pour l'authentification, bcrypt pour le hashage des mots de passe, et des middlewares de protection (Helmet, CORS, Rate Limiting).

Le projet inclut des tests unitaires (Jest + Vitest), une configuration Docker complète, et est déployé en production sur Vercel (frontend) et Render (backend). Le code est structuré, documenté et suit les best practices du développement moderne.

---

## 🛠 Technologies utilisées

### Frontend
- **React 18** - Bibliothèque UI moderne
- **React Router v6** - Navigation SPA
- **Styled Components** - CSS-in-JS pour le styling
- **Framer Motion** - Animations et transitions fluides
- **React Query** - Gestion d'état serveur et cache
- **React Hook Form** - Gestion des formulaires
- **Axios** - Client HTTP pour les appels API
- **Vite** - Build tool rapide

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **Prisma ORM** - ORM moderne et type-safe
- **JWT (jsonwebtoken)** - Authentification par tokens
- **bcryptjs** - Hashage sécurisé des mots de passe
- **Helmet** - Sécurisation des headers HTTP
- **Express Validator** - Validation des données
- **Express Rate Limit** - Protection anti-abus

### DevOps & Tests
- **Jest** - Tests unitaires backend
- **Vitest** - Tests unitaires frontend
- **Docker** - Containerisation
- **Docker Compose** - Orchestration multi-services

### Déploiement
- **Vercel** - Frontend (https://luxetime-three.vercel.app)
- **Render** - Backend + PostgreSQL (https://luxetime.onrender.com)

---

## ✨ Fonctionnalités principales

### Pour les utilisateurs
- ✅ **Authentification complète** : Inscription, connexion, déconnexion avec JWT
- ✅ **Catalogue de produits** : Affichage avec filtres par catégorie, prix, recherche
- ✅ **Détails produits** : Fiches complètes avec galerie d'images et spécifications
- ✅ **Panier d'achat** : Ajout, modification quantité, suppression avec calcul temps réel
- ✅ **Système de commandes** : Création, suivi et historique des commandes
- ✅ **Profil utilisateur** : Gestion des informations personnelles et adresses
- ✅ **Design responsive** : Interface adaptée mobile, tablette et desktop
- ✅ **Animations fluides** : Transitions avec Framer Motion

### Techniques
- ✅ Authentification JWT avec tokens sécurisés
- ✅ Hashage bcrypt des mots de passe
- ✅ Validation des données côté client et serveur
- ✅ Gestion d'erreurs centralisée
- ✅ Protection CORS configurée
- ✅ Rate limiting anti-brute-force
- ✅ Headers HTTP sécurisés (Helmet)
- ✅ Tests unitaires (8 tests)
- ✅ Configuration Docker complète

---

## 🔗 Liens importants

### Déploiement
- **Frontend (Vercel)** : https://luxetime-three.vercel.app
- **Backend (Render)** : https://luxetime.onrender.com
- **API Health Check** : https://luxetime.onrender.com/api/health

### Code source
- **GitHub Repository** : https://github.com/jeyakishandev/luxetime
- **Frontend** : `/client/` dans le repo
- **Backend** : `/server/` dans le repo

### Portfolio
- **Votre Portfolio** : https://portfolio-kishan-brown.vercel.app/

### Compte de test
```
Email : test@luxetime.fr
Mot de passe : Luxetime2024!
```

---

## 📸 Screenshots

**6 captures d'écran disponibles** dans le repository :

1. **Page d'accueil** : `docs/screenshots/home.png`
   - Bannière hero, sélection de produits vedettes

2. **Catalogue produits** : `docs/screenshots/products.png`
   - Liste avec filtres, tri, pagination

3. **Détail produit** : `docs/screenshots/product-detail.png`
   - Fiche complète avec galerie, spécifications, ajout au panier

4. **Panier d'achat** : `docs/screenshots/cart.png`
   - Gestion des articles, calcul du total, passage de commande

5. **Page de connexion** : `docs/screenshots/login.png`
   - Interface d'authentification moderne

6. **Profil utilisateur** : `docs/screenshots/profile.png`
   - Gestion des informations, historique des commandes

**URLs GitHub pour les images** :
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/home.png
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/products.png
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/product-detail.png
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/cart.png
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/login.png
- https://raw.githubusercontent.com/jeyakishandev/luxetime/main/docs/screenshots/profile.png

---

## 📊 Statistiques du projet

### Durée de développement
- **Statut** : Projet terminé et déployé
- **Durée** : 2-3 semaines de développement intensif
- **Date** : Octobre-Novembre 2024

### Équipe
- **Solo** - Développement individuel (fullstack)

### Métriques techniques
- **Lignes de code** : ~15 000 lignes
  - Frontend : ~8 000 lignes (React, JSX, CSS)
  - Backend : ~5 000 lignes (Node.js, Express)
  - Tests : ~500 lignes
  - Configuration : ~1 500 lignes

- **Fichiers de code** :
  - Backend : 23 fichiers JavaScript
  - Frontend : 45 fichiers (JSX/JS)

- **Endpoints API** : 20+ endpoints
  - `/api/auth/*` - Authentification (4 endpoints)
  - `/api/products/*` - Produits (6 endpoints)
  - `/api/cart/*` - Panier (4 endpoints)
  - `/api/orders/*` - Commandes (4 endpoints)
  - `/api/wishlist/*` - Favoris (4 endpoints)
  - `/api/init/*` - Initialisation DB (2 endpoints)

- **Composants React** : 30+ composants
  - Pages : 15+ pages
  - Composants réutilisables : 15+ composants
  - Hooks personnalisés : 5+ hooks
  - Contextes : 3 contextes (Auth, Cart, Wishlist)

- **Tables base de données** : 7 tables
  - Users, Produits, ImageProduit, PanierItem, Commande, CommandeItem, Avis, Favori

- **Tests** : 8 tests unitaires
  - Backend : 4 tests (auth, produits)
  - Frontend : 4 tests (utils, composants)

---

## 🎯 Points forts du projet

1. **Architecture fullstack complète** : Frontend React + Backend Express + PostgreSQL
2. **Sécurité robuste** : JWT, bcrypt, validation, rate limiting, headers sécurisés
3. **Code testé** : Tests unitaires backend et frontend
4. **Docker ready** : Configuration complète pour déploiement containerisé
5. **Déployé en production** : Frontend sur Vercel, Backend sur Render
6. **Documentation complète** : README détaillé avec screenshots
7. **Design moderne** : Interface responsive avec animations fluides
8. **Best practices** : Code propre, structure organisée, Git propre
9. **Gestion d'état avancée** : React Query pour le cache serveur
10. **API RESTful bien structurée** : Routes organisées, validation, gestion d'erreurs

---

## 💡 Défis techniques résolus

1. **CORS cross-origin** : Configuration CORS pour permettre les requêtes entre Vercel et Render
2. **Serving images** : Mise en place d'un système pour servir les images depuis le backend
3. **Authentification JWT** : Implémentation complète avec tokens sécurisés
4. **Gestion d'état complexe** : Utilisation de React Query pour synchroniser les données
5. **Déploiement multi-plateformes** : Configuration Vercel + Render avec variables d'environnement
6. **Initialisation automatique DB** : Script d'initialisation automatique de la base de données en production

---

## 🚀 Format court pour portfolio (copier-coller)

```
Luxetime - E-commerce de Montres de Luxe

Application e-commerce fullstack complète développée avec React, Node.js et PostgreSQL. 
Inclut authentification JWT, panier d'achat, gestion de commandes et interface moderne responsive.

Technologies : React, Node.js, Express, PostgreSQL, Prisma, JWT, Docker, Jest, Vitest

🔗 Live Demo : https://luxetime-three.vercel.app
📦 GitHub : https://github.com/jeyakishandev/luxetime
📸 6 screenshots disponibles
```

---

## 📝 Format détaillé pour portfolio

### Titre
**Luxetime - E-commerce Fullstack de Montres de Luxe**

### Description
Application e-commerce complète que j'ai développée pour démontrer mes compétences en développement fullstack. Le projet comprend une interface utilisateur moderne avec React, une API REST sécurisée avec Express.js, et une base de données PostgreSQL. L'application est entièrement fonctionnelle avec authentification JWT, panier d'achat, système de commandes, et gestion de profil utilisateur.

### Technologies
**Frontend** : React 18, React Router, Styled Components, Framer Motion, React Query, Axios, Vite

**Backend** : Node.js, Express.js, PostgreSQL, Prisma ORM, JWT, bcryptjs, Helmet

**DevOps** : Docker, Docker Compose, Jest, Vitest

**Déploiement** : Vercel (Frontend), Render (Backend + PostgreSQL)

### Fonctionnalités
- Authentification sécurisée avec JWT
- Catalogue de produits avec filtres et recherche
- Panier d'achat avec calcul en temps réel
- Système de commandes complet
- Gestion de profil utilisateur
- Design responsive (mobile, tablette, desktop)
- Animations fluides avec Framer Motion

### Liens
- **Live Demo** : https://luxetime-three.vercel.app
- **GitHub** : https://github.com/jeyakishandev/luxetime
- **API** : https://luxetime.onrender.com/api

### Statistiques
- **Durée** : 2-3 semaines
- **Lignes de code** : ~15 000
- **Composants React** : 30+
- **Endpoints API** : 20+
- **Tests** : 8 tests unitaires

---

## 🎬 Pour une vidéo de démo (si vous en faites une)

**Durée recommandée** : 1-2 minutes

**Séquences à montrer** :
1. **Introduction** (10s) : Page d'accueil, navigation
2. **Catalogue** (20s) : Filtres, recherche, tri
3. **Détail produit** (15s) : Galerie, spécifications, ajout au panier
4. **Panier** (15s) : Modification quantité, calcul total
5. **Authentification** (10s) : Connexion rapide
6. **Commande** (15s) : Processus de commande
7. **Profil** (10s) : Gestion du profil, historique

**Points à mettre en avant** :
- Design moderne et responsive
- Animations fluides
- Performance rapide
- Sécurité (authentification)

---

## 📌 Checklist pour votre portfolio

- [ ] Titre du projet : "Luxetime - E-commerce Fullstack"
- [ ] Description courte (1-2 phrases)
- [ ] Description détaillée (2-3 paragraphes)
- [ ] Liste des technologies utilisées
- [ ] Liste des fonctionnalités principales
- [ ] Lien vers le site déployé (Vercel)
- [ ] Lien vers le code source (GitHub)
- [ ] 6 screenshots (ou au moins 3-4)
- [ ] Statistiques du projet (durée, lignes de code, etc.)
- [ ] Points forts / Défis techniques résolus
- [ ] (Optionnel) Vidéo de démo

---

**Dernière mise à jour** : Novembre 2024

