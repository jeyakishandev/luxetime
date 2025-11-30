import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, PageLoading } from '../components/ui'
import { FiArrowRight, FiStar, FiShield, FiTruck, FiClock, FiAward, FiTrendingUp, FiHeart, FiShoppingCart } from 'react-icons/fi'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'
import { getImageUrl } from '../utils/format'
import toast from 'react-hot-toast'

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`

const HeroSection = styled.section`
  position: relative;
  height: 90vh;
  min-height: 700px;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  overflow: hidden;
  
  /* Effet de particules/décorations */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.3) 100%);
    pointer-events: none;
  }
  
  ${props => props.theme.media.mobile} {
    height: 75vh;
    min-height: 550px;
  }
`

const HeroContent = styled(motion.div)`
  max-width: 800px;
  padding: 0 ${props => props.theme.spacing[4]};
  z-index: 2;
`

const HeroTitle = styled(motion.h1)`
  font-size: clamp(3rem, 10vw, 5.5rem);
  font-weight: ${props => props.theme.fontWeights.extrabold};
  margin-bottom: ${props => props.theme.spacing[8]};
  line-height: 1.1;
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  letter-spacing: -0.02em;
  animation: shimmer 3s linear infinite;
  
  @keyframes shimmer {
    to {
      background-position: 200% center;
    }
  }
`

const HeroSubtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3.5vw, 1.75rem);
  color: ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing[10]};
  max-width: 700px;
  line-height: 1.7;
  font-weight: ${props => props.theme.fontWeights.light};
  letter-spacing: 0.01em;
  margin-left: auto;
  margin-right: auto;
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

const Section = styled(motion.section)`
  padding: ${props => props.theme.spacing[20]} 0;
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[16]} 0;
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

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.75rem, 7vw, 4.5rem);
  font-weight: ${props => props.theme.fontWeights.extrabold};
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-size: 200% auto;
  letter-spacing: -0.03em;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.02em;
`

const SectionSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.gray[300]};
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${props => props.theme.spacing[12]};
  line-height: 1.6;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const ProductImage = styled.div`
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.lg};
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
    border-radius: ${props => props.theme.borderRadius.xl};
    transition: all 0.3s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: ${props => props.theme.borderRadius.xl};
  }
  
  & > * {
    position: relative;
    z-index: 2;
  }
  
  &:hover::after {
    opacity: 1;
  }
`

const ProductCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(212, 175, 55, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(212, 175, 55, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:hover ${ProductImage} {
    transform: scale(1.05);
  }
`

const ProductName = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
  line-height: 1.3;
`

const ProductBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  &::before {
    content: '';
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
  
  &::after {
    content: '';
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`

const ProductPrice = styled.div`
  margin-bottom: ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
`

const CurrentPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.xxl};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
`

const ProductBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  background: ${props => props.variant === 'new' 
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))'};
  border: 1px solid ${props => props.variant === 'new' 
    ? 'rgba(34, 197, 94, 0.3)'
    : 'rgba(212, 175, 55, 0.3)'};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.variant === 'new' ? '#22c55e' : props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ProductActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: center;
  margin-top: ${props => props.theme.spacing[4]};
`

const ActionButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[5]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`

const WishlistButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isInWishlist ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isInWishlist ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 50%;
  color: ${props => props.$isInWishlist ? '#ef4444' : props.theme.colors.gray[300]};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { recentlyViewed } = useRecentlyViewed()
  const navigate = useNavigate()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.get(`${API_URL}/api/products`, {
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

  const handleAddToCart = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter au panier')
      navigate('/login')
      return
    }
    
    try {
      await addToCart({ produitId: product.id, quantite: 1 })
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
    }
  }

  const handleToggleWishlist = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter aux favoris')
      navigate('/login')
      return
    }
    
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    }
  }

  return (
    <HomeContainer>
      <HeroSection style={{
        background: `linear-gradient(
          135deg,
          rgba(26, 26, 26, 0.9) 0%,
          rgba(45, 45, 45, 0.8) 50%,
          rgba(26, 26, 26, 0.9) 100%
        ), url(${getImageUrl('/assets/images/banniere.jpg')})`
      }}>
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
              <ProductsGrid
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    layout
                  >
                    <ProductImage bgImage={getImageUrl(product.images?.[0]?.url)}>
                      {product.nom}
                    </ProductImage>
                    
                    <ProductBadges>
                      {product.estNouveau && (
                        <Badge variant="new">
                          <FiStar size={12} />
                          Nouveau
                        </Badge>
                      )}
                      {product.noteMoyenne >= 4.5 && (
                        <Badge>
                          <FiTrendingUp size={12} />
                          Populaire
                        </Badge>
                      )}
                    </ProductBadges>
                    
                    <ProductName>{product.nom}</ProductName>
                    <ProductBrand>{product.marque}</ProductBrand>
                    
                    <ProductPrice>
                      <CurrentPrice>{formatPrice(product.prix)}</CurrentPrice>
                    </ProductPrice>
                    
                    <ProductActions>
                      <ActionButton
                        as={Link}
                        to={`/products/${product.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FiShoppingCart size={16} />
                        Voir les détails
                      </ActionButton>
                      <WishlistButton
                        onClick={(e) => handleToggleWishlist(product, e)}
                        $isInWishlist={isInWishlist(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiHeart size={16} />
                      </WishlistButton>
                    </ProductActions>
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

      {/* Section Produits récemment consultés */}
      {recentlyViewed.length > 0 && (
        <Section style={{ background: '#1a1a1a' }}>
          <Container>
            <SectionTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Récemment consultés
            </SectionTitle>
            <SectionSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Retrouvez les montres que vous avez récemment consultées
            </SectionSubtitle>
            
            <ProductsGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {recentlyViewed.slice(0, 4).map((product, index) => (
                <ProductCard
                  key={product.id}
                  as={Link}
                  to={`/products/${product.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  layout
                >
                  <ProductImage bgImage={getImageUrl(product.images?.[0]?.url)}>
                    {product.nom}
                  </ProductImage>
                  
                  <ProductBadges>
                    {product.noteMoyenne >= 4.5 && (
                      <Badge>
                        <FiTrendingUp size={12} />
                        Populaire
                      </Badge>
                    )}
                  </ProductBadges>
                  
                  <ProductName>{product.nom}</ProductName>
                  <ProductBrand>{product.marque}</ProductBrand>
                  
                  <ProductPrice>
                    <CurrentPrice>
                      {formatPrice(product.prixPromo && product.prixPromo > 0 ? product.prixPromo : product.prix)}
                    </CurrentPrice>
                    {product.prixPromo && product.prixPromo > 0 && (
                      <OriginalPrice>{formatPrice(product.prix)}</OriginalPrice>
                    )}
                  </ProductPrice>
                  
                  <ProductActions>
                    <ActionButton
                      as={Link}
                      to={`/products/${product.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShoppingCart size={16} />
                      Voir les détails
                    </ActionButton>
                    <WishlistButton
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleToggleWishlist(product, e)
                      }}
                      $isInWishlist={isInWishlist(product.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiHeart size={16} />
                    </WishlistButton>
                  </ProductActions>
                </ProductCard>
              ))}
            </ProductsGrid>
          </Container>
        </Section>
      )}

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