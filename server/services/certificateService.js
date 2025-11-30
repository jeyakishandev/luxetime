const { prisma } = require('../config/database');
const crypto = require('crypto');

class CertificateService {
  // Générer un numéro de certificat unique
  static generateCertificateNumber() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `CERT-${timestamp}-${random}`;
  }

  // Créer un certificat d'authenticité pour un item de commande
  static async createCertificate(commandeItemId, userId) {
    try {
      // Vérifier que l'item existe et appartient à l'utilisateur
      const commandeItem = await prisma.commandeItem.findUnique({
        where: { id: commandeItemId },
        include: {
          commande: {
            include: {
              client: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                  email: true
                }
              }
            }
          },
          produit: true
        }
      });

      if (!commandeItem) {
        throw new Error('Item de commande non trouvé');
      }

      if (commandeItem.commande.clientId !== userId) {
        throw new Error('Non autorisé');
      }

      // Vérifier qu'il n'existe pas déjà un certificat
      const existingCert = await prisma.certificatAuthenticite.findUnique({
        where: { commandeItemId }
      });

      if (existingCert) {
        throw new Error('Un certificat existe déjà pour cet item');
      }

      // Générer le numéro de certificat
      const numeroCertificat = this.generateCertificateNumber();

      // Générer un numéro de série unique si pas déjà défini
      let numeroSerie = commandeItem.numeroSerie;
      if (!numeroSerie) {
        numeroSerie = `SN-${commandeItem.produit.reference}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        
        // Mettre à jour l'item avec le numéro de série
        await prisma.commandeItem.update({
          where: { id: commandeItemId },
          data: { numeroSerie }
        });
      }

      // Créer le certificat
      const certificat = await prisma.certificatAuthenticite.create({
        data: {
          numeroCertificat,
          qrCode: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-certificate/${numeroCertificat}`,
          pdfUrl: null, // Sera généré plus tard
          commandeItemId,
          userId,
          historiqueProprietaires: [
            {
              date: new Date().toISOString(),
              nom: `${commandeItem.commande.client.prenom} ${commandeItem.commande.client.nom}`,
              email: commandeItem.commande.client.email,
              type: 'Achat initial'
            }
          ]
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
              },
              commande: {
                include: {
                  client: {
                    select: {
                      id: true,
                      nom: true,
                      prenom: true,
                      email: true
                    }
                  }
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
        message: 'Certificat d\'authenticité créé avec succès',
        data: certificat
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création du certificat: ${error.message}`);
    }
  }

  // Créer un certificat automatiquement lors de la création de commande (sans vérification userId)
  static async createCertificateForOrder(commandeItemId, userId) {
    try {
      // Vérifier que l'item existe
      const commandeItem = await prisma.commandeItem.findUnique({
        where: { id: commandeItemId },
        include: {
          commande: {
            include: {
              client: {
                select: {
                  id: true,
                  nom: true,
                  prenom: true,
                  email: true
                }
              }
            }
          },
          produit: true
        }
      });

      if (!commandeItem) {
        throw new Error('Item de commande non trouvé');
      }

      // Vérifier qu'il n'existe pas déjà un certificat
      const existingCert = await prisma.certificatAuthenticite.findUnique({
        where: { commandeItemId }
      });

      if (existingCert) {
        return { success: true, data: existingCert }; // Déjà créé
      }

      // Générer le numéro de certificat
      const numeroCertificat = this.generateCertificateNumber();

      // Générer un numéro de série unique pour l'item si pas déjà défini
      if (!commandeItem.numeroSerie) {
        const numeroSerie = `SN-${commandeItem.produit.reference}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        
        // Mettre à jour l'item avec le numéro de série
        await prisma.commandeItem.update({
          where: { id: commandeItemId },
          data: { numeroSerie }
        });
      }

      // Créer le certificat
      const certificat = await prisma.certificatAuthenticite.create({
        data: {
          numeroCertificat,
          commandeItemId,
          userId,
          qrCode: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/certificates/verify/${numeroCertificat}`,
          historiqueProprietaires: [
            {
              date: new Date().toISOString(),
              nom: `${commandeItem.commande.client.prenom} ${commandeItem.commande.client.nom}`,
              email: commandeItem.commande.client.email,
              type: 'Achat initial'
            }
          ]
        }
      });

      return {
        success: true,
        data: certificat
      };
    } catch (error) {
      throw new Error(`Erreur lors de la création automatique du certificat: ${error.message}`);
    }
  }

  // Récupérer un certificat par numéro
  static async getCertificateByNumber(numeroCertificat) {
    try {
      const certificat = await prisma.certificatAuthenticite.findUnique({
        where: { numeroCertificat },
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

      if (!certificat) {
        throw new Error('Certificat non trouvé');
      }

      return {
        success: true,
        data: certificat
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du certificat: ${error.message}`);
    }
  }

  // Récupérer les certificats d'un utilisateur
  static async getUserCertificates(userId) {
    try {
      const certificats = await prisma.certificatAuthenticite.findMany({
        where: { userId },
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
        },
        orderBy: { dateEmission: 'desc' }
      });

      return {
        success: true,
        data: certificats
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des certificats: ${error.message}`);
    }
  }

  // Vérifier l'authenticité d'un certificat
  static async verifyCertificate(numeroCertificat) {
    try {
      const result = await this.getCertificateByNumber(numeroCertificat);
      
      if (result.success) {
        return {
          success: true,
          valid: true,
          message: 'Certificat authentique',
          data: result.data
        };
      }
      
      return {
        success: true,
        valid: false,
        message: 'Certificat non trouvé'
      };
    } catch (error) {
      return {
        success: true,
        valid: false,
        message: error.message
      };
    }
  }

  // Mettre à jour l'historique de propriété (transfert)
  static async updateOwnershipHistory(certificatId, newOwnerData) {
    try {
      const certificat = await prisma.certificatAuthenticite.findUnique({
        where: { id: certificatId }
      });

      if (!certificat) {
        throw new Error('Certificat non trouvé');
      }

      const historique = certificat.historiqueProprietaires || [];
      historique.push({
        date: new Date().toISOString(),
        nom: newOwnerData.nom,
        email: newOwnerData.email,
        type: newOwnerData.type || 'Transfert de propriété'
      });

      const updated = await prisma.certificatAuthenticite.update({
        where: { id: certificatId },
        data: {
          historiqueProprietaires: historique
        }
      });

      return {
        success: true,
        message: 'Historique mis à jour',
        data: updated
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'historique: ${error.message}`);
    }
  }
}

module.exports = CertificateService;

