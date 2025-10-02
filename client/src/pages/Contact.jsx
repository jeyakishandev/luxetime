import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi'

const ContactContainer = styled.div`
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
  margin-bottom: ${props => props.theme.spacing[12]};
`

const PageTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  max-width: 600px;
  margin: 0 auto;
`

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const ContactForm = styled(Card)`
  padding: ${props => props.theme.spacing[8]};
`

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const ContactFormElement = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[2]};
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const InfoCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
`

const InfoTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[800]};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const InfoContent = styled.div`
  flex: 1;
`

const InfoLabel = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[1]} 0;
`

const InfoValue = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.white};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici vous pourriez envoyer le formulaire
    console.log('Formulaire envoyé:', formData)
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.')
  }

  return (
    <ContactContainer>
      <Container>
        <PageHeader>
          <PageTitle>Contactez-nous</PageTitle>
          <PageSubtitle>
            Notre équipe d'experts est à votre disposition pour vous conseiller 
            et répondre à toutes vos questions.
          </PageSubtitle>
        </PageHeader>

        <ContactGrid>
          <ContactForm>
            <FormTitle>Envoyez-nous un message</FormTitle>
            <ContactFormElement onSubmit={handleSubmit}>
              <FormRow>
                <Input
                  type="text"
                  name="nom"
                  label="Nom complet"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormRow>

              <Input
                type="tel"
                name="telephone"
                label="Téléphone (optionnel)"
                placeholder="+33 6 12 34 56 78"
                value={formData.telephone}
                onChange={handleChange}
              />

              <Input
                type="text"
                name="sujet"
                label="Sujet"
                placeholder="Objet de votre message"
                value={formData.sujet}
                onChange={handleChange}
                required
              />

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  color: '#e5e7eb', 
                  fontWeight: '500' 
                }}>
                  Message
                </label>
                <TextArea
                  name="message"
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <SubmitButton type="submit" size="lg">
                <FiSend size={20} />
                Envoyer le message
              </SubmitButton>
            </ContactFormElement>
          </ContactForm>

          <ContactInfo>
            <InfoCard>
              <InfoTitle>Informations de contact</InfoTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>
                    <FiMapPin size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Adresse</InfoLabel>
                    <InfoValue>
                      123 Avenue des Champs-Élysées<br />
                      75008 Paris, France
                    </InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiPhone size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Téléphone</InfoLabel>
                    <InfoValue>+33 1 42 86 12 34</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiMail size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Email</InfoLabel>
                    <InfoValue>contact@luxetime.fr</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoCard>

            <InfoCard>
              <InfoTitle>Horaires d'ouverture</InfoTitle>
              <InfoList>
                <InfoItem>
                  <InfoIcon>
                    <FiClock size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Lundi - Vendredi</InfoLabel>
                    <InfoValue>9h00 - 19h00</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiClock size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Samedi</InfoLabel>
                    <InfoValue>10h00 - 18h00</InfoValue>
                  </InfoContent>
                </InfoItem>

                <InfoItem>
                  <InfoIcon>
                    <FiClock size={20} />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Dimanche</InfoLabel>
                    <InfoValue>Fermé</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoList>
            </InfoCard>
          </ContactInfo>
        </ContactGrid>
      </Container>
    </ContactContainer>
  )
}

export default Contact
