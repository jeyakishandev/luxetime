import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/format'

const LoginContainer = styled.div`
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
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const LoginCard = styled(Card)`
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

const LoginButton = styled(Button)`
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

const RegisterLink = styled(Link)`
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

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Récupérer la page d'origine depuis location.state ou URL params
  const urlParams = new URLSearchParams(window.location.search)
  const fromParam = urlParams.get('from')
  const from = location.state?.from || fromParam || '/'

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
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
      await login({ 
        email: formData.email, 
        motDePasse: formData.password 
      })
      toast.success('Connexion réussie ! Bienvenue chez Luxetime')
      
      // Rediriger vers la page d'origine ou la page d'accueil
      if (location.state?.from) {
        navigate(location.state.from)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      toast.error(error.response?.data?.message || 'Erreur de connexion')
    }
  }

  return (
    <LoginContainer>
      <Container>
        <LoginCard>
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
              Connexion
            </Title>
            
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Accédez à votre compte Luxetime
            </Subtitle>
          </Header>

          <Form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <InputGroup>
              <Label>Email</Label>
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
              <Label>Mot de passe</Label>
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
            </InputGroup>

            <LoginButton
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </LoginButton>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ textAlign: 'center', marginTop: '1rem' }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#d4af37'}
                onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              >
                Mot de passe oublié ?
              </Link>
            </motion.div>

            <Divider>
              <DividerText>ou</DividerText>
            </Divider>

            <RegisterLink
              to="/register"
              whileHover={{ x: 4 }}
            >
              <span>Vous n'avez pas encore de compte ?</span>
              <FiArrowRight size={16} />
            </RegisterLink>
          </Form>

          <Features
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FeaturesTitle>Pourquoi choisir Luxetime ?</FeaturesTitle>
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
                  <FiLock size={20} />
                </FeatureIcon>
                <FeatureText>Privé</FeatureText>
              </Feature>
            </FeaturesGrid>
          </Features>
        </LoginCard>
      </Container>
    </LoginContainer>
  )
}

export default Login