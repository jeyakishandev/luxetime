const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { 
  validateCreateProduct, 
  validateUpdateProduct, 
  validateSearchParams 
} = require('../middleware/validation');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer la liste des produits avec filtres
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *           enum: [HOMME, FEMME, UNISEXE, SPORT]
 *         description: Filtrer par catégorie
 *       - in: query
 *         name: marque
 *         schema:
 *           type: string
 *         description: Filtrer par marque
 *       - in: query
 *         name: minPrix
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrix
 *         schema:
 *           type: number
 *         description: Prix maximum
 *       - in: query
 *         name: tri
 *         schema:
 *           type: string
 *           enum: [prix_asc, prix_desc, nouveaute, popularite]
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         products:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Product'
 */
router.get('/', validateSearchParams, ProductController.getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Rechercher des produits
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *     responses:
 *       200:
 *         description: Résultats de recherche
 */
router.get('/search', validateSearchParams, ProductController.searchProducts);

/**
 * @swagger
 * /products/popular:
 *   get:
 *     summary: Récupérer les produits populaires
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Nombre de produits à retourner
 *     responses:
 *       200:
 *         description: Liste des produits populaires
 */
router.get('/popular', ProductController.getPopularProducts);

/**
 * @swagger
 * /products/new:
 *   get:
 *     summary: Récupérer les nouveaux produits
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Nombre de produits à retourner
 *     responses:
 *       200:
 *         description: Liste des nouveaux produits
 */
router.get('/new', ProductController.getNewProducts);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Récupérer toutes les catégories disponibles
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get('/categories', ProductController.getCategories);

/**
 * @swagger
 * /products/brands:
 *   get:
 *     summary: Récupérer toutes les marques disponibles
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des marques
 */
router.get('/brands', ProductController.getBrands);
// Route pour debug : lister les IDs des produits (uniquement en développement)
if (process.env.NODE_ENV !== 'production') {
  router.get('/debug/ids', async (req, res) => {
    try {
      const { prisma } = require('../config/database');
      const products = await prisma.produit.findMany({
        select: { id: true, nom: true, reference: true },
        orderBy: { id: 'asc' }
      });
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupérer les détails d'un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 */
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
