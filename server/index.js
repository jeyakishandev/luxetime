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

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy pour Render (nécessaire pour rate limiting)
app.set('trust proxy', 1);

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(helmet());

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
    // 2. TOUS les domaines Vercel (*.vercel.app)
    // 3. Les requêtes sans origine (Postman, curl, etc.)
    if (!origin || 
        origin === process.env.FRONTEND_URL ||
        origin.endsWith('.vercel.app') ||
        origin.includes('vercel.app')) {
      callback(null, true)
    } else {
      // Log pour debug
      console.log('⚠️ CORS bloqué pour:', origin);
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
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

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/init', require('./routes/init'));

// Route de santé
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
