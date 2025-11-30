import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const StyledCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => {
    switch (props.padding) {
      case 'sm': return props.theme.spacing[4]
      case 'lg': return props.theme.spacing[8]
      case 'xl': return props.theme.spacing[10]
      default: return props.theme.spacing[6]
    }
  }};
  box-shadow: ${props => props.theme.shadows.premium};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all ${props => props.theme.transitions.base};
  position: relative;
  overflow: hidden;
  
  /* Effet de brillance subtil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Variants */
  ${props => props.variant === 'elevated' && `
    box-shadow: ${props.theme.shadows.lg};
    
    &:hover {
      box-shadow: ${props.theme.shadows.xl};
      transform: translateY(-4px);
    }
  `}
  
  ${props => props.variant === 'outlined' && `
    background: transparent;
    border: 2px solid ${props.theme.colors.gray[600]};
    
    &:hover {
      border-color: ${props.theme.colors.primary};
    }
  `}
  
  ${props => props.variant === 'glass' && `
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
  
  ${props => props.variant === 'gradient' && `
    background: linear-gradient(135deg, ${props.theme.colors.gray[800]} 0%, ${props.theme.colors.gray[700]} 100%);
    border: none;
  `}
  
  /* Interactive */
  ${props => props.clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.lg};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Responsive */
  ${props => props.theme.media.mobile} {
    padding: ${props => {
      switch (props.padding) {
        case 'sm': return props.theme.spacing[3]
        case 'lg': return props.theme.spacing[6]
        case 'xl': return props.theme.spacing[8]
        default: return props.theme.spacing[4]
      }
    }};
  }
`

const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    margin-bottom: ${props => props.theme.spacing[3]};
  }
`

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.base};
  }
`

const CardSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const CardContent = styled.div`
  flex: 1;
`

const CardFooter = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
  
  ${props => props.theme.media.mobile} {
    margin-top: ${props => props.theme.spacing[3]};
    padding-top: ${props => props.theme.spacing[3]};
  }
`

const CardActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  align-items: center;
  justify-content: ${props => props.justify || 'flex-end'};
  
  ${props => props.theme.media.mobile} {
    flex-direction: ${props => props.stackOnMobile ? 'column' : 'row'};
    width: ${props => props.stackOnMobile ? '100%' : 'auto'};
  }
`

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  clickable = false,
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      clickable={clickable}
      onClick={onClick}
      className={className}
      whileHover={clickable ? { scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </StyledCard>
  )
}

// Sous-composants
Card.Header = CardHeader
Card.Title = CardTitle
Card.Subtitle = CardSubtitle
Card.Content = CardContent
Card.Footer = CardFooter
Card.Actions = CardActions

export default Card
