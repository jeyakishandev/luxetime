import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`
      case 'lg': return `${props.theme.spacing[4]} ${props.theme.spacing[6]}`
      case 'xl': return `${props.theme.spacing[5]} ${props.theme.spacing[8]}`
      default: return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.fontSizes.sm
      case 'lg': return props.theme.fontSizes.lg
      case 'xl': return props.theme.fontSizes.xl
      default: return props.theme.fontSizes.base
    }
  }};
  font-weight: ${props => props.theme.fontWeights.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  text-decoration: none;
  position: relative;
  overflow: hidden;
  min-height: ${props => {
    switch (props.size) {
      case 'sm': return '32px'
      case 'lg': return '48px'
      case 'xl': return '56px'
      default: return '40px'
    }
  }};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Variants */
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.primaryLight} 100%);
    color: ${props.theme.colors.black};
    box-shadow: ${props.theme.shadows.md};
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.lg};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: transparent;
    color: ${props.theme.colors.primary};
    border: 2px solid ${props.theme.colors.primary};
    
    &:hover {
      background: ${props.theme.colors.primary};
      color: ${props.theme.colors.black};
    }
  `}
  
  ${props => props.variant === 'outline' && `
    background: transparent;
    color: ${props.theme.colors.white};
    border: 1px solid ${props.theme.colors.gray[600]};
    
    &:hover {
      background: ${props.theme.colors.gray[800]};
      border-color: ${props.theme.colors.primary};
    }
  `}
  
  ${props => props.variant === 'ghost' && `
    background: transparent;
    color: ${props.theme.colors.gray[300]};
    
    &:hover {
      background: ${props.theme.colors.gray[800]};
      color: ${props.theme.colors.white};
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: ${props.theme.colors.error};
    color: ${props.theme.colors.white};
    
    &:hover {
      background: #c82333;
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* Loading state */
  ${props => props.isLoading && `
    cursor: not-allowed;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `}
  
  /* Responsive */
  ${props => props.theme.media.mobile} {
    padding: ${props => {
      switch (props.size) {
        case 'sm': return `${props.theme.spacing[1]} ${props.theme.spacing[2]}`
        case 'lg': return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`
        case 'xl': return `${props.theme.spacing[4]} ${props.theme.spacing[5]}`
        default: return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'sm': return props.theme.fontSizes.xs
        case 'lg': return props.theme.fontSizes.base
        case 'xl': return props.theme.fontSizes.lg
        default: return props.theme.fontSizes.sm
      }
    }};
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className,
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type}
      className={className}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? null : children}
    </StyledButton>
  )
})

Button.displayName = 'Button'

export default Button
