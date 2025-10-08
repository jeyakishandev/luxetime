const { prisma } = require('../config/database');

class OrderService {
  // Créer une nouvelle commande
  static async createOrder(userId, orderData) {
    try {
      console.log('🛒 OrderService - Création commande pour userId:', userId)
      console.log('🛒 OrderService - Données reçues:', JSON.stringify(orderData, null, 2))
      
      // Récupérer le panier de l'utilisateur
      const cartItems = await prisma.panierItem.findMany({
        where: { userId },
        include: { produit: true }
      });

      console.log('🛒 OrderService - Items panier trouvés:', cartItems.length)
      console.log('🛒 OrderService - Détails panier:', cartItems.map(item => ({
        id: item.id,
        quantite: item.quantite,
        produitId: item.produitId,
        produitNom: item.produit?.nom
      })))

      if (cartItems.length === 0) {
        throw new Error('Le panier est vide');
      }

      // Calculer les totaux
      let sousTotal = 0;
      const commandeItems = [];

      for (const item of cartItems) {
        const produit = item.produit;
        
        // Vérifier la disponibilité
        if (!produit.estEnVente) {
          throw new Error(`Le produit "${produit.nom}" n'est plus en vente`);
        }

        if (item.quantite > produit.stock) {
          throw new Error(`Stock insuffisant pour "${produit.nom}"`);
        }

        const prixUnitaire = produit.prixPromo && produit.prixPromo > 0 
          ? produit.prixPromo 
          : produit.prix;

        sousTotal += prixUnitaire * item.quantite;

        commandeItems.push({
          produitId: produit.id,
          quantite: item.quantite,
          prixUnitaire,
          nomProduit: produit.nom
        });
      }

      // Calculer les frais de livraison (gratuit si > 100€)
      const fraisLivraison = sousTotal >= 100 ? 0 : 15;
      const total = sousTotal + fraisLivraison - (orderData.reduction || 0);

      // Générer un numéro de commande unique
      const numero = `CMD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-${String(Date.now()).slice(-3)}`;

      console.log('🛒 OrderService - Numéro de commande généré:', numero)

      // Créer la commande
      const commande = await prisma.commande.create({
        data: {
          numero: numero,
          clientId: userId,
          adresseLivraisonNom: orderData.adresseLivraison.nom,
          adresseLivraisonPrenom: orderData.adresseLivraison.prenom,
          adresseLivraisonRue: orderData.adresseLivraison.rue,
          adresseLivraisonVille: orderData.adresseLivraison.ville,
          adresseLivraisonCodePostal: orderData.adresseLivraison.codePostal,
          adresseLivraisonPays: orderData.adresseLivraison.pays,
          adresseLivraisonTelephone: orderData.adresseLivraison.telephone,
          adresseFacturationNom: orderData.adresseFacturation?.nom || orderData.adresseLivraison.nom,
          adresseFacturationPrenom: orderData.adresseFacturation?.prenom || orderData.adresseLivraison.prenom,
          adresseFacturationRue: orderData.adresseFacturation?.rue || orderData.adresseLivraison.rue,
          adresseFacturationVille: orderData.adresseFacturation?.ville || orderData.adresseLivraison.ville,
          adresseFacturationCodePostal: orderData.adresseFacturation?.codePostal || orderData.adresseLivraison.codePostal,
          adresseFacturationPays: orderData.adresseFacturation?.pays || orderData.adresseLivraison.pays,
          sousTotal,
          fraisLivraison,
          reduction: orderData.reduction || 0,
          total,
          methodePaiement: orderData.methodePaiement,
          transactionId: orderData.transactionId,
          notes: orderData.notes,
          items: {
            create: commandeItems
          }
        },
        include: {
          items: {
            include: {
              produit: {
                include: {
                  images: {
                    where: { estPrincipale: true }
                  }
                }
              }
            }
          },
          client: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      });

      // Mettre à jour le stock des produits
      for (const item of commandeItems) {
        await prisma.produit.update({
          where: { id: item.produitId },
          data: { stock: { decrement: item.quantite } }
        });
      }

      // Vider le panier
      await prisma.panierItem.deleteMany({
        where: { userId }
      });

      return {
        success: true,
        message: 'Commande créée avec succès',
        data: commande
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
  }

  // Récupérer les commandes d'un utilisateur
  static async getUserOrders(userId, filters = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        statut = '',
        tri = 'createdAt',
        ordre = 'desc'
      } = filters;

      const skip = (page - 1) * limit;

      const where = { clientId: userId };
      if (statut) {
        where.statut = statut;
      }

      const [commandes, total] = await Promise.all([
        prisma.commande.findMany({
          where,
          include: {
            items: {
              include: {
                produit: {
                  include: {
                    images: {
                      where: { estPrincipale: true }
                    }
                  }
                }
              }
            }
          },
          orderBy: { [tri]: ordre },
          skip,
          take: parseInt(limit)
        }),
        prisma.commande.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          commandes,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
  }

  // Récupérer une commande par ID
  static async getOrderById(orderId, userId = null) {
    try {
      const where = { id: parseInt(orderId) };
      if (userId) {
        where.clientId = userId;
      }

      const commande = await prisma.commande.findUnique({
        where,
        include: {
          items: {
            include: {
              produit: {
                include: {
                  images: {
                    where: { estPrincipale: true }
                  }
                }
              }
            }
          },
          client: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true,
              telephone: true
            }
          }
        }
      });

      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      return {
        success: true,
        data: commande
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(orderId, newStatus, adminId = null) {
    try {
      const commande = await prisma.commande.findUnique({
        where: { id: parseInt(orderId) }
      });

      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      // Vérifier les transitions de statut autorisées
      const validTransitions = {
        'EN_ATTENTE': ['CONFIRMEE', 'ANNULEE'],
        'CONFIRMEE': ['EN_PREPARATION', 'ANNULEE'],
        'EN_PREPARATION': ['EXPEDIEE', 'ANNULEE'],
        'EXPEDIEE': ['LIVREE'],
        'LIVREE': [],
        'ANNULEE': []
      };

      if (!validTransitions[commande.statut]?.includes(newStatus)) {
        throw new Error(`Transition de statut non autorisée: ${commande.statut} -> ${newStatus}`);
      }

      const updatedCommande = await prisma.commande.update({
        where: { id: parseInt(orderId) },
        data: { 
          statut: newStatus,
          ...(newStatus === 'EXPEDIEE' && { dateLivraison: new Date() })
        },
        include: {
          items: {
            include: {
              produit: true
            }
          },
          client: {
            select: {
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      });

      return {
        success: true,
        message: 'Statut de la commande mis à jour',
        data: updatedCommande
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
    }
  }

  // Annuler une commande
  static async cancelOrder(orderId, userId) {
    try {
      const commande = await prisma.commande.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          items: true
        }
      });

      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      if (commande.clientId !== userId) {
        throw new Error('Vous ne pouvez pas annuler cette commande');
      }

      if (!['EN_ATTENTE', 'CONFIRMEE'].includes(commande.statut)) {
        throw new Error('Cette commande ne peut pas être annulée');
      }

      // Restaurer le stock
      for (const item of commande.items) {
        await prisma.produit.update({
          where: { id: item.produitId },
          data: { stock: { increment: item.quantite } }
        });
      }

      // Mettre à jour le statut
      const updatedCommande = await prisma.commande.update({
        where: { id: parseInt(orderId) },
        data: { statut: 'ANNULEE' }
      });

      return {
        success: true,
        message: 'Commande annulée avec succès',
        data: updatedCommande
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'annulation: ${error.message}`);
    }
  }

  // Récupérer toutes les commandes (admin)
  static async getAllOrders(filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        statut = '',
        search = '',
        tri = 'createdAt',
        ordre = 'desc'
      } = filters;

      const skip = (page - 1) * limit;

      const where = {};
      if (statut) {
        where.statut = statut;
      }

      if (search) {
        where.OR = [
          { numero: { contains: search, mode: 'insensitive' } },
          { client: { nom: { contains: search, mode: 'insensitive' } } },
          { client: { prenom: { contains: search, mode: 'insensitive' } } }
        ];
      }

      const [commandes, total] = await Promise.all([
        prisma.commande.findMany({
          where,
          include: {
            client: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            },
            items: {
              include: {
                produit: {
                  select: {
                    nom: true,
                    reference: true
                  }
                }
              }
            }
          },
          orderBy: { [tri]: ordre },
          skip,
          take: parseInt(limit)
        }),
        prisma.commande.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          commandes,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
    }
  }

  // Obtenir les statistiques des commandes
  static async getOrderStats() {
    try {
      const [
        totalCommandes,
        commandesEnAttente,
        commandesConfirmees,
        commandesLivrees,
        chiffreAffaires
      ] = await Promise.all([
        prisma.commande.count(),
        prisma.commande.count({ where: { statut: 'EN_ATTENTE' } }),
        prisma.commande.count({ where: { statut: 'CONFIRMEE' } }),
        prisma.commande.count({ where: { statut: 'LIVREE' } }),
        prisma.commande.aggregate({
          where: { statut: { not: 'ANNULEE' } },
          _sum: { total: true }
        })
      ]);

      return {
        success: true,
        data: {
          totalCommandes,
          commandesEnAttente,
          commandesConfirmees,
          commandesLivrees,
          chiffreAffaires: chiffreAffaires._sum.total || 0
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}

module.exports = OrderService;
