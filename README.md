# 🕰️ Luxetime - Boutique de Montres de Luxe

Application e-commerce fullstack pour la vente de montres de luxe, développée avec React, Node.js et PostgreSQL.

## 📋 À propos du projet

**Luxetime** est une application e-commerce complète que j'ai développée pour démontrer mes compétences en développement fullstack. Le projet comprend une interface utilisateur moderne, une API REST sécurisée et une base de données PostgreSQL.

## ✨ Fonctionnalités principales

- 🔐 Authentification utilisateur (JWT)
- 🛍️ Catalogue de produits avec filtres
- 🛒 Gestion du panier d'achat
- 📦 Système de commandes
- 👤 Gestion du profil utilisateur
- 📱 Design responsive
- 🎨 Interface moderne avec animations

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

### Compte de test

```
Email : test@luxetime.fr
Mot de passe : Luxetime2024!
```

## 📁 Structure du projet

```
luxetime/
├── client/              # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
├── server/              # API Node.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   └── package.json
└── package.json
```

## 📚 Documentation complémentaire

Pour plus de détails sur l'installation, consultez [INSTALLATION.md](INSTALLATION.md)

## 🔑 Variables d'environnement

Le fichier `server/config.env` doit contenir :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/luxetime"
JWT_SECRET=votre_secret_jwt
PORT=5000
NODE_ENV=development
```

## 🎯 Améliorations futures

- [ ] Intégration Stripe pour les paiements
- [ ] Système d'avis et de notes
- [ ] Wishlist
- [ ] Notifications email
- [ ] Dashboard administrateur
- [ ] Tests unitaires et E2E

## 👨‍💻 Auteur

**KARUNANITHY Jeya Kishan**

Développeur Web Full-Stack | React, Node.js, SQL | Paris

- Portfolio : *En construction* 🚧
- LinkedIn : [linkedin.com/in/jeya-kishan-karunanithy](https://www.linkedin.com/in/jeya-kishan-karunanithy)
- GitHub : [@jeyakishandev](https://github.com/jeyakishandev)

## 📝 License

Ce projet est sous licence MIT.

---

💡 *Projet développé dans le cadre de mon portfolio professionnel*
