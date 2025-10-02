import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const RegisterTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const RegisterSubtitle = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const RegisterForm = styled.form`
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

const RegisterButton = styled(Button)`
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing[6]};
  
  p {
    color: ${props => props.theme.colors.gray[400]};
    margin: 0 0 ${props => props.theme.spacing[2]} 0;
  }
`

const Register = () => {
  const { register, isRegistering } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: ''
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
    
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est requis'
    } else if (formData.motDePasse.length < 6) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (formData.telephone && !/^[0-9+\-\s()]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone n\'est pas valide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await register(formData)
      navigate('/')
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
    }
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterHeader>
          <RegisterTitle>Inscription</RegisterTitle>
          <RegisterSubtitle>
            Créez votre compte Luxetime
          </RegisterSubtitle>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit}>
          <FormRow>
            <Input
              type="text"
              name="prenom"
              label="Prénom"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
              error={errors.prenom}
              icon={<FiUser size={18} />}
              required
            />
            <Input
              type="text"
              name="nom"
              label="Nom"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              icon={<FiUser size={18} />}
              required
            />
          </FormRow>

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

          <Input
            type="tel"
            name="telephone"
            label="Téléphone (optionnel)"
            placeholder="+33 6 12 34 56 78"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            icon={<FiPhone size={18} />}
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

          <RegisterButton
            type="submit"
            isLoading={isRegistering}
            disabled={isRegistering}
          >
            {isRegistering ? 'Création du compte...' : 'Créer mon compte'}
          </RegisterButton>
        </RegisterForm>

        <Divider>
          <span>ou</span>
        </Divider>

        <LoginLink>
          <p>Vous avez déjà un compte ?</p>
          <Button as={Link} to="/login" variant="outline" fullWidth>
            Se connecter
          </Button>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default Register
