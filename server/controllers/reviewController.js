const ReviewService = require('../services/reviewService');

class ReviewController {
  // Créer ou mettre à jour un avis
  static async createOrUpdateReview(req, res) {
    try {
      const userId = req.user.id;
      const { produitId, note, commentaire } = req.body;

      if (!produitId || !note) {
        return res.status(400).json({
          success: false,
          message: 'Le produit ID et la note sont requis'
        });
      }

      const result = await ReviewService.createOrUpdateReview(userId, produitId, note, commentaire);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Supprimer un avis
  static async deleteReview(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await ReviewService.deleteReview(userId, id);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les avis d'un produit
  static async getProductReviews(req, res) {
    try {
      const { produitId } = req.params;

      const result = await ReviewService.getProductReviews(produitId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ReviewController;

