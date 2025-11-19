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
    
    // Supprimer toutes les données (dans l'ordre pour respecter les contraintes de clés étrangères)
    try {
      await prisma.favori.deleteMany();
    } catch (e) { console.log('⚠️ Favoris:', e.message); }
    
    try {
      await prisma.avis.deleteMany();
    } catch (e) { console.log('⚠️ Avis:', e.message); }
    
    try {
      await prisma.commandeItem.deleteMany();
    } catch (e) { console.log('⚠️ CommandeItems:', e.message); }
    
    try {
      await prisma.commande.deleteMany();
    } catch (e) { console.log('⚠️ Commandes:', e.message); }
    
    try {
      await prisma.panierItem.deleteMany();
    } catch (e) { console.log('⚠️ PanierItems:', e.message); }
    
    try {
      await prisma.imageProduit.deleteMany();
    } catch (e) { console.log('⚠️ ImageProduits:', e.message); }
    
    try {
      await prisma.produit.deleteMany();
    } catch (e) { console.log('⚠️ Produits:', e.message); }
    
    try {
      await prisma.user.deleteMany();
    } catch (e) { console.log('⚠️ Users:', e.message); }
    
    console.log('🗑️ Données supprimées');
    
    // Réinitialiser les séquences PostgreSQL pour que les IDs recommencent à 1
    // Utiliser une requête SQL dynamique pour trouver et réinitialiser toutes les séquences
    try {
      // Méthode 1 : Réinitialiser les séquences connues
      const sequences = [
        'produits_id_seq',
        'users_id_seq',
        'image_produits_id_seq',
        'panier_items_id_seq',
        'commandes_id_seq',
        'commande_items_id_seq',
        'avis_id_seq',
        'favoris_id_seq'
      ];
      
      for (const seq of sequences) {
        try {
          await prisma.$executeRawUnsafe(`SELECT setval('${seq}', 1, false);`);
        } catch (e) {
          // Si la séquence n'existe pas, essayer avec le nom de table différent
          console.log(`⚠️ Séquence ${seq} non trouvée, tentative alternative...`);
        }
      }
      
      // Méthode 2 : Trouver et réinitialiser toutes les séquences automatiquement
      const allSequences = await prisma.$queryRaw`
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public' 
        AND sequence_name LIKE '%_id_seq'
      `;
      
      for (const seq of allSequences) {
        try {
          await prisma.$executeRawUnsafe(`SELECT setval('${seq.sequence_name}', 1, false);`);
          console.log(`✅ Séquence ${seq.sequence_name} réinitialisée`);
        } catch (e) {
          console.log(`⚠️ Impossible de réinitialiser ${seq.sequence_name}:`, e.message);
        }
      }
      
      console.log('🔄 Séquences PostgreSQL réinitialisées');
    } catch (error) {
      console.log('⚠️ Erreur lors de la réinitialisation des séquences:', error.message);
    }
    
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

