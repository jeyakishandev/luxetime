const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Luxetime API',
      version: '1.0.0',
      description: 'API REST pour l\'application e-commerce Luxetime - Boutique de montres de luxe',
      contact: {
        name: 'KARUNANITHY Jeya Kishan',
        email: 'support@luxetime.com',
        url: 'https://github.com/jeyakishandev/luxetime'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
        description: 'Serveur de développement'
      },
      {
        url: 'https://luxetime-three.vercel.app/api',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT obtenu après connexion'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Message d\'erreur'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Opération réussie'
            },
            data: {
              type: 'object'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            nom: {
              type: 'string',
              example: 'Dupont'
            },
            prenom: {
              type: 'string',
              example: 'Jean'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'jean.dupont@example.com'
            },
            role: {
              type: 'string',
              enum: ['CLIENT', 'ADMIN'],
              example: 'CLIENT'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            nom: {
              type: 'string',
              example: 'Luxetime Classic'
            },
            description: {
              type: 'string',
              example: 'Une montre classique intemporelle'
            },
            prix: {
              type: 'number',
              format: 'float',
              example: 1299.99
            },
            prixPromo: {
              type: 'number',
              format: 'float',
              nullable: true,
              example: null
            },
            marque: {
              type: 'string',
              example: 'Luxetime'
            },
            reference: {
              type: 'string',
              example: 'LT-CL-001'
            },
            categorie: {
              type: 'string',
              enum: ['HOMME', 'FEMME', 'UNISEXE', 'SPORT'],
              example: 'HOMME'
            },
            stock: {
              type: 'integer',
              example: 15
            },
            noteMoyenne: {
              type: 'number',
              format: 'float',
              example: 4.8
            },
            nombreAvis: {
              type: 'integer',
              example: 24
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            numeroCommande: {
              type: 'string',
              example: 'CMD-20240115-001'
            },
            statut: {
              type: 'string',
              enum: ['EN_ATTENTE', 'CONFIRMEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE'],
              example: 'CONFIRMEE'
            },
            total: {
              type: 'number',
              format: 'float',
              example: 1299.99
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints d\'authentification et gestion utilisateur'
      },
      {
        name: 'Products',
        description: 'Gestion des produits (catalogue, recherche, détails)'
      },
      {
        name: 'Cart',
        description: 'Gestion du panier d\'achat'
      },
      {
        name: 'Orders',
        description: 'Gestion des commandes'
      },
      {
        name: 'Reviews',
        description: 'Gestion des avis et notes'
      },
      {
        name: 'Wishlist',
        description: 'Gestion de la liste de souhaits'
      },
      {
        name: 'Certificates',
        description: 'Certificats d\'authenticité des produits de luxe'
      },
      {
        name: 'Warranties',
        description: 'Gestion des garanties produits'
      },
      {
        name: 'Shipping',
        description: 'Suivi des livraisons'
      },
      {
        name: 'Returns',
        description: 'Gestion des retours et remboursements'
      },
      {
        name: 'Health',
        description: 'Vérification de l\'état de l\'API'
      }
    ]
  },
  apis: [
    '../routes/*.js',
    '../controllers/*.js',
    '../index.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;

