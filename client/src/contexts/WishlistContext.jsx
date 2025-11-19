import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { wishlistAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

// État initial
const initialState = {
  items: [],
  itemCount: 0,
  isLoading: false,
  error: null
}

// Actions
const wishlistActions = {
  SET_LOADING: 'SET_LOADING',
  SET_WISHLIST: 'SET_WISHLIST',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  SET_ERROR: 'SET_ERROR'
}

// Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case wishlistActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case wishlistActions.SET_WISHLIST:
      return {
        ...state,
        items: action.payload.items || [],
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
        error: null
      }
    
    case wishlistActions.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        itemCount: state.itemCount + 1
      }
    
    case wishlistActions.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemCount: Math.max(0, state.itemCount - 1)
      }
    
    case wishlistActions.CLEAR_WISHLIST:
      return {
        ...state,
        items: [],
        itemCount: 0
      }
    
    case wishlistActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    default:
      return state
  }
}

// Contexte
const WishlistContext = createContext()

// Provider
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState)
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Récupérer les favoris
  const { data: wishlistData, isLoading: isLoadingWishlist, refetch: refetchWishlist } = useQuery(
    ['wishlist'],
    () => {
      return wishlistAPI.getWishlist()
    },
    {
      enabled: isAuthenticated,
      refetchOnWindowFocus: false,
      refetchInterval: false
    }
  )

  // Traiter les données des favoris
  useEffect(() => {
    if (!isAuthenticated) {
      // Réinitialiser les favoris si l'utilisateur n'est pas connecté
      dispatch({
        type: wishlistActions.SET_WISHLIST,
        payload: { items: [], itemCount: 0 }
      })
      return
    }
    
    if (wishlistData) {
      if (wishlistData.data?.success) {
        dispatch({
          type: wishlistActions.SET_WISHLIST,
          payload: wishlistData.data.data
        })
      }
    }
  }, [wishlistData, isAuthenticated])

  // Ajouter aux favoris
  const addToWishlist = useMutation(
    async (produitId) => {
      const response = await wishlistAPI.addToWishlist(produitId)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['wishlist'])
          refetchWishlist()
          toast.success('Produit ajouté aux favoris !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de l\'ajout aux favoris'
        toast.error(message)
      }
    }
  )

  // Supprimer des favoris
  const removeFromWishlist = useMutation(
    async (produitId) => {
      const response = await wishlistAPI.removeFromWishlist(produitId)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['wishlist'])
          refetchWishlist()
          toast.success('Produit retiré des favoris !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la suppression'
        toast.error(message)
      }
    }
  )

  // Vider les favoris
  const clearWishlist = useMutation(
    async () => {
      const response = await wishlistAPI.clearWishlist()
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['wishlist'])
          refetchWishlist()
          toast.success('Favoris vidés !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors du vidage'
        toast.error(message)
      }
    }
  )

  // Vérifier si un produit est dans les favoris
  const isInWishlist = (produitId) => {
    if (!produitId) return false
    if (!Array.isArray(state.items)) return false
    return state.items.some(item => item.produitId === produitId)
  }

  // Valeurs du contexte
  const value = {
    // État
    items: state.items,
    itemCount: state.itemCount,
    isLoading: state.isLoading || isLoadingWishlist,
    error: state.error,
    
    // Actions
    addToWishlist: addToWishlist.mutate,
    removeFromWishlist: removeFromWishlist.mutate,
    clearWishlist: clearWishlist.mutate,
    
    // Utilitaires
    isInWishlist,
    
    // États de chargement
    isAddingToWishlist: addToWishlist.isLoading,
    isRemovingFromWishlist: removeFromWishlist.isLoading,
    isClearingWishlist: clearWishlist.isLoading
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook personnalisé
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  
  if (!context) {
    throw new Error('useWishlist doit être utilisé dans un WishlistProvider')
  }
  
  return context
}

export default WishlistContext
