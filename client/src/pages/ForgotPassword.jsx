import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button, Input } from '../components/ui'
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[8]} ${props => props.theme.spacing[4]};
  
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

const BackButton = styled(Button)`
  position: absolute;
  top: ${props => props.theme.spacing[6]};
  left: ${props => props.theme.spacing[6]};
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.gray[300]};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(212, 175, 55, 0.1);
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
    transform: translateX(-4px);
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
  border-radius: ${props => props.theme.radii.xl};
  padding: ${props => props.theme.spacing[10]};
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
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.gold[300]});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
`

const Title = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  letter-spacing: -0.02em;
`

const Subtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
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
  gap: ${props => props.theme.spacing[3]};
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.gray[200]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InputContainer = styled.div`
  position: relative;
`

const StyledInput = styled(Input)`
  padding-left: 3.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[4]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.gold[300]});
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
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.radii.lg};
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
  border-radius: ${props => props.theme.radii.lg};
  color: #ef4444;
  margin-bottom: ${props => props.theme.spacing[6]};
`

const LoginLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &:hover {
    color: ${props => props.theme.colors.white};
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
  }
`

const Footer = styled(motion.div)`
  text-align: center;
  margin-top: ${props => props.theme.spacing[8]};
  padding-top: ${props => props.theme.spacing[6]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  p {
    color: ${props => props.theme.colors.gray[400]};
    font-size: ${props => props.theme.fontSizes.sm};
    margin: 0;
  }
`

const TestInfo = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.radii.lg};
  color: #3b82f6;
  font-size: ${props => props.theme.fontSizes.sm};
  
  strong {
    color: ${props => props.theme.colors.white};
  }
  
  code {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    word-break: break-all;
  }
  
  a {
    color: #60a5fa;
    text-decoration: underline;
    
    &:hover {
      color: ${props => props.theme.colors.white};
    }
  }
`

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const response = await authAPI.forgotPassword(email)
      
      if (response.data.success) {
        setIsSuccess(true)
        setResetToken(response.data.resetToken) // Pour les tests
        toast.success('Email de réinitialisation envoyé !')
      } else {
        setError(response.data.message || 'Erreur lors de l\'envoi de l\'email')
      }
    } catch (error) {
      console.error('Erreur:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <ForgotPasswordContainer>
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
                Email envoyé !
              </Title>
              <Subtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.
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
                  <strong>Demande envoyée !</strong><br />
                  Vérifiez votre boîte email et cliquez sur le lien pour réinitialiser votre mot de passe.
                </div>
              </SuccessMessage>
              
              <LoginLink to="/login">
                <FiArrowLeft size={16} />
                Retour à la page de connexion
              </LoginLink>
            </motion.div>

            {/* Information pour les tests */}
            {resetToken && (
              <TestInfo
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <strong>🧪 Mode test :</strong><br />
                Token de réinitialisation : <code>{resetToken}</code><br />
                <Link to={`/reset-password?token=${resetToken}`}>
                  Cliquez ici pour tester la réinitialisation
                </Link>
              </TestInfo>
            )}
          </FormCard>
        </FormContainer>
      </ForgotPasswordContainer>
    )
  }

  return (
    <ForgotPasswordContainer>
      <BackButton
        as={Link}
        to="/login"
        variant="outline"
        size="sm"
      >
        <FiArrowLeft size={16} />
        Retour
      </BackButton>

      <FormContainer>
        <FormCard>
          <Header>
            <IconContainer>
              <FiMail size={40} color="white" />
            </IconContainer>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Mot de passe oublié
            </Title>
            <Subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
              <Label htmlFor="email">Adresse email</Label>
              <InputContainer>
                <InputIcon>
                  <FiMail size={20} />
                </InputIcon>
                <StyledInput
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </InputContainer>
            </FormGroup>

            <SubmitButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !email.trim()}
              isLoading={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
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
    </ForgotPasswordContainer>
  )
}

export default ForgotPassword