const { prisma } = require('../config/database');
const crypto = require('crypto');

class ReturnService {
  // Générer un numéro de retour unique
  static generateReturnNumber() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `RET-${timestamp}-${random}`;
  }

  // Créer une demande de retour
  static async createReturn(commandeId, userId, returnData) {
    try {
      // Vérifier que la commande existe et appartient à l'utilisateur
      const commande = await prisma.commande.findUnique({
        where: { id: commandeId },
        include: {
          items: {
            include: {
              produit: true
            }
          }
        }
      });

      if (!commande) {
        throw new Error('Commande non trouvée');
      }

      if (commande.clientId !== userId) {
        throw new Error('Non autorisé');
      }

      // Vérifier que la commande est livrée
      if (commande.statut !== 'LIVREE') {
        throw new Error('Seules les commandes livrées peuvent être retournées');
      }

      // Vérifier qu'il n'existe pas déjà un retour en cours pour cette commande
      const existingReturn = await prisma.retour.findFirst({
        where: {
          commandeId,
          statut: {
            notIn: ['REFUSEE', 'ANNULEE', 'REMBOURSEE']
          }
        }
      });

      if (existingReturn) {
        throw new Error('Un retour est déjà en cours pour cette commande');
      }

      // Valider les items à retourner
      const itemsToReturn = returnData.items || [];
      if (itemsToReturn.length === 0) {
        throw new Error('Aucun article spécifié pour le retour');
      }

      // Vérifier que les items appartiennent à la commande
      const commandeItemIds = commande.items.map(item => item.id);
      for (const returnItem of itemsToReturn) {
        if (!commandeItemIds.includes(returnItem.commandeItemId)) {
          throw new Error(`L'item ${returnItem.commandeItemId} n'appartient pas à cette commande`);
        }
      }

      // Calculer le montant du remboursement
      let montantRembourse = 0;
      for (const returnItem of itemsToReturn) {
        const commandeItem = commande.items.find(item => item.id === returnItem.commandeItemId);
        if (commandeItem) {
          montantRembourse += commandeItem.prixUnitaire * (returnItem.quantite || commandeItem.quantite);
        }
      }

      // Générer le numéro de retour
      const numeroRetour = this.generateReturnNumber();

      // Créer le retour
      const retour = await prisma.retour.create({
        data: {
          numeroRetour,
          commandeId,
          userId,
          statut: 'DEMANDE',
          raison: returnData.raison,
          description: returnData.description || null,
          items: itemsToReturn,
          montantRembourse,
          methodeRemboursement: returnData.methodeRemboursement || commande.methodePaiement,
          notesClient: returnData.notesClient || null
        },
        include: {
          commande: {
            include: {
              items: {
                include: {
                  produit: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      });

      return {
        success: true,
        message: 'Demande de retour créée avec succès',
        data: retour
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du retour: ${error.message}`);
    }
  }

  // Récupérer les retours d'un utilisateur
  static async getUserReturns(userId, filters = {}) {
    try {
      const where = {
        userId,
        ...(filters.statut && { statut: filters.statut })
      };

      const retours = await prisma.retour.findMany({
        where,
        include: {
          commande: {
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
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: retours
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des retours: ${error.message}`);
    }
  }

  // Récupérer un retour par ID
  static async getReturnById(retourId, userId = null) {
    try {
      const retour = await prisma.retour.findUnique({
        where: { id: retourId },
        include: {
          commande: {
            include: {
              items: {
                include: {
                  produit: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      });

      if (!retour) {
        throw new Error('Retour non trouvé');
      }

      // Vérifier l'autorisation si userId fourni
      if (userId && retour.userId !== userId) {
        throw new Error('Non autorisé');
      }

      return {
        success: true,
        data: retour
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du retour: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'un retour (admin)
  static async updateReturnStatus(retourId, nouveauStatut, adminNotes = null) {
    try {
      const retour = await prisma.retour.findUnique({
        where: { id: retourId }
      });

      if (!retour) {
        throw new Error('Retour non trouvé');
      }

      const updateData = {
        statut: nouveauStatut,
        ...(adminNotes && { notesAdmin: adminNotes })
      };

      // Mettre à jour les dates selon le statut
      if (nouveauStatut === 'RECUE' && !retour.dateReception) {
        updateData.dateReception = new Date();
      } else if (nouveauStatut === 'REMBOURSEE' && !retour.dateRemboursement) {
        updateData.dateRemboursement = new Date();
      }

      const updated = await prisma.retour.update({
        where: { id: retourId },
        data: updateData,
        include: {
          commande: true,
          user: true
        }
      });

      return {
        success: true,
        message: 'Statut du retour mis à jour',
        data: updated
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du retour: ${error.message}`);
    }
  }

  // Ajouter un numéro de suivi de retour
  static async addReturnTrackingNumber(retourId, numeroSuiviRetour) {
    try {
      const retour = await prisma.retour.update({
        where: { id: retourId },
        data: {
          numeroSuiviRetour,
          dateExpRetour: new Date(),
          statut: 'EN_TRANSIT'
        }
      });

      return {
        success: true,
        message: 'Numéro de suivi ajouté',
        data: retour
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'ajout du numéro de suivi: ${error.message}`);
    }
  }

  // Processus de remboursement
  static async processRefund(retourId) {
    try {
      const retour = await prisma.retour.findUnique({
        where: { id: retourId },
        include: {
          commande: true
        }
      });

      if (!retour) {
        throw new Error('Retour non trouvé');
      }

      if (retour.statut !== 'VERIFIEE') {
        throw new Error('Le retour doit être vérifié avant le remboursement');
      }

      // Simuler le remboursement (pour portfolio, c'est juste une mise à jour)
      const updated = await prisma.retour.update({
        where: { id: retourId },
        data: {
          statut: 'REMBOURSEE',
          dateRemboursement: new Date()
        },
        include: {
          commande: true,
          user: true
        }
      });

      return {
        success: true,
        message: 'Remboursement traité avec succès',
        data: updated
      };
    } catch (error) {
      throw new Error(`Erreur lors du remboursement: ${error.message}`);
    }
  }
}

module.exports = ReturnService;

