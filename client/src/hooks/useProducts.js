import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { productAPI } from '../services/api'
import toast from 'react-hot-toast'

// Hook pour récupérer les produits avec filtres
export const useProducts = (filters = {}) => {
  return useQuery(
    ['products', filters],
    () => productAPI.getProducts(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des produits')
      }
    }
  )
}

// Hook pour rechercher des produits
export const useSearchProducts = (query, filters = {}) => {
  return useQuery(
    ['products', 'search', query, filters],
    () => productAPI.searchProducts(query, filters),
    {
      enabled: !!query && query.length > 2,
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000, // 2 minutes
      onError: (error) => {
        toast.error('Erreur lors de la recherche')
      }
    }
  )
}

// Hook pour récupérer un produit par ID
export const useProduct = (id) => {
  return useQuery(
    ['product', id],
    () => productAPI.getProductById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement du produit')
      }
    }
  )
}

// Hook pour les produits populaires
export const usePopularProducts = (limit = 8) => {
  return useQuery(
    ['products', 'popular', limit],
    () => productAPI.getPopularProducts(limit),
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des produits populaires')
      }
    }
  )
}

// Hook pour les nouveaux produits
export const useNewProducts = (limit = 8) => {
  return useQuery(
    ['products', 'new', limit],
    () => productAPI.getNewProducts(limit),
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des nouveaux produits')
      }
    }
  )
}

// Hook pour les catégories
export const useCategories = () => {
  return useQuery(
    ['products', 'categories'],
    () => productAPI.getCategories(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des catégories')
      }
    }
  )
}

// Hook pour les marques
export const useBrands = () => {
  return useQuery(
    ['products', 'brands'],
    () => productAPI.getBrands(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      onError: (error) => {
        toast.error('Erreur lors du chargement des marques')
      }
    }
  )
}

// Hook pour créer un produit (admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (productData) => productAPI.createProduct(productData),
    {
      onSuccess: (data) => {
        if (data.success) {
          // Invalider les caches des produits
          queryClient.invalidateQueries(['products'])
          toast.success('Produit créé avec succès !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la création'
        toast.error(message)
      }
    }
  )
}

// Hook pour mettre à jour un produit (admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, productData }) => productAPI.updateProduct(id, productData),
    {
      onSuccess: (data, variables) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['products'])
          queryClient.invalidateQueries(['product', variables.id])
          toast.success('Produit mis à jour !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour'
        toast.error(message)
      }
    }
  )
}

// Hook pour supprimer un produit (admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id) => productAPI.deleteProduct(id),
    {
      onSuccess: (data) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['products'])
          toast.success('Produit supprimé !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la suppression'
        toast.error(message)
      }
    }
  )
}

// Hook pour mettre à jour le stock (admin)
export const useUpdateStock = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, stock }) => productAPI.updateStock(id, stock),
    {
      onSuccess: (data, variables) => {
        if (data.success) {
          // Invalider les caches
          queryClient.invalidateQueries(['products'])
          queryClient.invalidateQueries(['product', variables.id])
          toast.success('Stock mis à jour !')
        }
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Erreur lors de la mise à jour du stock'
        toast.error(message)
      }
    }
  )
}

// Hook utilitaire pour les filtres de produits
export const useProductFilters = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    categorie: '',
    prixMin: 0,
    prixMax: 999999,
    tri: 'createdAt',
    ordre: 'desc'
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset page when other filters change
    }))
  }

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      categorie: '',
      prixMin: 0,
      prixMax: 999999,
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

// Hook pour la pagination
export const usePagination = (currentPage, totalPages, onPageChange) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  return {
    pageNumbers: getPageNumbers(),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  }
}
