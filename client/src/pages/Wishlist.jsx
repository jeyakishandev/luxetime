import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../contexts/WishlistContext'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { Button, Card } from '../components/ui'
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { formatPrice } from '../utils/format'
import toast from 'react-hot-toast'

const WishlistContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: ${props => props.theme.spacing[8]} 0;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
`

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[4]} 0;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const PageSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const BackButton = styled(Button)`
  position: absolute;
  top: ${props => props.theme.spacing[4]};
  left: ${props => props.theme.spacing[4]};
  background: transparent;
  color: ${props => props.theme.colors.gray[400]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  
  &:hover {
    background: ${props => props.theme.colors.gray[800]};
    color: ${props => props.theme.colors.white};
  }
`

const EmptyWishlist = styled(motion.div)`
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

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const WishlistItem = styled(Card)`
  padding: ${props => props.theme.spacing[4]};
  position: relative;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
  }
`

const ItemImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing[4]};
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
`

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${props => props.theme.transitions.base};
  
  ${WishlistItem}:hover & {
    transform: scale(1.05);
  }
`

const ItemInfo = styled.div`
  text-align: center;
`

const ProductName = styled.h3`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[2]} 0;
  line-height: 1.3;
`

const ProductBrand = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const CurrentPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  justify-content: center;
`

const RemoveButton = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  flex: 1;
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.white};
  }
`

const AddToCartButton = styled(Button)`
  flex: 2;
`

const Wishlist = () => {
  const { items, itemCount, isLoading, removeFromWishlist, clearWishlist, isClearingWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [isClearing, setIsClearing] = useState(false)

  const handleRemoveFromWishlist = async (produitId) => {
    try {
      await removeFromWishlist(produitId)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleClearWishlist = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre liste de favoris ?')) {
      setIsClearing(true)
      try {
        await clearWishlist()
      } catch (error) {
        console.error('Erreur lors du vidage:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter au panier')
      navigate('/login')
      return
    }
    
    try {
      await addToCart({ produitId: product.id, quantite: 1 })
      // Optionnel : retirer des favoris après ajout au panier
      // await removeFromWishlist(product.id)
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error)
    }
  }

  const getCurrentPrice = (product) => {
    return product.prixPromo && product.prixPromo > 0 
      ? product.prixPromo 
      : product.prix
  }

  const getOriginalPrice = (product) => {
    return product.prixPromo && product.prixPromo > 0 
      ? product.prix 
      : null
  }

  if (isLoading) {
    return (
      <WishlistContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div>Chargement des favoris...</div>
          </div>
        </Container>
      </WishlistContainer>
    )
  }

  return (
    <WishlistContainer>
      <Container>
        <BackButton
          onClick={() => navigate(-1)}
          variant="outline"
          size="sm"
        >
          <FiArrowLeft size={16} />
          Retour
        </BackButton>

        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Mes Favoris
          </PageTitle>
          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {itemCount} produit{itemCount > 1 ? 's' : ''} dans vos favoris
          </PageSubtitle>
        </PageHeader>

        {itemCount === 0 ? (
          <EmptyWishlist
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <EmptyIcon>
              <FiHeart size={48} color="#d4af37" />
            </EmptyIcon>
            <EmptyTitle>Votre liste de favoris est vide</EmptyTitle>
            <EmptyText>
              Découvrez nos magnifiques montres et ajoutez vos préférées à vos favoris 
              pour les retrouver facilement plus tard.
            </EmptyText>
            <Button
              onClick={() => navigate('/products')}
              size="lg"
            >
              Découvrir nos montres
            </Button>
          </EmptyWishlist>
        ) : (
          <>
            {itemCount > 1 && (
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Button
                  onClick={handleClearWishlist}
                  variant="outline"
                  disabled={isClearingWishlist}
                >
                  <FiTrash2 size={16} />
                  Vider la liste
                </Button>
              </div>
            )}

            <WishlistGrid>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <WishlistItem>
                    <ItemImage>
                      <ProductImage
                        src={item.produit.images?.[0]?.url || '/placeholder-watch.jpg'}
                        alt={item.produit.nom}
                        loading="lazy"
                      />
                    </ItemImage>

                    <ItemInfo>
                      <ProductBrand>{item.produit.marque}</ProductBrand>
                      <ProductName>{item.produit.nom}</ProductName>
                      
                      <PriceContainer>
                        <CurrentPrice>{formatPrice(getCurrentPrice(item.produit))}</CurrentPrice>
                        {getOriginalPrice(item.produit) && (
                          <OriginalPrice>{formatPrice(getOriginalPrice(item.produit))}</OriginalPrice>
                        )}
                      </PriceContainer>

                      <ActionButtons>
                        <RemoveButton
                          onClick={() => handleRemoveFromWishlist(item.produit.id)}
                          size="sm"
                          variant="outline"
                        >
                          <FiTrash2 size={16} />
                        </RemoveButton>
                        <AddToCartButton
                          onClick={() => handleAddToCart(item.produit)}
                          size="sm"
                        >
                          <FiShoppingCart size={16} />
                          Ajouter au panier
                        </AddToCartButton>
                      </ActionButtons>
                    </ItemInfo>
                  </WishlistItem>
                </motion.div>
              ))}
            </WishlistGrid>
          </>
        )}
      </Container>
    </WishlistContainer>
  )
}

export default Wishlist
