import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiCookie, FiSettings, FiBarChart, FiTarget } from 'react-icons/fi'

const CookiesContainer = styled.div`
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
  
  strong {
    color: ${props => props.theme.colors.white};
    font-weight: ${props => props.theme.fontWeights.semibold};
  }
`

const CookieTypeCard = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.white};
    margin-bottom: ${props => props.theme.spacing[3]};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing[2]};
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
  
  p {
    color: ${props => props.theme.colors.gray[300]};
    margin-bottom: ${props => props.theme.spacing[3]};
    line-height: 1.6;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: ${props => props.theme.spacing[2]} 0 0 0;
  }
  
  li {
    color: ${props => props.theme.colors.gray[400]};
    font-size: ${props => props.theme.fontSizes.sm};
    padding-left: ${props => props.theme.spacing[4]};
    position: relative;
    margin-bottom: ${props => props.theme.spacing[1]};
    
    &::before {
      content: '→';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary};
    }
  }
`

const HighlightBox = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin: ${props => props.theme.spacing[6]} 0;
  text-align: center;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.white};
    margin-bottom: ${props => props.theme.spacing[3]};
  }
  
  p {
    color: ${props => props.theme.colors.gray[300]};
    margin-bottom: 0;
  }
`

const Cookies = () => {
  return (
    <CookiesContainer>
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Politique de Cookies
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
            <SectionTitle>
              <FiCookie size={24} />
              Qu'est-ce qu'un Cookie ?
            </SectionTitle>
            <Paragraph>
              Un cookie est un petit fichier texte déposé sur votre ordinateur, tablette ou smartphone 
              lors de votre visite sur notre site internet. Les cookies nous permettent de reconnaître 
              votre appareil et d'améliorer votre expérience de navigation.
            </Paragraph>
            <Paragraph>
              Nous utilisons différents types de cookies pour optimiser les fonctionnalités de notre 
              site, analyser son utilisation et vous proposer du contenu personnalisé.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Types de Cookies Utilisés</SectionTitle>
            
            <CookieTypeCard>
              <h3>
                <FiSettings size={20} />
                Cookies Essentiels
              </h3>
              <p>
                Ces cookies sont <strong>indispensables</strong> au fonctionnement du site. 
                Ils vous permettent de naviguer et d'utiliser les fonctionnalités de base comme 
                le panier d'achat et l'authentification.
              </p>
              <p><strong>Durée de conservation :</strong> Session</p>
              <p><strong>Exemples :</strong></p>
              <ul>
                <li>Cookie de session utilisateur</li>
                <li>Cookie de panier d'achat</li>
                <li>Cookie de sécurité</li>
              </ul>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>
                <FiBarChart size={20} />
                Cookies Analytiques
              </h3>
              <p>
                Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site. 
                Ils collectent des informations anonymes sur les pages visitées, le temps passé 
                et les erreurs rencontrées.
              </p>
              <p><strong>Durée de conservation :</strong> 13 mois</p>
              <p><strong>Services utilisés :</strong></p>
              <ul>
                <li>Google Analytics (analyse d'audience)</li>
                <li>Hotjar (analyse comportementale)</li>
              </ul>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>
                <FiTarget size={20} />
                Cookies Marketing
              </h3>
              <p>
                Ces cookies sont utilisés pour vous proposer des publicités pertinentes et 
                personnalisées. Ils permettent également de mesurer l'efficacité de nos campagnes 
                marketing.
              </p>
              <p><strong>Durée de conservation :</strong> 13 mois</p>
              <p><strong>Services utilisés :</strong></p>
              <ul>
                <li>Google Ads (publicité ciblée)</li>
                <li>Facebook Pixel (retargeting)</li>
                <li>Instagram Ads (publicité sociale)</li>
              </ul>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>
                <FiSettings size={20} />
                Cookies de Préférences
              </h3>
              <p>
                Ces cookies mémorisent vos préférences (langue, devise, filtres) pour vous offrir 
                une expérience personnalisée lors de vos prochaines visites.
              </p>
              <p><strong>Durée de conservation :</strong> 12 mois</p>
              <p><strong>Exemples :</strong></p>
              <ul>
                <li>Préférences de langue</li>
                <li>Préférences d'affichage</li>
                <li>Historique de navigation</li>
              </ul>
            </CookieTypeCard>
          </Section>

          <Section>
            <SectionTitle>Gestion des Cookies</SectionTitle>
            
            <Paragraph>
              Vous pouvez à tout moment choisir de désactiver les cookies via les paramètres de 
              votre navigateur. Voici comment procéder selon votre navigateur :
            </Paragraph>

            <CookieTypeCard>
              <h3>Google Chrome</h3>
              <p>
                Paramètres → Confidentialité et sécurité → Cookies et autres données de sites → 
                Gérer les cookies
              </p>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>Mozilla Firefox</h3>
              <p>
                Options → Vie privée et sécurité → Cookies et données de sites → 
                Gérer les données
              </p>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>Safari</h3>
              <p>
                Préférences → Confidentialité → Gérer les données de site web
              </p>
            </CookieTypeCard>

            <CookieTypeCard>
              <h3>Microsoft Edge</h3>
              <p>
                Paramètres → Cookies et autorisations de site → Gérer et supprimer les cookies
              </p>
            </CookieTypeCard>

            <Paragraph>
              <strong>Attention :</strong> La désactivation de certains cookies peut affecter le 
              fonctionnement du site et limiter votre expérience utilisateur.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Cookies Tiers</SectionTitle>
            <Paragraph>
              Nous utilisons des services tiers qui peuvent déposer leurs propres cookies :
            </Paragraph>
            <Paragraph>
              • <strong>Google Analytics :</strong> Pour analyser l'audience et le comportement des visiteurs<br />
              • <strong>Google Ads :</strong> Pour afficher des publicités pertinentes<br />
              • <strong>Facebook Pixel :</strong> Pour mesurer l'efficacité de nos campagnes sur Facebook et Instagram<br />
              • <strong>Stripe :</strong> Pour sécuriser les paiements en ligne
            </Paragraph>
            <Paragraph>
              Ces services ont leurs propres politiques de confidentialité que nous vous invitons à consulter.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Durée de Conservation</SectionTitle>
            <Paragraph>
              Les cookies ont des durées de vie variables selon leur type :
            </Paragraph>
            <Paragraph>
              • <strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur<br />
              • <strong>Cookies persistants :</strong> Conservés entre 1 et 13 mois selon leur fonction<br />
              • <strong>Cookies tiers :</strong> Durée définie par le service tiers
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Vos Droits</SectionTitle>
            <Paragraph>
              Conformément au RGPD, vous disposez des droits suivants concernant les cookies :
            </Paragraph>
            <Paragraph>
              • <strong>Droit d'accès :</strong> Connaître les cookies utilisés<br />
              • <strong>Droit d'opposition :</strong> Refuser certains cookies (sauf essentiels)<br />
              • <strong>Droit de retrait :</strong> Supprimer les cookies à tout moment<br />
              • <strong>Droit de modification :</strong> Changer vos préférences
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Modifications</SectionTitle>
            <Paragraph>
              Nous nous réservons le droit de modifier cette politique de cookies à tout moment 
              pour refléter les changements dans nos pratiques ou pour des raisons légales. 
              La date de dernière mise à jour est indiquée en haut de cette page.
            </Paragraph>
          </Section>

          <HighlightBox>
            <h3>Questions sur les Cookies ?</h3>
            <p>
              Pour toute question concernant notre utilisation des cookies, contactez-nous :<br />
              <a href="mailto:privacy@luxetime.fr" style={{ color: '#d4af37' }}>privacy@luxetime.fr</a> | 
              <a href="tel:+33142567890" style={{ color: '#d4af37', marginLeft: '8px' }}>+33 1 42 56 78 90</a>
            </p>
          </HighlightBox>
        </Content>
      </Container>
    </CookiesContainer>
  )
}

export default Cookies
