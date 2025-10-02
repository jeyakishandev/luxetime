import React, { useState } from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories, useProductFilters } from '../hooks/useProducts'
import { Button, Card, PageLoading } from '../components/ui'
import ProductCard from '../components/ProductCard'
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi'

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
  margin-bottom: ${props => props.theme.spacing[8]};
  text-align: center;
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
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[3]};
  }
`

const SearchBar = styled.div`
  flex: 1;
  position: relative;
  min-width: 300px;
  
  ${props => props.theme.media.mobile} {
    min-width: auto;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[10]};
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[400]};
  }
`

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray[400]};
  pointer-events: none;
`

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const ViewControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  align-items: center;
`

const ViewButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${props => props.theme.colors.gray[600]};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.black : props.theme.colors.gray[400]};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
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

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  margin-top: ${props => props.theme.spacing[8]};
`

const PaginationButton = styled.button`
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.black : props.theme.colors.gray[400]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing[6]};
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[2]};
    text-align: center;
  }
`

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  const { filters, updateFilter, resetFilters } = useProductFilters()
  
  // Appliquer les filtres depuis l'URL
  React.useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page')) || 1
    
    updateFilter('search', search)
    updateFilter('categorie', category)
    updateFilter('page', page)
  }, [searchParams, updateFilter])

  const { data: productsData, isLoading } = useProducts(filters)
  const { data: categories } = useCategories()

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const search = formData.get('search')
    updateFilter('search', search)
    updateFilter('page', 1)
  }

  const handleCategoryChange = (category) => {
    updateFilter('categorie', category)
    updateFilter('page', 1)
  }

  const handlePageChange = (page) => {
    updateFilter('page', page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (sort) => {
    const [tri, ordre] = sort.split('-')
    updateFilter('tri', tri)
    updateFilter('ordre', ordre)
  }

  const products = productsData?.data?.products || []
  const pagination = productsData?.data?.pagination || {}

  return (
    <ProductsContainer>
      <Container>
        <PageHeader>
          <PageTitle>Nos Montres</PageTitle>
          <PageSubtitle>
            Découvrez notre collection exclusive de montres de luxe, 
            alliant tradition horlogère et innovation moderne.
          </PageSubtitle>
        </PageHeader>

        <FiltersContainer>
          <SearchBar>
            <form onSubmit={handleSearch}>
              <SearchIcon size={18} />
              <SearchInput
                name="search"
                placeholder="Rechercher une montre..."
                defaultValue={filters.search}
              />
            </form>
          </SearchBar>

          <FilterSelect
            value={filters.categorie}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories?.data?.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={`${filters.tri}-${filters.ordre}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Plus récentes</option>
            <option value="createdAt-asc">Plus anciennes</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nom-asc">Nom A-Z</option>
            <option value="nom-desc">Nom Z-A</option>
          </FilterSelect>

          <ViewControls>
            <ViewButton
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={18} />
            </ViewButton>
            <ViewButton
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={18} />
            </ViewButton>
          </ViewControls>
        </FiltersContainer>

        {isLoading ? (
          <PageLoading text="Chargement des produits..." />
        ) : (
          <>
            <ResultsInfo>
              <span>
                {pagination.totalItems} produit{pagination.totalItems > 1 ? 's' : ''} trouvé{pagination.totalItems > 1 ? 's' : ''}
              </span>
              <span>
                Page {pagination.currentPage} sur {pagination.totalPages}
              </span>
            </ResultsInfo>

            {viewMode === 'grid' ? (
              <ProductsGrid>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductsGrid>
            ) : (
              <ProductsList>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant="list" />
                ))}
              </ProductsList>
            )}

            {pagination.totalPages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Précédent
                </PaginationButton>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <PaginationButton
                      key={page}
                      active={page === pagination.currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  )
                })}
                
                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Suivant
                </PaginationButton>
              </Pagination>
            )}
          </>
        )}
      </Container>
    </ProductsContainer>
  )
}

export default Products
