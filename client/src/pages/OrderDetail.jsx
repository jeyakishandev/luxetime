import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, PageLoading } from '../components/ui'
import { 
  FiArrowLeft, 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiMapPin, 
  FiCalendar, 
  FiCreditCard, 
  FiEye,
  FiUser,
  FiMail,
  FiPhone,
  FiShoppingCart,
  FiTag,
  FiFileText,
  FiAward,
  FiShield
} from 'react-icons/fi'
import { orderAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatPrice, formatDate, getImageUrl } from '../utils/format'
import toast from 'react-hot-toast'

const OrderDetailContainer = styled.div`
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

const BackButton = styled(Button)`
  position: absolute;
  top: -${props => props.theme.spacing[4]};
  left: ${props => props.theme.spacing[4]};
  background: transparent;
  color: ${props => props.theme.colors.gray[400]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  
  &:hover {
    background: ${props => props.theme.colors.gray[800]};
    color: ${props => props.theme.colors.white};
  }
`

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.white} 0%, ${props => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const OrderCard = styled(Card)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: ${props => props.theme.spacing[6]};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-2px);
  }
`

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing[6]};
  padding-bottom: ${props => props.theme.spacing[4]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const OrderNumber = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0;
`

const OrderDate = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const StatusBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  background: ${props => {
    switch (props.$status) {
      case 'LIVREE': return 'rgba(34, 197, 94, 0.2)'
      case 'EXPEDIEE': return 'rgba(59, 130, 246, 0.2)'
      case 'EN_PREPARATION': return 'rgba(245, 158, 11, 0.2)'
      case 'CONFIRMEE': return 'rgba(168, 85, 247, 0.2)'
      case 'EN_ATTENTE': return 'rgba(107, 114, 128, 0.2)'
      case 'ANNULEE': return 'rgba(239, 68, 68, 0.2)'
      default: return 'rgba(107, 114, 128, 0.2)'
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'LIVREE': return 'rgba(34, 197, 94, 0.5)'
      case 'EXPEDIEE': return 'rgba(59, 130, 246, 0.5)'
      case 'EN_PREPARATION': return 'rgba(245, 158, 11, 0.5)'
      case 'CONFIRMEE': return 'rgba(168, 85, 247, 0.5)'
      case 'EN_ATTENTE': return 'rgba(107, 114, 128, 0.5)'
      case 'ANNULEE': return 'rgba(239, 68, 68, 0.5)'
      default: return 'rgba(107, 114, 128, 0.5)'
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'LIVREE': return '#22c55e'
      case 'EXPEDIEE': return '#3b82f6'
      case 'EN_PREPARATION': return '#f59e0b'
      case 'CONFIRMEE': return '#a855f7'
      case 'EN_ATTENTE': return '#6b7280'
      case 'ANNULEE': return '#ef4444'
      default: return '#6b7280'
    }
  }};
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const ItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(212, 175, 55, 0.3);
  }
`

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const ItemInfo = styled.div`
  flex: 1;
`

const ItemName = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const ItemDetails = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const ItemPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`

const ItemActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${props => props.theme.spacing[3]};
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    width: 100%;
  }
`

const ItemActionButton = styled(Button)`
  font-size: ${props => props.theme.fontSizes.sm};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  white-space: nowrap;
  flex: 1;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.semibold};
  
  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }
  
  ${props => props.theme.media.mobile} {
    width: 100%;
  }
`

const OrderSummary = styled(Card)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: ${props => props.theme.spacing[6]};
  height: fit-content;
  position: sticky;
  top: ${props => props.theme.spacing[8]};
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[3]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: ${props => props.theme.fontWeights.bold};
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.white};
  }
`

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.gray[400]};
`

const SummaryValue = styled.span`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const AddressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const AddressCard = styled.div`
  padding: ${props => props.theme.spacing[4]};
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
`

const AddressTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const AddressText = styled.div`
  color: ${props => props.theme.colors.gray[300]};
  line-height: 1.6;
`

const ErrorMessage = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.lg};
  margin: ${props => props.theme.spacing[8]} 0;
`

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  // Récupérer les détails de la commande
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated || !id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await orderAPI.getOrderById(id)
        
        if (response.data.success) {
          setOrder(response.data.data)
        } else {
          setError('Erreur lors du chargement de la commande')
        }
      } catch (err) {
        console.error('❌ Erreur:', err)
        setError(err.response?.data?.message || 'Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrderDetails()
  }, [id, isAuthenticated])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'LIVREE': return <FiCheckCircle size={18} />
      case 'EXPEDIEE': return <FiTruck size={18} />
      case 'EN_PREPARATION': return <FiClock size={18} />
      case 'CONFIRMEE': return <FiCheckCircle size={18} />
      case 'EN_ATTENTE': return <FiClock size={18} />
      case 'ANNULEE': return <FiPackage size={18} />
      default: return <FiClock size={18} />
    }
  }


  const getStatusText = (status) => {
    switch (status) {
      case 'LIVREE': return 'Livrée'
      case 'EXPEDIEE': return 'Expédiée'
      case 'EN_PREPARATION': return 'En préparation'
      case 'CONFIRMEE': return 'Confirmée'
      case 'EN_ATTENTE': return 'En attente'
      case 'ANNULEE': return 'Annulée'
      default: return status
    }
  }

  if (isLoading) {
    return (
      <OrderDetailContainer>
        <Container>
          <PageLoading text="Chargement des détails de la commande..." />
        </Container>
      </OrderDetailContainer>
    )
  }

  if (error) {
    return (
      <OrderDetailContainer>
        <Container>
          <ErrorMessage>{error}</ErrorMessage>
          <Button onClick={() => navigate('/orders')}>
            Retour aux commandes
          </Button>
        </Container>
      </OrderDetailContainer>
    )
  }

  if (!order) {
    return (
      <OrderDetailContainer>
        <Container>
          <ErrorMessage>Commande non trouvée</ErrorMessage>
          <Button onClick={() => navigate('/orders')}>
            Retour aux commandes
          </Button>
        </Container>
      </OrderDetailContainer>
    )
  }

  return (
    <OrderDetailContainer>
      <Container>
        <BackButton
          onClick={() => navigate('/orders')}
          variant="outline"
          size="sm"
        >
          <FiArrowLeft size={16} />
          Retour aux commandes
        </BackButton>

        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Détails de la commande
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {order.numero}
          </PageSubtitle>
        </PageHeader>

        <OrderGrid>
          <OrderInfo>
            {/* Informations générales */}
            <OrderCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <OrderHeader>
                <div>
                  <OrderNumber>Commande {order.numero}</OrderNumber>
                  <OrderDate>
                    <FiCalendar size={16} />
                    {formatDate(order.createdAt)}
                  </OrderDate>
                </div>
                <StatusBadge
                  $status={order.statut}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {getStatusIcon(order.statut)}
                  {getStatusText(order.statut)}
                </StatusBadge>
              </OrderHeader>

              {/* Numéro de suivi */}
              {order.numeroSuivi && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                    <FiTruck size={16} />
                    <span style={{ fontWeight: '500' }}>Numéro de suivi:</span>
                    <span style={{ fontFamily: 'monospace' }}>{order.numeroSuivi}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FiFileText size={16} />
                    <span style={{ fontWeight: '500', color: '#fff' }}>Notes:</span>
                  </div>
                  <p style={{ color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>"{order.notes}"</p>
                </div>
              )}
            </OrderCard>

            {/* Articles commandés */}
            <OrderCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SectionTitle>
                <FiShoppingCart size={20} />
                Articles commandés
              </SectionTitle>
              
              {/* Section explicative pour certificats et garanties */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                style={{
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                  <FiAward size={20} color="#3b82f6" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
                      🏆 Certificat d'authenticité
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: '1.5' }}>
                      Créé automatiquement lors de votre commande. Document officiel prouvant l'authenticité de votre produit.
                      <br /><strong style={{ color: '#3b82f6', marginTop: '0.5rem', display: 'block' }}>📍 Pour accéder à vos certificats :</strong>
                      <span style={{ fontSize: '0.8125rem' }}>1. Cliquez sur "Mes Certificats" dans le menu utilisateur (en haut à droite) OU</span>
                      <span style={{ fontSize: '0.8125rem', display: 'block', marginTop: '0.25rem' }}>2. Utilisez le bouton "Mes Certificats" ci-dessous sur chaque produit</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                  <FiShield size={20} color="#3b82f6" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>
                      🛡️ Garantie Fabricant
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: '1.5' }}>
                      Créée automatiquement avec votre commande. Protection incluse contre les défauts de fabrication (2 ans).
                      <br /><strong style={{ color: '#3b82f6', marginTop: '0.5rem', display: 'block' }}>📍 Pour accéder à vos garanties :</strong>
                      <span style={{ fontSize: '0.8125rem' }}>1. Cliquez sur "Mes Garanties" dans le menu utilisateur (en haut à droite) OU</span>
                      <span style={{ fontSize: '0.8125rem', display: 'block', marginTop: '0.25rem' }}>2. Utilisez le bouton "Mes Garanties" ci-dessous sur chaque produit</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <ItemsList>
                {order.items?.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <ItemCard>
                      <ItemImage 
                        src={getImageUrl(item.produit?.images?.[0]?.url || '/assets/images/analog-watch-1845547_1280.jpg')} 
                        alt={item.produit?.nom || 'Produit'} 
                      />
                      <ItemInfo>
                        <ItemName>{item.produit?.nom || item.nomProduit}</ItemName>
                        <ItemDetails>
                          <span>Quantité: {item.quantite}</span>
                          <span>Réf: {item.produit?.reference}</span>
                        </ItemDetails>
                        <ItemActions>
                          <ItemActionButton
                            onClick={() => navigate('/certificates')}
                          >
                            <FiAward size={16} style={{ marginRight: '0.5rem' }} />
                            {item.certificat ? 'Voir Certificat' : 'Mes Certificats'}
                          </ItemActionButton>
                          <ItemActionButton
                            onClick={() => navigate('/warranties')}
                          >
                            <FiShield size={16} style={{ marginRight: '0.5rem' }} />
                            {item.garantie ? 'Voir Garantie' : 'Mes Garanties'}
                          </ItemActionButton>
                        </ItemActions>
                      </ItemInfo>
                      <ItemPrice>{formatPrice(item.prixUnitaire)}</ItemPrice>
                    </ItemCard>
                  </motion.div>
                ))}
              </ItemsList>
            </OrderCard>

            {/* Adresses */}
            <OrderCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SectionTitle>
                <FiMapPin size={20} />
                Adresses
              </SectionTitle>
              <AddressSection>
                <AddressCard>
                  <AddressTitle>
                    <FiTruck size={16} />
                    Adresse de livraison
                  </AddressTitle>
                  <AddressText>
                    {order.adresseLivraisonPrenom} {order.adresseLivraisonNom}<br />
                    {order.adresseLivraisonRue}<br />
                    {order.adresseLivraisonCodePostal} {order.adresseLivraisonVille}<br />
                    {order.adresseLivraisonPays}<br />
                    <FiPhone size={14} style={{ marginRight: '0.5rem' }} />
                    {order.adresseLivraisonTelephone}
                  </AddressText>
                </AddressCard>

                <AddressCard>
                  <AddressTitle>
                    <FiCreditCard size={16} />
                    Adresse de facturation
                  </AddressTitle>
                  <AddressText>
                    {order.adresseFacturationPrenom} {order.adresseFacturationNom}<br />
                    {order.adresseFacturationRue}<br />
                    {order.adresseFacturationCodePostal} {order.adresseFacturationVille}<br />
                    {order.adresseFacturationPays}
                  </AddressText>
                </AddressCard>
              </AddressSection>
            </OrderCard>
          </OrderInfo>

          {/* Résumé de la commande */}
          <OrderSummary
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SectionTitle>
              <FiTag size={20} />
              Résumé de la commande
            </SectionTitle>
            
            <SummaryRow>
              <SummaryLabel>Sous-total</SummaryLabel>
              <SummaryValue>{formatPrice(order.sousTotal)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Frais de livraison</SummaryLabel>
              <SummaryValue>
                {order.fraisLivraison > 0 ? formatPrice(order.fraisLivraison) : 'Gratuit'}
              </SummaryValue>
            </SummaryRow>
            
            {order.reduction > 0 && (
              <SummaryRow>
                <SummaryLabel>Réduction</SummaryLabel>
                <SummaryValue>-{formatPrice(order.reduction)}</SummaryValue>
              </SummaryRow>
            )}
            
            <SummaryRow>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{formatPrice(order.total)}</SummaryValue>
            </SummaryRow>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FiCreditCard size={16} />
                <span style={{ fontWeight: '500', color: '#fff' }}>Méthode de paiement</span>
              </div>
              <div style={{ color: '#9ca3af' }}>
                {order.methodePaiement === 'CARTE' ? 'Carte bancaire' : 
                 order.methodePaiement === 'PAYPAL' ? 'PayPal' : 
                 order.methodePaiement}
              </div>
            </div>
          </OrderSummary>
        </OrderGrid>
      </Container>
    </OrderDetailContainer>
  )
}

export default OrderDetail
