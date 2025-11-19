const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { initDatabase } = require('../utils/initDB');

// Endpoint pour initialiser la base de données (à appeler une seule fois)
// Protégé par une clé secrète simple
router.post('/init-db', async (req, res) => {
  try {
    const { secret } = req.body;
    
    // Vérification simple (vous pouvez changer cette clé)
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

