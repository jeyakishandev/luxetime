import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'
import { Button, Card, PageLoading } from '../components/ui'
import { formatPrice } from '../utils/format'
import { FiStar, FiTruck, FiShield, FiHeart } from 'react-icons/fi'

const ProductDetailContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing[8]} 0;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const ImageContainer = styled.div`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  background: ${props => props.theme.colors.gray[800]};
`

const ProductImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  
  ${props => props.theme.media.mobile} {
    height: 300px;
  }
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const ProductBrand = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`

const ProductTitle = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0;
  line-height: 1.2;
`

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  margin: ${props => props.theme.spacing[4]} 0;
`

const CurrentPrice = styled.span`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
`

const ProductDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[300]};
  line-height: 1.6;
  margin: 0;
`

const ProductActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
  }
`

const AddToCartButton = styled(Button)`
  flex: 1;
`

const WishlistButton = styled(Button)`
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProductFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[8]};
`

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing[4]};
`

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[3]};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.base};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const ProductDetail = () => {
  const { id } = useParams()
  const { data: product, isLoading } = useProduct(id)
  const { addToCart, isAddingToCart } = useCart()

  const handleAddToCart = () => {
    if (product?.data) {
      addToCart({ produitId: product.data.id, quantite: 1 })
    }
  }

  if (isLoading) {
    return (
      <ProductDetailContainer>
        <Container>
          <PageLoading text="Chargement du produit..." />
        </Container>
      </ProductDetailContainer>
    )
  }

  if (!product?.data) {
    return (
      <ProductDetailContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1>Produit non trouvé</h1>
            <p>Ce produit n'existe pas ou a été supprimé.</p>
          </div>
        </Container>
      </ProductDetailContainer>
    )
  }

  const productData = product.data
  const currentPrice = productData.prixPromo && productData.prixPromo > 0 
    ? productData.prixPromo 
    : productData.prix
  const originalPrice = productData.prixPromo && productData.prixPromo > 0 
    ? productData.prix 
    : null

  return (
    <ProductDetailContainer>
      <Container>
        <ProductGrid>
          <ImageContainer>
            <ProductImage
              src={productData.images?.[0]?.url || '/placeholder-watch.jpg'}
              alt={productData.nom}
            />
          </ImageContainer>

          <ProductInfo>
            <ProductBrand>{productData.marque}</ProductBrand>
            <ProductTitle>{productData.nom}</ProductTitle>
            
            <ProductPrice>
              <CurrentPrice>{formatPrice(currentPrice)}</CurrentPrice>
              {originalPrice && (
                <OriginalPrice>{formatPrice(originalPrice)}</OriginalPrice>
              )}
            </ProductPrice>

            <ProductDescription>
              {productData.description}
            </ProductDescription>

            <ProductActions>
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={productData.stock === 0 || isAddingToCart}
                isLoading={isAddingToCart}
                size="lg"
              >
                {productData.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </AddToCartButton>
              
              <WishlistButton variant="outline" size="lg">
                <FiHeart size={20} />
              </WishlistButton>
            </ProductActions>
          </ProductInfo>
        </ProductGrid>

        <ProductFeatures>
          <FeatureCard>
            <FeatureIcon>
              <FiTruck size={24} />
            </FeatureIcon>
            <FeatureTitle>Livraison gratuite</FeatureTitle>
            <FeatureDescription>
              Livraison gratuite en France métropolitaine
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiShield size={24} />
            </FeatureIcon>
            <FeatureTitle>Garantie 2 ans</FeatureTitle>
            <FeatureDescription>
              Garantie constructeur incluse
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiStar size={24} />
            </FeatureIcon>
            <FeatureTitle>Qualité premium</FeatureTitle>
            <FeatureDescription>
              Matériaux d'exception sélectionnés
            </FeatureDescription>
          </FeatureCard>
        </ProductFeatures>
      </Container>
    </ProductDetailContainer>
  )
}

export default ProductDetail
