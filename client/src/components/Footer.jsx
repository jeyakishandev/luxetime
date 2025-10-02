import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi'

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.gray[900]};
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
  padding: ${props => props.theme.spacing[8]} 0 ${props => props.theme.spacing[4]};
  margin-top: auto;
`

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const FooterTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0;
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const FooterLink = styled(Link)`
  color: ${props => props.theme.colors.gray[400]};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
`

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[800]};
  color: ${props => props.theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.black};
    transform: translateY(-2px);
  }
`

const FooterBottom = styled.div`
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
  padding-top: ${props => props.theme.spacing[4]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    text-align: center;
  }
`

const Copyright = styled.p`
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`

const LegalLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[2]};
  }
`

const LegalLink = styled(Link)`
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.sm};
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>Luxetime</FooterTitle>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Découvrez notre collection exclusive de montres de luxe. 
              Élégance et précision horlogère depuis 1952.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook">
                <FiFacebook size={18} />
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                <FiTwitter size={18} />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <FiInstagram size={18} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Navigation</FooterTitle>
            <FooterLinks>
              <FooterLink to="/">Accueil</FooterLink>
              <FooterLink to="/products">Montres</FooterLink>
              <FooterLink to="/about">À propos</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Mon compte</FooterTitle>
            <FooterLinks>
              <FooterLink to="/login">Connexion</FooterLink>
              <FooterLink to="/register">Inscription</FooterLink>
              <FooterLink to="/profile">Mon profil</FooterLink>
              <FooterLink to="/orders">Mes commandes</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <ContactInfo>
              <ContactItem>
                <FiMapPin size={16} />
                <span>123 Avenue des Champs-Élysées<br />75008 Paris, France</span>
              </ContactItem>
              <ContactItem>
                <FiPhone size={16} />
                <span>+33 1 42 86 12 34</span>
              </ContactItem>
              <ContactItem>
                <FiMail size={16} />
                <span>contact@luxetime.fr</span>
              </ContactItem>
            </ContactInfo>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © 2024 Luxetime. Tous droits réservés.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">Confidentialité</LegalLink>
            <LegalLink to="/terms">Conditions</LegalLink>
            <LegalLink to="/cookies">Cookies</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  )
}

export default Footer
