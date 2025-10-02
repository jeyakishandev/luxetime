import React, { useState, forwardRef } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`

const StyledInput = styled(motion.input)`
  width: 100%;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`
      case 'lg': return `${props.theme.spacing[4]} ${props.theme.spacing[5]}`
      default: return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return props.theme.fontSizes.sm
      case 'lg': return props.theme.fontSizes.lg
      default: return props.theme.fontSizes.base
    }
  }};
  background: ${props => props.theme.colors.gray[800]};
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  transition: all ${props => props.theme.transitions.base};
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(220, 53, 69, 0.1)' : 'rgba(212, 175, 55, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.gray[700]};
  }
  
  /* Responsive */
  ${props => props.theme.media.mobile} {
    padding: ${props => {
      switch (props.size) {
        case 'sm': return `${props.theme.spacing[1]} ${props.theme.spacing[2]}`
        case 'lg': return `${props.theme.spacing[3]} ${props.theme.spacing[4]}`
        default: return `${props.theme.spacing[2]} ${props.theme.spacing[3]}`
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'sm': return props.theme.fontSizes.xs
        case 'lg': return props.theme.fontSizes.base
        default: return props.theme.fontSizes.sm
      }
    }};
  }
`

const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.gray[200]};
  margin-bottom: ${props => props.theme.spacing[2]};
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: ${props.theme.colors.error};
    }
  `}
`

const ErrorMessage = styled(motion.div)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing[1]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
`

const HelperText = styled.div`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: ${props => props.theme.spacing[1]};
`

const IconWrapper = styled.div`
  position: absolute;
  right: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray[400]};
  pointer-events: none;
`

const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  size = 'md',
  icon,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <InputContainer className={className}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      
      <StyledInput
        ref={ref}
        size={size}
        error={!!error}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {icon && (
        <IconWrapper>
          {icon}
        </IconWrapper>
      )}
      
      {error && (
        <ErrorMessage
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {error}
        </ErrorMessage>
      )}
      
      {helperText && !error && (
        <HelperText>
          {helperText}
        </HelperText>
      )}
    </InputContainer>
  )
})

Input.displayName = 'Input'

export default Input
