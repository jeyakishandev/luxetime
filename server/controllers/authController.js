const AuthService = require('../services/authService');

class AuthController {
  // Inscription d'un nouvel utilisateur
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Connexion d'un utilisateur
  static async login(req, res) {
    try {
      const { email, motDePasse } = req.body;
      const result = await AuthService.login(email, motDePasse);
      
      res.json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Récupérer le profil de l'utilisateur connecté
  static async getProfile(req, res) {
    try {
      const result = await AuthService.getProfile(req.user.id);
      
      res.json({
        success: true,
        data: result.user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Mettre à jour le profil
  static async updateProfile(req, res) {
    try {
      const result = await AuthService.updateProfile(req.user.id, req.body);
      
      res.json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Changer le mot de passe
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(
        req.user.id, 
        currentPassword, 
        newPassword
      );
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Supprimer le compte
  static async deleteAccount(req, res) {
    try {
      const { password } = req.body;
      const result = await AuthService.deleteAccount(req.user.id, password);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Vérifier le token (pour la persistance de session)
  static async verifyToken(req, res) {
    try {
      res.json({
        success: true,
        message: 'Token valide',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  }
}

module.exports = AuthController;
