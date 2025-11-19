import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, PageLoading } from '../components/ui'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/format'
import { 
  FiShoppingBag, 
  FiArrowRight, 
  FiTrash2, 
  FiShoppingCart,
  FiHeart,
  FiShield,
  FiTruck,
  FiClock,
  FiStar,
  FiGift,
  FiCreditCard,
  FiLock,
  FiCheck,
  FiPlus,
  FiMinus,
  FiX
} from 'react-icons/fi'

const CartContainer = styled.div`
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
  margin-bottom: ${props => props.theme.spacing[12]};
  position: relative;
`

const PageTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[4]};
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.02em;
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const EmptyCart = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[16]} 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  backdrop-filter: blur(20px);
`

const EmptyCartIcon = styled(motion.div)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 2px solid rgba(212, 175, 55, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[8]};
  color: ${props => props.theme.colors.primary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
    border-radius: 50%;
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const EmptyCartTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const EmptyCartText = styled(motion.p)`
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[8]};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.6;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
`

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const CartActions = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  margin-top: ${props => props.theme.spacing[8]};
  flex-wrap: wrap;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[6]};
  background: ${props => props.variant === 'danger' 
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))'};
  border: 1px solid ${props => props.variant === 'danger' 
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.variant === 'danger' ? '#ffffff' : props.theme.colors.gray[300]};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'danger' 
      ? '0 10px 25px rgba(239, 68, 68, 0.4)'
      : '0 10px 25px rgba(212, 175, 55, 0.3)'};
    border-color: ${props => props.variant === 'danger' 
      ? 'rgba(239, 68, 68, 0.5)'
      : 'rgba(212, 175, 55, 0.3)'};
  }
`

const CartSummary = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
  height: fit-content;
  position: sticky;
  top: 120px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`

const SummaryTitle = styled(motion.h3)`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const SummaryRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[4]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: ${props => props.theme.fontWeights.bold};
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.primary};
    margin-top: ${props => props.theme.spacing[4]};
    padding-top: ${props => props.theme.spacing[4]};
    border-top: 2px solid rgba(212, 175, 55, 0.3);
  }
`

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.gray[300]};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const SummaryValue = styled.span`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const CheckoutButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing[6]};
  
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
    box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const FeaturesSection = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`

const FeatureCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-2px);
  }
`

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.lg};
  flex-shrink: 0;
`

const FeatureContent = styled.div`
  flex: 1;
`

const FeatureTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
  line-height: 1.4;
`

const Cart = () => {
  const navigate = useNavigate()
  const { items, total, itemCount, isLoading, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      setIsClearing(true)
      try {
        await clearCart()
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout')
    } else {
      navigate('/login')
    }
  }

  if (isLoading) {
    return (
      <CartContainer>
        <Container>
          <PageLoading text="Chargement du panier..." />
        </Container>
      </CartContainer>
    )
  }

  if (itemCount === 0) {
    return (
      <CartContainer>
        <Container>
          <PageHeader>
            <PageTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Mon Panier
            </PageTitle>
            <PageSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Découvrez notre collection exclusive
            </PageSubtitle>
          </PageHeader>
          
          <EmptyCart
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <EmptyCartIcon
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FiShoppingBag size={64} />
            </EmptyCartIcon>
            <EmptyCartTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Votre panier est vide
            </EmptyCartTitle>
            <EmptyCartText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Découvrez notre collection de montres de luxe et ajoutez vos favoris à votre panier pour une expérience d'achat exceptionnelle.
            </EmptyCartText>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button as={Link} to="/products" size="lg">
                Découvrir nos montres
                <FiArrowRight size={20} />
              </Button>
            </motion.div>
          </EmptyCart>
        </Container>
      </CartContainer>
    )
  }

  const shippingCost = total >= 100 ? 0 : 15
  const finalTotal = total + shippingCost
  const savings = total >= 100 ? 15 : 0

  return (
    <CartContainer>
      <Container>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Mon Panier
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
          </PageSubtitle>
        </PageHeader>

        <CartContent>
          <CartItems>
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            <CartActions
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ActionButton
                variant="danger"
                onClick={handleClearCart}
                disabled={isClearing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTrash2 size={18} />
                {isClearing ? 'Suppression...' : 'Vider le panier'}
              </ActionButton>
              
              <ActionButton
                as={Link}
                to="/products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus size={18} />
                Continuer mes achats
              </ActionButton>
            </CartActions>
          </CartItems>

          <CartSummary
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SummaryTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FiShoppingCart size={24} />
              Résumé de la commande
            </SummaryTitle>
            
            <SummaryRow
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <SummaryLabel>Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</SummaryLabel>
              <SummaryValue>{formatPrice(total)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SummaryLabel>Frais de livraison</SummaryLabel>
              <SummaryValue>
                {shippingCost === 0 ? (
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Gratuit</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </SummaryValue>
            </SummaryRow>
            
            {savings > 0 && (
              <SummaryRow
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <SummaryLabel>Économies</SummaryLabel>
                <SummaryValue style={{ color: '#22c55e' }}>
                  -{formatPrice(savings)}
                </SummaryValue>
              </SummaryRow>
            )}
            
            {shippingCost > 0 && (
              <motion.div 
                style={{ 
                  fontSize: '0.875rem', 
                  color: '#9ca3af', 
                  textAlign: 'center',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: 'rgba(212, 175, 55, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                💡 Livraison gratuite à partir de 100€
              </motion.div>
            )}
            
            <SummaryRow
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{formatPrice(finalTotal)}</SummaryValue>
            </SummaryRow>

            <CheckoutButton 
              onClick={handleCheckout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiLock size={20} />
              {isAuthenticated ? 'Finaliser la commande' : 'Se connecter pour commander'}
              <FiArrowRight size={20} />
            </CheckoutButton>

            <FeaturesSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <FeaturesGrid>
                <FeatureCard
                  whileHover={{ y: -2 }}
                >
                  <FeatureIcon>
                    <FiTruck size={18} />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>Livraison gratuite</FeatureTitle>
                    <FeatureDescription>Dès 100€ d'achat</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>

                <FeatureCard
                  whileHover={{ y: -2 }}
                >
                  <FeatureIcon>
                    <FiShield size={18} />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>Garantie 2 ans</FeatureTitle>
                    <FeatureDescription>Service inclus</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>

                <FeatureCard
                  whileHover={{ y: -2 }}
                >
                  <FeatureIcon>
                    <FiLock size={18} />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>Paiement sécurisé</FeatureTitle>
                    <FeatureDescription>SSL 256 bits</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>

                <FeatureCard
                  whileHover={{ y: -2 }}
                >
                  <FeatureIcon>
                    <FiClock size={18} />
                  </FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>Expédition rapide</FeatureTitle>
                    <FeatureDescription>24-48h</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
              </FeaturesGrid>
            </FeaturesSection>
          </CartSummary>
        </CartContent>
      </Container>
    </CartContainer>
  )
}

export default Cart