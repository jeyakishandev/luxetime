const { prisma } = require('../config/database');
const bcrypt = require('bcryptjs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Créer les tables si elles n'existent pas
const createTables = async () => {
  try {
    console.log('📋 Création des tables...');
    const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate --accept-data-loss', {
      cwd: process.cwd(),
      env: { ...process.env }
    });
    console.log('✅ Tables créées avec succès');
    return true;
  } catch (error) {
    // Si les tables existent déjà, ce n'est pas grave
    if (error.message.includes('already') || error.message.includes('exists')) {
      console.log('ℹ️ Tables déjà existantes');
      return true;
    }
    console.error('⚠️ Erreur lors de la création des tables:', error.message);
    return false;
  }
};

// Vérifier si la base de données est initialisée
const isDBInitialized = async () => {
  try {
    const userCount = await prisma.user.count();
    return userCount > 0;
  } catch (error) {
    // Si l'erreur est que la table n'existe pas, on doit créer les tables
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      return false;
    }
    return false;
  }
};

// Initialiser la base de données
const initDatabase = async () => {
  try {
    console.log('🔍 Vérification de l\'initialisation de la base de données...');
    
    // D'abord, créer les tables si elles n'existent pas
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.log('⚠️ Impossible de créer les tables, réessayez plus tard');
      return;
    }
    
    // Attendre un peu que les tables soient bien créées
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isInitialized = await isDBInitialized();
    
    if (isInitialized) {
      console.log('✅ Base de données déjà initialisée');
      return;
    }

    console.log('🌱 Initialisation de la base de données...');
    
    // Créer l'utilisateur de test
    const hashedPassword = await bcrypt.hash('Luxetime2024!', 10);
    
    const user = await prisma.user.create({
      data: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'test@luxetime.fr',
        motDePasse: hashedPassword,
        telephone: '0123456789',
        adresseRue: '123 Avenue des Champs-Élysées',
        adresseVille: 'Paris',
        adresseCodePostal: '75008',
        adressePays: 'France',
        role: 'CLIENT'
      }
    });
    
    console.log(`✅ Utilisateur créé: ${user.email}`);
    
    // Créer tous les produits
    const products = [
      {
        nom: "Luxetime Classic",
        description: "Une montre classique intemporelle, alliant élégance et précision. Parfaite pour toutes les occasions.",
        prix: 1299,
        prixPromo: null,
        marque: "Luxetime",
        reference: "LT-CL-001",
        categorie: "HOMME",
        stock: 15,
        mouvement: "Mécanique automatique",
        boitier: "Acier inoxydable",
        bracelet: "Cuir noir",
        etanche: "5 ATM",
        diametre: "42mm",
        poids: "85g",
        tags: ["classique", "élégant", "automatique"],
        estEnVente: true,
        estNouveau: true,
        noteMoyenne: 4.8,
        nombreAvis: 24,
        vues: 156,
        images: {
          create: [{
            url: "/assets/images/analog-watch-1845547_1280.jpg",
            alt: "Luxetime Classic",
            estPrincipale: true
          }]
        }
      },
      {
        nom: "Luxetime Sport",
        description: "Montre sportive robuste avec chronographe et résistance à l'eau. Idéale pour les activités intenses.",
        prix: 899,
        prixPromo: null,
        marque: "Luxetime",
        reference: "LT-SP-002",
        categorie: "SPORT",
        stock: 8,
        mouvement: "Quartz haute précision",
        boitier: "Titane",
        bracelet: "Caoutchouc sport",
        etanche: "20 ATM",
        diametre: "44mm",
        poids: "95g",
        tags: ["sport", "chronographe", "résistant"],
        estEnVente: true,
        estNouveau: false,
        noteMoyenne: 4.6,
        nombreAvis: 18,
        vues: 203,
        images: {
          create: [{
            url: "/assets/images/analog-watch-1869928_1280.jpg",
            alt: "Luxetime Sport",
            estPrincipale: true
          }]
        }
      },
      {
        nom: "Luxetime Elegance",
        description: "Montre de soirée raffinée avec boîtier en or rose et cadran émaillé. Un bijou horloger d'exception.",
        prix: 1599,
        prixPromo: 1399,
        marque: "Luxetime",
        reference: "LT-EL-003",
        categorie: "FEMME",
        stock: 5,
        mouvement: "Mécanique manuelle",
        boitier: "Or rose 18k",
        bracelet: "Satin noir",
        etanche: "3 ATM",
        diametre: "36mm",
        poids: "65g",
        tags: ["élégance", "or", "soirée"],
        estEnVente: true,
        estNouveau: true,
        noteMoyenne: 4.9,
        nombreAvis: 12,
        vues: 89,
        images: {
          create: [{
            url: "/assets/images/clock-1224379_1280.jpg",
            alt: "Luxetime Elegance",
            estPrincipale: true
          }]
        }
      },
      {
        nom: "Luxetime Heritage",
        description: "Réédition d'un modèle historique des années 60. Un hommage à l'âge d'or de l'horlogerie française.",
        prix: 2199,
        prixPromo: null,
        marque: "Luxetime",
        reference: "LT-HT-004",
        categorie: "VINTAGE",
        stock: 3,
        mouvement: "Mécanique automatique",
        boitier: "Acier brossé",
        bracelet: "Cuir vintage",
        etanche: "5 ATM",
        diametre: "40mm",
        poids: "78g",
        tags: ["vintage", "heritage", "limité"],
        estEnVente: true,
        estNouveau: false,
        noteMoyenne: 5.0,
        nombreAvis: 8,
        vues: 67,
        images: {
          create: [{
            url: "/assets/images/analog-watch-1845547_1280.jpg",
            alt: "Luxetime Heritage",
            estPrincipale: true
          }]
        }
      },
      {
        nom: "Luxetime Modern",
        description: "Design contemporain avec matériaux innovants. Une montre qui reflète l'esprit de notre époque.",
        prix: 999,
        prixPromo: null,
        marque: "Luxetime",
        reference: "LT-MD-005",
        categorie: "UNISEXE",
        stock: 12,
        mouvement: "Quartz solaire",
        boitier: "Fibre de carbone",
        bracelet: "Caoutchouc recyclé",
        etanche: "10 ATM",
        diametre: "41mm",
        poids: "72g",
        tags: ["moderne", "écologique", "innovant"],
        estEnVente: true,
        estNouveau: true,
        noteMoyenne: 4.7,
        nombreAvis: 15,
        vues: 134,
        images: {
          create: [{
            url: "/assets/images/analog-watch-1869928_1280.jpg",
            alt: "Luxetime Modern",
            estPrincipale: true
          }]
        }
      },
      {
        nom: "Luxetime Premium",
        description: "Le summum de l'art horloger. Montre de collection avec complications et finitions d'exception.",
        prix: 2999,
        prixPromo: null,
        marque: "Luxetime",
        reference: "LT-PR-006",
        categorie: "HOMME",
        stock: 2,
        mouvement: "Mécanique automatique avec réserve de marche",
        boitier: "Platine 950",
        bracelet: "Alligator noir",
        etanche: "5 ATM",
        diametre: "43mm",
        poids: "92g",
        tags: ["premium", "collection", "complications"],
        estEnVente: true,
        estNouveau: false,
        noteMoyenne: 5.0,
        nombreAvis: 6,
        vues: 45,
        images: {
          create: [{
            url: "/assets/images/clock-1224379_1280.jpg",
            alt: "Luxetime Premium",
            estPrincipale: true
          }]
        }
      }
    ];

    let createdCount = 0;
    for (const product of products) {
      try {
        await prisma.produit.create({ data: product });
        createdCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la création du produit "${product.nom}":`, error.message);
        // Continuer avec les autres produits même en cas d'erreur
      }
    }
    
    console.log(`✅ ${createdCount}/${products.length} produits créés`);
    if (createdCount === products.length) {
      console.log('✅ Base de données initialisée avec succès !');
    } else {
      console.log(`⚠️ ${products.length - createdCount} produits n'ont pas pu être créés`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    // Ne pas faire planter l'application si l'init échoue
  }
};

module.exports = { initDatabase };

