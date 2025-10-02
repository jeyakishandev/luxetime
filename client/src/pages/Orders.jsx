import React from 'react'
import styled from 'styled-components'
import { useUserOrders } from '../hooks/useOrders'
import { Card, PageLoading } from '../components/ui'
import { formatPrice, formatDate } from '../utils/format'
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi'

const OrdersContainer = styled.div`
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

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const OrderCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`

const OrderInfo = styled.div`
  flex: 1;
`

const OrderNumber = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const OrderDate = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => {
    switch (props.status) {
      case 'LIVREE': return props.theme.colors.success
      case 'EXPEDIEE': return props.theme.colors.info
      case 'EN_PREPARATION': return props.theme.colors.warning
      case 'CONFIRMEE': return props.theme.colors.primary
      case 'EN_ATTENTE': return props.theme.colors.gray[600]
      case 'ANNULEE': return props.theme.colors.error
      default: return props.theme.colors.gray[600]
    }
  }};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const OrderTotal = styled.div`
  text-align: right;
  
  ${props => props.theme.media.mobile} {
    text-align: left;
  }
`

const TotalLabel = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const TotalValue = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin: 0;
`

const OrderItems = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[3]};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  object-fit: cover;
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemName = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const ItemDetails = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const ItemPrice = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.primary};
  margin: 0;
`

const EmptyOrders = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const EmptyIcon = styled.div`
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

const EmptyTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const EmptyText = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const Orders = () => {
  const { data: ordersData, isLoading } = useUserOrders()

  if (isLoading) {
    return (
      <OrdersContainer>
        <Container>
          <PageLoading text="Chargement de vos commandes..." />
        </Container>
      </OrdersContainer>
    )
  }

  const orders = ordersData?.data?.commandes || []

  const getStatusIcon = (status) => {
    switch (status) {
      case 'LIVREE': return <FiCheckCircle size={16} />
      case 'EXPEDIEE': return <FiTruck size={16} />
      case 'EN_PREPARATION': return <FiPackage size={16} />
      default: return <FiPackage size={16} />
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      'EN_ATTENTE': 'En attente',
      'CONFIRMEE': 'Confirmée',
      'EN_PREPARATION': 'En préparation',
      'EXPEDIEE': 'Expédiée',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    }
    return labels[status] || status
  }

  if (orders.length === 0) {
    return (
      <OrdersContainer>
        <Container>
          <PageHeader>
            <PageTitle>Mes Commandes</PageTitle>
          </PageHeader>
          
          <EmptyOrders>
            <EmptyIcon>
              <FiPackage size={48} />
            </EmptyIcon>
            <EmptyTitle>Aucune commande</EmptyTitle>
            <EmptyText>
              Vous n'avez pas encore passé de commande. Découvrez notre collection de montres de luxe.
            </EmptyText>
          </EmptyOrders>
        </Container>
      </OrdersContainer>
    )
  }

  return (
    <OrdersContainer>
      <Container>
        <PageHeader>
          <PageTitle>Mes Commandes</PageTitle>
        </PageHeader>

        <OrdersList>
          {orders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderNumber>Commande #{order.numero}</OrderNumber>
                  <OrderDate>Passée le {formatDate(order.createdAt)}</OrderDate>
                </OrderInfo>
                
                <OrderStatus status={order.statut}>
                  {getStatusIcon(order.statut)}
                  {getStatusLabel(order.statut)}
                </OrderStatus>
                
                <OrderTotal>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>{formatPrice(order.total)}</TotalValue>
                </OrderTotal>
              </OrderHeader>

              <OrderItems>
                {order.items?.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemImage
                      src={item.produit?.images?.[0]?.url || '/placeholder-watch.jpg'}
                      alt={item.nomProduit}
                    />
                    <ItemInfo>
                      <ItemName>{item.nomProduit}</ItemName>
                      <ItemDetails>
                        Quantité: {item.quantite} • Prix unitaire: {formatPrice(item.prixUnitaire)}
                      </ItemDetails>
                    </ItemInfo>
                    <ItemPrice>{formatPrice(item.prixUnitaire * item.quantite)}</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>
            </OrderCard>
          ))}
        </OrdersList>
      </Container>
    </OrdersContainer>
  )
}

export default Orders
