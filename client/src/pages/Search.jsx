import React from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import { useSearchProducts } from '../hooks/useProducts'
import { Button, PageLoading } from '../components/ui'
import ProductCard from '../components/ProductCard'
import { FiSearch } from 'react-icons/fi'

const SearchContainer = styled.div`
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
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const SearchQuery = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const NoResultsIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.gray[400]};
`

const NoResultsTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[3]};
`

const NoResultsText = styled.p`
  color: ${props => props.theme.colors.gray[400]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const { data: searchData, isLoading } = useSearchProducts(query)

  if (isLoading) {
    return (
      <SearchContainer>
        <Container>
          <PageLoading text="Recherche en cours..." />
        </Container>
      </SearchContainer>
    )
  }

  const products = searchData?.data?.products || []
  const totalResults = searchData?.data?.pagination?.totalItems || 0

  return (
    <SearchContainer>
      <Container>
        <PageHeader>
          <PageTitle>Résultats de recherche</PageTitle>
          {query && (
            <SearchQuery>
              Recherche pour "{query}" - {totalResults} résultat{totalResults > 1 ? 's' : ''}
            </SearchQuery>
          )}
        </PageHeader>

        {products.length === 0 ? (
          <NoResults>
            <NoResultsIcon>
              <FiSearch size={48} />
            </NoResultsIcon>
            <NoResultsTitle>Aucun résultat trouvé</NoResultsTitle>
            <NoResultsText>
              Désolé, nous n'avons trouvé aucun produit correspondant à votre recherche.
              Essayez avec d'autres mots-clés.
            </NoResultsText>
            <Button as="a" href="/products" size="lg">
              Voir tous les produits
            </Button>
          </NoResults>
        ) : (
          <ProductsGrid>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductsGrid>
        )}
      </Container>
    </SearchContainer>
  )
}

export default Search
