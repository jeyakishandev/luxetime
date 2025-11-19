const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { initDatabase } = require('../utils/initDB');

const { prisma } = require('../config/database');

// Endpoint pour réinitialiser la base de données (supprime et recrée tout)
router.post('/reset-db', async (req, res) => {
  try {
    const { secret } = req.body;
    
    const INIT_SECRET = process.env.INIT_DB_SECRET || 'luxetime-init-2024';
    
    if (secret !== INIT_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Clé secrète invalide'
      });
    }

    console.log('🔄 Réinitialisation complète de la base de données...');
    
    // Supprimer toutes les données
    await prisma.avis.deleteMany();
    await prisma.image_produits.deleteMany();
    await prisma.produit.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('🗑️ Données supprimées');
    
    // Réinitialiser
    await initDatabase();
    
    res.json({
      success: true,
      message: 'Base de données réinitialisée avec succès (6 produits créés)'
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation',
      error: error.message
    });
  }
});

// Endpoint pour initialiser la base de données (à appeler une seule fois)
router.post('/init-db', async (req, res) => {
  try {
    const { secret } = req.body;
    
    const INIT_SECRET = process.env.INIT_DB_SECRET || 'luxetime-init-2024';
    
    if (secret !== INIT_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Clé secrète invalide'
      });
    }

    console.log('🔄 Initialisation de la base de données via API...');
    
    // Essayer de créer les tables avec prisma db push
    try {
      const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate', {
        cwd: process.cwd(),
        env: { ...process.env }
      });
      console.log('✅ Tables créées:', stdout);
    } catch (error) {
      console.log('⚠️ Erreur lors de la création des tables (peut-être déjà créées):', error.message);
    }

    // Initialiser les données
    await initDatabase();
    
    res.json({
      success: true,
      message: 'Base de données initialisée avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'initialisation',
      error: error.message
    });
  }
});

module.exports = router;

