import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { FiLock, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const ResetPasswordContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }
`

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  color: #d1d5db;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.75rem;
  backdrop-filter: blur(12px);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(244, 208, 63, 0.1));
    color: #f4d03f;
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateX(-6px) translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(212, 175, 55, 0.2),
      0 0 0 1px rgba(212, 175, 55, 0.1);
    text-shadow: 0 0 8px rgba(244, 208, 63, 0.3);
  }
  
  &:active {
    transform: translateX(-4px) translateY(-1px);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(-2px);
  }
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
`

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 3rem;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
`

const Title = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
`

const Subtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: #d1d5db;
  margin: 0;
  line-height: 1.6;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InputContainer = styled.div`
  position: relative;
`

const StyledInput = styled(Input)`
  padding-right: 3.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  
  &:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
  }
`

const PasswordStrength = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`

const StrengthBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`

const StrengthFill = styled(motion.div)`
  height: 100%;
  border-radius: 2px;
  background: ${props => {
    switch (props.$strength) {
      case 'weak': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'strong': return '#22c55e'
      default: return 'transparent'
    }
  }};
  box-shadow: ${props => props.$strength !== 'none' ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'none'};
`

const MatchIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${props => props.$match ? '#22c55e' : '#ef4444'};
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  border: none;
  position: relative;
  overflow: hidden;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
  }
`

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.5rem;
  color: #22c55e;
  margin-bottom: 1.5rem;
`

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
`

const LoginLink = styled(Link)`
  color: #d4af37;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #ffffff;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }
`

const Footer = styled(motion.div)`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    color: #9ca3af;
    font-size: 0.875rem;
    margin: 0;
  }
`

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant ou invalide')
    }
  }, [token])

  const calculatePasswordStrength = (password) => {
    if (password.length === 0) return { strength: 'none', score: 0 }
    
    let score = 0
    if (password.length >= 8) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[^a-zA-Z\d]/.test(password)) score += 1
    
    if (score <= 2) return { strength: 'weak', score }
    if (score <= 3) return { strength: 'medium', score }
    return { strength: 'strong', score }
  }

  const passwordStrength = calculatePasswordStrength(formData.newPassword)
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      setError('Token de réinitialisation manquant')
      return
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (passwordStrength.strength === 'weak') {
      setError('Le mot de passe est trop faible')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.resetPassword(token, formData.newPassword)
      
      if (response.data.success) {
        setIsSuccess(true)
        toast.success('Mot de passe réinitialisé avec succès !')
        
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(response.data.message || 'Erreur lors de la réinitialisation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <ResetPasswordContainer>
        <FormContainer>
          <FormCard>
            <Header>
              <IconContainer>
                <FiCheckCircle size={40} color="white" />
              </IconContainer>
              <Title
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Mot de passe réinitialisé !
              </Title>
              <Subtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Votre mot de passe a été modifié avec succès.
              </Subtitle>
            </Header>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SuccessMessage>
                <FiCheckCircle size={24} />
                <div>
                  <strong>Réinitialisation réussie !</strong><br />
                  Vous allez être redirigé vers la page de connexion dans quelques secondes...
                </div>
              </SuccessMessage>
              
              <LoginLink to="/login">
                <FiArrowLeft size={16} />
                Se connecter maintenant
              </LoginLink>
            </motion.div>
          </FormCard>
        </FormContainer>
      </ResetPasswordContainer>
    )
  }

  return (
    <ResetPasswordContainer>
      <BackButton to="/login">
        <FiArrowLeft size={16} />
        Retour
      </BackButton>

      <FormContainer>
        <FormCard>
          <Header>
            <IconContainer>
              <FiShield size={40} color="white" />
            </IconContainer>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Nouveau mot de passe
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Entrez votre nouveau mot de passe ci-dessous.
            </Subtitle>
          </Header>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiAlertCircle size={20} />
              {error}
            </ErrorMessage>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <InputContainer>
                <StyledInput
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  required
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </PasswordToggle>
              </InputContainer>
              
              {formData.newPassword && (
                <PasswordStrength>
                  <span>Force:</span>
                  <StrengthBar>
                    <StrengthFill 
                      $strength={passwordStrength.strength}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </StrengthBar>
                  <span style={{ 
                    color: passwordStrength.strength === 'weak' ? '#ef4444' : 
                           passwordStrength.strength === 'medium' ? '#f59e0b' : '#22c55e',
                    fontWeight: '600'
                  }}>
                    {passwordStrength.strength === 'weak' ? 'Faible' : 
                     passwordStrength.strength === 'medium' ? 'Moyen' : 'Fort'}
                  </span>
                </PasswordStrength>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <InputContainer>
                <StyledInput
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </PasswordToggle>
              </InputContainer>
              
              {formData.confirmPassword && (
                <MatchIndicator $match={passwordsMatch}>
                  {passwordsMatch ? (
                    <>
                      <FiCheckCircle size={16} />
                      Les mots de passe correspondent
                    </>
                  ) : (
                    <>
                      <FiAlertCircle size={16} />
                      Les mots de passe ne correspondent pas
                    </>
                  )}
                </MatchIndicator>
              )}
            </FormGroup>

            <SubmitButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !token || !passwordsMatch || passwordStrength.strength === 'weak'}
              isLoading={isLoading}
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </SubmitButton>
          </Form>

          <Footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p>
              Vous vous souvenez de votre mot de passe ?{' '}
              <LoginLink to="/login">
                Se connecter
              </LoginLink>
            </p>
          </Footer>
        </FormCard>
      </FormContainer>
    </ResetPasswordContainer>
  )
}

export default ResetPassword