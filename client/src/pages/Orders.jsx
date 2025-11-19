import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, Button, PageLoading } from '../components/ui'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiMapPin, FiCalendar, FiCreditCard, FiEye } from 'react-icons/fi'
import { orderAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice } from '../utils/format'
import toast from 'react-hot-toast'

const OrdersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  padding: ${props => props.theme.spacing[8]} 0;
  
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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
`

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[3]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
`

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const OrderCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing[4]};
  padding-bottom: ${props => props.theme.spacing[4]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`

const OrderInfo = styled.div`
  flex: 1;
`

const OrderNumber = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const OrderStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  background: ${props => {
    switch (props.$status) {
      case 'LIVREE':
        return 'rgba(34, 197, 94, 0.2)'
      case 'EXPEDIEE':
        return 'rgba(59, 130, 246, 0.2)'
      case 'EN_PREPARATION':
        return 'rgba(251, 191, 36, 0.2)'
      case 'CONFIRMEE':
        return 'rgba(168, 85, 247, 0.2)'
      case 'EN_ATTENTE':
        return 'rgba(156, 163, 175, 0.2)'
      case 'ANNULEE':
        return 'rgba(239, 68, 68, 0.2)'
      default:
        return 'rgba(156, 163, 175, 0.2)'
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'LIVREE':
        return 'rgba(34, 197, 94, 0.4)'
      case 'EXPEDIEE':
        return 'rgba(59, 130, 246, 0.4)'
      case 'EN_PREPARATION':
        return 'rgba(251, 191, 36, 0.4)'
      case 'CONFIRMEE':
        return 'rgba(168, 85, 247, 0.4)'
      case 'EN_ATTENTE':
        return 'rgba(156, 163, 175, 0.4)'
      case 'ANNULEE':
        return 'rgba(239, 68, 68, 0.4)'
      default:
        return 'rgba(156, 163, 175, 0.4)'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'LIVREE':
        return '#22c55e'
      case 'EXPEDIEE':
        return '#3b82f6'
      case 'EN_PREPARATION':
        return '#fbbf24'
      case 'CONFIRMEE':
        return '#a855f7'
      case 'EN_ATTENTE':
        return '#9ca3af'
      case 'ANNULEE':
        return '#ef4444'
      default:
        return '#9ca3af'
    }
  }};
`

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${props => props.theme.borderRadius.md};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[1]};
`

const ItemPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
`

const ItemQuantity = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
    align-items: flex-start;
  }
`

const OrderTotal = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`

const OrderActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
`

const TrackingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  color: #3b82f6;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing[3]};
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(212, 175, 55, 0.2);
`

const EmptyTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`

const EmptyText = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
`

const Orders = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Récupérer les commandes
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await orderAPI.getUserOrders()
        
        if (response.data.success) {
          // L'API retourne { commandes, pagination }
          const ordersData = response.data.data?.commandes || []
          setOrders(ordersData)
        } else {
          setError('Erreur lors du chargement des commandes')
        }
      } catch (err) {
        console.error('❌ Erreur:', err)
        setError(err.response?.data?.message || 'Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [isAuthenticated])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'LIVREE':
        return <FiCheckCircle size={18} />
      case 'EXPEDIEE':
        return <FiTruck size={18} />
      case 'EN_PREPARATION':
        return <FiPackage size={18} />
      default:
        return <FiClock size={18} />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'LIVREE':
        return 'Livrée'
      case 'EXPEDIEE':
        return 'Expédiée'
      case 'EN_PREPARATION':
        return 'En préparation'
      case 'CONFIRMEE':
        return 'Confirmée'
      case 'EN_ATTENTE':
        return 'En attente'
      case 'ANNULEE':
        return 'Annulée'
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  if (isLoading) {
    return (
      <OrdersContainer>
        <Container>
          <PageLoading text="Chargement de vos commandes..." />
        </Container>
      </OrdersContainer>
    )
  }

  if (error) {
    return (
      <OrdersContainer>
        <Container>
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>
              <FiPackage size={48} color="#d4af37" />
            </EmptyIcon>
            <EmptyTitle>Erreur</EmptyTitle>
            <EmptyText>Impossible de charger vos commandes</EmptyText>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </EmptyState>
        </Container>
      </OrdersContainer>
    )
  }

  // Protection supplémentaire
  if (!Array.isArray(orders)) {
    console.error('❌ orders n\'est pas un tableau:', orders)
    return (
      <OrdersContainer>
        <Container>
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>
              <FiPackage size={48} color="#d4af37" />
            </EmptyIcon>
            <EmptyTitle>Erreur de format</EmptyTitle>
            <EmptyText>Format de données invalide</EmptyText>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </EmptyState>
        </Container>
      </OrdersContainer>
    )
  }

  return (
    <OrdersContainer>
      <Container>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Mes Commandes
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {orders.length} commande{orders.length > 1 ? 's' : ''}
          </PageSubtitle>
        </PageHeader>

        {orders.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>
              <FiPackage size={48} color="#d4af37" />
            </EmptyIcon>
            <EmptyTitle>Aucune commande</EmptyTitle>
            <EmptyText>
              Vous n'avez pas encore passé de commande.
            </EmptyText>
            <Button onClick={() => navigate('/products')}>
              Découvrir nos produits
            </Button>
          </EmptyState>
        ) : (
          <OrdersList>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <OrderCard>
                  <OrderHeader>
                    <OrderInfo>
                      <OrderNumber>Commande {order.numero}</OrderNumber>
                      <OrderDate>
                        <FiCalendar size={16} />
                        {formatDate(order.createdAt)}
                      </OrderDate>
                    </OrderInfo>
                    <OrderStatus $status={order.statut}>
                      {getStatusIcon(order.statut)}
                      {getStatusLabel(order.statut)}
                    </OrderStatus>
                  </OrderHeader>

                  <OrderItems>
                    {order.items?.map((item) => (
                      <OrderItem key={item.id}>
                        <ItemImage>
                          <img
                            src={item.produit?.images?.[0]?.url || '/placeholder-watch.jpg'}
                            alt={item.nomProduit}
                          />
                        </ItemImage>
                        <ItemDetails>
                          <ItemName>{item.nomProduit}</ItemName>
                          <ItemPrice>{formatPrice(item.prixUnitaire)}</ItemPrice>
                        </ItemDetails>
                        <ItemQuantity>×{item.quantite}</ItemQuantity>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  {order.numeroSuivi && (
                    <TrackingInfo>
                      <FiTruck size={16} />
                      Numéro de suivi : <strong style={{ marginLeft: '4px' }}>{order.numeroSuivi}</strong>
                    </TrackingInfo>
                  )}

                  <OrderFooter>
                    <OrderTotal>
                      Total : <span>{formatPrice(order.total)}</span>
                    </OrderTotal>
                    <OrderActions>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <FiEye size={16} />
                        Détails
                      </Button>
                    </OrderActions>
                  </OrderFooter>
                </OrderCard>
              </motion.div>
            ))}
          </OrdersList>
        )}
      </Container>
    </OrdersContainer>
  )
}

export default Orders