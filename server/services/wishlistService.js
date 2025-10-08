const { prisma } = require('../config/database')

class WishlistService {
  // Récupérer les favoris d'un utilisateur
  static async getWishlist(userId) {
    try {
      const wishlistItems = await prisma.favori.findMany({
        where: { userId },
        include: {
          produit: {
            include: {
              images: {
                where: { estPrincipale: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return {
        success: true,
        data: {
          items: wishlistItems,
          itemCount: wishlistItems.length
        }
      }
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des favoris: ${error.message}`)
    }
  }

  // Ajouter un produit aux favoris
  static async addToWishlist(userId, produitId) {
    try {
      // Vérifier que le produit existe
      const produit = await prisma.produit.findUnique({
        where: { id: parseInt(produitId) }
      })

      if (!produit) {
        throw new Error('Produit non trouvé')
      }

      // Vérifier si le produit est déjà dans les favoris
      const existingFavorite = await prisma.favori.findUnique({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      })

      if (existingFavorite) {
        throw new Error('Produit déjà dans vos favoris')
      }

      // Ajouter aux favoris
      const newFavorite = await prisma.favori.create({
        data: {
          userId,
          produitId: parseInt(produitId)
        },
        include: {
          produit: {
            include: {
              images: {
                where: { estPrincipale: true }
              }
            }
          }
        }
      })

      return {
        success: true,
        message: 'Produit ajouté aux favoris',
        data: newFavorite
      }
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout aux favoris: ${error.message}`)
    }
  }

  // Supprimer un produit des favoris
  static async removeFromWishlist(userId, produitId) {
    try {
      const deletedFavorite = await prisma.favori.delete({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      })

      return {
        success: true,
        message: 'Produit retiré des favoris',
        data: deletedFavorite
      }
    } catch (error) {
      throw new Error(`Erreur lors de la suppression des favoris: ${error.message}`)
    }
  }

  // Vérifier si un produit est dans les favoris
  static async isInWishlist(userId, produitId) {
    try {
      const favorite = await prisma.favori.findUnique({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      })

      return {
        success: true,
        data: {
          isInWishlist: !!favorite
        }
      }
    } catch (error) {
      throw new Error(`Erreur lors de la vérification des favoris: ${error.message}`)
    }
  }

  // Vider les favoris
  static async clearWishlist(userId) {
    try {
      await prisma.favori.deleteMany({
        where: { userId }
      })

      return {
        success: true,
        message: 'Favoris vidés'
      }
    } catch (error) {
      throw new Error(`Erreur lors du vidage des favoris: ${error.message}`)
    }
  }

  // Obtenir le nombre de favoris
  static async getWishlistCount(userId) {
    try {
      const count = await prisma.favori.count({
        where: { userId }
      })

      return {
        success: true,
        data: {
          count
        }
      }
    } catch (error) {
      throw new Error(`Erreur lors du comptage des favoris: ${error.message}`)
    }
  }
}

module.exports = WishlistService
