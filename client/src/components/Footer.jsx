import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
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
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding: ${props => props.theme.spacing[12]} 0 ${props => props.theme.spacing[6]};
  margin-top: auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
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

const FooterTitle = styled(motion.h3)`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const FooterLink = styled(motion(Link))`
  color: ${props => props.theme.colors.gray[400]};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.normal};
  letter-spacing: 0.3px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: ${props => props.theme.spacing[1]} 0;
  position: relative;
  display: inline-block;
  
  &::before {
    content: '✦';
    position: absolute;
    left: -16px;
    opacity: 0;
    color: ${props => props.theme.colors.primary};
    font-size: 8px;
    transform: translateX(-4px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    color: ${props => props.theme.colors.white};
    padding-left: ${props => props.theme.spacing[3]};
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
    
    &::before {
      opacity: 1;
      transform: translateX(0);
    }
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

const SocialLink = styled(motion.a)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
    
    &::before {
      opacity: 1;
    }
    
    & > * {
      color: ${props => props.theme.colors.black};
    }
  }
`


const FooterBottom = styled.div`
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: ${props => props.theme.spacing[6]};
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
  font-size: ${props => props.theme.fontSizes.xs};
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: ${props => props.theme.colors.primary};
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      width: 100%;
    }
  }
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>

        <FooterGrid>
          <FooterSection>
            <FooterTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Luxetime
            </FooterTitle>
            <motion.p 
              style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Découvrez notre collection exclusive de montres de luxe. 
              Élégance et précision horlogère depuis 1952.
            </motion.p>
            <SocialLinks>
              <SocialLink 
                href="https://www.facebook.com/luxetime.paris" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Rejoignez-nous sur Facebook"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFacebook size={18} />
              </SocialLink>
              <SocialLink 
                href="https://twitter.com/luxetime_paris" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                title="Suivez-nous sur Twitter"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTwitter size={18} />
              </SocialLink>
              <SocialLink 
                href="https://www.instagram.com/luxetime.paris" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Suivez-nous sur Instagram"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiInstagram size={18} />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Navigation
            </FooterTitle>
            <FooterLinks>
              <FooterLink 
                to="/"
                whileHover={{ x: 4 }}
              >
                Accueil
              </FooterLink>
              <FooterLink 
                to="/products"
                whileHover={{ x: 4 }}
              >
                Montres
              </FooterLink>
              <FooterLink 
                to="/about"
                whileHover={{ x: 4 }}
              >
                À propos
              </FooterLink>
              <FooterLink 
                to="/contact"
                whileHover={{ x: 4 }}
              >
                Contact
              </FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Mon compte
            </FooterTitle>
            <FooterLinks>
              <FooterLink 
                to="/login"
                whileHover={{ x: 4 }}
              >
                Connexion
              </FooterLink>
              <FooterLink 
                to="/register"
                whileHover={{ x: 4 }}
              >
                Inscription
              </FooterLink>
              <FooterLink 
                to="/profile"
                whileHover={{ x: 4 }}
              >
                Mon profil
              </FooterLink>
              <FooterLink 
                to="/orders"
                whileHover={{ x: 4 }}
              >
                Mes commandes
              </FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Contact
            </FooterTitle>
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
