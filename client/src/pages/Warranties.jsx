import React from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiShield, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { warrantyAPI } from '../services/api'
import { Card, PageLoading } from '../components/ui'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  padding: ${props => props.theme.spacing[8]} 0;
`

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
`

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const WarrantiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing[5]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[5]};
  }
`

const WarrantyCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid ${props => props.$isExpired ? 'rgba(239, 68, 68, 0.3)' : 'rgba(212, 175, 55, 0.2)'};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
  }
`

const WarrantyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[4]};
`

const WarrantyIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`

const WarrantyType = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
`

const StatusBadge = styled.div`
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.medium};
  background: ${props => props.$active ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.$active ? '#22c55e' : '#ef4444'};
  border: 1px solid ${props => props.$active ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
`

const ProductName = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const WarrantyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[300]};
`

const DaysRemaining = styled.div`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.$warning ? '#f59e0b' : props.theme.colors.primary};
`

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const getWarrantyTypeLabel = (type) => {
  const types = {
    'FABRICANT': 'Garantie Fabricant',
    'ETENDUE_3': 'Garantie Étendue 3 ans',
    'ETENDUE_5': 'Garantie Étendue 5 ans'
  }
  return types[type] || type
}

const Warranties = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery(
    'myWarranties',
    () => warrantyAPI.getMyWarranties(),
    {
      enabled: isAuthenticated,
      retry: 1
    }
  )

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (isLoading) {
    return (
      <Container>
        <Content>
          <PageLoading />
        </Content>
      </Container>
    )
  }

  if (error) {
    toast.error('Erreur lors du chargement des garanties')
    return null
  }

  const warranties = data?.data?.data || []

  return (
    <Container>
      <Content>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Mes Garanties
        </Title>

        {warranties.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WarrantyIcon style={{ margin: '0 auto 2rem' }}>
              <FiShield size={48} color="#d4af37" />
            </WarrantyIcon>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
              Aucune garantie
            </h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Vos garanties apparaîtront ici après vos commandes.
            </p>
          </EmptyState>
        ) : (
          <WarrantiesGrid>
            {warranties.map((warranty, index) => {
              const isExpired = warranty.estExpiree || false
              const daysRemaining = warranty.joursRestants || 0
              const isActive = warranty.estActive && !isExpired

              return (
                <motion.div
                  key={warranty.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <WarrantyCard $isExpired={isExpired}>
                    <WarrantyHeader>
                      <WarrantyIcon>
                        <FiShield size={24} />
                      </WarrantyIcon>
                      <StatusBadge $active={isActive}>
                        {isActive ? 'Active' : 'Expirée'}
                      </StatusBadge>
                    </WarrantyHeader>

                    <WarrantyType>
                      {getWarrantyTypeLabel(warranty.typeGarantie)}
                    </WarrantyType>

                    {warranty.commandeItem?.produit && (
                      <ProductName>
                        {warranty.commandeItem.produit.nom}
                      </ProductName>
                    )}

                    <WarrantyInfo>
                      <InfoRow>
                        <span>Durée</span>
                        <span>{warranty.dureeMois} mois</span>
                      </InfoRow>
                      <InfoRow>
                        <span>Date de début</span>
                        <span>{new Date(warranty.dateDebut).toLocaleDateString('fr-FR')}</span>
                      </InfoRow>
                      <InfoRow>
                        <span>Date de fin</span>
                        <span>{new Date(warranty.dateFin).toLocaleDateString('fr-FR')}</span>
                      </InfoRow>
                      {isActive && (
                        <InfoRow>
                          <span>Jours restants</span>
                          <DaysRemaining $warning={daysRemaining < 30}>
                            {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
                          </DaysRemaining>
                        </InfoRow>
                      )}
                    </WarrantyInfo>
                  </WarrantyCard>
                </motion.div>
              )
            })}
          </WarrantiesGrid>
        )}
      </Content>
    </Container>
  )
}

export default Warranties

