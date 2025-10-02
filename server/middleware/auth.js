const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        role: true,
        telephone: true,
        adresseRue: true,
        adresseVille: true,
        adresseCodePostal: true,
        adressePays: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur d\'authentification' 
    });
  }
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès refusé. Droits administrateur requis.' 
    });
  }
  next();
};

// Middleware optionnel (ne bloque pas si pas de token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          role: true
        }
      });
      req.user = user;
    }
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
