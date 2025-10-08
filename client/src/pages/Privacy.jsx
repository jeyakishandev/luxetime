import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiShield, FiLock, FiEye, FiDatabase } from 'react-icons/fi'

const PrivacyContainer = styled.div`
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[3]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const LastUpdate = styled(motion.p)`
  text-align: center;
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Content = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]};
  }
`

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing[8]};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`

const Paragraph = styled.p`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.base};
  line-height: 1.8;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${props => props.theme.spacing[4]} 0;
`

const ListItem = styled.li`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.base};
  line-height: 1.8;
  margin-bottom: ${props => props.theme.spacing[2]};
  padding-left: ${props => props.theme.spacing[6]};
  position: relative;
  
  &::before {
    content: '•';
    position: absolute;
    left: ${props => props.theme.spacing[3]};
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
`

const ContactBox = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[6]};
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.white};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
  
  p {
    color: ${props => props.theme.colors.gray[300]};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: ${props => props.theme.fontWeights.medium};
    
    &:hover {
      color: #f4d03f;
    }
  }
`

const Privacy = () => {
  return (
    <PrivacyContainer>
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Politique de Confidentialité
        </PageTitle>
        
        <LastUpdate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Dernière mise à jour : 8 octobre 2024
        </LastUpdate>

        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Section>
            <Paragraph>
              Chez Luxetime, nous accordons une importance primordiale à la protection de vos données personnelles. 
              Cette politique de confidentialité décrit comment nous collectons, utilisons et protégeons vos informations.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiDatabase size={24} />
              Données Collectées
            </SectionTitle>
            <Paragraph>
              Nous collectons les informations suivantes lorsque vous utilisez notre site :
            </Paragraph>
            <List>
              <ListItem>Informations d'identification : nom, prénom, adresse email</ListItem>
              <ListItem>Informations de contact : numéro de téléphone, adresse postale</ListItem>
              <ListItem>Informations de commande : historique d'achats, préférences</ListItem>
              <ListItem>Données de navigation : adresse IP, cookies, pages visitées</ListItem>
              <ListItem>Informations de paiement : traitées de manière sécurisée par nos partenaires</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FiEye size={24} />
              Utilisation des Données
            </SectionTitle>
            <Paragraph>
              Vos données personnelles sont utilisées pour :
            </Paragraph>
            <List>
              <ListItem>Traiter et gérer vos commandes</ListItem>
              <ListItem>Vous contacter concernant vos achats</ListItem>
              <ListItem>Améliorer nos services et votre expérience utilisateur</ListItem>
              <ListItem>Vous envoyer des offres personnalisées (avec votre consentement)</ListItem>
              <ListItem>Assurer la sécurité de notre plateforme</ListItem>
              <ListItem>Respecter nos obligations légales</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FiLock size={24} />
              Protection des Données
            </SectionTitle>
            <Paragraph>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
            </Paragraph>
            <List>
              <ListItem>Chiffrement SSL/TLS pour toutes les transmissions de données</ListItem>
              <ListItem>Accès restreint aux données personnelles</ListItem>
              <ListItem>Serveurs sécurisés et régulièrement mis à jour</ListItem>
              <ListItem>Audits de sécurité réguliers</ListItem>
              <ListItem>Formation de notre personnel à la protection des données</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>
              <FiShield size={24} />
              Vos Droits
            </SectionTitle>
            <Paragraph>
              Conformément au RGPD, vous disposez des droits suivants :
            </Paragraph>
            <List>
              <ListItem>Droit d'accès : obtenir une copie de vos données personnelles</ListItem>
              <ListItem>Droit de rectification : corriger vos données inexactes</ListItem>
              <ListItem>Droit à l'effacement : demander la suppression de vos données</ListItem>
              <ListItem>Droit à la portabilité : recevoir vos données dans un format structuré</ListItem>
              <ListItem>Droit d'opposition : vous opposer au traitement de vos données</ListItem>
              <ListItem>Droit de limitation : demander la limitation du traitement</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>Cookies</SectionTitle>
            <Paragraph>
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos préférences de cookies 
              à tout moment via les paramètres de votre navigateur. Pour plus d'informations, consultez notre 
              <a href="/cookies" style={{ color: '#d4af37', marginLeft: '4px' }}>politique de cookies</a>.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Partage des Données</SectionTitle>
            <Paragraph>
              Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec :
            </Paragraph>
            <List>
              <ListItem>Nos prestataires de services (paiement, livraison, hébergement)</ListItem>
              <ListItem>Les autorités légales si requis par la loi</ListItem>
              <ListItem>Nos partenaires commerciaux (avec votre consentement explicite)</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>Conservation des Données</SectionTitle>
            <Paragraph>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
            </Paragraph>
            <List>
              <ListItem>Fournir nos services et traiter vos commandes</ListItem>
              <ListItem>Respecter nos obligations légales (3 ans pour les factures)</ListItem>
              <ListItem>Résoudre les litiges et faire respecter nos accords</ListItem>
            </List>
            <Paragraph>
              Vous pouvez demander la suppression de vos données à tout moment en nous contactant.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Modifications</SectionTitle>
            <Paragraph>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              Les modifications seront publiées sur cette page avec une date de mise à jour révisée. 
              Nous vous encourageons à consulter régulièrement cette page.
            </Paragraph>
          </Section>

          <ContactBox>
            <h3>Questions sur la Confidentialité ?</h3>
            <p>
              Pour toute question concernant cette politique ou pour exercer vos droits, 
              contactez notre délégué à la protection des données :
            </p>
            <p>
              Email : <a href="mailto:dpo@luxetime.fr">dpo@luxetime.fr</a><br />
              Téléphone : <a href="tel:+33142567890">+33 1 42 56 78 90</a><br />
              Adresse : 123 Avenue des Champs-Élysées, 75008 Paris, France
            </p>
          </ContactBox>
        </Content>
      </Container>
    </PrivacyContainer>
  )
}

export default Privacy
