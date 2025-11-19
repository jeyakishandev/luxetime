import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

// État initial
const initialState = {
  user: null,
  token: localStorage.getItem('luxetime_token'),
  isAuthenticated: !!localStorage.getItem('luxetime_token'),
  isLoading: false
}

// Actions
const authActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case authActions.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case authActions.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case authActions.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case authActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    default:
      return state
  }
}

// Contexte
const AuthContext = createContext()

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const queryClient = useQueryClient()

  // Récupérer le profil utilisateur
  const fetchUserProfile = async (token) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true })
      
      const response = await authAPI.getProfile()
      
      if (response.data.success) {
        dispatch({
          type: authActions.LOGIN_SUCCESS,
          payload: {
            user: response.data.data,
            token: token
          }
        })
      } else {
        throw new Error('Erreur lors de la récupération du profil')
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      localStorage.removeItem('luxetime_token')
      dispatch({ type: authActions.LOGOUT })
    } finally {
      dispatch({ type: authActions.SET_LOADING, payload: false })
    }
  }

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('luxetime_token')
      
      if (token) {
        try {
          // Vérifier si le token est valide
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          
          if (payload.exp && payload.exp > currentTime) {
            // Token valide, récupérer le profil
            await fetchUserProfile(token)
          } else {
            // Token expiré
            console.log('❌ Token expiré')
            localStorage.removeItem('luxetime_token')
            dispatch({ type: authActions.LOGOUT })
          }
        } catch (error) {
          // Token invalide
          console.log('❌ Token invalide:', error)
          localStorage.removeItem('luxetime_token')
          dispatch({ type: authActions.LOGOUT })
        }
      } else {
        // Pas de token, s'assurer que l'état est cohérent
        console.log('❌ Pas de token')
        dispatch({ type: authActions.LOGOUT })
      }
    }
    
    checkAuth()
  }, [])

  // Connexion
  const login = useMutation(
    async ({ email, motDePasse }) => {
      console.log('🔐 Tentative de connexion...', { email })
      const response = await authAPI.login(email, motDePasse)
      console.log('🔐 Réponse API:', response.data)
      return response.data
    },
    {
      onSuccess: (data) => {
        console.log('✅ Succès login:', data)
        if (data.success) {
          localStorage.setItem('luxetime_token', data.data.token)
          dispatch({
            type: authActions.LOGIN_SUCCESS,
            payload: data.data
          })
          toast.success('Connexion réussie !')
        } else {
          console.log('❌ Login failed:', data.message)
          toast.error(data.message || 'Erreur de connexion')
        }
      },
      onError: (error) => {
        console.log('❌ Erreur login:', error)
        const message = error.response?.data?.message || 'Erreur de connexion'
        dispatch({
          type: authActions.LOGIN_ERROR,
          payload: message
        })
        toast.error(message)
      }
    }
  )

  // Inscription
  const register = useMutation(
    async (userData) => {
      const response = await authAPI.register(userData)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          localStorage.setItem('luxetime_token', data.data.token)
          dispatch({
            type: authActions.LOGIN_SUCCESS,
            payload: data.data
          })
          toast.success('Compte créé avec succès !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de l\'inscription'
        toast.error(message)
      }
    }
  )

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('luxetime_token')
    dispatch({ type: authActions.LOGOUT })
    queryClient.clear()
    toast.success('Déconnexion réussie')
  }

  // Mettre à jour le profil
  const updateProfile = useMutation(
    async (userData) => {
      const response = await authAPI.updateProfile(userData)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          dispatch({
            type: authActions.UPDATE_USER,
            payload: data.data
          })
          toast.success('Profil mis à jour !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
        toast.error(message)
      }
    }
  )

  // Changer le mot de passe
  const changePassword = useMutation(
    async ({ currentPassword, newPassword }) => {
      const response = await authAPI.changePassword(currentPassword, newPassword)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          toast.success('Mot de passe modifié !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors du changement de mot de passe'
        toast.error(message)
      }
    }
  )

  // Supprimer le compte
  const deleteAccount = useMutation(
    async (password) => {
      const response = await authAPI.deleteAccount(password)
      return response.data
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          logout()
          toast.success('Compte supprimé')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la suppression'
        toast.error(message)
      }
    }
  )

  // Valeurs du contexte
  const value = {
    // État
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login: login.mutate,
    register: register.mutate,
    logout,
    updateProfile: updateProfile.mutate,
    changePassword: changePassword.mutate,
    deleteAccount: deleteAccount.mutate,
    
    // États de chargement
    isLoggingIn: login.isLoading,
    isRegistering: register.isLoading,
    isUpdatingProfile: updateProfile.isLoading,
    isChangingPassword: changePassword.isLoading,
    isDeletingAccount: deleteAccount.isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  
  return context
}

export default AuthContext
