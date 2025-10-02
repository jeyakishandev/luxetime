const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Utilisateur de test
const testUser = {
  nom: "Dupont",
  prenom: "Jean",
  email: "test@luxetime.fr",
  motDePasse: "password123",
  telephone: "0123456789",
  dateNaissance: new Date('1990-01-15'),
  adresse: {
    rue: "123 Avenue des Champs-Élysées",
    codePostal: "75008",
    ville: "Paris",
    pays: "France"
  },
  role: "CLIENT",
  estActif: true,
  preferences: {
    newsletter: true,
    notifications: true,
    langue: "fr"
  }
}

const products = [
  {
    nom: "Luxetime Classic",
    description: "Une montre classique intemporelle, alliant élégance et précision. Parfaite pour toutes les occasions.",
    prix: 1299,
    prixPromo: 0,
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
    vues: 156
  },
  {
    nom: "Luxetime Sport",
    description: "Montre sportive robuste avec chronographe et résistance à l'eau. Idéale pour les activités intenses.",
    prix: 899,
    prixPromo: 0,
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
    vues: 203
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
    vues: 89
  },
  {
    nom: "Luxetime Heritage",
    description: "Réédition d'un modèle historique des années 60. Un hommage à l'âge d'or de l'horlogerie française.",
    prix: 2199,
    prixPromo: 0,
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
    vues: 67
  },
  {
    nom: "Luxetime Modern",
    description: "Design contemporain avec matériaux innovants. Une montre qui reflète l'esprit de notre époque.",
    prix: 999,
    prixPromo: 0,
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
    vues: 134
  },
  {
    nom: "Luxetime Premium",
    description: "Le summum de l'art horloger. Montre de collection avec complications et finitions d'exception.",
    prix: 2999,
    prixPromo: 0,
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
    vues: 45
  }
]

async function main() {
  console.log('🌱 Début du seeding...')
  
  try {
    // Nettoyer les données existantes (si les tables existent)
    try {
      await prisma.avis.deleteMany()
      await prisma.produit.deleteMany()
      await prisma.utilisateur.deleteMany()
    } catch (error) {
      console.log('⚠️ Tables non trouvées, création des données...')
    }
    
    // Créer l'utilisateur de test
    console.log('👤 Création de l\'utilisateur de test...')
    const hashedPassword = await bcrypt.hash(testUser.motDePasse, 10)
    
    const user = await prisma.utilisateur.create({
      data: {
        nom: testUser.nom,
        prenom: testUser.prenom,
        email: testUser.email,
        motDePasse: hashedPassword,
        telephone: testUser.telephone,
        dateNaissance: testUser.dateNaissance,
        adresse: testUser.adresse,
        role: testUser.role,
        estActif: testUser.estActif,
        preferences: testUser.preferences
      }
    })
    
    console.log(`✅ Utilisateur créé: ${user.email}`)
    console.log('🔑 Identifiants de test:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Mot de passe: ${testUser.motDePasse}`)
    
    // Créer les produits
    console.log('📦 Création des produits...')
    for (const product of products) {
      await prisma.produit.create({
        data: product
      })
    }
    
    console.log('✅ Seeding terminé !')
    console.log(`📦 ${products.length} produits créés`)
    console.log('👤 1 utilisateur de test créé')
    console.log('')
    console.log('🚀 Vous pouvez maintenant vous connecter avec:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Mot de passe: ${testUser.motDePasse}`)
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
