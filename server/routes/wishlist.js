const express = require('express')
const router = express.Router()
const WishlistController = require('../controllers/wishlistController')
const { authenticateToken } = require('../middleware/auth')
const { body } = require('express-validator')
const { handleValidationErrors } = require('../middleware/validation')

// Toutes les routes nécessitent une authentification
router.use(authenticateToken)

// Validation pour l'ajout aux favoris
const validateAddToWishlist = [
  body('produitId')
    .isInt({ min: 1 })
    .withMessage('L\'ID du produit doit être un entier positif'),
  handleValidationErrors
]

// Routes
router.get('/', WishlistController.getWishlist)
router.post('/add', validateAddToWishlist, WishlistController.addToWishlist)
router.delete('/:produitId', WishlistController.removeFromWishlist)
router.get('/check/:produitId', WishlistController.isInWishlist)
router.delete('/', WishlistController.clearWishlist)
router.get('/count', WishlistController.getWishlistCount)

module.exports = router
