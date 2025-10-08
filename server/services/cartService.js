const { prisma } = require('../config/database');

class CartService {
  // Récupérer le panier d'un utilisateur
  static async getCart(userId) {
    try {
      const cartItems = await prisma.panierItem.findMany({
        where: { userId },
        include: {
          produit: {
            include: {
              images: {
                where: { estPrincipale: true }
              }
            }
          }
        }
      });

      // Calculer le total du panier
      const total = cartItems.reduce((sum, item) => {
        const prix = item.produit.prixPromo && item.produit.prixPromo > 0 
          ? item.produit.prixPromo 
          : item.produit.prix;
        return sum + (prix * item.quantite);
      }, 0);

      return {
        success: true,
        data: {
          items: cartItems,
          total: Math.round(total * 100) / 100,
          itemCount: cartItems.length
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du panier: ${error.message}`);
    }
  }

  // Ajouter un produit au panier
  static async addToCart(userId, produitId, quantite = 1) {
    try {
      // Vérifier que le produit existe et est disponible
      const produit = await prisma.produit.findUnique({
        where: { id: parseInt(produitId) }
      });

      if (!produit) {
        throw new Error('Produit non trouvé');
      }

      if (!produit.estEnVente) {
        throw new Error('Ce produit n\'est plus en vente');
      }

      if (produit.stock < quantite) {
        throw new Error('Stock insuffisant');
      }

      // Vérifier si le produit est déjà dans le panier
      const existingItem = await prisma.panierItem.findUnique({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      });

      if (existingItem) {
        // Mettre à jour la quantité
        const newQuantite = existingItem.quantite + quantite;
        
        if (newQuantite > produit.stock) {
          throw new Error('Quantité demandée supérieure au stock disponible');
        }

        const updatedItem = await prisma.panierItem.update({
          where: {
            userId_produitId: {
              userId,
              produitId: parseInt(produitId)
            }
          },
          data: { quantite: newQuantite },
          include: {
            produit: {
              include: {
                images: {
                  where: { estPrincipale: true }
                }
              }
            }
          }
        });

        return {
          success: true,
          message: 'Quantité mise à jour dans le panier',
          data: updatedItem
        };
      } else {
        // Ajouter un nouvel item
        const newItem = await prisma.panierItem.create({
          data: {
            userId,
            produitId,
            quantite
          },
          include: {
            produit: {
              include: {
                images: {
                  where: { estPrincipale: true }
                }
              }
            }
          }
        });

        return {
          success: true,
          message: 'Produit ajouté au panier',
          data: newItem
        };
      }
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout au panier: ${error.message}`);
    }
  }

  // Mettre à jour la quantité d'un item
  static async updateCartItem(userId, produitId, quantite) {
    try {
      if (quantite <= 0) {
        throw new Error('La quantité doit être positive');
      }

      // Vérifier que le produit existe
      const produit = await prisma.produit.findUnique({
        where: { id: parseInt(produitId) }
      });

      if (!produit) {
        throw new Error('Produit non trouvé');
      }

      if (quantite > produit.stock) {
        throw new Error('Quantité supérieure au stock disponible');
      }

      // Vérifier que l'item existe dans le panier
      const existingItem = await prisma.panierItem.findUnique({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      });

      if (!existingItem) {
        throw new Error('Produit non trouvé dans le panier');
      }

      const updatedItem = await prisma.panierItem.update({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        },
        data: { quantite },
        include: {
          produit: {
            include: {
              images: {
                where: { estPrincipale: true }
              }
            }
          }
        }
      });

      return {
        success: true,
        message: 'Quantité mise à jour',
        data: updatedItem
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  }

  // Supprimer un item du panier
  static async removeFromCart(userId, produitId) {
    try {
      const deletedItem = await prisma.panierItem.delete({
        where: {
          userId_produitId: {
            userId,
            produitId: parseInt(produitId)
          }
        }
      });

      return {
        success: true,
        message: 'Produit retiré du panier',
        data: deletedItem
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Produit non trouvé dans le panier');
      }
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  // Vider le panier
  static async clearCart(userId) {
    try {
      await prisma.panierItem.deleteMany({
        where: { userId }
      });

      return {
        success: true,
        message: 'Panier vidé'
      };
    } catch (error) {
      throw new Error(`Erreur lors du vidage du panier: ${error.message}`);
    }
  }

  // Vérifier la disponibilité des produits du panier
  static async validateCart(userId) {
    try {
      const cartItems = await prisma.panierItem.findMany({
        where: { userId },
        include: { produit: true }
      });

      const issues = [];
      const updatedItems = [];

      for (const item of cartItems) {
        const produit = item.produit;
        
        // Vérifier si le produit est toujours en vente
        if (!produit.estEnVente) {
          issues.push({
            produitId: produit.id,
            nom: produit.nom,
            probleme: 'Produit plus en vente'
          });
          continue;
        }

        // Vérifier le stock
        if (item.quantite > produit.stock) {
          if (produit.stock === 0) {
            issues.push({
              produitId: produit.id,
              nom: produit.nom,
              probleme: 'Produit en rupture de stock'
            });
          } else {
            // Ajuster la quantité au stock disponible
            updatedItems.push({
              produitId: produit.id,
              quantiteDemandee: item.quantite,
              quantiteDisponible: produit.stock
            });
          }
        }
      }

      return {
        success: true,
        data: {
          issues,
          updatedItems,
          isValid: issues.length === 0 && updatedItems.length === 0
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la validation du panier: ${error.message}`);
    }
  }

  // Obtenir le nombre d'items dans le panier
  static async getCartItemCount(userId) {
    try {
      const count = await prisma.panierItem.aggregate({
        where: { userId },
        _sum: { quantite: true }
      });

      return {
        success: true,
        data: {
          itemCount: count._sum.quantite || 0
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors du comptage: ${error.message}`);
    }
  }
}

module.exports = CartService;
