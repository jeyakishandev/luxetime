#!/bin/bash
echo "🛑 Arrêt de tous les processus Node..."
pkill -f node
sleep 2

echo "🚀 Démarrage du serveur backend..."
cd /root/Luxetime/server
node index.js &
sleep 3

echo "✅ Serveur démarré !"
echo "🌐 Frontend: http://localhost:3003"
echo "📡 Backend: http://localhost:5000"
echo ""
echo "🔑 Identifiants de test:"
echo "   Email: test@luxetime.fr"
echo "   Mot de passe: Luxetime2024!"






