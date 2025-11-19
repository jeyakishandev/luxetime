import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiPhone, FiMapPin, FiShield, FiZap, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/format'

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
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
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const RegisterCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]};
  }
`

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Logo = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  overflow: hidden;
`

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[2]};
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  letter-spacing: -0.02em;
`

const Subtitle = styled(motion.p)`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.6;
`

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
`

const Label = styled.label`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const StyledInput = styled(Input)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`

const PasswordContainer = styled.div`
  position: relative;
`

const PasswordToggle = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[1]};
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const PasswordRequirements = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const RequirementTitle = styled.h4`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const RequirementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[1]};
`

const RequirementItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.valid ? props.theme.colors.success : props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.xs};
  transition: color ${props => props.theme.transitions.base};
`

const RegisterButton = styled(Button)`
  width: 100%;
  height: 56px;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  border: none;
  color: ${props => props.theme.colors.black};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
  margin: ${props => props.theme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`

const DividerText = styled.span`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const LoginLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    color: #f4d03f;
    transform: translateX(4px);
  }
`

const Features = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const FeaturesTitle = styled.h3`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: ${props => props.theme.spacing[4]};
  text-align: center;
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[3]};
  }
`

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${props => props.theme.spacing[2]};
`

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.fontSizes.lg};
`

const FeatureText = styled.span`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    adresseRue: '',
    adresseVille: '',
    adresseCodePostal: '',
    adressePays: 'France'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    return requirements
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis'
    }
    
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis'
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.telephone) {
      newErrors.telephone = 'Le téléphone est requis'
    } else if (!/^[0-9+\-\s()]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Le téléphone n\'est pas valide'
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else {
      const passwordRequirements = validatePassword(formData.password)
      if (!Object.values(passwordRequirements).every(req => req)) {
        newErrors.password = 'Le mot de passe ne respecte pas tous les critères'
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    if (!formData.adresseRue.trim()) {
      newErrors.adresseRue = 'L\'adresse est requise'
    }
    
    if (!formData.adresseVille.trim()) {
      newErrors.adresseVille = 'La ville est requise'
    }
    
    if (!formData.adresseCodePostal) {
      newErrors.adresseCodePostal = 'Le code postal est requis'
    } else if (!/^\d{5}$/.test(formData.adresseCodePostal)) {
      newErrors.adresseCodePostal = 'Le code postal doit contenir 5 chiffres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        adresseRue: formData.adresseRue,
        adresseVille: formData.adresseVille,
        adresseCodePostal: formData.adresseCodePostal,
        adressePays: formData.adressePays
      })
      toast.success('Inscription réussie ! Bienvenue chez Luxetime')
      navigate('/')
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      toast.error(error.response?.data?.message || 'Erreur d\'inscription')
    }
  }

  const passwordRequirements = validatePassword(formData.password)

  return (
    <RegisterContainer>
      <Container>
        <RegisterCard>
          <Header>
            <Logo
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <LogoImage 
                src={getImageUrl("/assets/images/ChatGPT Image 2 oct. 2025, 15_35_31.png")} 
                alt="Luxetime Logo" 
              />
            </Logo>
            
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Inscription
            </Title>
            
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Rejoignez la communauté Luxetime
            </Subtitle>
          </Header>

          <Form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FormGrid>
              <InputGroup>
                <Label>Nom *</Label>
                <StyledInput
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  value={formData.nom}
                  onChange={handleChange}
                  error={errors.nom}
                  icon={<FiUser />}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Prénom *</Label>
                <StyledInput
                  type="text"
                  name="prenom"
                  placeholder="Votre prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  error={errors.prenom}
                  icon={<FiUser />}
                  required
                />
              </InputGroup>
            </FormGrid>

            <InputGroup>
              <Label>Email *</Label>
              <StyledInput
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<FiMail />}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Téléphone *</Label>
              <StyledInput
                type="tel"
                name="telephone"
                placeholder="0123456789"
                value={formData.telephone}
                onChange={handleChange}
                error={errors.telephone}
                icon={<FiPhone />}
                required
              />
            </InputGroup>

            <FormGrid>
              <InputGroup>
                <Label>Mot de passe *</Label>
                <PasswordContainer>
                  <StyledInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordContainer>
                
                {formData.password && (
                  <PasswordRequirements>
                    <RequirementTitle>Critères du mot de passe :</RequirementTitle>
                    <RequirementList>
                      <RequirementItem valid={passwordRequirements.length}>
                        <FiCheck size={12} />
                        Au moins 8 caractères
                      </RequirementItem>
                      <RequirementItem valid={passwordRequirements.uppercase}>
                        <FiCheck size={12} />
                        Une majuscule
                      </RequirementItem>
                      <RequirementItem valid={passwordRequirements.lowercase}>
                        <FiCheck size={12} />
                        Une minuscule
                      </RequirementItem>
                      <RequirementItem valid={passwordRequirements.number}>
                        <FiCheck size={12} />
                        Un chiffre
                      </RequirementItem>
                      <RequirementItem valid={passwordRequirements.special}>
                        <FiCheck size={12} />
                        Un caractère spécial
                      </RequirementItem>
                    </RequirementList>
                  </PasswordRequirements>
                )}
              </InputGroup>

              <InputGroup>
                <Label>Confirmer le mot de passe *</Label>
                <PasswordContainer>
                  <StyledInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </PasswordContainer>
              </InputGroup>
            </FormGrid>

            <InputGroup>
              <Label>Adresse *</Label>
              <StyledInput
                type="text"
                name="adresseRue"
                placeholder="123 Avenue des Champs-Élysées"
                value={formData.adresseRue}
                onChange={handleChange}
                error={errors.adresseRue}
                icon={<FiMapPin />}
                required
              />
            </InputGroup>

            <FormGrid>
              <InputGroup>
                <Label>Ville *</Label>
                <StyledInput
                  type="text"
                  name="adresseVille"
                  placeholder="Paris"
                  value={formData.adresseVille}
                  onChange={handleChange}
                  error={errors.adresseVille}
                  icon={<FiMapPin />}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>Code postal *</Label>
                <StyledInput
                  type="text"
                  name="adresseCodePostal"
                  placeholder="75008"
                  value={formData.adresseCodePostal}
                  onChange={handleChange}
                  error={errors.adresseCodePostal}
                  icon={<FiMapPin />}
                  required
                />
              </InputGroup>
            </FormGrid>

            <RegisterButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Inscription...' : 'Créer mon compte'}
            </RegisterButton>

            <Divider>
              <DividerText>ou</DividerText>
            </Divider>

            <LoginLink
              to="/login"
              whileHover={{ x: 4 }}
            >
              <span>Vous avez déjà un compte ?</span>
              <FiArrowRight size={16} />
            </LoginLink>
          </Form>

          <Features
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FeaturesTitle>Avantages de l'inscription</FeaturesTitle>
            <FeaturesGrid>
              <Feature>
                <FeatureIcon>
                  <FiShield size={20} />
                </FeatureIcon>
                <FeatureText>Sécurisé</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>
                  <FiZap size={20} />
                </FeatureIcon>
                <FeatureText>Rapide</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>
                  <FiCheck size={20} />
                </FeatureIcon>
                <FeatureText>Gratuit</FeatureText>
              </Feature>
            </FeaturesGrid>
          </Features>
        </RegisterCard>
      </Container>
    </RegisterContainer>
  )
}

export default Register