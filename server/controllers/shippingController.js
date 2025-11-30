const ShippingService = require('../services/shippingService');

class ShippingController {
  // Créer une livraison (admin)
  static async createShipping(req, res) {
    try {
      const { commandeId, transporteur, ...options } = req.body;
      const result = await ShippingService.createShipping(commandeId, transporteur, options);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mettre à jour le statut d'une livraison (admin)
  static async updateShippingStatus(req, res) {
    try {
      const { id } = req.params;
      const { statut, lieu, description } = req.body;
      const result = await ShippingService.updateShippingStatus(id, statut, lieu, description);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les livraisons de l'utilisateur
  static async getUserShippings(req, res) {
    try {
      const result = await ShippingService.getUserShippings(req.user.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Suivre une livraison par numéro de suivi (public)
  static async trackShipping(req, res) {
    try {
      const { numeroSuivi } = req.params;
      const result = await ShippingService.getShippingByTrackingNumber(numeroSuivi);
      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ShippingController;

