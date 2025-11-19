import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Card } from '../components/ui'
import { FiAward, FiUsers, FiHeart, FiShield, FiTrendingUp, FiStar, FiGlobe, FiWatch } from 'react-icons/fi'
import { getImageUrl } from '../utils/format'

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  
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

const Section = styled.section`
  padding: ${props => props.theme.spacing[12]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[8]} 0;
  }
`

const HeroSection = styled(Section)`
  text-align: center;
  padding: ${props => props.theme.spacing[16]} 0 ${props => props.theme.spacing[12]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[12]} 0 ${props => props.theme.spacing[8]} 0;
  }
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.gray[300]};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const SectionTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[3]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
`

const SectionSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${props => props.theme.spacing[12]};
  line-height: 1.6;
`

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const StoryImage = styled(motion.div)`
  width: 100%;
  height: 500px;
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid rgba(212, 175, 55, 0.3);
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.6s ease, opacity 0.5s ease;
    opacity: ${props => props.loaded ? 1 : 0.7};
    display: block;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
    pointer-events: none;
    opacity: ${props => props.loaded ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  ${props => props.theme.media.mobile} {
    height: 300px;
  }
`

const StoryContent = styled(motion.div)`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.8;
  
  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.white};
    margin-bottom: ${props => props.theme.spacing[4]};
    
    &::before {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, ${props => props.theme.colors.primary}, transparent);
      margin-bottom: ${props => props.theme.spacing[3]};
    }
  }
  
  p {
    margin-bottom: ${props => props.theme.spacing[4]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const ValueCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-8px);
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
  }
`

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${props => props.theme.spacing[4]};
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  border: 2px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`

const ValueTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const ValueDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[400]};
  line-height: 1.6;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing[4]};
  }
`

const StatCard = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(212, 175, 55, 0.4);
  }
`

const StatNumber = styled.div`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[2]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[400]};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const TimelineSection = styled(Section)`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
`

const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, ${props => props.theme.colors.primary}, transparent);
    transform: translateX(-50%);
    
    ${props => props.theme.media.mobile} {
      left: 20px;
    }
  }
`

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  position: relative;
  
  &:nth-child(even) {
    .timeline-content {
      grid-column: 1;
      text-align: right;
    }
    
    .timeline-year {
      grid-column: 2;
      justify-self: start;
    }
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
    padding-left: ${props => props.theme.spacing[12]};
    
    &:nth-child(even) {
      .timeline-content {
        grid-column: 1;
        text-align: left;
      }
      
      .timeline-year {
        grid-column: 1;
        justify-self: start;
      }
    }
  }
`

const TimelineYear = styled.div`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-self: end;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
`

const TimelineContent = styled.div`
  h4 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.white};
    margin-bottom: ${props => props.theme.spacing[2]};
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.base};
    color: ${props => props.theme.colors.gray[400]};
    line-height: 1.6;
  }
`

const TimelineDot = styled.div`
  position: absolute;
  left: 50%;
  top: 20px;
  width: 16px;
  height: 16px;
  background: ${props => props.theme.colors.primary};
  border: 3px solid #0a0a0a;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 2;
  
  ${props => props.theme.media.mobile} {
    left: 20px;
  }
`

const About = () => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const imgRef = React.useRef(null)

  // Vérifier si l'image est déjà chargée (cache) et forcer l'affichage
  React.useEffect(() => {
    const checkImage = () => {
      if (imgRef.current) {
        if (imgRef.current.complete && imgRef.current.naturalHeight !== 0) {
          setImageLoaded(true)
        } else {
          // Forcer l'affichage après un court délai même si onLoad ne s'est pas déclenché
          const timeout = setTimeout(() => {
            setImageLoaded(true)
          }, 300)
          return () => clearTimeout(timeout)
        }
      }
    }
    // Vérifier immédiatement
    checkImage()
    // Vérifier aussi après un court délai
    const delayedCheck = setTimeout(() => {
      if (imgRef.current && !imageLoaded) {
        setImageLoaded(true)
      }
    }, 500)
    return () => clearTimeout(delayedCheck)
  }, [imageLoaded])

  const values = [
    {
      icon: <FiAward size={32} />,
      title: 'Excellence',
      description: 'Nous sélectionnons uniquement les montres les plus prestigieuses et authentiques.'
    },
    {
      icon: <FiShield size={32} />,
      title: 'Authenticité',
      description: 'Chaque montre est certifiée et garantie authentique par nos experts.'
    },
    {
      icon: <FiHeart size={32} />,
      title: 'Passion',
      description: 'Notre amour de l\'horlogerie guide chacune de nos décisions.'
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Service',
      description: 'Un accompagnement personnalisé pour chaque client, avant et après l\'achat.'
    }
  ]

  const stats = [
    { number: '15+', label: 'Années d\'expérience' },
    { number: '5000+', label: 'Clients satisfaits' },
    { number: '50+', label: 'Marques de luxe' },
    { number: '99%', label: 'Satisfaction client' }
  ]

  const timeline = [
    {
      year: '2008',
      title: 'La naissance',
      description: 'Fondation de Luxetime avec une vision : rendre l\'horlogerie de luxe accessible aux passionnés.'
    },
    {
      year: '2012',
      title: 'Expansion',
      description: 'Ouverture de notre première boutique sur les Champs-Élysées, devenant une référence parisienne.'
    },
    {
      year: '2016',
      title: 'Innovation',
      description: 'Lancement de notre plateforme e-commerce, permettant à nos clients du monde entier d\'accéder à nos collections.'
    },
    {
      year: '2020',
      title: 'Excellence reconnue',
      description: 'Obtention de la certification "Maison de Confiance" et partenariats exclusifs avec les plus grandes marques.'
    },
    {
      year: '2024',
      title: 'Aujourd\'hui',
      description: 'Leader dans l\'horlogerie de luxe, avec une communauté de plus de 5000 clients fidèles.'
    }
  ]

  return (
    <AboutContainer>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            L'Excellence Horlogère
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Depuis 2008, Luxetime est votre partenaire de confiance pour l'acquisition de montres de luxe authentiques. 
            Nous partageons votre passion pour l'horlogerie d'exception.
          </PageSubtitle>
        </Container>
      </HeroSection>

      {/* Story Section */}
      <Section>
        <Container>
          <StoryGrid>
            <StoryImage
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              loaded={imageLoaded}
            >
              <img 
                ref={imgRef}
                src={getImageUrl('/assets/images/horloger-artisan.jpg')} 
                alt="Artisan horloger travaillant sur une montre de luxe"
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                onLoad={() => {
                  setImageLoaded(true)
                  setImageError(false)
                }}
                onError={(e) => {
                  setImageError(true)
                  setImageLoaded(true) // Afficher quand même pour éviter le blocage
                  console.error('Erreur de chargement de l\'image horloger-artisan.jpg', e)
                  console.error('URL tentée:', getImageUrl('/assets/images/horloger-artisan.jpg'))
                }}
              />
              {imageError && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#d4af37',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  padding: '1rem'
                }}>
                  Image non disponible
                </div>
              )}
            </StoryImage>
            <StoryContent
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3>Notre Histoire</h3>
              <p>
                Tout a commencé en 2008, lorsque notre fondateur, passionné d'horlogerie depuis l'enfance, 
                a décidé de créer une maison qui allierait expertise, authenticité et service d'exception.
              </p>
              <p>
                Aujourd'hui, Luxetime est devenue une référence incontournable dans le monde de l'horlogerie 
                de luxe, reconnue pour son expertise, son authenticité et la qualité de son service client.
              </p>
              <p>
                Chaque montre que nous proposons est soigneusement sélectionnée, expertisée et certifiée 
                par nos horlogers qualifiés. Nous ne faisons aucun compromis sur la qualité et l'authenticité.
              </p>
            </StoryContent>
          </StoryGrid>
        </Container>
      </Section>

      {/* Values Section */}
      <Section>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4 }}
          >
            Nos Valeurs
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Les principes qui guident notre passion et notre engagement envers l'excellence
          </SectionSubtitle>
          
          <ValuesGrid>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ValueCard>
                  <ValueIcon>{value.icon}</ValueIcon>
                  <ValueTitle>{value.title}</ValueTitle>
                  <ValueDescription>{value.description}</ValueDescription>
                </ValueCard>
              </motion.div>
            ))}
          </ValuesGrid>

          {/* Stats */}
          <StatsGrid>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <StatCard>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              </motion.div>
            ))}
          </StatsGrid>
        </Container>
      </Section>

      {/* Timeline Section */}
      <TimelineSection>
        <Container>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4 }}
          >
            Notre Parcours
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            15 années d'excellence et d'innovation dans l'horlogerie de luxe
          </SectionSubtitle>

          <Timeline>
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <TimelineItem>
                  <TimelineDot />
                  <TimelineYear className="timeline-year">{item.year}</TimelineYear>
                  <TimelineContent className="timeline-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </TimelineContent>
                </TimelineItem>
              </motion.div>
            ))}
          </Timeline>
        </Container>
      </TimelineSection>

      {/* Final CTA Section */}
      <Section>
        <Container>
          <motion.div
            style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FiWatch size={64} color="#d4af37" style={{ marginBottom: '2rem' }} />
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#fff', 
              marginBottom: '1.5rem' 
            }}>
              Rejoignez Notre Communauté
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#9ca3af', 
              lineHeight: '1.8',
              marginBottom: '2rem'
            }}>
              Découvrez notre collection exclusive de montres de luxe et laissez-vous guider 
              par nos experts pour trouver la montre qui vous correspond.
            </p>
          </motion.div>
        </Container>
      </Section>
    </AboutContainer>
  )
}

export default About