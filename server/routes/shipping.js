const express = require('express');
const router = express.Router();
const ShippingController = require('../controllers/shippingController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Route publique pour suivre une livraison
router.get('/track/:numeroSuivi', ShippingController.trackShipping);

// Routes authentifiées
router.use(authenticateToken);
router.get('/user/my-shippings', ShippingController.getUserShippings);

// Routes admin
router.post('/', requireAdmin, ShippingController.createShipping);
router.put('/:id/status', requireAdmin, ShippingController.updateShippingStatus);

module.exports = router;

