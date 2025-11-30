import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'luxetime_recently_viewed'
const MAX_ITEMS = 10

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([])

  // Charger depuis localStorage au montage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRecentlyViewed(parsed)
      } catch (error) {
        console.error('Erreur lors du chargement des produits récents:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Ajouter un produit à l'historique (mémorisé avec useCallback)
  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product.id) return

    setRecentlyViewed(prev => {
      // Retirer le produit s'il existe déjà
      const filtered = prev.filter(p => p.id !== product.id)
      
      // Ajouter le produit au début
      const updated = [
        {
          id: product.id,
          nom: product.nom,
          marque: product.marque,
          prix: product.prix,
          prixPromo: product.prixPromo,
          images: product.images,
          noteMoyenne: product.noteMoyenne,
          nombreAvis: product.nombreAvis,
          viewedAt: new Date().toISOString()
        },
        ...filtered
      ].slice(0, MAX_ITEMS) // Garder seulement les MAX_ITEMS plus récents

      // Sauvegarder dans localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      
      return updated
    })
  }, [])

  // Supprimer un produit de l'historique
  const removeFromRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(p => p.id !== productId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  // Vider l'historique
  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed
  }
}

