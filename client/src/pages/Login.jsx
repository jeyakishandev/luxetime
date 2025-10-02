import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const LoginTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const LoginSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
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
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[2]};
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.theme.spacing[6]} 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.gray[700]};
  }
  
  span {
    padding: 0 ${props => props.theme.spacing[4]};
    color: ${props => props.theme.colors.gray[400]};
    font-size: ${props => props.theme.fontSizes.sm};
  }
`

const RegisterLink = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing[6]};
  
  p {
    color: ${props => props.theme.colors.gray[400]};
    margin: 0 0 ${props => props.theme.spacing[2]} 0;
  }
`

const Login = () => {
  const { login, isLoggingIn } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  })
  const [showPassword, setShowPassword] = useState(false)
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }
    
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await login(formData)
      navigate('/')
    } catch (error) {
      console.error('Erreur de connexion:', error)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Connexion</LoginTitle>
          <LoginSubtitle>
            Connectez-vous à votre compte Luxetime
          </LoginSubtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<FiMail size={18} />}
            required
          />

          <PasswordContainer>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="motDePasse"
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={formData.motDePasse}
              onChange={handleChange}
              error={errors.motDePasse}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </PasswordToggle>
          </PasswordContainer>

          <LoginButton
            type="submit"
            isLoading={isLoggingIn}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Connexion...' : 'Se connecter'}
          </LoginButton>
        </LoginForm>

        <Divider>
          <span>ou</span>
        </Divider>

        <RegisterLink>
          <p>Vous n'avez pas encore de compte ?</p>
          <Button as={Link} to="/register" variant="outline" fullWidth>
            Créer un compte
          </Button>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  )
}

export default Login
