import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card, PageLoading } from '../components/ui'
import { FiShoppingCart, FiHeart, FiFilter, FiStar, FiEye, FiTrendingUp, FiAward, FiClock, FiArrowDown, FiArrowUp } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { getImageUrl } from '../utils/format'
import toast from 'react-hot-toast'

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
  font-size: clamp(2.75rem, 7vw, 4.5rem);
  font-weight: ${props => props.theme.fontWeights.extrabold};
  font-family: 'Playfair Display', serif;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[8]};
  letter-spacing: -0.03em;
  animation: shimmer 3s linear infinite;
  
  @keyframes shimmer {
    to {
      background-position: 200% center;
    }
  }
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

const SortContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[8]};
  justify-content: flex-end;
  
  ${props => props.theme.media.mobile} {
    justify-content: center;
    margin-bottom: ${props => props.theme.spacing[6]};
  }
`

const SortLabel = styled.label`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  white-space: nowrap;
`

const SortSelect = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  min-width: 200px;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  option {
    background: #1a1a1a;
    color: ${props => props.theme.colors.white};
  }
`

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[16]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing[6]};
  }
  
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


const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: ${props => props.theme.colors.error};
  
  p {
    margin: ${props => props.theme.spacing[2]} 0;
    line-height: 1.6;
  }
`

const BackendInfoBox = styled.div`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  p {
    color: #9ca3af;
    font-size: ${props => props.theme.fontSizes.sm};
    margin: 0;
    line-height: 1.6;
    
    strong {
      color: #3b82f6;
    }
  }
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
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
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
    tri: 'createdAt',
    ordre: 'desc',
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
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
      if (filters.tri) {
        queryParams.tri = filters.tri
      }
      if (filters.ordre) {
        queryParams.ordre = filters.ordre
      }
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.get(`${API_URL}/api/products`, {
        params: queryParams,
        timeout: 30000 // 30 secondes - le backend peut prendre du temps à démarrer
      })
      
      if (response.data.success) {
        setProducts(response.data.data.products || [])
        setError(null)
      } else {
        setError('Erreur lors du chargement des produits')
      }
    } catch (err) {
      console.error('❌ Erreur API:', err)
      if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
        setError('Le serveur est en cours de démarrage. Cela peut prendre 30-60 secondes lors du premier chargement. Veuillez patienter et réessayer dans quelques instants...')
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Le backend prend un peu de temps à répondre. Veuillez patienter quelques instants...')
      } else {
        setError(`Erreur de connexion à l'API: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter au panier')
      navigate('/login', { 
        state: { from: window.location.pathname + window.location.search, message: 'Connectez-vous pour ajouter ce produit au panier' }
      })
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
      navigate('/login', { 
        state: { from: window.location.pathname + window.location.search, message: 'Connectez-vous pour ajouter aux favoris' }
      })
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1
    }))
  }

  const handleSortChange = (e) => {
    const [tri, ordre] = e.target.value.split('-')
    setFilters(prev => ({
      ...prev,
      tri,
      ordre,
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
          <PageLoading text="Chargement des produits..." showBackendInfo={true} />
        </Container>
      </ProductsContainer>
    )
  }

  if (error) {
    const isBackendSlowError = error.includes('démarrage') || error.includes('patienter')
    
    return (
      <ProductsContainer>
        <Container>
          <ErrorMessage>
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
            {isBackendSlowError && (
              <BackendInfoBox>
                <p>
                  💡 <strong>Information :</strong> Le backend est en cours de démarrage. 
                  Cela peut prendre 30-60 secondes lors du premier chargement ou après une période d'inactivité. 
                  Veuillez patienter et réessayer dans quelques instants.
                </p>
              </BackendInfoBox>
            )}
            <Button onClick={fetchProducts} style={{ marginTop: '1.5rem' }}>
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

        <SortContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <SortLabel htmlFor="sort-select">
            Trier par :
          </SortLabel>
          <SortSelect
            id="sort-select"
            value={`${filters.tri}-${filters.ordre}`}
            onChange={handleSortChange}
          >
            <option value="createdAt-desc">Plus récents</option>
            <option value="createdAt-asc">Plus anciens</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="noteMoyenne-desc">Mieux notés</option>
            <option value="nom-asc">Nom (A-Z)</option>
            <option value="nom-desc">Nom (Z-A)</option>
            <option value="vues-desc">Plus populaires</option>
          </SortSelect>
        </SortContainer>

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
                  onClick={() => {
                    navigate(`/products/${product.id}`)
                  }}
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
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiShoppingCart size={16} />
                      Ajouter
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