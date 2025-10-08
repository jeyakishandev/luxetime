const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../config/database');

class AuthService {
  // Inscription d'un nouvel utilisateur
  static async register(userData) {
    try {
      const { nom, prenom, email, motDePasse, telephone } = userData;

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, 12);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          nom,
          prenom,
          email,
          motDePasse: hashedPassword,
          telephone,
          role: 'CLIENT'
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          createdAt: true
        }
      });

      // Générer le token JWT
      const token = this.generateToken(user.id);

      return {
        success: true,
        message: 'Compte créé avec succès',
        user,
        token
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'inscription: ${error.message}`);
    }
  }

  // Connexion d'un utilisateur
  static async login(email, motDePasse) {
    try {
      // Trouver l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Générer le token JWT
      const token = this.generateToken(user.id);

      // Retourner les données utilisateur (sans le mot de passe)
      const { motDePasse: _, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw new Error(`Erreur lors de la connexion: ${error.message}`);
    }
  }

  // Génération du token JWT
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Vérification du token
  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  // Récupération du profil utilisateur
  static async getProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          adresseRue: true,
          adresseVille: true,
          adresseCodePostal: true,
          adressePays: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
    }
  }

  // Mise à jour du profil
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['nom', 'prenom', 'telephone', 'adresseRue', 'adresseVille', 'adresseCodePostal', 'adressePays'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      const user = await prisma.user.update({
        where: { id: userId },
        data: filteredData,
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          adresseRue: true,
          adresseVille: true,
          adresseCodePostal: true,
          adressePays: true,
          updatedAt: true
        }
      });

      return {
        success: true,
        message: 'Profil mis à jour avec succès',
        user
      };
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  }

  // Changement de mot de passe
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Récupérer l'utilisateur avec le mot de passe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.motDePasse);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: { motDePasse: hashedNewPassword }
      });

      return {
        success: true,
        message: 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  }

  // Mot de passe oublié - Demande de réinitialisation
  static async forgotPassword(email) {
    try {
      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Pour la sécurité, on ne révèle pas si l'email existe
        return {
          success: true,
          message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'
        };
      }

      // Générer un token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

      // Sauvegarder le token dans la base de données
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry
        }
      });

      // Simuler l'envoi d'email (en production, utiliser un service comme SendGrid)
      console.log(`📧 EMAIL SIMULATION - Reset password pour ${email}:`);
      console.log(`🔗 Lien de réinitialisation: http://localhost:3000/reset-password?token=${resetToken}`);
      console.log(`⏰ Expire dans 1 heure`);

      return {
        success: true,
        message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.',
        resetToken // Pour les tests, on retourne le token
      };
    } catch (error) {
      throw new Error(`Erreur lors de la demande de réinitialisation: ${error.message}`);
    }
  }

  // Réinitialisation du mot de passe
  static async resetPassword(token, newPassword) {
    try {
      // Vérifier le token et son expiration
      const user = await prisma.user.findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Token invalide ou expiré');
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Mettre à jour le mot de passe et supprimer le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          motDePasse: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      });

      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la réinitialisation: ${error.message}`);
    }
  }

  // Suppression du compte
  static async deleteAccount(userId, password) {
    try {
      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.motDePasse);
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Supprimer l'utilisateur (cascade supprimera les relations)
      await prisma.user.delete({
        where: { id: userId }
      });

      return {
        success: true,
        message: 'Compte supprimé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression du compte: ${error.message}`);
    }
  }
}

module.exports = AuthService;
