const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Utilisateur de test
const testUser = {
  nom: "Dupont",
  prenom: "Jean",
  email: "test@luxetime.fr",
  motDePasse: "Luxetime2024!",
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
      create: [
        {
          url: "/assets/images/analog-watch-1845547_1280.jpg",
          alt: "Luxetime Classic",
          estPrincipale: true
        }
      ]
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
      create: [
        {
          url: "/assets/images/analog-watch-1869928_1280.jpg",
          alt: "Luxetime Sport",
          estPrincipale: true
        }
      ]
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
      create: [
        {
          url: "/assets/images/clock-1224379_1280.jpg",
          alt: "Luxetime Elegance",
          estPrincipale: true
        }
      ]
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
      create: [
        {
          url: "/assets/images/analog-watch-1845547_1280.jpg",
          alt: "Luxetime Heritage",
          estPrincipale: true
        }
      ]
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
      create: [
        {
          url: "/assets/images/analog-watch-1869928_1280.jpg",
          alt: "Luxetime Modern",
          estPrincipale: true
        }
      ]
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
      create: [
        {
          url: "/assets/images/clock-1224379_1280.jpg",
          alt: "Luxetime Premium",
          estPrincipale: true
        }
      ]
    }
  }
]

async function main() {
  console.log('🌱 Début du seeding...')
  
  try {
    // Nettoyer les données existantes (si les tables existent)
    try {
      await prisma.avis.deleteMany()
      await prisma.produit.deleteMany()
      await prisma.user.deleteMany()
    } catch (error) {
      console.log('⚠️ Tables non trouvées, création des données...')
    }
    
    // Créer l'utilisateur de test
    console.log('👤 Création de l\'utilisateur de test...')
    const hashedPassword = await bcrypt.hash(testUser.motDePasse, 10)
    
    const user = await prisma.user.create({
      data: {
        nom: testUser.nom,
        prenom: testUser.prenom,
        email: testUser.email,
        motDePasse: hashedPassword,
        telephone: testUser.telephone,
        adresseRue: testUser.adresse.rue,
        adresseVille: testUser.adresse.ville,
        adresseCodePostal: testUser.adresse.codePostal,
        adressePays: testUser.adresse.pays,
        role: testUser.role
      }
    })
    
    console.log(`✅ Utilisateur créé: ${user.email}`)
    console.log('🔑 Identifiants de test:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Mot de passe: ${testUser.motDePasse}`)
    
    // Créer les produits
    console.log('📦 Création des produits...')
    const createdProducts = []
    for (const product of products) {
      const createdProduct = await prisma.produit.create({
        data: product
      })
      createdProducts.push(createdProduct)
    }
    
    // Créer des commandes de test pour l'historique
    console.log('\n📋 Création des commandes de test...')
    
    const testOrders = [
      {
        numero: 'CMD-2024-09-001',
        clientId: user.id,
        adresseLivraisonNom: 'Dupont',
        adresseLivraisonPrenom: 'Jean',
        adresseLivraisonRue: '123 Avenue des Champs-Élysées',
        adresseLivraisonVille: 'Paris',
        adresseLivraisonCodePostal: '75008',
        adresseLivraisonPays: 'France',
        adresseLivraisonTelephone: '+33 6 12 34 56 78',
        adresseFacturationNom: 'Dupont',
        adresseFacturationPrenom: 'Jean',
        adresseFacturationRue: '123 Avenue des Champs-Élysées',
        adresseFacturationVille: 'Paris',
        adresseFacturationCodePostal: '75008',
        adresseFacturationPays: 'France',
        methodePaiement: 'CARTE',
        statut: 'LIVREE',
        sousTotal: 8500.00,
        fraisLivraison: 0,
        total: 8500.00,
        createdAt: new Date('2024-09-15'),
        items: {
          create: [
            {
              produitId: createdProducts[0].id,
              quantite: 1,
              prixUnitaire: 8500.00,
              nomProduit: createdProducts[0].nom
            }
          ]
        }
      },
      {
        numero: 'CMD-2024-10-002',
        clientId: user.id,
        adresseLivraisonNom: 'Dupont',
        adresseLivraisonPrenom: 'Jean',
        adresseLivraisonRue: '123 Avenue des Champs-Élysées',
        adresseLivraisonVille: 'Paris',
        adresseLivraisonCodePostal: '75008',
        adresseLivraisonPays: 'France',
        adresseLivraisonTelephone: '+33 6 12 34 56 78',
        adresseFacturationNom: 'Dupont',
        adresseFacturationPrenom: 'Jean',
        adresseFacturationRue: '123 Avenue des Champs-Élysées',
        adresseFacturationVille: 'Paris',
        adresseFacturationCodePostal: '75008',
        adresseFacturationPays: 'France',
        methodePaiement: 'PAYPAL',
        statut: 'EN_PREPARATION',
        sousTotal: 12500.00,
        fraisLivraison: 0,
        total: 12500.00,
        createdAt: new Date('2024-10-01'),
        items: {
          create: [
            {
              produitId: createdProducts[1].id,
              quantite: 1,
              prixUnitaire: 12500.00,
              nomProduit: createdProducts[1].nom
            }
          ]
        }
      },
      {
        numero: 'CMD-2024-10-003',
        clientId: user.id,
        adresseLivraisonNom: 'Dupont',
        adresseLivraisonPrenom: 'Jean',
        adresseLivraisonRue: '123 Avenue des Champs-Élysées',
        adresseLivraisonVille: 'Paris',
        adresseLivraisonCodePostal: '75008',
        adresseLivraisonPays: 'France',
        adresseLivraisonTelephone: '+33 6 12 34 56 78',
        adresseFacturationNom: 'Dupont',
        adresseFacturationPrenom: 'Jean',
        adresseFacturationRue: '123 Avenue des Champs-Élysées',
        adresseFacturationVille: 'Paris',
        adresseFacturationCodePostal: '75008',
        adresseFacturationPays: 'France',
        methodePaiement: 'CARTE',
        statut: 'EXPEDIEE',
        sousTotal: 6500.00,
        fraisLivraison: 0,
        total: 6500.00,
        numeroSuivi: 'FR123456789',
        createdAt: new Date('2024-10-05'),
        items: {
          create: [
            {
              produitId: createdProducts[2].id,
              quantite: 1,
              prixUnitaire: 6500.00,
              nomProduit: createdProducts[2].nom
            }
          ]
        }
      }
    ]

    for (const orderData of testOrders) {
      const { clientId, items, ...restOrderData } = orderData
      
      // Transformer les items pour utiliser connect
      const transformedItems = {
        create: items.create.map(item => ({
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
          nomProduit: item.nomProduit,
          produit: {
            connect: { id: item.produitId }
          }
        }))
      }
      
      await prisma.commande.create({
        data: {
          ...restOrderData,
          client: {
            connect: { id: clientId }
          },
          items: transformedItems
        }
      })
    }

    console.log('✅ Commandes de test créées avec succès')
    console.log(`📋 ${testOrders.length} commandes ajoutées\n`)
    
    console.log('✅ Seeding terminé !')
    console.log(`📦 ${products.length} produits créés`)
    console.log('👤 1 utilisateur de test créé')
    console.log(`📋 ${testOrders.length} commandes de test créées`)
    console.log('')
    console.log('🚀 Vous pouvez maintenant vous connecter avec:')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Mot de passe: Luxetime2024!`)
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
