const WishlistService = require('../services/wishlistService')

class WishlistController {
  // Récupérer les favoris
  static async getWishlist(req, res) {
    try {
      const result = await WishlistService.getWishlist(req.user.id)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Ajouter aux favoris
  static async addToWishlist(req, res) {
    try {
      const { produitId } = req.body
      const result = await WishlistService.addToWishlist(req.user.id, produitId)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Supprimer des favoris
  static async removeFromWishlist(req, res) {
    try {
      const { produitId } = req.params
      const result = await WishlistService.removeFromWishlist(req.user.id, produitId)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Vérifier si un produit est dans les favoris
  static async isInWishlist(req, res) {
    try {
      const { produitId } = req.params
      const result = await WishlistService.isInWishlist(req.user.id, produitId)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Vider les favoris
  static async clearWishlist(req, res) {
    try {
      const result = await WishlistService.clearWishlist(req.user.id)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }

  // Obtenir le nombre de favoris
  static async getWishlistCount(req, res) {
    try {
      const result = await WishlistService.getWishlistCount(req.user.id)
      res.json(result)
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      })
    }
  }
}

module.exports = WishlistController
