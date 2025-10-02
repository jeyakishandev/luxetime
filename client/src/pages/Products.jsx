import React from 'react'
import styled from 'styled-components'
import { Button, Card } from '../components/ui'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'

const ProductsContainer = styled.div`
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

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[12]};
`

const PageTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  max-width: 600px;
  margin: 0 auto;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[12]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const ProductCard = styled(Card)`
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, ${props => props.theme.colors.gray[800]}, ${props => props.theme.colors.gray[700]});
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.lg};
`

const ProductName = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const ProductBrand = styled.p`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${props => props.theme.spacing[3]};
`

const ProductPrice = styled.p`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const ProductActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  justify-content: center;
`

const ActionButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
`

const WishlistButton = styled(Button)`
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

// Données statiques des montres
const staticProducts = [
  {
    id: 1,
    name: "Luxetime Classic",
    brand: "Luxetime",
    price: 1299,
    image: "Montre Classique"
  },
  {
    id: 2,
    name: "Luxetime Sport",
    brand: "Luxetime",
    price: 899,
    image: "Montre Sport"
  },
  {
    id: 3,
    name: "Luxetime Elegance",
    brand: "Luxetime",
    price: 1599,
    image: "Montre Élégance"
  },
  {
    id: 4,
    name: "Luxetime Heritage",
    brand: "Luxetime",
    price: 2199,
    image: "Montre Heritage"
  },
  {
    id: 5,
    name: "Luxetime Modern",
    brand: "Luxetime",
    price: 999,
    image: "Montre Moderne"
  },
  {
    id: 6,
    name: "Luxetime Premium",
    brand: "Luxetime",
    price: 2999,
    image: "Montre Premium"
  }
]

const Products = () => {
  return (
    <ProductsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Nos Collections</PageTitle>
          <PageSubtitle>
            Découvrez notre sélection de montres de luxe, alliant tradition horlogère et innovation moderne
          </PageSubtitle>
        </PageHeader>

        <ProductsGrid>
          {staticProducts.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage>
                {product.image}
              </ProductImage>
              
              <ProductName>{product.name}</ProductName>
              <ProductBrand>{product.brand}</ProductBrand>
              <ProductPrice>{product.price}€</ProductPrice>
              
              <ProductActions>
                <ActionButton size="sm">
                  <FiShoppingCart size={16} />
                  Ajouter
                </ActionButton>
                <WishlistButton variant="outline" size="sm">
                  <FiHeart size={16} />
                </WishlistButton>
              </ProductActions>
            </ProductCard>
          ))}
        </ProductsGrid>
      </Container>
    </ProductsContainer>
  )
}

export default Products