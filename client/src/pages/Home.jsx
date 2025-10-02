import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { usePopularProducts, useNewProducts } from '../hooks/useProducts'
import { Button, Card, PageLoading } from '../components/ui'
import ProductCard from '../components/ProductCard'
import { FiArrowRight, FiStar, FiShield, FiTruck } from 'react-icons/fi'

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
  
  ${props => props.theme.media.mobile} {
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[8]};
  line-height: 1.6;
  
  ${props => props.theme.media.mobile} {
    margin-bottom: ${props => props.theme.spacing[6]};
  }
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
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.white};
`

const SectionSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const ViewAllButton = styled(Button)`
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[12]};
`

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
`

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryLight});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.black};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  line-height: 1.6;
`

const Home = () => {
  const { data: popularProducts, isLoading: isLoadingPopular } = usePopularProducts(4)
  const { data: newProducts, isLoading: isLoadingNew } = useNewProducts(4)

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Élégance et Précision
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Trouvez votre montre idéale parmi notre collection exclusive de montres de luxe
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
          
          {isLoadingNew ? (
            <PageLoading text="Chargement des nouveautés..." />
          ) : (
            <>
              <ProductsGrid>
                {newProducts?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductsGrid>
              <ViewAllButton as={Link} to="/products?filter=new">
                Voir toutes les nouveautés
                <FiArrowRight size={18} />
              </ViewAllButton>
            </>
          )}
        </Container>
      </Section>

      <Section style={{ background: '#1a1a1a' }}>
        <Container>
          <SectionTitle>Produits populaires</SectionTitle>
          <SectionSubtitle>
            Les montres les plus appréciées par nos clients
          </SectionSubtitle>
          
          {isLoadingPopular ? (
            <PageLoading text="Chargement des produits populaires..." />
          ) : (
            <>
              <ProductsGrid>
                {popularProducts?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductsGrid>
              <ViewAllButton as={Link} to="/products?filter=popular">
                Voir tous les produits
                <FiArrowRight size={18} />
              </ViewAllButton>
            </>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Pourquoi choisir Luxetime ?</SectionTitle>
          <SectionSubtitle>
            L'excellence horlogère à votre service
          </SectionSubtitle>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <FiStar size={32} />
              </FeatureIcon>
              <FeatureTitle>Qualité Premium</FeatureTitle>
              <FeatureDescription>
                Chaque montre est soigneusement sélectionnée pour sa qualité exceptionnelle 
                et son savoir-faire artisanal.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FiShield size={32} />
              </FeatureIcon>
              <FeatureTitle>Garantie 2 ans</FeatureTitle>
              <FeatureDescription>
                Toutes nos montres bénéficient d'une garantie constructeur de 2 ans 
                pour votre tranquillité.
              </FeatureDescription>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <FiTruck size={32} />
              </FeatureIcon>
              <FeatureTitle>Livraison gratuite</FeatureTitle>
              <FeatureDescription>
                Livraison gratuite en France métropolitaine pour toute commande 
                supérieure à 100€.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </Section>
    </HomeContainer>
  )
}

export default Home
