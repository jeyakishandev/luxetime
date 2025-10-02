import React from 'react'
import styled from 'styled-components'
import { Card, Button } from '../components/ui'
import { FiCreditCard, FiTruck, FiShield } from 'react-icons/fi'

const CheckoutContainer = styled.div`
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
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const ComingSoon = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const ComingSoonIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[6]};
`

const ComingSoonTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const ComingSoonText = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[8]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[8]};
`

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[6]};
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[800]};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  line-height: 1.6;
  margin: 0;
`

const Checkout = () => {
  return (
    <CheckoutContainer>
      <Container>
        <PageHeader>
          <PageTitle>Finalisation de la commande</PageTitle>
        </PageHeader>

        <ComingSoon>
          <ComingSoonIcon>
            <FiCreditCard size={48} />
          </ComingSoonIcon>
          <ComingSoonTitle>Bientôt disponible</ComingSoonTitle>
          <ComingSoonText>
            La fonctionnalité de commande en ligne sera bientôt disponible. 
            En attendant, contactez-nous directement pour passer votre commande.
          </ComingSoonText>
        </ComingSoon>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiCreditCard size={24} />
            </FeatureIcon>
            <FeatureTitle>Paiement sécurisé</FeatureTitle>
            <FeatureDescription>
              Transactions protégées par les dernières technologies de sécurité bancaire
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiTruck size={24} />
            </FeatureIcon>
            <FeatureTitle>Livraison rapide</FeatureTitle>
            <FeatureDescription>
              Livraison sous 24-48h en France métropolitaine avec suivi en temps réel
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiShield size={24} />
            </FeatureIcon>
            <FeatureTitle>Garantie totale</FeatureTitle>
            <FeatureDescription>
              Garantie constructeur 2 ans + satisfaction client garantie
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Container>
    </CheckoutContainer>
  )
}

export default Checkout
