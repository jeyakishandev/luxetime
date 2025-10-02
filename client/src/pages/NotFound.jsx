import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.spacing[8]} 0;
`

const NotFoundContent = styled.div`
  max-width: 600px;
  padding: 0 ${props => props.theme.spacing[4]};
`

const NotFoundCode = styled.h1`
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin: 0;
  line-height: 1;
`

const NotFoundTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: ${props => props.theme.spacing[4]} 0;
`

const NotFoundText = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[8]};
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundCode>404</NotFoundCode>
        <NotFoundTitle>Page non trouvée</NotFoundTitle>
        <NotFoundText>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
          Retournez à l'accueil pour continuer votre navigation.
        </NotFoundText>
        
        <ButtonGroup>
          <Button as={Link} to="/" size="lg">
            <FiHome size={20} />
            Retour à l'accueil
          </Button>
          <Button as={Link} to="/products" variant="outline" size="lg">
            <FiArrowLeft size={20} />
            Voir nos montres
          </Button>
        </ButtonGroup>
      </NotFoundContent>
    </NotFoundContainer>
  )
}

export default NotFound
