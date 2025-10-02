const ProductService = require('../services/productService');

class ProductController {
  // Récupérer tous les produits avec filtres
  static async getProducts(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
        search: req.query.search || '',
        categorie: req.query.categorie || '',
        prixMin: parseFloat(req.query.prixMin) || 0,
        prixMax: parseFloat(req.query.prixMax) || 999999,
        tri: req.query.tri || 'createdAt',
        ordre: req.query.ordre || 'desc',
        estEnVente: req.query.estEnVente !== 'false'
      };

      const result = await ProductService.getProducts(filters);
      
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

  // Récupérer un produit par ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.getProductById(id);
      
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

  // Créer un nouveau produit (admin)
  static async createProduct(req, res) {
    try {
      const productData = req.body;
      const images = req.files ? req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname
      })) : [];

      const result = await ProductService.createProduct(productData, images);
      
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

  // Mettre à jour un produit (admin)
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const newImages = req.files ? req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname
      })) : [];

      const result = await ProductService.updateProduct(id, updateData, newImages);
      
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

  // Supprimer un produit (admin)
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.deleteProduct(id);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer les produits populaires
  static async getPopularProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await ProductService.getPopularProducts(limit);
      
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

  // Récupérer les nouveaux produits
  static async getNewProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 8;
      const result = await ProductService.getNewProducts(limit);
      
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

  // Rechercher des produits
  static async searchProducts(req, res) {
    try {
      const { q } = req.query;
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 12,
        categorie: req.query.categorie || '',
        prixMin: parseFloat(req.query.prixMin) || 0,
        prixMax: parseFloat(req.query.prixMax) || 999999,
        tri: req.query.tri || 'createdAt',
        ordre: req.query.ordre || 'desc'
      };

      const result = await ProductService.searchProducts(q, filters);
      
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

  // Mettre à jour le stock (admin)
  static async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      
      const result = await ProductService.updateStock(id, stock);
      
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

  // Obtenir les catégories disponibles
  static async getCategories(req, res) {
    try {
      const categories = [
        { value: 'HOMME', label: 'Homme' },
        { value: 'FEMME', label: 'Femme' },
        { value: 'UNISEXE', label: 'Unisexe' },
        { value: 'VINTAGE', label: 'Vintage' },
        { value: 'SPORT', label: 'Sport' }
      ];

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obtenir les marques disponibles
  static async getBrands(req, res) {
    try {
      // Cette fonction pourrait être améliorée pour récupérer les marques depuis la DB
      const brands = [
        'Luxe Time',
        'Rolex',
        'Omega',
        'Cartier',
        'Patek Philippe',
        'Audemars Piguet',
        'Vacheron Constantin',
        'Jaeger-LeCoultre'
      ];

      res.json({
        success: true,
        data: brands
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ProductController;
