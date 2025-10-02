import React from 'react'
import styled from 'styled-components'
import { Card } from '../components/ui'
import { FiAward, FiUsers, FiClock, FiHeart } from 'react-icons/fi'

const AboutContainer = styled.div`
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

const HeroSection = styled.section`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[16]};
`

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[6]};
  line-height: 1.2;
`

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  color: ${props => props.theme.colors.gray[400]};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[16]};
`

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const SectionContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  align-items: center;
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const SectionText = styled.div`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  line-height: 1.8;
  
  p {
    margin-bottom: ${props => props.theme.spacing[4]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const SectionImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, ${props => props.theme.colors.gray[800]}, ${props => props.theme.colors.gray[700]});
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.lg};
  
  ${props => props.theme.media.mobile} {
    height: 300px;
  }
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[8]};
`

const ValueCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[8]};
`

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
`

const ValueTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const ValueDescription = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  line-height: 1.6;
  margin: 0;
`

const About = () => {
  return (
    <AboutContainer>
      <Container>
        <HeroSection>
          <HeroTitle>À propos de Luxetime</HeroTitle>
          <HeroSubtitle>
            Depuis 1952, Luxetime incarne l'excellence horlogère française, 
            alliant tradition artisanale et innovation moderne pour créer 
            des montres d'exception.
          </HeroSubtitle>
        </HeroSection>

        <Section>
          <SectionTitle>Notre Histoire</SectionTitle>
          <SectionContent>
            <SectionText>
              <p>
                Fondée en 1952 par Jean-Pierre Luxetime, notre maison horlogère 
                s'est construite sur des valeurs d'excellence et de passion pour 
                l'art du temps. Depuis plus de 70 ans, nous perpétuons un savoir-faire 
                artisanal unique, transmis de génération en génération.
              </p>
              <p>
                Chaque montre Luxetime est le fruit d'un travail minutieux, 
                alliant précision technique et esthétique raffinée. Nos maîtres 
                horlogers consacrent des centaines d'heures à la création de 
                chaque pièce, garantissant une qualité exceptionnelle.
              </p>
            </SectionText>
            <SectionImage>
              Image de l'atelier historique
            </SectionImage>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Notre Philosophie</SectionTitle>
          <SectionContent>
            <SectionImage>
              Image des valeurs
            </SectionImage>
            <SectionText>
              <p>
                Chez Luxetime, nous croyons que le temps est le plus précieux 
                des biens. C'est pourquoi chaque montre que nous créons est 
                conçue pour durer, pour traverser les générations et devenir 
                un héritage précieux.
              </p>
              <p>
                Notre engagement va au-delà de la simple vente. Nous créons 
                des liens durables avec nos clients, en leur offrant un service 
                personnalisé et une expertise inégalée dans le domaine de 
                l'horlogerie de luxe.
              </p>
            </SectionText>
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Nos Valeurs</SectionTitle>
          <ValuesGrid>
            <ValueCard>
              <ValueIcon>
                <FiAward size={32} />
              </ValueIcon>
              <ValueTitle>Excellence</ValueTitle>
              <ValueDescription>
                Chaque détail est soigneusement pensé et exécuté avec la plus grande précision, 
                garantissant une qualité exceptionnelle.
              </ValueDescription>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <FiUsers size={32} />
              </ValueIcon>
              <ValueTitle>Tradition</ValueTitle>
              <ValueDescription>
                Nous perpétuons un savoir-faire ancestral, transmis de maître 
                à apprenti depuis des générations.
              </ValueDescription>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <FiClock size={32} />
              </ValueIcon>
              <ValueTitle>Innovation</ValueTitle>
              <ValueDescription>
                Nous intégrons les dernières technologies tout en respectant 
                les techniques traditionnelles d'horlogerie.
              </ValueDescription>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <FiHeart size={32} />
              </ValueIcon>
              <ValueTitle>Passion</ValueTitle>
              <ValueDescription>
                Notre amour pour l'horlogerie se ressent dans chaque création, 
                chaque détail, chaque mouvement.
              </ValueDescription>
            </ValueCard>
          </ValuesGrid>
        </Section>
      </Container>
    </AboutContainer>
  )
}

export default About
