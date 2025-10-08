import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button, Input, Card } from '../components/ui'
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordContainer = styled.div`
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
`

const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.gray[200]};
  text-align: left;
`

const EmailInput = styled(Input)`
  text-align: left;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`

const SubmitButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[4]};
  position: relative;
  
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

const TestInfo = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[6]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: #3b82f6;
  font-size: ${props => props.theme.fontSizes.sm};
  
  strong {
    color: ${props => props.theme.colors.white};
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

  return (
    <ForgotPasswordContainer>
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
            Mot de passe oublié
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Subtitle>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SuccessMessage>
                <FiCheckCircle size={24} />
                <div>
                  <strong>Email envoyé !</strong><br />
                  Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.
                </div>
              </SuccessMessage>
              
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                Vérifiez votre boîte email et cliquez sur le lien pour réinitialiser votre mot de passe.
              </p>
              
              <LoginLink to="/login">
                Retour à la page de connexion
              </LoginLink>
            </motion.div>
          ) : (
            <>
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
                  <EmailInput
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
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
            </>
          )}

          {/* Information pour les tests */}
          {isSuccess && resetToken && (
            <TestInfo
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <strong>🧪 Mode test :</strong><br />
              Token de réinitialisation : <code style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{resetToken}</code><br />
              <Link to={`/reset-password?token=${resetToken}`} style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                Cliquez ici pour tester la réinitialisation
              </Link>
            </TestInfo>
          )}
        </FormCard>
      </Container>
    </ForgotPasswordContainer>
  )
}

export default ForgotPassword
