import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ContactContainer = styled.div`
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

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const ContactForm = styled(Card)`
  padding: ${props => props.theme.spacing[8]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
`

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing[4]};
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes.base};
  resize: vertical;
  transition: all ${props => props.theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.bold};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
  }
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const InfoCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(212, 175, 55, 0.4);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
  }
`

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1));
  border: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
`

const InfoTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0;
`

const InfoContent = styled.div`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.base};
  line-height: 1.6;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.base};
    
    &:hover {
      color: #f4d03f;
    }
  }
`

const MapSection = styled.div`
  margin-top: ${props => props.theme.spacing[12]};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.2);
  height: 400px;
  background: rgba(255, 255, 255, 0.02);
  position: relative;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
    filter: grayscale(0.3) invert(0.9);
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  margin-top: ${props => props.theme.spacing[4]};
`

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[300]};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.black};
    transform: translateY(-2px);
  }
`

const HoursGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing[2]};
`

const HourRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[2]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`

const DayLabel = styled.span`
  color: ${props => props.theme.colors.gray[400]};
`

const TimeLabel = styled.span`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Nom requis'
    if (!formData.email.trim()) newErrors.email = 'Email requis'
    if (!formData.subject.trim()) newErrors.subject = 'Sujet requis'
    if (!formData.message.trim()) newErrors.message = 'Message requis'
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simuler l'envoi du message
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      toast.error('Erreur lors de l\'envoi du message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContactContainer>
      <Container>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contactez-nous
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions sur nos montres de luxe.
          </PageSubtitle>
        </PageHeader>

        <ContentGrid>
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ContactForm>
              <FormTitle>Envoyez-nous un message</FormTitle>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    label="Nom complet"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Input
                    label="Téléphone (optionnel)"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Input
                    label="Sujet"
                    placeholder="Objet de votre message"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    error={errors.subject}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '0.5rem', 
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    Message *
                  </label>
                  <TextArea
                    placeholder="Décrivez votre demande en détail..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                  />
                  {errors.message && (
                    <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {errors.message}
                    </div>
                  )}
                </FormGroup>
                
                <SubmitButton
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <FiSend size={18} />
                      Envoyer le message
                    </>
                  )}
                </SubmitButton>
              </form>
            </ContactForm>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ContactInfo>
              {/* Adresse */}
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <FiMapPin size={24} />
                  </InfoIcon>
                  <InfoTitle>Notre boutique</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  123 Avenue des Champs-Élysées<br />
                  75008 Paris, France
                </InfoContent>
              </InfoCard>

              {/* Téléphone */}
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <FiPhone size={24} />
                  </InfoIcon>
                  <InfoTitle>Téléphone</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <a href="tel:+33142567890">+33 1 42 56 78 90</a><br />
                  Du lundi au samedi<br />
                  10h00 - 19h00
                </InfoContent>
              </InfoCard>

              {/* Email */}
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <FiMail size={24} />
                  </InfoIcon>
                  <InfoTitle>Email</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <a href="mailto:contact@luxetime.fr">contact@luxetime.fr</a><br />
                  <a href="mailto:vip@luxetime.fr">vip@luxetime.fr</a> (Service VIP)
                </InfoContent>
                <SocialLinks>
                  <SocialLink href="https://www.instagram.com/luxetime.paris" target="_blank" rel="noopener noreferrer" title="Suivez-nous sur Instagram">
                    <FiInstagram size={20} />
                  </SocialLink>
                  <SocialLink href="https://www.facebook.com/luxetime.paris" target="_blank" rel="noopener noreferrer" title="Rejoignez-nous sur Facebook">
                    <FiFacebook size={20} />
                  </SocialLink>
                  <SocialLink href="https://twitter.com/luxetime_paris" target="_blank" rel="noopener noreferrer" title="Suivez-nous sur Twitter">
                    <FiTwitter size={20} />
                  </SocialLink>
                </SocialLinks>
              </InfoCard>

              {/* Horaires */}
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <FiClock size={24} />
                  </InfoIcon>
                  <InfoTitle>Horaires d'ouverture</InfoTitle>
                </InfoHeader>
                <InfoContent>
                  <HoursGrid>
                    <HourRow>
                      <DayLabel>Lundi - Vendredi</DayLabel>
                      <TimeLabel>10h00 - 19h00</TimeLabel>
                    </HourRow>
                    <HourRow>
                      <DayLabel>Samedi</DayLabel>
                      <TimeLabel>10h00 - 20h00</TimeLabel>
                    </HourRow>
                    <HourRow>
                      <DayLabel>Dimanche</DayLabel>
                      <TimeLabel>Fermé</TimeLabel>
                    </HourRow>
                  </HoursGrid>
                </InfoContent>
              </InfoCard>
            </ContactInfo>
          </motion.div>
        </ContentGrid>

        {/* Carte Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <MapSection>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.2916878892484!2d2.3059728156744995!3d48.86982097928888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fec70fb1d8f%3A0x40b82c3688c9460!2sChamps-%C3%89lys%C3%A9es%2C%2075008%20Paris!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localisation Luxetime"
            />
          </MapSection>
        </motion.div>
      </Container>
    </ContactContainer>
  )
}

export default Contact