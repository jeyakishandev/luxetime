const OrderService = require('../services/orderService');

class OrderController {
  // Créer une nouvelle commande
  static async createOrder(req, res) {
    try {
      const result = await OrderService.createOrder(req.user.id, req.body);
      
      res.status(201).json({
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

  // Récupérer les commandes de l'utilisateur
  static async getUserOrders(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        statut: req.query.statut || '',
        tri: req.query.tri || 'createdAt',
        ordre: req.query.ordre || 'desc'
      };

      const result = await OrderService.getUserOrders(req.user.id, filters);
      
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

  // Récupérer une commande par ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const result = await OrderService.getOrderById(id, req.user.id);
      
      res.json({
        success: true,
        data: result.data
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Annuler une commande
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await OrderService.cancelOrder(id, req.user.id);
      
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

  // Récupérer toutes les commandes (admin)
  static async getAllOrders(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        statut: req.query.statut || '',
        search: req.query.search || '',
        tri: req.query.tri || 'createdAt',
        ordre: req.query.ordre || 'desc'
      };

      const result = await OrderService.getAllOrders(filters);
      
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

  // Mettre à jour le statut d'une commande (admin)
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      const result = await OrderService.updateOrderStatus(id, statut, req.user.id);
      
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

  // Obtenir les statistiques des commandes (admin)
  static async getOrderStats(req, res) {
    try {
      const result = await OrderService.getOrderStats();
      
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

  // Obtenir les statuts de commande disponibles
  static async getOrderStatuses(req, res) {
    try {
      const statuses = [
        { value: 'EN_ATTENTE', label: 'En attente' },
        { value: 'CONFIRMEE', label: 'Confirmée' },
        { value: 'EN_PREPARATION', label: 'En préparation' },
        { value: 'EXPEDIEE', label: 'Expédiée' },
        { value: 'LIVREE', label: 'Livrée' },
        { value: 'ANNULEE', label: 'Annulée' }
      ];

      res.json({
        success: true,
        data: statuses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
