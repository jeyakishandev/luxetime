const { body, param, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  next();
};

// Validation pour l'inscription
const validateRegister = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('telephone')
    .optional()
    .isMobilePhone('fr-FR')
    .withMessage('Numéro de téléphone invalide'),
  handleValidationErrors
];

// Validation pour la connexion
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('motDePasse')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors
];

// Validation pour la création de produit
const validateCreateProduct = [
  body('nom')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('prix')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('prixPromo')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix promo doit être un nombre positif'),
  body('marque')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La marque doit contenir entre 2 et 50 caractères'),
  body('reference')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('La référence doit contenir entre 3 et 50 caractères'),
  body('categorie')
    .isIn(['HOMME', 'FEMME', 'UNISEXE', 'VINTAGE', 'SPORT'])
    .withMessage('Catégorie invalide'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  handleValidationErrors
];

// Validation pour la mise à jour de produit
const validateUpdateProduct = [
  param('id').isInt().withMessage('ID produit invalide'),
  body('nom')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('prix')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  handleValidationErrors
];

// Validation pour les paramètres de recherche
const validateSearchParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La page doit être un nombre entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  query('prixMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix minimum doit être positif'),
  query('prixMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix maximum doit être positif'),
  query('categorie')
    .optional()
    .isIn(['HOMME', 'FEMME', 'UNISEXE', 'VINTAGE', 'SPORT'])
    .withMessage('Catégorie invalide'),
  handleValidationErrors
];

// Validation pour l'ajout au panier
const validateAddToCart = [
  body('produitId')
    .isInt()
    .withMessage('ID produit invalide'),
  body('quantite')
    .isInt({ min: 1, max: 10 })
    .withMessage('La quantité doit être entre 1 et 10'),
  handleValidationErrors
];

// Validation pour la création de commande
const validateCreateOrder = [
  body('adresseLivraison.nom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom de livraison doit contenir entre 2 et 50 caractères'),
  body('adresseLivraison.prenom')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom de livraison doit contenir entre 2 et 50 caractères'),
  body('adresseLivraison.rue')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('L\'adresse de livraison doit contenir entre 5 et 100 caractères'),
  body('adresseLivraison.ville')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('La ville doit contenir entre 2 et 50 caractères'),
  body('adresseLivraison.codePostal')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('Le code postal doit contenir entre 5 et 10 caractères'),
  body('adresseLivraison.pays')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le pays doit contenir entre 2 et 50 caractères'),
  body('adresseLivraison.telephone')
    .isMobilePhone('fr-FR')
    .withMessage('Numéro de téléphone invalide'),
  body('methodePaiement')
    .isIn(['CARTE', 'PAYPAL', 'VIREMENT'])
    .withMessage('Méthode de paiement invalide'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateCreateProduct,
  validateUpdateProduct,
  validateSearchParams,
  validateAddToCart,
  validateCreateOrder
};
