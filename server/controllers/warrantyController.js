const WarrantyService = require('../services/warrantyService');

class WarrantyController {
  // Créer une garantie
  static async createWarranty(req, res) {
    try {
      const { commandeItemId, typeGarantie } = req.body;
      const result = await WarrantyService.createWarranty(commandeItemId, req.user.id, typeGarantie);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les garanties de l'utilisateur
  static async getUserWarranties(req, res) {
    try {
      const filters = {
        estActive: req.query.estActive !== undefined ? req.query.estActive === 'true' : undefined
      };
      const result = await WarrantyService.getUserWarranties(req.user.id, filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer une garantie par ID
  static async getWarrantyById(req, res) {
    try {
      const { id } = req.params;
      const result = await WarrantyService.getWarrantyById(parseInt(id), req.user.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir les garanties expirantes (admin)
  static async getExpiringWarranties(req, res) {
    try {
      const daysAhead = parseInt(req.query.days) || 30;
      const result = await WarrantyService.getExpiringWarranties(daysAhead);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = WarrantyController;

