import React, { useState } from 'react'
import styled from 'styled-components'
import { useProducts } from '../hooks/useProducts'
import { Button, Card, PageLoading } from '../components/ui'
import { FiShoppingCart, FiHeart, FiFilter } from 'react-icons/fi'

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

const FiltersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[8]};
  flex-wrap: wrap;
  justify-content: center;
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    align-items: center;
  }
`

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
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

const ProductPrice = styled.div`
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
  margin-left: ${props => props.theme.spacing[2]};
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

const Products = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    page: 1,
    limit: 12,
  })

  const { data: productsData, isLoading, isError } = useProducts(filters)
  const products = productsData?.data || []

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1
    }))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  if (isLoading) {
    return (
      <ProductsContainer>
        <Container>
          <PageLoading text="Chargement des produits..." />
        </Container>
      </ProductsContainer>
    )
  }

  if (isError) {
    return (
      <ProductsContainer>
        <Container>
          <PageHeader>
            <PageTitle>Nos Collections</PageTitle>
            <PageSubtitle>
              Erreur lors du chargement des produits. Veuillez réessayer.
            </PageSubtitle>
          </PageHeader>
        </Container>
      </ProductsContainer>
    )
  }

  return (
    <ProductsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Nos Collections</PageTitle>
          <PageSubtitle>
            Découvrez notre sélection de montres de luxe, alliant tradition horlogère et innovation moderne
          </PageSubtitle>
        </PageHeader>

        <FiltersContainer>
          <FilterButton
            variant={filters.category === '' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('category', '')}
          >
            <FiFilter size={16} />
            Toutes
          </FilterButton>
          <FilterButton
            variant={filters.category === 'HOMME' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('category', 'HOMME')}
          >
            Homme
          </FilterButton>
          <FilterButton
            variant={filters.category === 'FEMME' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('category', 'FEMME')}
          >
            Femme
          </FilterButton>
          <FilterButton
            variant={filters.category === 'SPORT' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('category', 'SPORT')}
          >
            Sport
          </FilterButton>
          <FilterButton
            variant={filters.category === 'VINTAGE' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('category', 'VINTAGE')}
          >
            Vintage
          </FilterButton>
        </FiltersContainer>

        <ProductsGrid>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage>
                  {product.nom}
                </ProductImage>
                
                <ProductName>{product.nom}</ProductName>
                <ProductBrand>{product.marque}</ProductBrand>
                
                <ProductPrice>
                  <CurrentPrice>{formatPrice(product.prix)}</CurrentPrice>
                  {product.prixPromo && product.prixPromo > 0 && (
                    <OriginalPrice>{formatPrice(product.prix)}</OriginalPrice>
                  )}
                </ProductPrice>
                
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
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem 0',
              color: '#9ca3af'
            }}>
              <h3>Aucun produit trouvé</h3>
              <p>Essayez de modifier vos filtres de recherche.</p>
            </div>
          )}
        </ProductsGrid>
      </Container>
    </ProductsContainer>
  )
}

export default Products