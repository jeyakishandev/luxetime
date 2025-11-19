const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation pour créer un avis
const validateReview = [
  body('produitId')
    .isInt({ min: 1 })
    .withMessage('ID produit invalide'),
  body('note')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('commentaire')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),
  handleValidationErrors
];

// Routes publiques
router.get('/produit/:produitId', ReviewController.getProductReviews);

// Routes protégées
router.post('/', 
  authenticateToken,
  validateReview,
  ReviewController.createOrUpdateReview
);

router.delete('/:id', 
  authenticateToken,
  param('id').isInt().withMessage('ID avis invalide'),
  handleValidationErrors,
  ReviewController.deleteReview
);

module.exports = router;

