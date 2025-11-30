const express = require('express');
const router = express.Router();
const ReturnController = require('../controllers/returnController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes authentifiées
router.use(authenticateToken);

router.post('/', ReturnController.createReturn);
router.get('/user/my-returns', ReturnController.getUserReturns);
router.get('/:id', ReturnController.getReturnById);

// Routes admin
router.put('/:id/status', requireAdmin, ReturnController.updateReturnStatus);
router.put('/:id/tracking', requireAdmin, ReturnController.addReturnTracking);
router.put('/:id/refund', requireAdmin, ReturnController.processRefund);

module.exports = router;

