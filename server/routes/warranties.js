const express = require('express');
const router = express.Router();
const WarrantyController = require('../controllers/warrantyController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes authentifiées
router.use(authenticateToken);

router.post('/', WarrantyController.createWarranty);
router.get('/user/my-warranties', WarrantyController.getUserWarranties);
router.get('/:id', WarrantyController.getWarrantyById);

// Routes admin
router.get('/admin/expiring', requireAdmin, WarrantyController.getExpiringWarranties);

module.exports = router;

