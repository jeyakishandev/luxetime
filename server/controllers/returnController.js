const ReturnService = require('../services/returnService');

class ReturnController {
  // Créer une demande de retour
  static async createReturn(req, res) {
    try {
      const { commandeId, items, raison, description, notesClient, methodeRemboursement } = req.body;
      const returnData = {
        items,
        raison,
        description,
        notesClient,
        methodeRemboursement
      };
      const result = await ReturnService.createReturn(commandeId, req.user.id, returnData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les retours de l'utilisateur
  static async getUserReturns(req, res) {
    try {
      const filters = {
        statut: req.query.statut || undefined
      };
      const result = await ReturnService.getUserReturns(req.user.id, filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer un retour par ID
  static async getReturnById(req, res) {
    try {
      const { id } = req.params;
      const result = await ReturnService.getReturnById(parseInt(id), req.user.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mettre à jour le statut d'un retour (admin)
  static async updateReturnStatus(req, res) {
    try {
      const { id } = req.params;
      const { statut, notesAdmin } = req.body;
      const result = await ReturnService.updateReturnStatus(parseInt(id), statut, notesAdmin);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Ajouter un numéro de suivi de retour (admin)
  static async addReturnTracking(req, res) {
    try {
      const { id } = req.params;
      const { numeroSuiviRetour } = req.body;
      const result = await ReturnService.addReturnTrackingNumber(parseInt(id), numeroSuiviRetour);
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Traiter le remboursement (admin)
  static async processRefund(req, res) {
    try {
      const { id } = req.params;
      const result = await ReturnService.processRefund(parseInt(id));
      res.json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ReturnController;

