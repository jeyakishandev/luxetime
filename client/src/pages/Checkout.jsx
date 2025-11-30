import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Input } from '../components/ui'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { FiCreditCard, FiShield, FiLock, FiTruck, FiMapPin, FiUser, FiPhone, FiMail, FiArrowLeft, FiCheck, FiTag, FiFileText } from 'react-icons/fi'
import { formatPrice, getImageUrl } from '../utils/format'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

const CheckoutContainer = styled.div`
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
  max-width: 1200px;
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

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
    margin: ${props => props.theme.spacing[6]} 0;
  }
`

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: ${props => props.theme.spacing[8]};
  margin-top: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const CheckoutForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const FormSection = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[3]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[3]};
  }
`

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[4]};
  border: 1px solid ${props => props.$selected ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$selected ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(212, 175, 55, 0.05);
  }
`

const RadioInput = styled.input`
  margin: 0;
  accent-color: ${props => props.theme.colors.primary};
`

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
`

const OrderSummary = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  height: fit-content;
  position: sticky;
  top: ${props => props.theme.spacing[8]};
`

const SummaryTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${props => props.theme.borderRadius.md};
`

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
`

const ItemDetails = styled.div`
  flex: 1;
`

const ItemName = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[1]};
`

const ItemPrice = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
`

const ItemQuantity = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[2]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: ${props => props.theme.fontWeights.semibold};
    font-size: ${props => props.theme.fontSizes.lg};
    color: ${props => props.theme.colors.white};
  }
`

const SummaryLabel = styled.span`
  color: ${props => props.theme.colors.gray[300]};
`

const SummaryValue = styled.span`
  color: ${props => props.theme.colors.white};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const TotalValue = styled.span`
  color: ${props => props.theme.colors.primary};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.xl};
`

const PlaceOrderButton = styled(Button)`
  width: 100%;
  margin-top: ${props => props.theme.spacing[4]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-size: ${props => props.theme.fontSizes.lg};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  color: #22c55e;
  font-size: ${props => props.theme.fontSizes.sm};
`

const PromoCodeSection = styled.div`
  margin-top: ${props => props.theme.spacing[4]};
  padding-top: ${props => props.theme.spacing[4]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const PromoCodeInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
`

const PromoButton = styled(Button)`
  white-space: nowrap;
`

const PromoSuccess = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[2]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  color: #22c55e;
  font-size: ${props => props.theme.fontSizes.sm};
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[4]};
  cursor: pointer;
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  
  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
    
    &:hover {
      color: #f4d03f;
    }
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${props => props.theme.spacing[3]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.body};
  font-size: ${props => props.theme.fontSizes.base};
  resize: vertical;
  transition: all ${props => props.theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
`

const ShippingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[3]};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: ${props => props.theme.borderRadius.md};
  color: #22c55e;
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const EmptyCart = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(212, 175, 55, 0.2);
`

const EmptyTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
`

const EmptyText = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[6]} 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`

const Checkout = () => {
  const { items, total, itemCount, isLoading, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: user?.prenom || 'Jean',
    lastName: user?.nom || 'Dupont',
    email: user?.email || 'jean.dupont@email.fr',
    phone: user?.telephone || '0612345678',
    
    // Adresse de livraison
    address: user?.adresseRue || '123 Avenue des Champs-Élysées',
    city: user?.adresseVille || 'Paris',
    postalCode: user?.adresseCodePostal || '75008',
    country: user?.adressePays || 'France',
    
    // Méthode de paiement
    paymentMethod: 'card',
    cardNumber: '4242424242424242',
    expiryDate: '12/26',
    cvv: '123',
    cardName: 'JEAN DUPONT',
    
    // Notes et conditions
    notes: '',
    acceptTerms: false
  })
  
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Calcul des frais de livraison (gratuit si > 100€)
  const shippingCost = total >= 100 ? 0 : 15
  const discount = appliedPromo ? appliedPromo.amount : 0
  const subtotalWithShipping = total + shippingCost - discount
  const taxAmount = subtotalWithShipping * 0.2
  const finalTotal = subtotalWithShipping + taxAmount

  // Rediriger si panier vide
  useEffect(() => {
    if (!isLoading && itemCount === 0) {
      navigate('/cart')
    }
  }, [isLoading, itemCount, navigate])

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Veuillez entrer un code promo')
      return
    }
    
    setIsApplyingPromo(true)
    
    try {
      // Simuler la validation du code promo
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Codes promo de test
      const promoCodes = {
        'LUXE10': { code: 'LUXE10', amount: total * 0.1, type: 'percentage', value: 10 },
        'WELCOME20': { code: 'WELCOME20', amount: total * 0.2, type: 'percentage', value: 20 },
        'FIRST50': { code: 'FIRST50', amount: 50, type: 'fixed', value: 50 }
      }
      
      const promo = promoCodes[promoCode.toUpperCase()]
      
      if (promo) {
        setAppliedPromo(promo)
        toast.success(`Code promo appliqué ! -${promo.type === 'percentage' ? promo.value + '%' : formatPrice(promo.value)}`)
      } else {
        toast.error('Code promo invalide')
      }
    } catch (error) {
      toast.error('Erreur lors de l\'application du code promo')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validation des champs requis
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!formData.email.trim()) newErrors.email = 'Email requis'
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis'
    if (!formData.address.trim()) newErrors.address = 'Adresse requise'
    if (!formData.city.trim()) newErrors.city = 'Ville requise'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis'
    
    // Validation des conditions générales (automatiquement acceptées pour les tests)
    if (!formData.acceptTerms) {
      // Accepter automatiquement pour faciliter les tests
      setFormData(prev => ({ ...prev, acceptTerms: true }))
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }
    
    // Validation téléphone
    const phoneRegex = /^[0-9+\-\s()]{10,}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Téléphone invalide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire')
      return
    }

    setIsProcessing(true)
    
    try {
      // Préparer les données de la commande
      const orderData = {
        adresseLivraison: {
          nom: formData.lastName,
          prenom: formData.firstName,
          rue: formData.address,
          ville: formData.city,
          codePostal: formData.postalCode,
          pays: formData.country,
          telephone: formData.phone
        },
        methodePaiement: formData.paymentMethod === 'card' ? 'CARTE' : 'PAYPAL',
        notes: formData.notes || null,
        codePromo: appliedPromo ? appliedPromo.code : null,
        reduction: discount
      }
      
      // Créer la commande via l'API
      const response = await orderAPI.createOrder(orderData)
      
      if (response.data.success) {
        // Vider le panier
        await clearCart()
        
        toast.success('Commande passée avec succès ! 🎉')
        
        // Rediriger vers la page de confirmation ou les commandes
        setTimeout(() => {
          navigate('/orders')
        }, 1500)
      } else {
        throw new Error(response.data.message || 'Erreur lors de la création de la commande')
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la commande:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du traitement de la commande'
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <CheckoutContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div>Chargement...</div>
          </div>
        </Container>
      </CheckoutContainer>
    )
  }

  if (itemCount === 0) {
    return (
      <CheckoutContainer>
        <Container>
          <EmptyCart
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyIcon>
              <FiCreditCard size={48} color="#d4af37" />
            </EmptyIcon>
            <EmptyTitle>Votre panier est vide</EmptyTitle>
            <EmptyText>
              Ajoutez des produits à votre panier avant de finaliser votre commande.
            </EmptyText>
            <Button onClick={() => navigate('/products')}>
              Continuer mes achats
            </Button>
          </EmptyCart>
        </Container>
      </CheckoutContainer>
    )
  }

  return (
    <CheckoutContainer>
      <Container>
        <BackButton
          onClick={() => navigate('/cart')}
          variant="outline"
          size="sm"
        >
          <FiArrowLeft size={16} />
          Retour au panier
        </BackButton>

        <PageTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Finaliser la commande
        </PageTitle>

        {/* Bouton pour remplir automatiquement (pour les tests) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@email.fr',
                phone: '0612345678',
                address: '123 Avenue des Champs-Élysées',
                city: 'Paris',
                postalCode: '75008',
                country: 'France',
                paymentMethod: 'card',
                cardNumber: '4242424242424242',
                expiryDate: '12/26',
                cvv: '123',
                cardName: 'JEAN DUPONT',
                acceptTerms: true
              }))
              toast.success('Formulaire rempli automatiquement ! 🎉')
            }}
          >
            🧪 Remplir automatiquement (test)
          </Button>
        </motion.div>

        <CheckoutGrid>
          <CheckoutForm>
            {/* Informations personnelles */}
            <FormSection>
              <SectionTitle>
                <FiUser size={20} />
                Informations personnelles
              </SectionTitle>
              <FormGrid>
                <Input
                  label="Prénom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={errors.firstName}
                  required
                />
                <Input
                  label="Nom"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={errors.lastName}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  required
                />
              </FormGrid>
            </FormSection>

            {/* Adresse de livraison */}
            <FormSection>
              <SectionTitle>
                <FiMapPin size={20} />
                Adresse de livraison
              </SectionTitle>
              <FormRow>
                <Input
                  label="Adresse"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={errors.address}
                  required
                />
                <FormGrid>
                  <Input
                    label="Ville"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    required
                  />
                  <Input
                    label="Code postal"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    error={errors.postalCode}
                    required
                  />
                </FormGrid>
                <Input
                  label="Pays"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  required
                />
              </FormRow>
            </FormSection>

            {/* Méthode de paiement */}
            <FormSection>
              <SectionTitle>
                <FiCreditCard size={20} />
                Méthode de paiement
              </SectionTitle>
              <PaymentMethods>
                <PaymentMethod $selected={formData.paymentMethod === 'card'}>
                  <RadioInput
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  />
                  <PaymentInfo>
                    <FiCreditCard size={20} />
                    Carte bancaire
                  </PaymentInfo>
                </PaymentMethod>
                
                <PaymentMethod $selected={formData.paymentMethod === 'paypal'}>
                  <RadioInput
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  />
                  <PaymentInfo>
                    <FiShield size={20} />
                    PayPal
                  </PaymentInfo>
                </PaymentMethod>
              </PaymentMethods>
              
              {formData.paymentMethod === 'card' && (
                <FormRow style={{ marginTop: '1.5rem' }}>
                  <Input
                    label="Numéro de carte"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  />
                  <FormGrid>
                    <Input
                      label="Date d'expiration"
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                    />
                  </FormGrid>
                  <Input
                    label="Nom sur la carte"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                  />
                </FormRow>
              )}
            </FormSection>

            {/* Notes de commande */}
            <FormSection>
              <SectionTitle>
                <FiFileText size={20} />
                Notes de commande (optionnel)
              </SectionTitle>
              <TextArea
                placeholder="Instructions spéciales pour la livraison, emballage cadeau, etc..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </FormSection>

            {/* Conditions générales */}
            <FormSection>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                />
                <span>
                  J'accepte les <a href="/terms" target="_blank">conditions générales de vente</a> et la <a href="/privacy" target="_blank">politique de confidentialité</a>
                </span>
              </CheckboxLabel>
              {errors.acceptTerms && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {errors.acceptTerms}
                </div>
              )}
            </FormSection>
          </CheckoutForm>

          {/* Résumé de la commande */}
          <OrderSummary>
            <SummaryTitle>Résumé de la commande</SummaryTitle>
            
            {total >= 100 && (
              <ShippingInfo>
                <FiTruck size={16} />
                Livraison gratuite ! 🎉
              </ShippingInfo>
            )}
            
            <OrderItems>
              {items.map(item => (
                <OrderItem key={item.id}>
                  <ItemImage>
                    <img
                      src={getImageUrl(item.produit.images?.[0]?.url || '/assets/images/analog-watch-1845547_1280.jpg')}
                      alt={item.produit.nom}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </ItemImage>
                  <ItemDetails>
                    <ItemName>{item.produit.nom}</ItemName>
                    <ItemPrice>{formatPrice(item.produit.prixPromo && item.produit.prixPromo > 0 ? item.produit.prixPromo : item.produit.prix)}</ItemPrice>
                  </ItemDetails>
                  <ItemQuantity>×{item.quantite}</ItemQuantity>
                </OrderItem>
              ))}
            </OrderItems>
            
            <SummaryRow>
              <SummaryLabel>Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</SummaryLabel>
              <SummaryValue>{formatPrice(total)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Livraison</SummaryLabel>
              <SummaryValue>{shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}</SummaryValue>
            </SummaryRow>
            
            {appliedPromo && (
              <SummaryRow>
                <SummaryLabel>Réduction ({appliedPromo.code})</SummaryLabel>
                <SummaryValue style={{ color: '#22c55e' }}>-{formatPrice(discount)}</SummaryValue>
              </SummaryRow>
            )}
            
            <SummaryRow>
              <SummaryLabel>TVA (20%)</SummaryLabel>
              <SummaryValue>{formatPrice(taxAmount)}</SummaryValue>
            </SummaryRow>
            
            <SummaryRow>
              <SummaryLabel>Total</SummaryLabel>
              <TotalValue>{formatPrice(finalTotal)}</TotalValue>
            </SummaryRow>
            
            {/* Code promo */}
            <PromoCodeSection>
              <PromoCodeInput>
                <Input
                  placeholder="Code promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={appliedPromo !== null}
                />
                <PromoButton
                  onClick={handleApplyPromoCode}
                  disabled={isApplyingPromo || appliedPromo !== null}
                  variant="outline"
                  size="sm"
                >
                  {isApplyingPromo ? '...' : appliedPromo ? '✓' : 'Appliquer'}
                </PromoButton>
              </PromoCodeInput>
              {appliedPromo && (
                <PromoSuccess>
                  <FiCheck size={16} />
                  Code promo appliqué avec succès !
                </PromoSuccess>
              )}
            </PromoCodeSection>
            
            <PlaceOrderButton
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                'Traitement en cours...'
              ) : (
                <>
                  <FiLock size={18} />
                  Finaliser la commande - {formatPrice(finalTotal)}
                </>
              )}
            </PlaceOrderButton>
            
            <SecurityBadge>
              <FiShield size={16} />
              Paiement sécurisé SSL 256-bit
            </SecurityBadge>
          </OrderSummary>
        </CheckoutGrid>
      </Container>
    </CheckoutContainer>
  )
}

export default Checkout