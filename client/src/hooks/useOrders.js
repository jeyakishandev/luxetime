import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

// Hook pour récupérer les commandes de l'utilisateur
export const useUserOrders = (filters = {}) => {
  return useQuery(
    ['orders', 'user', filters],
    () => orderAPI.getUserOrders(filters),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des commandes')
      }
    }
  )
}

// Hook pour récupérer une commande par ID
export const useOrder = (id) => {
  return useQuery(
    ['order', id],
    () => orderAPI.getOrderById(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement de la commande')
      }
    }
  )
}

// Hook pour créer une commande
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (orderData) => orderAPI.createOrder(orderData),
    {
      onSuccess: (data) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['orders'])
          queryClient.invalidateQueries(['cart'])
          toast.success('Commande créée avec succès !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la création de la commande'
        toast.error(message)
      }
    }
  )
}

// Hook pour annuler une commande
export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id) => orderAPI.cancelOrder(id),
    {
      onSuccess: (data) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['orders'])
          toast.success('Commande annulée !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de l\'annulation'
        toast.error(message)
      }
    }
  )
}

// Hook pour récupérer toutes les commandes (admin)
export const useAllOrders = (filters = {}) => {
  return useQuery(
    ['orders', 'admin', filters],
    () => orderAPI.getAllOrders(filters),
    {
      keepPreviousData: true,
      staleTime: 1 * 60 * 1000, // 1 minute
      onError: (error) => {
        toast.error('Erreur lors du chargement des commandes')
      }
    }
  )
}

// Hook pour mettre à jour le statut d'une commande (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, statut }) => orderAPI.updateOrderStatus(id, statut),
    {
      onSuccess: (data) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['orders'])
          toast.success('Statut mis à jour !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
        toast.error(message)
      }
    }
  )
}

// Hook pour les statistiques des commandes (admin)
export const useOrderStats = () => {
  return useQuery(
    ['orders', 'stats'],
    () => orderAPI.getOrderStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des statistiques')
      }
    }
  )
}

// Hook pour les statuts de commande
export const useOrderStatuses = () => {
  return useQuery(
    ['orders', 'statuses'],
    () => orderAPI.getOrderStatuses(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des statuts')
      }
    }
  )
}

// Hook utilitaire pour les filtres de commandes
export const useOrderFilters = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    statut: '',
    search: '',
    tri: 'createdAt',
    ordre: 'desc'
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 })
    }))
  }

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      statut: '',
      search: '',
      tri: 'createdAt',
      ordre: 'desc'
    })
  }

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters
  }
}

// Hook pour le statut des commandes
export const useOrderStatus = (statut) => {
  const statusConfig = {
    EN_ATTENTE: {
      label: 'En attente',
      color: '#ffc107',
      bgColor: '#fff3cd',
      textColor: '#856404'
    },
    CONFIRMEE: {
      label: 'Confirmée',
      color: '#17a2b8',
      bgColor: '#d1ecf1',
      textColor: '#0c5460'
    },
    EN_PREPARATION: {
      label: 'En préparation',
      color: '#fd7e14',
      bgColor: '#ffeaa7',
      textColor: '#856404'
    },
    EXPEDIEE: {
      label: 'Expédiée',
      color: '#6f42c1',
      bgColor: '#e2d9f3',
      textColor: '#4a2c5a'
    },
    LIVREE: {
      label: 'Livrée',
      color: '#28a745',
      bgColor: '#d4edda',
      textColor: '#155724'
    },
    ANNULEE: {
      label: 'Annulée',
      color: '#dc3545',
      bgColor: '#f8d7da',
      textColor: '#721c24'
    }
  }

  return statusConfig[statut] || {
    label: statut,
    color: '#6c757d',
    bgColor: '#f8f9fa',
    textColor: '#495057'
  }
}

// Hook pour calculer les statistiques des commandes
export const useOrderAnalytics = (orders) => {
  const analytics = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        statusDistribution: {},
        monthlyRevenue: []
      }
    }

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const averageOrderValue = totalRevenue / totalOrders

    const statusDistribution = orders.reduce((acc, order) => {
      acc[order.statut] = (acc[order.statut] || 0) + 1
      return acc
    }, {})

    // Calculer le revenu mensuel
    const monthlyRevenue = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7)
      acc[month] = (acc[month] || 0) + order.total
      return acc
    }, {})

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusDistribution,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      }))
    }
  }, [orders])

  return analytics
}
