import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button, Card } from '../components/ui'
import { FiArrowRight, FiStar, FiShield, FiTruck, FiClock, FiAward } from 'react-icons/fi'
import axios from 'axios'

const HomeContainer = styled.div`
  min-height: 100vh;
`

const HeroSection = styled.section`
  position: relative;
  height: 80vh;
  min-height: 600px;
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.9) 0%,
    rgba(45, 45, 45, 0.8) 50%,
    rgba(26, 26, 26, 0.9) 100%
  ),
  url('/assets/images/banniere.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  
  ${props => props.theme.media.mobile} {
    height: 70vh;
    min-height: 500px;
  }
`

const HeroContent = styled(motion.div)`
  max-width: 800px;
  padding: 0 ${props => props.theme.spacing[4]};
  z-index: 2;
`

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: 1.2;
  color: ${props => props.theme.colors.primary};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[8]};
  max-width: 600px;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const Section = styled.section`
  padding: ${props => props.theme.spacing[16]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[12]} 0;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]};
`

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  text-align: center;
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing[12]};
  line-height: 1.6;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const ProductCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: ${props => props.theme.borderRadius.lg};
  }
`

const ProductName = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const ProductPrice = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const ViewAllButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin: 0 auto;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[12]};
`

const FeatureCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  color: white;
  font-size: ${props => props.theme.fontSizes.xl};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  line-height: 1.6;
`

// Mapping des images pour les produits
const productImages = {
  1: '/assets/images/analog-watch-1845547_1280.jpg',
  2: '/assets/images/analog-watch-1869928_1280.jpg',
  3: '/assets/images/rolex-2171960_1280.jpg',
  4: '/assets/images/rolex-2171961_1280.jpg',
  5: '/assets/images/clock-1224379_1280.jpg',
  6: '/assets/images/watch-5772317_1280.jpg'
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/products', {
        params: { limit: 4 }
      })
      
      if (response.data.success) {
        setFeaturedProducts(response.data.data.products || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Luxetime
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Élégance et Précision : Trouvez Votre Montre Idéale
          </HeroSubtitle>
          <HeroButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button as={Link} to="/products" size="lg">
              Voir les collections
              <FiArrowRight size={20} />
            </Button>
            <Button as={Link} to="/about" variant="outline" size="lg">
              En savoir plus
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Nouveautés</SectionTitle>
          <SectionSubtitle>
            Découvrez nos dernières créations, alliant tradition horlogère et innovation
          </SectionSubtitle>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
              <h3>Chargement des nouveautés...</h3>
            </div>
          ) : (
            <>
              <ProductsGrid>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id}>
                    <ProductImage bgImage={productImages[product.id]} />
                    <ProductName>{product.nom}</ProductName>
                    <ProductPrice>{formatPrice(product.prix)}</ProductPrice>
                    <Button as={Link} to={`/products/${product.id}`} size="sm">
                      Voir les détails
                    </Button>
                  </ProductCard>
                ))}
              </ProductsGrid>
              <ViewAllButton as={Link} to="/products">
                Voir toutes les nouveautés
                <FiArrowRight size={18} />
              </ViewAllButton>
            </>
          )}
        </Container>
      </Section>

      <Section style={{ background: '#1a1a1a' }}>
        <Container>
          <SectionTitle>Pourquoi choisir Luxetime ?</SectionTitle>
          <SectionSubtitle>
            Notre engagement envers l'excellence et la satisfaction client
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FiAward size={24} />
              </FeatureIcon>
              <FeatureTitle>Qualité Premium</FeatureTitle>
              <FeatureDescription>
                Chaque montre est fabriquée avec des matériaux de haute qualité et une attention aux détails exceptionnelle.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FiShield size={24} />
              </FeatureIcon>
              <FeatureTitle>Garantie 2 ans</FeatureTitle>
              <FeatureDescription>
                Toutes nos montres sont couvertes par une garantie complète de 2 ans pour votre tranquillité.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FiTruck size={24} />
              </FeatureIcon>
              <FeatureTitle>Livraison gratuite</FeatureTitle>
              <FeatureDescription>
                Livraison gratuite et sécurisée partout en France métropolitaine sous 24-48h.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FiClock size={24} />
              </FeatureIcon>
              <FeatureTitle>Service client 24/7</FeatureTitle>
              <FeatureDescription>
                Notre équipe d'experts est disponible pour vous accompagner à tout moment.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </Section>
    </HomeContainer>
  )
}

export default Home