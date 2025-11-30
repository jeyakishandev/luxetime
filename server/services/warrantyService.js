const { prisma } = require('../config/database');

class WarrantyService {
  // Créer une garantie pour un item de commande
  static async createWarranty(commandeItemId, userId, typeGarantie = 'FABRICANT') {
    try {
      // Vérifier que l'item existe et appartient à l'utilisateur
      const commandeItem = await prisma.commandeItem.findUnique({
        where: { id: commandeItemId },
        include: {
          commande: true
        }
      });

      if (!commandeItem) {
        throw new Error('Item de commande non trouvé');
      }

      if (commandeItem.commande.clientId !== userId) {
        throw new Error('Non autorisé');
      }

      // Vérifier qu'il n'existe pas déjà une garantie
      const existingWarranty = await prisma.garantie.findUnique({
        where: { commandeItemId }
      });

      if (existingWarranty) {
        throw new Error('Une garantie existe déjà pour cet item');
      }

      // Déterminer la durée selon le type
      let dureeMois;
      switch (typeGarantie) {
        case 'FABRICANT':
          dureeMois = 24; // 2 ans
          break;
        case 'ETENDUE_3':
          dureeMois = 36; // 3 ans
          break;
        case 'ETENDUE_5':
          dureeMois = 60; // 5 ans
          break;
        default:
          dureeMois = 24;
      }

      // Date de début = date de commande
      const dateDebut = commandeItem.commande.createdAt;
      const dateFin = new Date(dateDebut);
      dateFin.setMonth(dateFin.getMonth() + dureeMois);

      // Créer la garantie
      const garantie = await prisma.garantie.create({
        data: {
          typeGarantie,
          dureeMois,
          dateDebut,
          dateFin,
          commandeItemId,
          userId,
          estActive: true,
          conditions: this.getWarrantyConditions(typeGarantie)
        },
        include: {
          commandeItem: {
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
      });

      return {
        success: true,
        message: 'Garantie créée avec succès',
        data: garantie
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la garantie: ${error.message}`);
    }
  }

  // Récupérer les garanties d'un utilisateur
  static async getUserWarranties(userId, filters = {}) {
    try {
      const where = {
        userId,
        ...(filters.estActive !== undefined && { estActive: filters.estActive })
      };

      const garanties = await prisma.garantie.findMany({
        where,
        include: {
          commandeItem: {
            include: {
              produit: {
                include: {
                  images: {
                    where: { estPrincipale: true }
                  }
                }
              },
              commande: {
                select: {
                  numero: true,
                  createdAt: true
                }
              }
            }
          }
        },
        orderBy: { dateFin: 'asc' }
      });

      // Ajouter un champ calculé pour les garanties expirées
      const now = new Date();
      const garantiesAvecStatut = garanties.map(garantie => ({
        ...garantie,
        estExpiree: new Date(garantie.dateFin) < now,
        joursRestants: Math.max(0, Math.ceil((new Date(garantie.dateFin) - now) / (1000 * 60 * 60 * 24)))
      }));

      return {
        success: true,
        data: garantiesAvecStatut
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des garanties: ${error.message}`);
    }
  }

  // Récupérer une garantie par ID
  static async getWarrantyById(garantieId, userId) {
    try {
      const garantie = await prisma.garantie.findUnique({
        where: { id: garantieId },
        include: {
          commandeItem: {
            include: {
              produit: {
                include: {
                  images: true
                }
              },
              commande: {
                include: {
                  client: {
                    select: {
                      id: true,
                      nom: true,
                      prenom: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!garantie) {
        throw new Error('Garantie non trouvée');
      }

      if (garantie.userId !== userId) {
        throw new Error('Non autorisé');
      }

      const now = new Date();
      const garantieAvecStatut = {
        ...garantie,
        estExpiree: new Date(garantie.dateFin) < now,
        joursRestants: Math.max(0, Math.ceil((new Date(garantie.dateFin) - now) / (1000 * 60 * 60 * 24)))
      };

      return {
        success: true,
        data: garantieAvecStatut
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la garantie: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'une garantie
  static async updateWarrantyStatus(garantieId, estActive) {
    try {
      const garantie = await prisma.garantie.update({
        where: { id: garantieId },
        data: { estActive },
        include: {
          commandeItem: {
            include: {
              produit: true
            }
          }
        }
      });

      return {
        success: true,
        message: 'Statut de la garantie mis à jour',
        data: garantie
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la garantie: ${error.message}`);
    }
  }

  // Obtenir les garanties expirant bientôt
  static async getExpiringWarranties(daysAhead = 30) {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const garanties = await prisma.garantie.findMany({
        where: {
          estActive: true,
          dateFin: {
            gte: now,
            lte: futureDate
          }
        },
        include: {
          commandeItem: {
            include: {
              produit: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              nom: true,
              prenom: true
            }
          }
        }
      });

      return {
        success: true,
        data: garanties
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des garanties expirantes: ${error.message}`);
    }
  }

  // Obtenir les conditions de garantie selon le type
  static getWarrantyConditions(typeGarantie) {
    const conditions = {
      FABRICANT: `Garantie fabricant standard de 2 ans couvrant les défauts de fabrication et de matériaux.`,
      ETENDUE_3: `Garantie étendue de 3 ans incluant la garantie fabricant standard plus la protection contre l'usure normale et les réparations.`,
      ETENDUE_5: `Garantie étendue premium de 5 ans incluant tous les avantages de la garantie étendue 3 ans plus la couverture complète des pièces et main d'œuvre.`
    };
    return conditions[typeGarantie] || conditions.FABRICANT;
  }
}

module.exports = WarrantyService;

