const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connexion à la base de données
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Base de données PostgreSQL connectée avec Prisma');
    
    // Initialiser automatiquement la base si elle est vide (seulement en production)
    if (process.env.NODE_ENV === 'production') {
      const { initDatabase } = require('../utils/initDB');
      // Attendre un peu pour être sûr que la connexion est stable
      setTimeout(async () => {
        await initDatabase();
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

// Déconnexion propre
const disconnectDB = async () => {
  await prisma.$disconnect();
};

module.exports = { prisma, connectDB, disconnectDB };
