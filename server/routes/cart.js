const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { validateAddToCart } = require('../middleware/validation');

// Toutes les routes du panier nécessitent une authentification
router.use(authenticateToken);

router.get('/', CartController.getCart);
router.post('/add', validateAddToCart, CartController.addToCart);
router.put('/:produitId', CartController.updateCartItem);
router.delete('/:produitId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);
router.get('/validate', CartController.validateCart);
router.get('/count', CartController.getCartItemCount);

module.exports = router;
