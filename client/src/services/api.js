import axios from 'axios'

// Configuration de base d'axios
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// S'assurer que l'URL se termine par /api
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  // Si l'URL ne se termine pas par /api, l'ajouter
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api'
}

// Instance axios principale
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxetime_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('luxetime_token')
      
      // Ne rediriger que si on n'est pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        const currentPath = window.location.pathname + window.location.search
        window.location.href = `/login?from=${encodeURIComponent(currentPath)}`
      }
    }
    return Promise.reject(error)
  }
)

// API d'authentification
export const authAPI = {
  // Connexion
  login: (email, motDePasse) => 
    api.post('/auth/login', { email, motDePasse }),
  
  // Inscription
  register: (userData) => 
    api.post('/auth/register', userData),
  
  // Vérifier le token
  verifyToken: () => 
    api.get('/auth/verify'),
  
  // Récupérer le profil
  getProfile: () => 
    api.get('/auth/profile'),
  
  // Mettre à jour le profil
  updateProfile: (userData) => 
    api.put('/auth/profile', userData),
  
  // Changer le mot de passe
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  
  // Mot de passe oublié
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
  
  // Réinitialiser le mot de passe
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }),
  
  // Supprimer le compte
  deleteAccount: (password) => 
    api.delete('/auth/account', { data: { password } })
}

// API des produits
export const productAPI = {
  // Récupérer tous les produits
  getProducts: (params = {}) => 
    api.get('/products', { params }),
  
  // Rechercher des produits
  searchProducts: (query, params = {}) => 
    api.get('/products/search', { params: { q: query, ...params } }),
  
  // Récupérer un produit par ID
  getProductById: (id) => 
    api.get(`/products/${id}`),
  
  // Récupérer les produits populaires
  getPopularProducts: (limit = 8) => 
    api.get('/products/popular', { params: { limit } }),
  
  // Récupérer les nouveaux produits
  getNewProducts: (limit = 8) => 
    api.get('/products/new', { params: { limit } }),
  
  // Récupérer les catégories
  getCategories: () => 
    api.get('/products/categories'),
  
  // Récupérer les marques
  getBrands: () => 
    api.get('/products/brands'),
  
  // Créer un produit (admin)
  createProduct: (productData) => 
    api.post('/products', productData),
  
  // Mettre à jour un produit (admin)
  updateProduct: (id, productData) => 
    api.put(`/products/${id}`, productData),
  
  // Supprimer un produit (admin)
  deleteProduct: (id) => 
    api.delete(`/products/${id}`),
  
  // Mettre à jour le stock (admin)
  updateStock: (id, stock) => 
    api.put(`/products/${id}/stock`, { stock })
}

// API du panier
export const cartAPI = {
  // Récupérer le panier
  getCart: () => 
    api.get('/cart'),
  
  // Ajouter au panier
  addToCart: (produitId, quantite = 1) => 
    api.post('/cart/add', { produitId, quantite }),
  
  // Mettre à jour la quantité
  updateCartItem: (produitId, quantite) => 
    api.put(`/cart/${produitId}`, { quantite }),
  
  // Supprimer du panier
  removeFromCart: (produitId) => 
    api.delete(`/cart/${produitId}`),
  
  // Vider le panier
  clearCart: () => 
    api.delete('/cart'),
  
  // Valider le panier
  validateCart: () => 
    api.get('/cart/validate'),
  
  // Obtenir le nombre d'items
  getCartItemCount: () => 
    api.get('/cart/count')
}

// API des commandes
export const orderAPI = {
  // Créer une commande
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  
  // Récupérer les commandes de l'utilisateur
  getUserOrders: (params = {}) => 
    api.get('/orders/my-orders', { params }),
  
  // Récupérer une commande par ID
  getOrderById: (id) => 
    api.get(`/orders/${id}`),
  
  // Annuler une commande
  cancelOrder: (id) => 
    api.put(`/orders/${id}/cancel`),
  
  // Récupérer toutes les commandes (admin)
  getAllOrders: (params = {}) => 
    api.get('/orders/admin/all', { params }),
  
  // Mettre à jour le statut (admin)
  updateOrderStatus: (id, statut) => 
    api.put(`/orders/admin/${id}/status`, { statut }),
  
  // Obtenir les statistiques (admin)
  getOrderStats: () => 
    api.get('/orders/admin/stats'),
  
  // Obtenir les statuts disponibles
  getOrderStatuses: () => 
    api.get('/orders/admin/statuses')
}

// API utilitaire
export const utilAPI = {
  // Santé de l'API
  health: () => 
    api.get('/health'),
  
  // Upload d'image
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// API pour les favoris
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (produitId) => api.post('/wishlist/add', { produitId }),
  removeFromWishlist: (produitId) => api.delete(`/wishlist/${produitId}`),
  isInWishlist: (produitId) => api.get(`/wishlist/check/${produitId}`),
  clearWishlist: () => api.delete('/wishlist'),
  getWishlistCount: () => api.get('/wishlist/count')
}

// API des avis
export const reviewAPI = {
  // Créer ou mettre à jour un avis
  createOrUpdateReview: (produitId, note, commentaire) => 
    api.post('/reviews', { produitId, note, commentaire }),
  
  // Supprimer un avis
  deleteReview: (id) => 
    api.delete(`/reviews/${id}`),
  
  // Récupérer les avis d'un produit
  getProductReviews: (produitId) => 
    api.get(`/reviews/produit/${produitId}`)
}

// API des certificats d'authenticité
export const certificateAPI = {
  // Créer un certificat
  createCertificate: (commandeItemId) => 
    api.post('/certificates', { commandeItemId }),
  
  // Récupérer mes certificats
  getMyCertificates: () => 
    api.get('/certificates/user/my-certificates'),
  
  // Vérifier un certificat (public)
  verifyCertificate: (numeroCertificat) => 
    api.get(`/certificates/verify/${numeroCertificat}`),
  
  // Récupérer un certificat par numéro
  getCertificateByNumber: (numeroCertificat) => 
    api.get(`/certificates/${numeroCertificat}`)
}

// API des garanties
export const warrantyAPI = {
  // Créer une garantie
  createWarranty: (commandeItemId, typeGarantie) => 
    api.post('/warranties', { commandeItemId, typeGarantie }),
  
  // Récupérer mes garanties
  getMyWarranties: (params = {}) => 
    api.get('/warranties/user/my-warranties', { params }),
  
  // Récupérer une garantie par ID
  getWarrantyById: (id) => 
    api.get(`/warranties/${id}`)
}

// API des livraisons
export const shippingAPI = {
  // Récupérer mes livraisons
  getMyShippings: () => 
    api.get('/shipping/user/my-shippings'),
  
  // Suivre une livraison (public)
  trackShipping: (numeroSuivi) => 
    api.get(`/shipping/track/${numeroSuivi}`)
}

// API des retours
export const returnAPI = {
  // Créer une demande de retour
  createReturn: (returnData) => 
    api.post('/returns', returnData),
  
  // Récupérer mes retours
  getMyReturns: (params = {}) => 
    api.get('/returns/user/my-returns', { params }),
  
  // Récupérer un retour par ID
  getReturnById: (id) => 
    api.get(`/returns/${id}`)
}

// Export par défaut
export default api
