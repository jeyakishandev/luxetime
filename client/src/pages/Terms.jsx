import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiFileText, FiPackage, FiCreditCard, FiRefreshCw, FiShield } from 'react-icons/fi'

const TermsContainer = styled.div`
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

const SubTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.white};
  margin: ${props => props.theme.spacing[4]} 0 ${props => props.theme.spacing[3]} 0;
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

const HighlightBox = styled.div`
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[4]};
  margin: ${props => props.theme.spacing[4]} 0;
`

const Terms = () => {
  return (
    <TermsContainer>
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Conditions Générales de Vente
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
              <FiFileText size={24} />
              Article 1 - Objet
            </SectionTitle>
            <Paragraph>
              Les présentes conditions générales de vente (CGV) régissent les ventes de montres de luxe 
              et accessoires horlogers effectuées par Luxetime, société par actions simplifiée au capital 
              de 100 000 euros, immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège 
              social est situé au 123 Avenue des Champs-Élysées, 75008 Paris, France.
            </Paragraph>
            <Paragraph>
              Toute commande passée sur notre site internet <strong>www.luxetime.fr</strong> implique 
              l'acceptation sans réserve des présentes CGV.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiPackage size={24} />
              Article 2 - Produits
            </SectionTitle>
            
            <SubTitle>2.1 Authenticité</SubTitle>
            <Paragraph>
              Tous nos produits sont <strong>100% authentiques</strong> et proviennent directement des 
              marques ou de distributeurs agréés. Chaque montre est accompagnée de :
            </Paragraph>
            <List>
              <ListItem>Son certificat d'authenticité original</ListItem>
              <ListItem>Sa boîte d'origine et ses documents</ListItem>
              <ListItem>Sa garantie internationale du fabricant</ListItem>
              <ListItem>Un certificat d'expertise Luxetime</ListItem>
            </List>

            <SubTitle>2.2 Descriptions</SubTitle>
            <Paragraph>
              Nous apportons le plus grand soin à la description de nos produits. Les photographies 
              sont contractuelles et représentent fidèlement les articles. Toutefois, de légères 
              variations de couleur peuvent apparaître selon votre écran.
            </Paragraph>

            <SubTitle>2.3 Disponibilité</SubTitle>
            <Paragraph>
              Nos offres sont valables dans la limite des stocks disponibles. En cas d'indisponibilité 
              d'un article après passation de votre commande, nous vous en informerons dans les plus 
              brefs délais et vous proposerons un remboursement intégral.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiCreditCard size={24} />
              Article 3 - Prix et Paiement
            </SectionTitle>
            
            <SubTitle>3.1 Prix</SubTitle>
            <Paragraph>
              Les prix sont indiqués en euros (€) toutes taxes comprises (TTC), incluant la TVA française 
              au taux en vigueur. Les frais de livraison sont offerts pour toute commande supérieure à 100€.
            </Paragraph>
            <HighlightBox>
              <Paragraph style={{ marginBottom: 0 }}>
                <strong>Livraison gratuite</strong> pour les commandes supérieures à 100€<br />
                <strong>Frais de livraison :</strong> 15€ pour les commandes inférieures à 100€
              </Paragraph>
            </HighlightBox>

            <SubTitle>3.2 Moyens de Paiement</SubTitle>
            <Paragraph>
              Nous acceptons les moyens de paiement suivants :
            </Paragraph>
            <List>
              <ListItem>Carte bancaire (Visa, Mastercard, American Express)</ListItem>
              <ListItem>PayPal</ListItem>
              <ListItem>Virement bancaire (pour les montants supérieurs à 5 000€)</ListItem>
            </List>
            <Paragraph>
              Tous les paiements sont sécurisés via notre système de cryptage SSL. Nous ne conservons 
              aucune donnée bancaire sur nos serveurs.
            </Paragraph>

            <SubTitle>3.3 Validation de Commande</SubTitle>
            <Paragraph>
              Votre commande ne sera validée qu'après réception du paiement intégral. Pour les paiements 
              par virement, la commande sera expédiée dès réception des fonds sur notre compte.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiPackage size={24} />
              Article 4 - Livraison
            </SectionTitle>
            
            <SubTitle>4.1 Délais</SubTitle>
            <Paragraph>
              Les délais de livraison sont les suivants :
            </Paragraph>
            <List>
              <ListItem>France métropolitaine : 2 à 4 jours ouvrés</ListItem>
              <ListItem>Europe : 4 à 7 jours ouvrés</ListItem>
              <ListItem>International : 7 à 14 jours ouvrés</ListItem>
            </List>

            <SubTitle>4.2 Mode de Livraison</SubTitle>
            <Paragraph>
              Toutes nos montres sont expédiées en <strong>colis sécurisé avec assurance</strong> et 
              nécessitent une signature à la réception. Un numéro de suivi vous sera communiqué dès 
              l'expédition de votre commande.
            </Paragraph>

            <SubTitle>4.3 Responsabilité</SubTitle>
            <Paragraph>
              En cas de colis endommagé ou perdu, veuillez nous contacter immédiatement. Nous engagerons 
              les démarches nécessaires auprès du transporteur.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiRefreshCw size={24} />
              Article 5 - Droit de Rétractation
            </SectionTitle>
            
            <Paragraph>
              Conformément à la législation en vigueur, vous disposez d'un délai de <strong>14 jours</strong> 
              à compter de la réception de votre commande pour exercer votre droit de rétractation, 
              sans avoir à justifier de motifs ni à payer de pénalités.
            </Paragraph>

            <SubTitle>5.1 Conditions de Retour</SubTitle>
            <List>
              <ListItem>La montre doit être retournée dans son état d'origine</ListItem>
              <ListItem>Avec tous ses accessoires, boîte et documents</ListItem>
              <ListItem>Sans avoir été portée (sauf essayage)</ListItem>
              <ListItem>Les films de protection ne doivent pas avoir été retirés</ListItem>
            </List>

            <SubTitle>5.2 Procédure</SubTitle>
            <Paragraph>
              Pour exercer votre droit de rétractation, contactez-nous par email à 
              <strong style={{ marginLeft: '4px' }}>retour@luxetime.fr</strong> ou par téléphone au 
              <strong style={{ marginLeft: '4px' }}>+33 1 42 56 78 90</strong>. 
              Nous vous fournirons une étiquette de retour prépayée.
            </Paragraph>

            <SubTitle>5.3 Remboursement</SubTitle>
            <Paragraph>
              Le remboursement sera effectué dans un délai de <strong>14 jours</strong> suivant la 
              réception du produit retourné, par le même moyen de paiement que celui utilisé lors 
              de l'achat.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>
              <FiShield size={24} />
              Article 6 - Garanties
            </SectionTitle>
            
            <SubTitle>6.1 Garantie Constructeur</SubTitle>
            <Paragraph>
              Toutes nos montres neuves bénéficient de la <strong>garantie internationale du fabricant</strong>, 
              généralement de 2 à 5 ans selon les marques. Cette garantie couvre les défauts de fabrication 
              et de fonctionnement.
            </Paragraph>

            <SubTitle>6.2 Garantie Légale</SubTitle>
            <Paragraph>
              Vous bénéficiez également de la garantie légale de conformité (2 ans) et de la garantie 
              contre les vices cachés, conformément au Code de la consommation français.
            </Paragraph>

            <SubTitle>6.3 Service Après-Vente</SubTitle>
            <Paragraph>
              Pour toute demande de service après-vente, contactez-nous à 
              <strong style={{ marginLeft: '4px' }}>sav@luxetime.fr</strong>. 
              Nous vous mettrons en relation avec un centre de service agréé par la marque.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Article 7 - Propriété Intellectuelle</SectionTitle>
            <Paragraph>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos) est protégé par le 
              droit d'auteur et appartient à Luxetime ou à ses partenaires. Toute reproduction, 
              même partielle, est interdite sans autorisation préalable.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Article 8 - Protection des Données</SectionTitle>
            <Paragraph>
              Vos données personnelles sont traitées conformément à notre 
              <a href="/privacy" style={{ color: '#d4af37', marginLeft: '4px' }}>
                politique de confidentialité
              </a>
              . Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Article 9 - Litiges</SectionTitle>
            <Paragraph>
              En cas de litige, nous vous invitons à nous contacter en priorité pour trouver une 
              solution amiable. À défaut, vous pouvez recourir à la médiation de la consommation.
            </Paragraph>
            <Paragraph>
              Les présentes CGV sont soumises au droit français. Tout litige relève de la compétence 
              exclusive des tribunaux de Paris.
            </Paragraph>
          </Section>

          <HighlightBox>
            <Paragraph style={{ marginBottom: 0, textAlign: 'center' }}>
              <strong>Questions sur nos CGV ?</strong><br />
              Contactez-nous : <a href="mailto:contact@luxetime.fr" style={{ color: '#d4af37' }}>contact@luxetime.fr</a> | 
              <a href="tel:+33142567890" style={{ color: '#d4af37', marginLeft: '8px' }}>+33 1 42 56 78 90</a>
            </Paragraph>
          </HighlightBox>
        </Content>
      </Container>
    </TermsContainer>
  )
}

export default Terms
