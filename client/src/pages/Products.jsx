import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '../components/ui'
import { FiShoppingCart, FiHeart, FiFilter, FiStar, FiEye, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ProductsContainer = styled.div`
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
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[16]};
  position: relative;
`

const PageTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[6]};
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.02em;
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.gray[300]};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const LuxuryBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
`

const FiltersContainer = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[12]};
  flex-wrap: wrap;
  justify-content: center;
  padding: ${props => props.theme.spacing[6]};
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  backdrop-filter: blur(20px);
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
    padding: ${props => props.theme.spacing[4]};
  }
`

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[5]};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))' 
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray[300]};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[16]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
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

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
  opacity: 0.7;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: ${props => props.theme.colors.gray[300]};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
    transform: scale(1.1);
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: ${props => props.theme.colors.gray[400]};
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: ${props => props.theme.colors.error};
`

// Mapping des images pour chaque produit
const productImages = {
  1: '/assets/images/analog-watch-1845547_1280.jpg', // Luxetime Classic
  2: '/assets/images/analog-watch-1869928_1280.jpg', // Luxetime Sport
  3: '/assets/images/rolex-2171960_1280.jpg', // Luxetime Elegance
  4: '/assets/images/rolex-2171961_1280.jpg', // Luxetime Heritage
  5: '/assets/images/clock-1224379_1280.jpg', // Luxetime Modern
  6: '/assets/images/watch-5772317_1280.jpg' // Luxetime Premium
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12,
  })

  console.log('🔍 Products component rendering, loading:', loading, 'products:', products.length)

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      console.log('🔄 Début du chargement des produits...')
      setLoading(true)
      setError(null)
      
      // Préparer les paramètres de requête
      const queryParams = {
        page: filters.page,
        limit: filters.limit
      }
      
      // Ajouter les filtres seulement s'ils ont des valeurs
      if (filters.category) {
        queryParams.categorie = filters.category
      }
      if (filters.minPrice && filters.minPrice > 0) {
        queryParams.prixMin = filters.minPrice
      }
      if (filters.maxPrice && filters.maxPrice < 999999) {
        queryParams.prixMax = filters.maxPrice
      }
      if (filters.search) {
        queryParams.search = filters.search
      }
      
      console.log('📤 Paramètres envoyés:', queryParams)
      
      const response = await axios.get('http://localhost:5000/api/products', {
        params: queryParams,
        timeout: 10000
      })
      
      console.log('✅ Réponse API:', response.data)
      
      if (response.data.success) {
        setProducts(response.data.data.products || [])
        setError(null)
        console.log('📦 Produits chargés:', response.data.data.products.length)
      } else {
        setError('Erreur lors du chargement des produits')
      }
    } catch (err) {
      console.error('❌ Erreur API:', err)
      if (err.code === 'ECONNREFUSED') {
        setError('Serveur non disponible. Vérifiez que le backend est démarré.')
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Erreur réseau. Vérifiez votre connexion.')
      } else {
        setError(`Erreur de connexion à l'API: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (loading) {
    return (
      <ProductsContainer>
        <Container>
          <LoadingMessage>
            <h3>Chargement des produits...</h3>
            <p>Veuillez patienter...</p>
          </LoadingMessage>
        </Container>
      </ProductsContainer>
    )
  }

  if (error) {
    return (
      <ProductsContainer>
        <Container>
          <ErrorMessage>
            <h3>Erreur</h3>
            <p>{error}</p>
            <Button onClick={fetchProducts} style={{ marginTop: '1rem' }}>
              Réessayer
            </Button>
          </ErrorMessage>
        </Container>
      </ProductsContainer>
    )
  }

  return (
    <ProductsContainer>
      <Container>
        <PageHeader
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PageTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Nos Collections
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Découvrez notre sélection de montres de luxe, alliant tradition horlogère et innovation moderne
          </PageSubtitle>
          <LuxuryBadge
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FiAward size={16} />
            Collection Exclusive
          </LuxuryBadge>
        </PageHeader>

        <FiltersContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <FilterButton
            active={filters.category === ''}
            onClick={() => handleFilterChange('category', '')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFilter size={16} />
            Toutes
          </FilterButton>
          <FilterButton
            active={filters.category === 'HOMME'}
            onClick={() => handleFilterChange('category', 'HOMME')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Homme
          </FilterButton>
          <FilterButton
            active={filters.category === 'FEMME'}
            onClick={() => handleFilterChange('category', 'FEMME')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Femme
          </FilterButton>
          <FilterButton
            active={filters.category === 'SPORT'}
            onClick={() => handleFilterChange('category', 'SPORT')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sport
          </FilterButton>
          <FilterButton
            active={filters.category === 'VINTAGE'}
            onClick={() => handleFilterChange('category', 'VINTAGE')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Vintage
          </FilterButton>
        </FiltersContainer>

        <ProductsGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <AnimatePresence>
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  layout
                >
                  <ProductImage bgImage={productImages[product.id]}>
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
                    {product.prixPromo && product.prixPromo > 0 ? (
                      <>
                        <CurrentPrice>{formatPrice(product.prixPromo)}</CurrentPrice>
                        <OriginalPrice>{formatPrice(product.prix)}</OriginalPrice>
                      </>
                    ) : (
                      <CurrentPrice>{formatPrice(product.prix)}</CurrentPrice>
                    )}
                  </ProductPrice>
                  
                  <ProductActions>
                    <ActionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShoppingCart size={16} />
                      Ajouter
                    </ActionButton>
                    <WishlistButton
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiHeart size={16} />
                    </WishlistButton>
                  </ProductActions>
                </ProductCard>
              ))
            ) : (
              <motion.div
                style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '4rem 0',
                  color: '#9ca3af'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ProductsGrid>
      </Container>
    </ProductsContainer>
  )
}

export default Products