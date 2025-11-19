const { prisma } = require('../config/database');

class ReviewService {
  // Créer ou mettre à jour un avis
  static async createOrUpdateReview(userId, produitId, note, commentaire) {
    try {
      // Vérifier que le produit existe
      const produit = await prisma.produit.findUnique({
        where: { id: parseInt(produitId) }
      });

      if (!produit) {
        throw new Error('Produit non trouvé');
      }

      // Vérifier que la note est valide (1-5)
      if (note < 1 || note > 5) {
        throw new Error('La note doit être entre 1 et 5');
      }

      // Créer ou mettre à jour l'avis (upsert)
      const avis = await prisma.avis.upsert({
        where: {
          userId_produitId: {
            userId: parseInt(userId),
            produitId: parseInt(produitId)
          }
        },
        update: {
          note: parseInt(note),
          commentaire: commentaire || null
        },
        create: {
          userId: parseInt(userId),
          produitId: parseInt(produitId),
          note: parseInt(note),
          commentaire: commentaire || null
        },
        include: {
          user: {
            select: {
              nom: true,
              prenom: true
            }
          }
        }
      });

      // Recalculer la note moyenne et le nombre d'avis du produit
      const allAvis = await prisma.avis.findMany({
        where: { produitId: parseInt(produitId) },
        select: { note: true }
      });

      const noteMoyenne = allAvis.length > 0
        ? allAvis.reduce((sum, a) => sum + a.note, 0) / allAvis.length
        : 0;
      const nombreAvis = allAvis.length;

      // Mettre à jour le produit
      await prisma.produit.update({
        where: { id: parseInt(produitId) },
        data: {
          noteMoyenne: Math.round(noteMoyenne * 10) / 10, // Arrondir à 1 décimale
          nombreAvis: nombreAvis
        }
      });

      return {
        success: true,
        message: 'Avis enregistré avec succès',
        data: avis
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement de l'avis: ${error.message}`);
    }
  }

  // Supprimer un avis
  static async deleteReview(userId, avisId) {
    try {
      const avis = await prisma.avis.findUnique({
        where: { id: parseInt(avisId) },
        include: { produit: true }
      });

      if (!avis) {
        throw new Error('Avis non trouvé');
      }

      // Vérifier que l'utilisateur est le propriétaire de l'avis
      if (avis.userId !== parseInt(userId)) {
        throw new Error('Vous n\'êtes pas autorisé à supprimer cet avis');
      }

      const produitId = avis.produitId;

      // Supprimer l'avis
      await prisma.avis.delete({
        where: { id: parseInt(avisId) }
      });

      // Recalculer la note moyenne et le nombre d'avis
      const allAvis = await prisma.avis.findMany({
        where: { produitId: produitId },
        select: { note: true }
      });

      const noteMoyenne = allAvis.length > 0
        ? allAvis.reduce((sum, a) => sum + a.note, 0) / allAvis.length
        : 0;
      const nombreAvis = allAvis.length;

      // Mettre à jour le produit
      await prisma.produit.update({
        where: { id: produitId },
        data: {
          noteMoyenne: Math.round(noteMoyenne * 10) / 10,
          nombreAvis: nombreAvis
        }
      });

      return {
        success: true,
        message: 'Avis supprimé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'avis: ${error.message}`);
    }
  }

  // Récupérer les avis d'un produit
  static async getProductReviews(produitId) {
    try {
      const avis = await prisma.avis.findMany({
        where: { produitId: parseInt(produitId) },
        include: {
          user: {
            select: {
              nom: true,
              prenom: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: avis
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des avis: ${error.message}`);
    }
  }
}

module.exports = ReviewService;

