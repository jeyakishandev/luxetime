const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Charger les variables d'environnement seulement en développement
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './config.env' });
}

const { connectDB } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const wishlistRoutes = require('./routes/wishlist');
const initRoutes = require('./routes/init');
const certificateRoutes = require('./routes/certificates');
const warrantyRoutes = require('./routes/warranties');
const shippingRoutes = require('./routes/shipping');
const returnRoutes = require('./routes/returns');

// Swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy pour Render (nécessaire pour rate limiting)
app.set('trust proxy', 1);

// Connexion à la base de données
connectDB();

// Middleware de sécurité avec configuration CORS-friendly
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Configuration CORS
const corsOptions = {
  origin: function (origin, callback) {
    // En développement, accepter localhost
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true)
      return
    }
    
    // En production, accepter :
    // 1. L'URL du frontend configurée
    // 2. TOUS les domaines Vercel (*.vercel.app et previews)
    // 3. Les requêtes sans origine (Postman, curl, etc.)
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/luxetime.*\.vercel\.app$/
    ]
    
    if (!origin) {
      // Requêtes sans origine (Postman, curl, etc.)
      callback(null, true)
      return
    }
    
    // Vérifier si l'origine est autorisée
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin)
      }
      return false
    }) || origin.endsWith('.vercel.app') || origin.includes('vercel.app')
    
    if (isAllowed) {
      callback(null, true)
    } else {
      // Log pour debug
      console.log('⚠️ CORS bloqué pour:', origin);
      console.log('✅ Origines autorisées:', process.env.FRONTEND_URL);
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite de 100 requêtes par IP par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

app.use('/api/', limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images uploadées) avec CORS
app.use('/uploads', (req, res, next) => {
  // Définir les headers CORS avant de servir le fichier
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Servir les assets statiques (images, logos, etc.) avec CORS
app.use('/assets', (req, res, next) => {
  // Définir les headers CORS avant de servir le fichier
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(__dirname, 'public', 'assets'), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Middleware CORS supplémentaire pour toutes les routes API
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin
  if (origin && (origin.includes('vercel.app') || origin === process.env.FRONTEND_URL)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (!origin || process.env.NODE_ENV !== 'production') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/init', require('./routes/init'));
app.use('/api/certificates', certificateRoutes);
app.use('/api/warranties', warrantyRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/returns', returnRoutes);

// Documentation API Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Luxetime API Documentation'
}));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifier l'état de l'API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API fonctionnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API Luxetime fonctionnelle
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: production
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Luxetime fonctionnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route 404 pour les endpoints non trouvés
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.originalUrl
  });
});

// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Luxetime démarré sur le port ${PORT}`);
  console.log(`📱 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur...');
  process.exit(0);
});

module.exports = app;
