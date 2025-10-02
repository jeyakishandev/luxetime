const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connexion à la base de données
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Base de données PostgreSQL connectée avec Prisma');
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
