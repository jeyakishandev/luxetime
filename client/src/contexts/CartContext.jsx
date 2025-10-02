import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

// État initial
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null
}

// Actions
const cartActions = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR'
}

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case cartActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case cartActions.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
        isLoading: false,
        error: null
      }
    
    case cartActions.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        itemCount: state.itemCount + action.payload.quantite,
        total: state.total + (action.payload.produit.prix * action.payload.quantite)
      }
    
    case cartActions.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, ...action.payload }
            : item
        ),
        total: state.items.reduce((sum, item) => {
          const prix = item.produit.prixPromo && item.produit.prixPromo > 0 
            ? item.produit.prixPromo 
            : item.produit.prix
          return sum + (prix * item.quantite)
        }, 0)
      }
    
    case cartActions.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        itemCount: Math.max(0, state.itemCount - 1),
        total: state.items
          .filter(item => item.id !== action.payload)
          .reduce((sum, item) => {
            const prix = item.produit.prixPromo && item.produit.prixPromo > 0 
              ? item.produit.prixPromo 
              : item.produit.prix
            return sum + (prix * item.quantite)
          }, 0)
      }
    
    case cartActions.CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }
    
    case cartActions.SET_ERROR:
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
const CartContext = createContext()

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Récupérer le panier
  const { data: cartData, isLoading: isLoadingCart } = useQuery(
    ['cart'],
    () => cartAPI.getCart(),
    {
      enabled: isAuthenticated,
      onSuccess: (data) => {
        if (data.success) {
          dispatch({
            type: cartActions.SET_CART,
            payload: data.data
          })
        }
      },
      onError: (error) => {
        dispatch({
          type: cartActions.SET_ERROR,
          payload: error.message
        })
      }
    }
  )

  // Ajouter au panier
  const addToCart = useMutation(
    async ({ produitId, quantite = 1 }) => {
      const response = await cartAPI.addToCart(produitId, quantite)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          // Rafraîchir le panier
          queryClient.invalidateQueries(['cart'])
          toast.success('Produit ajouté au panier !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de l\'ajout au panier'
        toast.error(message)
      }
    }
  )

  // Mettre à jour la quantité
  const updateQuantity = useMutation(
    async ({ produitId, quantite }) => {
      const response = await cartAPI.updateCartItem(produitId, quantite)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['cart'])
          toast.success('Quantité mise à jour !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
        toast.error(message)
      }
    }
  )

  // Supprimer du panier
  const removeFromCart = useMutation(
    async (produitId) => {
      const response = await cartAPI.removeFromCart(produitId)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['cart'])
          toast.success('Produit retiré du panier !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la suppression'
        toast.error(message)
      }
    }
  )

  // Vider le panier
  const clearCart = useMutation(
    async () => {
      const response = await cartAPI.clearCart()
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries(['cart'])
          toast.success('Panier vidé !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors du vidage'
        toast.error(message)
      }
    }
  )

  // Valider le panier
  const validateCart = useMutation(
    async () => {
      const response = await cartAPI.validateCart()
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          return data.data
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la validation'
        toast.error(message)
        throw error
      }
    }
  )

  // Calculer le total
  const calculateTotal = () => {
    return state.items.reduce((total, item) => {
      const prix = item.produit.prixPromo && item.produit.prixPromo > 0 
        ? item.produit.prixPromo 
        : item.produit.prix
      return total + (prix * item.quantite)
    }, 0)
  }

  // Vérifier si un produit est dans le panier
  const isInCart = (produitId) => {
    return state.items.some(item => item.produitId === produitId)
  }

  // Obtenir la quantité d'un produit dans le panier
  const getItemQuantity = (produitId) => {
    const item = state.items.find(item => item.produitId === produitId)
    return item ? item.quantite : 0
  }

  // Valeurs du contexte
  const value = {
    // État
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    isLoading: state.isLoading || isLoadingCart,
    error: state.error,
    
    // Actions
    addToCart: addToCart.mutate,
    updateQuantity: updateQuantity.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearCart.mutate,
    validateCart: validateCart.mutate,
    
    // Utilitaires
    calculateTotal,
    isInCart,
    getItemQuantity,
    
    // États de chargement
    isAddingToCart: addToCart.isLoading,
    isUpdatingQuantity: updateQuantity.isLoading,
    isRemovingFromCart: removeFromCart.isLoading,
    isClearingCart: clearCart.isLoading,
    isValidatingCart: validateCart.isLoading
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook personnalisé
export const useCart = () => {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider')
  }
  
  return context
}

export default CartContext
