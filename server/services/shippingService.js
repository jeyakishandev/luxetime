const { prisma } = require('../config/database');
const EmailService = require('./emailService');

class ShippingService {
  // Générer un numéro de suivi unique
  static generateTrackingNumber(transporteur) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const prefixes = {
      'COLISSIMO': 'C',
      'DHL': 'D',
      'FEDEX': 'F',
      'UPS': 'U'
    };
    
    const prefix = prefixes[transporteur] || 'L';
    return `${prefix}${timestamp}${random}`;
  }

  // Créer une livraison pour une commande
  static async createShipping(commandeId, transporteur, options = {}) {
    try {
      // Vérifier que la commande existe
      const commande = await prisma.commande.findUnique({
        where: { id: commandeId },
        include: {
          client: true,
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

      // Vérifier qu'il n'existe pas déjà une livraison
      const existingShipping = await prisma.livraison.findFirst({
        where: { commandeId }
      });

      if (existingShipping) {
        throw new Error('Une livraison existe déjà pour cette commande');
      }

      // Générer le numéro de suivi
      const numeroSuivi = options.numeroSuivi || this.generateTrackingNumber(transporteur);

      // Construire l'adresse complète
      const adresseComplete = `${commande.adresseLivraisonRue}, ${commande.adresseLivraisonCodePostal} ${commande.adresseLivraisonVille}, ${commande.adresseLivraisonPays}`;

      // Créer la livraison
      const livraison = await prisma.livraison.create({
        data: {
          numeroSuivi,
          transporteur,
          statut: 'PREPARATION',
          commandeId,
          adresseComplete,
          assuranceIncluse: options.assuranceIncluse !== undefined ? options.assuranceIncluse : true,
          signatureRequise: options.signatureRequise !== undefined ? options.signatureRequise : true,
          instructions: options.instructions || null,
          historiqueEtapes: [
            {
              date: new Date().toISOString(),
              statut: 'PREPARATION',
              lieu: 'Entrepôt Luxetime',
              description: 'Commande en préparation'
            }
          ]
        },
        include: {
          commande: {
            include: {
              client: true,
              items: {
                include: {
                  produit: true
                }
              }
            }
          }
        }
      });

      return {
        success: true,
        message: 'Livraison créée avec succès',
        data: livraison
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création de la livraison: ${error.message}`);
    }
  }

  // Mettre à jour le statut d'une livraison
  static async updateShippingStatus(livraisonId, nouveauStatut, lieu = null, description = null) {
    try {
      const livraison = await prisma.livraison.findUnique({
        where: { id: livraisonId },
        include: {
          commande: {
            include: {
              client: true
            }
          }
        }
      });

      if (!livraison) {
        throw new Error('Livraison non trouvée');
      }

      // Mettre à jour l'historique
      const historique = livraison.historiqueEtapes || [];
      historique.push({
        date: new Date().toISOString(),
        statut: nouveauStatut,
        lieu: lieu || 'En transit',
        description: description || this.getStatusDescription(nouveauStatut)
      });

      // Déterminer les dates selon le statut
      const updateData = {
        statut: nouveauStatut,
        historiqueEtapes: historique
      };

      if (nouveauStatut === 'EXPEDIEE' && !livraison.dateExpedition) {
        updateData.dateExpedition = new Date();
        updateData.dateEstimee = new Date();
        updateData.dateEstimee.setDate(updateData.dateEstimee.getDate() + 3); // +3 jours par défaut
      } else if (nouveauStatut === 'LIVREE' && !livraison.dateLivraison) {
        updateData.dateLivraison = new Date();
      }

      const updated = await prisma.livraison.update({
        where: { id: livraisonId },
        data: updateData,
        include: {
          commande: {
            include: {
              client: true
            }
          }
        }
      });

      // Envoyer un email si expédié ou livré
      if (nouveauStatut === 'EXPEDIEE' || nouveauStatut === 'LIVREE') {
        EmailService.sendOrderShipped(
          updated.commande,
          updated.commande.client,
          updated.numeroSuivi
        ).catch(err => {
          console.error('Erreur envoi email livraison:', err);
        });
      }

      // Mettre à jour le statut de la commande si livrée
      if (nouveauStatut === 'LIVREE') {
        await prisma.commande.update({
          where: { id: livraison.commandeId },
          data: { statut: 'LIVREE' }
        });
      }

      return {
        success: true,
        message: 'Statut de livraison mis à jour',
        data: updated
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la livraison: ${error.message}`);
    }
  }

  // Récupérer les livraisons d'un utilisateur
  static async getUserShippings(userId) {
    try {
      const commandes = await prisma.commande.findMany({
        where: { clientId: userId },
        select: { id: true }
      });

      const commandeIds = commandes.map(c => c.id);

      const livraisons = await prisma.livraison.findMany({
        where: {
          commandeId: { in: commandeIds }
        },
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
        data: livraisons
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des livraisons: ${error.message}`);
    }
  }

  // Récupérer une livraison par numéro de suivi
  static async getShippingByTrackingNumber(numeroSuivi) {
    try {
      const livraison = await prisma.livraison.findUnique({
        where: { numeroSuivi },
        include: {
          commande: {
            include: {
              client: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true
                }
              },
              items: {
                include: {
                  produit: true
                }
              }
            }
          }
        }
      });

      if (!livraison) {
        throw new Error('Livraison non trouvée');
      }

      return {
        success: true,
        data: livraison
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la livraison: ${error.message}`);
    }
  }

  // Obtenir la description d'un statut
  static getStatusDescription(statut) {
    const descriptions = {
      'PREPARATION': 'Votre commande est en préparation',
      'EXPEDIEE': 'Votre commande a été expédiée',
      'EN_TRANSIT': 'Votre colis est en transit',
      'EN_DISTRIBUTION': 'Votre colis est en cours de distribution',
      'LIVREE': 'Votre commande a été livrée',
      'RETOUR_EN_COURS': 'Votre colis est en retour',
      'PROBLEME': 'Problème détecté avec votre livraison'
    };
    return descriptions[statut] || 'Statut inconnu';
  }
}

module.exports = ShippingService;

