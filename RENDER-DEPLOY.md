# 🚀 Déploiement sur Render.com - Guide Complet

Render.com est une excellente alternative gratuite à Railway !

## 📋 Plan de déploiement

- **Backend (Node.js)** → Render.com (gratuit)
- **PostgreSQL** → Render.com (gratuit)
- **Frontend (React)** → Vercel (gratuit)

---

## 🌐 Étape 1 : Créer un compte Render

1. Aller sur https://render.com/
2. Cliquer sur "Get Started for Free"
3. Se connecter avec GitHub
4. Autoriser Render à accéder à vos repos

---

## 🗄️ Étape 2 : Créer la base de données PostgreSQL

1. Dans le dashboard Render, cliquer sur "New +"
2. Choisir "PostgreSQL"
3. Configurer :
   - **Name** : `luxetime-db`
   - **Database** : `luxetime`
   - **User** : (laissé par défaut)
   - **Region** : Choisir le plus proche (ex: Frankfurt)
   - **PostgreSQL Version** : 14 ou 15
   - **Plan** : **Free** (gratuit)
4. Cliquer sur "Create Database"
5. ⚠️ **IMPORTANT** : Noter l'URL de connexion (dans "Connections")

L'URL ressemble à :
```
postgresql://user:password@dpg-xxxxx-a.frankfurt-postgres.render.com/luxetime
```

---

## 🔧 Étape 3 : Créer le service Web (Backend)

1. Dans le dashboard, cliquer sur "New +"
2. Choisir "Web Service"
3. Connecter votre repo GitHub `luxetime`
4. Configurer le service :

### Configuration de base :
- **Name** : `luxetime-backend`
- **Region** : Même région que la base de données
- **Branch** : `main`
- **Root Directory** : `server`
- **Runtime** : `Node`
- **Build Command** : `npm install && npx prisma generate`
- **Start Command** : `npm start`
- **Plan** : **Free** (gratuit)

### Variables d'environnement :

Cliquer sur "Advanced" → "Add Environment Variable" et ajouter :

```
DATABASE_URL = <URL_POSTGRESQL_DE_RENDER>
JWT_SECRET = 79176b1e69c7fcf273125f519d95e457d98781e266bb19a51323b76bede346e97b51ec892467807df0dc3b6b39d212c5eaac01671ad9d33e3857adc9497e9334
PORT = 10000
NODE_ENV = production
FRONTEND_URL = https://votre-app.vercel.app
```

⚠️ **Important** :
- `DATABASE_URL` : Copier depuis votre base PostgreSQL Render
- `PORT` : Render utilise le port 10000 par défaut (ou la variable `PORT` fournie)
- `FRONTEND_URL` : On le mettra à jour après le déploiement du frontend

5. Cliquer sur "Create Web Service"

---

## ⏳ Étape 4 : Attendre le déploiement

Render va :
1. Cloner votre repo
2. Installer les dépendances
3. Builder l'application
4. Démarrer le service

**Temps estimé** : 5-10 minutes

⚠️ **Note** : Sur le plan gratuit, le service peut prendre 30-60 secondes à démarrer après inactivité (cold start).

---

## 🗄️ Étape 5 : Initialiser la base de données

Une fois le service déployé :

1. Dans votre service backend Render, aller dans "Shell"
2. Exécuter ces commandes :

```bash
npx prisma generate
npx prisma db push
npm run seed
```

Ou créer un script de build qui fait ça automatiquement.

---

## 🔗 Étape 6 : Noter l'URL du backend

Une fois déployé, Render donnera une URL comme :
```
https://luxetime-backend.onrender.com
```

**Notez cette URL** - vous en aurez besoin pour le frontend !

---

## ✅ Vérification

Testez votre backend :
```bash
curl https://votre-backend.onrender.com/api/health
```

Devrait retourner :
```json
{"success":true,"message":"API Luxetime fonctionnelle",...}
```

---

## 🎯 Avantages de Render

✅ **Gratuit** : Plan gratuit généreux
✅ **Simple** : Interface intuitive
✅ **PostgreSQL gratuit** : Base de données incluse
✅ **Auto-deploy** : Déploie automatiquement à chaque push
✅ **Logs** : Logs en temps réel
✅ **Shell** : Accès terminal pour les commandes

---

## ⚠️ Limitations du plan gratuit

- **Cold start** : 30-60 secondes après inactivité
- **Limite de temps** : Service peut s'arrêter après 15 min d'inactivité
- **Limite de bande passante** : 100 GB/mois (largement suffisant)

---

## 🔄 Alternative : Fly.io (aussi gratuit)

Si Render ne vous convient pas, vous pouvez aussi utiliser **Fly.io** :

1. https://fly.io/
2. Installer `flyctl`
3. `fly launch` dans le dossier `server`
4. Configuration similaire

---

**Besoin d'aide ?** Dites-moi où vous en êtes !

