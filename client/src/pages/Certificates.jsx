import React from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiAward, FiDownload, FiCheckCircle, FiCalendar } from 'react-icons/fi'
import { certificateAPI } from '../services/api'
import { Card, Button, PageLoading } from '../components/ui'
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

const CertificatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing[6]};
`

const CertificateCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-4px);
  }
`

const CertificateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const CertificateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`

const CertificateNumber = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const ProductName = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const CertificateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[300]};
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

const Certificates = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery(
    'myCertificates',
    () => certificateAPI.getMyCertificates(),
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
    toast.error('Erreur lors du chargement des certificats')
    return null
  }

  const certificates = data?.data?.data || []

  return (
    <Container>
      <Content>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Mes Certificats d'Authenticité
        </Title>

        {certificates.length === 0 ? (
          <EmptyState
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>
              <FiAward size={48} color="#d4af37" />
            </EmptyIcon>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
              Aucun certificat d'authenticité
            </h2>
            <p style={{ color: '#888', marginBottom: '2rem' }}>
              Vos certificats d'authenticité apparaîtront ici après vos commandes.
            </p>
            <Button onClick={() => navigate('/orders')}>
              Voir mes commandes
            </Button>
          </EmptyState>
        ) : (
          <CertificatesGrid>
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CertificateCard>
                  <CertificateHeader>
                    <CertificateIcon>
                      <FiAward size={24} />
                    </CertificateIcon>
                    <div>
                      <CertificateNumber>
                        {cert.numeroCertificat}
                      </CertificateNumber>
                    </div>
                  </CertificateHeader>

                  {cert.commandeItem?.produit && (
                    <ProductName>
                      {cert.commandeItem.produit.nom}
                    </ProductName>
                  )}

                  <CertificateInfo>
                    <InfoRow>
                      <FiCalendar size={16} />
                      <span>Émis le {new Date(cert.dateEmission).toLocaleDateString('fr-FR')}</span>
                    </InfoRow>
                    <InfoRow>
                      <FiCheckCircle size={16} />
                      <span>Certificat authentique</span>
                    </InfoRow>
                  </CertificateInfo>

                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: Télécharger le PDF du certificat
                      toast.success('Téléchargement du certificat (bientôt disponible)')
                    }}
                  >
                    <FiDownload size={18} />
                    Télécharger le certificat
                  </Button>
                </CertificateCard>
              </motion.div>
            ))}
          </CertificatesGrid>
        )}
      </Content>
    </Container>
  )
}

export default Certificates

