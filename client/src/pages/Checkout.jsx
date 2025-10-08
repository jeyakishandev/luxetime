import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Card } from '../components/ui'
import { FiCreditCard, FiShield, FiLock } from 'react-icons/fi'

const CheckoutContainer = styled.div`
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

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const ComingSoon = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  backdrop-filter: blur(20px);
`

const ComingSoonIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.fontSizes['3xl']};
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
`

const ComingSoonTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
  font-weight: ${props => props.theme.fontWeights.bold};
`

const ComingSoonText = styled.p`
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[6]};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`

const Checkout = () => {
  return (
    <CheckoutContainer>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Finaliser la Commande
        </Title>

        <ComingSoon
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ComingSoonIcon>
            <FiCreditCard size={48} />
          </ComingSoonIcon>
          <ComingSoonTitle>Bientôt disponible</ComingSoonTitle>
          <ComingSoonText>
            La fonctionnalité de paiement sera bientôt disponible. En attendant, vous pouvez continuer à explorer notre collection de montres de luxe.
          </ComingSoonText>
        </ComingSoon>
      </Container>
    </CheckoutContainer>
  )
}

export default Checkout