const { prisma } = require('../config/database');

class ProductService {
  // Récupérer tous les produits avec pagination et filtres
  static async getProducts(filters = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        search = '',
        categorie = '',
        prixMin = 0,
        prixMax = 999999,
        tri = 'createdAt',
        ordre = 'desc',
        estEnVente = true
      } = filters;

      const skip = (page - 1) * limit;

      // Construction des conditions de recherche
      const where = {
        estEnVente,
        prix: {
          gte: prixMin,
          lte: prixMax
        }
      };

      // Filtre par catégorie
      if (categorie) {
        where.categorie = categorie;
      }

      // Recherche textuelle
      if (search) {
        where.OR = [
          { nom: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { marque: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Récupération des produits
      const [products, total] = await Promise.all([
        prisma.produit.findMany({
          where,
          include: {
            images: {
              orderBy: { estPrincipale: 'desc' }
            },
            _count: {
              select: { avis: true }
            }
          },
          orderBy: { [tri]: ordre },
          skip,
          take: parseInt(limit)
        }),
        prisma.produit.count({ where })
      ]);

      // Calcul des métadonnées de pagination
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage,
            hasPrevPage
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
    }
  }

  // Récupérer un produit par ID
  static async getProductById(id) {
    try {
      const product = await prisma.produit.findUnique({
        where: { id: parseInt(id) },
        include: {
          images: {
            orderBy: { estPrincipale: 'desc' }
          },
          avis: {
            include: {
              user: {
                select: {
                  nom: true,
                  prenom: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { avis: true }
          }
        }
      });

      if (!product) {
        throw new Error('Produit non trouvé');
      }

      // Incrémenter le compteur de vues
      await prisma.produit.update({
        where: { id: parseInt(id) },
        data: { vues: { increment: 1 } }
      });

      return {
        success: true,
        data: product
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
    }
  }

  // Créer un nouveau produit
  static async createProduct(productData, images = []) {
    try {
      const product = await prisma.produit.create({
        data: {
          ...productData,
          images: {
            create: images.map((img, index) => ({
              url: img.url,
              alt: img.alt || '',
              estPrincipale: index === 0
            }))
          }
        },
        include: {
          images: true
        }
      });

      return {
        success: true,
        message: 'Produit créé avec succès',
        data: product
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du produit: ${error.message}`);
    }
  }

  // Mettre à jour un produit
  static async updateProduct(id, updateData, newImages = []) {
    try {
      // Vérifier que le produit existe
      const existingProduct = await prisma.produit.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingProduct) {
        throw new Error('Produit non trouvé');
      }

      // Mettre à jour le produit
      const product = await prisma.produit.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          images: true
        }
      });

      // Ajouter les nouvelles images si fournies
      if (newImages.length > 0) {
        await prisma.imageProduit.createMany({
          data: newImages.map((img, index) => ({
            url: img.url,
            alt: img.alt || '',
            estPrincipale: index === 0,
            produitId: parseInt(id)
          }))
        });
      }

      return {
        success: true,
        message: 'Produit mis à jour avec succès',
        data: product
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
    }
  }

  // Supprimer un produit
  static async deleteProduct(id) {
    try {
      const product = await prisma.produit.findUnique({
        where: { id: parseInt(id) }
      });

      if (!product) {
        throw new Error('Produit non trouvé');
      }

      await prisma.produit.delete({
        where: { id: parseInt(id) }
      });

      return {
        success: true,
        message: 'Produit supprimé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
    }
  }

  // Récupérer les produits populaires
  static async getPopularProducts(limit = 8) {
    try {
      const products = await prisma.produit.findMany({
        where: { estEnVente: true },
        include: {
          images: {
            where: { estPrincipale: true }
          }
        },
        orderBy: [
          { vues: 'desc' },
          { noteMoyenne: 'desc' }
        ],
        take: limit
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des produits populaires: ${error.message}`);
    }
  }

  // Récupérer les nouveaux produits
  static async getNewProducts(limit = 8) {
    try {
      const products = await prisma.produit.findMany({
        where: { 
          estEnVente: true,
          estNouveau: true 
        },
        include: {
          images: {
            where: { estPrincipale: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return {
        success: true,
        data: products
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des nouveaux produits: ${error.message}`);
    }
  }

  // Rechercher des produits
  static async searchProducts(query, filters = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        categorie = '',
        prixMin = 0,
        prixMax = 999999,
        tri = 'createdAt',
        ordre = 'desc'
      } = filters;

      const skip = (page - 1) * limit;

      const where = {
        estEnVente: true,
        prix: {
          gte: prixMin,
          lte: prixMax
        },
        OR: [
          { nom: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { marque: { contains: query, mode: 'insensitive' } },
          { reference: { contains: query, mode: 'insensitive' } }
        ]
      };

      if (categorie) {
        where.categorie = categorie;
      }

      const [products, total] = await Promise.all([
        prisma.produit.findMany({
          where,
          include: {
            images: {
              where: { estPrincipale: true }
            }
          },
          orderBy: { [tri]: ordre },
          skip,
          take: parseInt(limit)
        }),
        prisma.produit.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }
  }

  // Mettre à jour le stock
  static async updateStock(id, newStock) {
    try {
      const product = await prisma.produit.update({
        where: { id: parseInt(id) },
        data: { stock: newStock }
      });

      return {
        success: true,
        message: 'Stock mis à jour avec succès',
        data: product
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du stock: ${error.message}`);
    }
  }
}

module.exports = ProductService;
