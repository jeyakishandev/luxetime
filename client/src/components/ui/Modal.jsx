import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing[4]};
`

const ModalContainer = styled(motion.div)`
  background: ${props => props.theme.colors.gray[800]};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows['2xl']};
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '400px'
      case 'lg': return '800px'
      case 'xl': return '1200px'
      default: return '600px'
    }
  }};
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  
  ${props => props.theme.media.mobile} {
    max-width: 100%;
    margin: ${props => props.theme.spacing[2]};
    max-height: 95vh;
  }
`

const ModalHeader = styled.div`
  padding: ${props => props.theme.spacing[6]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[700]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[4]};
  }
`

const ModalTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.gray[700]};
    color: ${props => props.theme.colors.white};
  }
`

const ModalContent = styled.div`
  padding: ${props => props.theme.spacing[6]};
  overflow-y: auto;
  max-height: 60vh;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[4]};
    max-height: 50vh;
  }
`

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing[6]};
  border-top: 1px solid ${props => props.theme.colors.gray[700]};
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: ${props => props.justify || 'flex-end'};
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[4]};
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className
}) => {
  // Gestion de l'événement Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <ModalContainer
            size={size}
            className={className}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {title && (
              <ModalHeader>
                <ModalTitle>{title}</ModalTitle>
                {showCloseButton && (
                  <CloseButton onClick={onClose} aria-label="Fermer">
                    ✕
                  </CloseButton>
                )}
              </ModalHeader>
            )}
            
            <ModalContent>
              {children}
            </ModalContent>
            
            {footer && (
              <ModalFooter>
                {footer}
              </ModalFooter>
            )}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Sous-composants
Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal
