const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          nom,
          prenom,
          email,
          motDePasse, // Le hash sera fait automatiquement par Prisma
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

      // Mettre à jour le mot de passe
      await prisma.user.update({
        where: { id: userId },
        data: { motDePasse: newPassword }
      });

      return {
        success: true,
        message: 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur lors du changement de mot de passe: ${error.message}`);
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
