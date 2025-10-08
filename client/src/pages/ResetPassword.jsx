import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui'
import { FiLock, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const ResetPasswordContainer = styled.div`
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
  max-width: 500px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
`

const BackButton = styled(Button)`
  position: absolute;
  top: -${props => props.theme.spacing[4]};
  left: ${props => props.theme.spacing[4]};
  background: transparent;
  color: ${props => props.theme.colors.gray[400]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  
  &:hover {
    background: ${props => props.theme.colors.gray[800]};
    color: ${props => props.theme.colors.white};
  }
`

const FormCard = styled(Card)`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  padding: ${props => props.theme.spacing[8]};
  text-align: center;
`

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.white} 0%, ${props => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0 0 ${props => props.theme.spacing[8]} 0;
  line-height: 1.6;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
  position: relative;
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.gray[200]};
  text-align: left;
`

const PasswordInput = styled(Input)`
  text-align: left;
  padding-right: 3rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 2.5rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.white};
  }
`

const PasswordStrength = styled.div`
  margin-top: ${props => props.theme.spacing[2]};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.gray[400]};
  text-align: left;
`

const StrengthBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${props => props.theme.spacing[1]};
`

const StrengthFill = styled(motion.div)`
  height: 100%;
  background: ${props => {
    switch (props.$strength) {
      case 'weak': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'strong': return '#22c55e'
      default: return 'transparent'
    }
  }};
  transition: width 0.3s ease;
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[4]};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SuccessMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: #22c55e;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: #ef4444;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.colors.white};
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
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
        
        // Rediriger vers la page de connexion après 3 secondes
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
        <Container>
          <FormCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessMessage>
                <FiCheckCircle size={24} />
                <div>
                  <strong>Mot de passe réinitialisé !</strong><br />
                  Votre mot de passe a été modifié avec succès.
                </div>
              </SuccessMessage>
              
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
              
              <LoginLink to="/login">
                Se connecter maintenant
              </LoginLink>
            </motion.div>
          </FormCard>
        </Container>
      </ResetPasswordContainer>
    )
  }

  return (
    <ResetPasswordContainer>
      <Container>
        <BackButton
          as={Link}
          to="/login"
          variant="outline"
          size="sm"
        >
          <FiArrowLeft size={16} />
          Retour à la connexion
        </BackButton>

        <FormCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Nouveau mot de passe
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Entrez votre nouveau mot de passe ci-dessous.
          </Subtitle>

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
              <PasswordInput
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
              
              {formData.newPassword && (
                <PasswordStrength>
                  Force du mot de passe: {passwordStrength.strength === 'weak' ? 'Faible' : passwordStrength.strength === 'medium' ? 'Moyen' : 'Fort'}
                  <StrengthBar>
                    <StrengthFill 
                      $strength={passwordStrength.strength}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </StrengthBar>
                </PasswordStrength>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <PasswordInput
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
              
              {formData.confirmPassword && (
                <PasswordStrength>
                  {passwordsMatch ? (
                    <span style={{ color: '#22c55e' }}>✓ Les mots de passe correspondent</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>✗ Les mots de passe ne correspondent pas</span>
                  )}
                </PasswordStrength>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Vous vous souvenez de votre mot de passe ?{' '}
              <LoginLink to="/login">
                Se connecter
              </LoginLink>
            </p>
          </motion.div>
        </FormCard>
      </Container>
    </ResetPasswordContainer>
  )
}

export default ResetPassword
