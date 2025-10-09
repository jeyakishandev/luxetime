#!/bin/bash

echo "🐳 Configuration de Docker pour Luxetime"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire les images
echo "🔨 Construction des images Docker..."
docker-compose build

# Démarrer les conteneurs
echo "🚀 Démarrage des conteneurs..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 5

# Initialiser Prisma
echo "🗄️ Initialisation de la base de données..."
docker-compose exec server npx prisma db push
docker-compose exec server npm run seed

echo ""
echo "✅ Installation terminée !"
echo ""
echo "🌐 Application disponible sur :"
echo "   Frontend : http://localhost:3000"
echo "   Backend  : http://localhost:5000"
echo ""
echo "📋 Commandes utiles :"
echo "   docker-compose logs -f          # Voir les logs"
echo "   docker-compose down             # Arrêter les conteneurs"
echo "   docker-compose up -d            # Démarrer les conteneurs"
echo "   docker-compose restart          # Redémarrer les conteneurs"
echo ""

