import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, PageLoading } from '../components/ui'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/format'
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi'

const CartContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
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

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing[8]};
  text-align: center;
`

const PageTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const EmptyCart = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const EmptyCartIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.gray[400]};
`

const EmptyCartTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const EmptyCartText = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const CartSummary = styled(Card)`
  height: fit-content;
  position: sticky;
  top: 100px;
`

const SummaryTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[2]} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[700]};
  
  &:last-child {
    border-bottom: none;
    font-weight: ${props => props.theme.fontWeights.bold};
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.primary};
    margin-top: ${props => props.theme.spacing[2]};
  }
`

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.gray[400]};
`

const SummaryValue = styled.span`
  color: ${props => props.theme.colors.white};
`

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[4]};
`

const Cart = () => {
  const { items, total, itemCount, isLoading, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart()
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
            <PageTitle>Mon Panier</PageTitle>
          </PageHeader>
          
          <EmptyCart>
            <EmptyCartIcon>
              <FiShoppingBag size={48} />
            </EmptyCartIcon>
            <EmptyCartTitle>Votre panier est vide</EmptyCartTitle>
            <EmptyCartText>
              Découvrez notre collection de montres de luxe et ajoutez vos favoris à votre panier.
            </EmptyCartText>
            <Button as={Link} to="/products" size="lg">
              Découvrir nos montres
              <FiArrowRight size={20} />
            </Button>
          </EmptyCart>
        </Container>
      </CartContainer>
    )
  }

  const shippingCost = total >= 100 ? 0 : 15
  const finalTotal = total + shippingCost

  return (
    <CartContainer>
      <Container>
        <PageHeader>
          <PageTitle>Mon Panier</PageTitle>
        </PageHeader>

        <CartContent>
          <CartItems>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Button 
                variant="outline" 
                onClick={handleClearCart}
                style={{ marginRight: '1rem' }}
              >
                Vider le panier
              </Button>
              <Button as={Link} to="/products" variant="secondary">
                Continuer mes achats
              </Button>
            </div>
          </CartItems>

          <CartSummary>
            <SummaryTitle>Résumé de la commande</SummaryTitle>
            
            <SummaryRow>
              <SummaryLabel>Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</SummaryLabel>
              <SummaryValue>{formatPrice(total)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Frais de livraison</SummaryLabel>
              <SummaryValue>
                {shippingCost === 0 ? 'Gratuit' : formatPrice(shippingCost)}
              </SummaryValue>
            </SummaryRow>
            
            {shippingCost > 0 && (
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#9ca3af', 
                textAlign: 'center',
                marginTop: '0.5rem'
              }}>
                Livraison gratuite à partir de 100€
              </div>
            )}
            
            <SummaryRow>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{formatPrice(finalTotal)}</SummaryValue>
            </SummaryRow>

            <CheckoutButton 
              as={Link} 
              to={isAuthenticated ? "/checkout" : "/login"}
              size="lg"
            >
              {isAuthenticated ? 'Finaliser la commande' : 'Se connecter pour commander'}
              <FiArrowRight size={20} />
            </CheckoutButton>
          </CartSummary>
        </CartContent>
      </Container>
    </CartContainer>
  )
}

export default Cart
