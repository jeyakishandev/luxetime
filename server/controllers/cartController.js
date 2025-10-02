const CartService = require('../services/cartService');

class CartController {
  // Récupérer le panier de l'utilisateur
  static async getCart(req, res) {
    try {
      const result = await CartService.getCart(req.user.id);
      
      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Ajouter un produit au panier
  static async addToCart(req, res) {
    try {
      const { produitId, quantite } = req.body;
      const result = await CartService.addToCart(req.user.id, produitId, quantite);
      
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mettre à jour la quantité d'un item
  static async updateCartItem(req, res) {
    try {
      const { produitId } = req.params;
      const { quantite } = req.body;
      const result = await CartService.updateCartItem(req.user.id, produitId, quantite);
      
      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Supprimer un item du panier
  static async removeFromCart(req, res) {
    try {
      const { produitId } = req.params;
      const result = await CartService.removeFromCart(req.user.id, produitId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Vider le panier
  static async clearCart(req, res) {
    try {
      const result = await CartService.clearCart(req.user.id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Valider le panier
  static async validateCart(req, res) {
    try {
      const result = await CartService.validateCart(req.user.id);
      
      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir le nombre d'items dans le panier
  static async getCartItemCount(req, res) {
    try {
      const result = await CartService.getCartItemCount(req.user.id);
      
      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = CartController;
