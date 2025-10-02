import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
  color: ${props => props.theme.colors.white};
`

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: 1.2;
  color: ${props => props.theme.colors.primary};
`

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[8]};
  max-width: 600px;
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const Home = () => {
  return (
    <HomeContainer>
      <HeroTitle>Luxetime</HeroTitle>
      <HeroSubtitle>
        Élégance et Précision : Trouvez Votre Montre Idéale
      </HeroSubtitle>
      
      <ButtonGroup>
        <Button as={Link} to="/products" size="lg">
          Voir les collections
        </Button>
        <Button as={Link} to="/about" variant="outline" size="lg">
          En savoir plus
        </Button>
      </ButtonGroup>
    </HomeContainer>
  )
}

export default Home