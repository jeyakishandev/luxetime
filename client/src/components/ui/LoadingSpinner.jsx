import React from 'react'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const StyledSpinner = styled.div`
  display: inline-block;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '16px'
      case 'lg': return '32px'
      case 'xl': return '48px'
      default: return '24px'
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '16px'
      case 'lg': return '32px'
      case 'xl': return '48px'
      default: return '24px'
    }
  }};
  border: 2px solid ${props => props.theme.colors.gray[600]};
  border-top: 2px solid ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const StyledDots = styled.div`
  display: inline-flex;
  gap: ${props => props.theme.spacing[1]};
  align-items: center;
`

const Dot = styled.div`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '4px'
      case 'lg': return '8px'
      default: return '6px'
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '4px'
      case 'lg': return '8px'
      default: return '6px'
    }
  }};
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`

const StyledSkeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.gray[700]} 25%,
    ${props => props.theme.colors.gray[600]} 50%,
    ${props => props.theme.colors.gray[700]} 75%
  );
  background-size: 200% 100%;
  animation: ${keyframes`
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  `} 1.5s infinite;
  border-radius: ${props => props.theme.borderRadius.md};
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
`

const LoadingText = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin: 0;
`

const BackendInfo = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[4]};
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  max-width: 500px;
  
  p {
    color: #9ca3af;
    font-size: ${props => props.theme.fontSizes.sm};
    margin: 0;
    line-height: 1.6;
    
    strong {
      color: #3b82f6;
    }
  }
`

// Spinner simple
export const Spinner = ({ size = 'md', color, className }) => (
  <StyledSpinner size={size} color={color} className={className} />
)

// Dots animés
export const Dots = ({ size = 'md', color, className }) => (
  <StyledDots className={className}>
    <Dot size={size} color={color} delay="0s" />
    <Dot size={size} color={color} delay="0.2s" />
    <Dot size={size} color={color} delay="0.4s" />
  </StyledDots>
)

// Skeleton loader
export const Skeleton = ({ width, height, className }) => (
  <StyledSkeleton width={width} height={height} className={className} />
)

// Loading complet avec texte
export const Loading = ({ 
  text = 'Chargement...', 
  size = 'md', 
  color,
  variant = 'spinner',
  className 
}) => (
  <LoadingContainer className={className}>
    {variant === 'spinner' ? (
      <Spinner size={size} color={color} />
    ) : (
      <Dots size={size} color={color} />
    )}
    {text && <LoadingText>{text}</LoadingText>}
  </LoadingContainer>
)

// Loading pour les boutons
export const ButtonSpinner = ({ size = 'sm', color }) => (
  <Spinner size={size} color={color} />
)

// Loading pour les pages
export const PageLoading = ({ text = 'Chargement de la page...', showBackendInfo = true }) => (
  <LoadingContainer style={{ minHeight: '50vh' }}>
    <Spinner size="lg" />
    <LoadingText>{text}</LoadingText>
    {showBackendInfo && (
      <BackendInfo>
        <p>
          💡 <strong>Note :</strong> Le backend peut prendre 30-60 secondes à démarrer lors du premier chargement.
          <br />Veuillez patienter, cela peut prendre un peu de temps...
        </p>
      </BackendInfo>
    )}
  </LoadingContainer>
)

// Loading pour les cartes
export const CardSkeleton = () => (
  <div style={{ padding: '1rem' }}>
    <Skeleton height="200px" />
    <div style={{ marginTop: '1rem' }}>
      <Skeleton height="20px" width="80%" />
      <Skeleton height="16px" width="60%" style={{ marginTop: '0.5rem' }} />
    </div>
  </div>
)

export default Loading
