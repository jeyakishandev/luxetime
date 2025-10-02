const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { 
  validateCreateProduct, 
  validateUpdateProduct, 
  validateSearchParams 
} = require('../middleware/validation');

// Routes publiques
router.get('/', validateSearchParams, ProductController.getProducts);
router.get('/search', validateSearchParams, ProductController.searchProducts);
router.get('/popular', ProductController.getPopularProducts);
router.get('/new', ProductController.getNewProducts);
router.get('/categories', ProductController.getCategories);
router.get('/brands', ProductController.getBrands);
router.get('/:id', optionalAuth, ProductController.getProductById);

// Routes protégées (admin)
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  validateCreateProduct, 
  ProductController.createProduct
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  validateUpdateProduct, 
  ProductController.updateProduct
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  ProductController.deleteProduct
);

router.put('/:id/stock', 
  authenticateToken, 
  requireAdmin, 
  ProductController.updateStock
);

module.exports = router;
