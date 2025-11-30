import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button, Card } from './ui'
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'

// ============================================
// STYLED COMPONENTS
// ============================================

const ErrorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 700px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  text-align: center;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const ErrorCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]};
  }
`

const IconContainer = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto ${props => props.theme.spacing[6]};
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(239, 68, 68, 0.3);
  
  ${props => props.theme.media.mobile} {
    width: 60px;
    height: 60px;
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`

const Icon = styled(FiAlertTriangle)`
  width: 40px;
  height: 40px;
  color: ${props => props.theme.colors.error};
  
  ${props => props.theme.media.mobile} {
    width: 30px;
    height: 30px;
  }
`

const Title = styled(motion.h1)`
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
  font-family: 'Playfair Display', serif;
`

const Description = styled(motion.p)`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.base};
    margin-bottom: ${props => props.theme.spacing[4]};
  }
`

const ErrorDetails = styled(motion.details)`
  text-align: left;
  margin-bottom: ${props => props.theme.spacing[6]};
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  
  summary {
    padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
    cursor: pointer;
    color: ${props => props.theme.colors.gray[300]};
    font-size: ${props => props.theme.fontSizes.sm};
    font-weight: ${props => props.theme.fontWeights.medium};
    user-select: none;
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: ${props => props.theme.colors.white};
    }
    
    &::-webkit-details-marker {
      display: none;
    }
    
    &::before {
      content: '▶';
      display: inline-block;
      margin-right: ${props => props.theme.spacing[2]};
      transition: transform 0.3s ease;
    }
  }
  
  &[open] summary::before {
    transform: rotate(90deg);
  }
`

const ErrorMessage = styled.pre`
  padding: ${props => props.theme.spacing[4]};
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(239, 68, 68, 0.2);
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.xs};
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  overflow-x: auto;
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  
  ${props => props.theme.media.mobile} {
    font-size: 10px;
    padding: ${props => props.theme.spacing[3]};
  }
`

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`

// ============================================
// ERROR BOUNDARY CLASS COMPONENT
// ============================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de fallback
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Logger l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // En production, on pourrait envoyer l'erreur à un service comme Sentry
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: errorInfo })
    // }
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personnalisée
      return (
        <ErrorContainer>
          <Container>
            <ErrorCard>
              <IconContainer
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <Icon />
              </IconContainer>
              
              <Title
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Oups ! Une erreur s'est produite
              </Title>
              
              <Description
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Désolé, quelque chose s'est mal passé. Ne vous inquiétez pas, nos équipes ont été notifiées.
                Vous pouvez essayer de recharger la page ou retourner à l'accueil.
              </Description>

              {/* Détails de l'erreur (développement uniquement) */}
              {(process.env.NODE_ENV === 'development' && this.state.error) && (
                <ErrorDetails
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <summary>Détails techniques (développement)</summary>
                  <ErrorMessage>
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </ErrorMessage>
                </ErrorDetails>
              )}
              
              <ButtonGroup
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  onClick={this.handleReset}
                  variant="primary"
                  size="lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiRefreshCw size={20} />
                  Réessayer
                </Button>
                
                <Button
                  as={Link}
                  to="/"
                  variant="outline"
                  size="lg"
                  onClick={this.handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiHome size={20} />
                  Retour à l'accueil
                </Button>
              </ButtonGroup>
            </ErrorCard>
          </Container>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

