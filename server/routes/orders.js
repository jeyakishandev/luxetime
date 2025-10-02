const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateCreateOrder } = require('../middleware/validation');

// Routes utilisateur
router.use(authenticateToken);

// Commandes utilisateur
router.post('/', validateCreateOrder, OrderController.createOrder);
router.get('/my-orders', OrderController.getUserOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/cancel', OrderController.cancelOrder);

// Routes admin
router.get('/admin/all', requireAdmin, OrderController.getAllOrders);
router.put('/admin/:id/status', requireAdmin, OrderController.updateOrderStatus);
router.get('/admin/stats', requireAdmin, OrderController.getOrderStats);
router.get('/admin/statuses', requireAdmin, OrderController.getOrderStatuses);

module.exports = router;
