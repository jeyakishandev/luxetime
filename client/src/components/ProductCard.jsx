import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import { Button, Card } from './ui'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { formatPrice } from '../utils/format'
import toast from 'react-hot-toast'

const ProductCardContainer = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.transitions.base};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.theme.shadows['2xl']};
  }
  
  ${props => props.theme.media.mobile} {
    &:hover {
      transform: none;
    }
  }
`

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  cursor: pointer;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    height: 200px;
    margin-bottom: ${props => props.theme.spacing[3]};
  }
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.base};
  
  ${ProductCardContainer}:hover & {
    transform: scale(1.05);
  }
`

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: ${props => props.theme.spacing[3]};
  opacity: 0;
  transition: opacity ${props => props.theme.transitions.base};
  
  ${ProductCardContainer}:hover & {
    opacity: 1;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`

const ActionButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.white};
  color: ${props => props.$isInWishlist ? props.theme.colors.error : props.theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.$isInWishlist ? props.theme.colors.error : props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    transform: scale(1.1);
  }
  
  ${props => props.theme.media.mobile} {
    width: 36px;
    height: 36px;
  }
`

const Badge = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing[3]};
  left: ${props => props.theme.spacing[3]};
  background: ${props => {
    switch (props.type) {
      case 'new': return props.theme.colors.success
      case 'sale': return props.theme.colors.error
      case 'featured': return props.theme.colors.primary
      default: return props.theme.colors.gray[600]
    }
  }};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const ProductTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  line-height: 1.3;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.base};
  }
`

const ProductBrand = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ProductDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const CurrentPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
`

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const StockIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    if (props.stock === 0) return props.theme.colors.error
    if (props.stock < 10) return props.theme.colors.warning
    return props.theme.colors.success
  }};
`

const AddToCartButton = styled(Button)`
  width: 100%;
  margin-top: auto;
`

const ProductCard = ({ 
  product, 
  onViewDetails,
  onAddToWishlist,
  className 
}) => {
  const { addToCart, isAddingToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist, isAddingToWishlist } = useWishlist()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter des produits au panier')
      navigate('/login')
      return
    }
    
    try {
      await addToCart({ produitId: product.id, quantite: 1 })
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
    }
  }

  const handleViewDetails = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onViewDetails) {
      onViewDetails(product)
    }
  }

  const handleAddToWishlist = async (e) => {
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

  const getBadgeType = () => {
    if (product.estNouveau) return 'new'
    if (product.prixPromo && product.prixPromo > 0) return 'sale'
    return null
  }

  const getBadgeText = () => {
    if (product.estNouveau) return 'Nouveau'
    if (product.prixPromo && product.prixPromo > 0) return 'Promo'
    return null
  }

  const getCurrentPrice = () => {
    return product.prixPromo && product.prixPromo > 0 
      ? product.prixPromo 
      : product.prix
  }

  const getOriginalPrice = () => {
    return product.prixPromo && product.prixPromo > 0 
      ? product.prix 
      : null
  }

  const getStockStatus = () => {
    if (product.stock === 0) return 'Rupture de stock'
    if (product.stock < 10) return `Plus que ${product.stock} en stock`
    return 'En stock'
  }

  return (
    <ProductCardContainer
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ProductLink 
        to={`/products/${product.id}`}
        onClick={() => console.log('Navigation vers:', `/products/${product.id}`)}
      >
        <ImageContainer>
          {getBadgeType() && (
            <Badge type={getBadgeType()}>
              {getBadgeText()}
            </Badge>
          )}
          
          <ProductImage
            src={product.images?.[0]?.url || '/placeholder-watch.jpg'}
            alt={product.nom}
            loading="lazy"
          />
          
          <ImageOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <ActionButtons>
              <ActionButton
                onClick={handleViewDetails}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiEye size={18} />
              </ActionButton>
              
              <ActionButton
                onClick={handleAddToWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                $isInWishlist={isInWishlist(product.id)}
                disabled={isAddingToWishlist}
              >
                <FiHeart size={18} />
              </ActionButton>
            </ActionButtons>
          </ImageOverlay>
        </ImageContainer>

        <ProductInfo>
          <ProductBrand>{product.marque}</ProductBrand>
          <ProductTitle>{product.nom}</ProductTitle>
          <ProductDescription>{product.description}</ProductDescription>
          
          <PriceContainer>
            <CurrentPrice>{formatPrice(getCurrentPrice())}</CurrentPrice>
            {getOriginalPrice() && (
              <OriginalPrice>{formatPrice(getOriginalPrice())}</OriginalPrice>
            )}
          </PriceContainer>
          
          <StockInfo>
            <StockIndicator stock={product.stock} />
            <span>{getStockStatus()}</span>
          </StockInfo>
          
          {/* Bouton de test pour la navigation */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.5rem', 
            background: 'rgba(212, 175, 55, 0.1)', 
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: '#d4af37'
          }}>
            Cliquez ici pour voir les détails
          </div>
        </ProductInfo>
      </ProductLink>
      
      <AddToCartButton
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAddingToCart}
        isLoading={isAddingToCart}
        fullWidth
        style={{ marginTop: '1rem' }}
      >
        {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
      </AddToCartButton>
    </ProductCardContainer>
  )
}

export default ProductCard
