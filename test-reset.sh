#!/bin/bash
echo "🔄 Réinitialisation de la base de données..."
curl -X POST https://luxetime.onrender.com/api/init/reset-db \
  -H "Content-Type: application/json" \
  -d '{"secret":"luxetime-init-2024"}' \
  | jq '.'
echo ""
echo "✅ Vérification des produits..."
curl -s https://luxetime.onrender.com/api/products?limit=10 | jq '.data.products | length'
