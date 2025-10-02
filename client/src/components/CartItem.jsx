import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { Button, Card } from './ui'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import { formatPrice } from '../utils/format'

const CartItemContainer = styled(Card)`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    padding: ${props => props.theme.spacing[3]};
  }
`

const ImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  flex-shrink: 0;
  
  ${props => props.theme.media.mobile} {
    width: 100%;
    height: 200px;
  }
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const ProductName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0;
  line-height: 1.3;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.base};
  }
`

const ProductBrand = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ProductReference = styled.p`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.gray[500]};
  margin: 0;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const CurrentPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
`

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-top: auto;
  
  ${props => props.theme.media.mobile} {
    justify-content: space-between;
    width: 100%;
  }
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${props => props.theme.colors.gray[700]};
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.gray[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityInput = styled.input`
  width: 50px;
  height: 32px;
  border: none;
  background: ${props => props.theme.colors.gray[800]};
  color: ${props => props.theme.colors.white};
  text-align: center;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  
  &:focus {
    outline: none;
    background: ${props => props.theme.colors.gray[700]};
  }
`

const QuantityDisplay = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[300]};
  min-width: 20px;
  text-align: center;
`

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
  align-items: flex-end;
  
  ${props => props.theme.media.mobile} {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`

const TotalPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  text-align: right;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const RemoveButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing[2]};
  min-width: auto;
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.white};
  }
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  }
`

const StockWarning = styled.div`
  background: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.black};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-top: ${props => props.theme.spacing[2]};
`

const CartItem = ({ item, onUpdate, onRemove }) => {
  const { updateQuantity, removeFromCart, isUpdatingQuantity, isRemovingFromCart } = useCart()
  const [localQuantity, setLocalQuantity] = useState(item.quantite)
  const [isEditing, setIsEditing] = useState(false)

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.produit.stock) {
      // Afficher un avertissement si la quantité dépasse le stock
      return
    }
    
    setLocalQuantity(newQuantity)
    updateQuantity({ produitId: item.produit.id, quantite: newQuantity })
  }

  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 1
    setLocalQuantity(value)
  }

  const handleQuantityInputBlur = () => {
    if (localQuantity !== item.quantite) {
      handleQuantityChange(localQuantity)
    }
    setIsEditing(false)
  }

  const handleRemove = () => {
    removeFromCart(item.produit.id)
    if (onRemove) {
      onRemove(item)
    }
  }

  const getCurrentPrice = () => {
    return item.produit.prixPromo && item.produit.prixPromo > 0 
      ? item.produit.prixPromo 
      : item.produit.prix
  }

  const getOriginalPrice = () => {
    return item.produit.prixPromo && item.produit.prixPromo > 0 
      ? item.produit.prix 
      : null
  }

  const getTotalPrice = () => {
    return getCurrentPrice() * item.quantite
  }

  const isLowStock = item.produit.stock < 10 && item.produit.stock > 0
  const isOutOfStock = item.produit.stock === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CartItemContainer>
        <ImageContainer>
          <ProductImage
            src={item.produit.images?.[0]?.url || '/placeholder-watch.jpg'}
            alt={item.produit.nom}
            loading="lazy"
          />
        </ImageContainer>

        <ProductInfo>
          <ProductBrand>{item.produit.marque}</ProductBrand>
          <ProductName>{item.produit.nom}</ProductName>
          <ProductReference>Réf: {item.produit.reference}</ProductReference>
          
          <PriceContainer>
            <CurrentPrice>{formatPrice(getCurrentPrice())}</CurrentPrice>
            {getOriginalPrice() && (
              <OriginalPrice>{formatPrice(getOriginalPrice())}</OriginalPrice>
            )}
          </PriceContainer>

          {isLowStock && (
            <StockWarning>
              Plus que {item.produit.stock} en stock
            </StockWarning>
          )}

          {isOutOfStock && (
            <StockWarning style={{ background: '#dc3545', color: 'white' }}>
              Rupture de stock
            </StockWarning>
          )}
        </ProductInfo>

        <ActionsContainer>
          <QuantityContainer>
            <QuantityControls>
              <QuantityButton
                onClick={() => handleQuantityChange(item.quantite - 1)}
                disabled={item.quantite <= 1 || isUpdatingQuantity}
              >
                <FiMinus size={14} />
              </QuantityButton>
              
              {isEditing ? (
                <QuantityInput
                  type="number"
                  value={localQuantity}
                  onChange={handleQuantityInputChange}
                  onBlur={handleQuantityInputBlur}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuantityInputBlur()}
                  min="1"
                  max={item.produit.stock}
                />
              ) : (
                <QuantityDisplay
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.quantite}
                </QuantityDisplay>
              )}
              
              <QuantityButton
                onClick={() => handleQuantityChange(item.quantite + 1)}
                disabled={item.quantite >= item.produit.stock || isUpdatingQuantity}
              >
                <FiPlus size={14} />
              </QuantityButton>
            </QuantityControls>
          </QuantityContainer>

          <TotalPrice>
            {formatPrice(getTotalPrice())}
          </TotalPrice>

          <RemoveButton
            onClick={handleRemove}
            disabled={isRemovingFromCart}
            size="sm"
            variant="outline"
          >
            <FiTrash2 size={16} />
          </RemoveButton>
        </ActionsContainer>
      </CartItemContainer>
    </motion.div>
  )
}

export default CartItem
