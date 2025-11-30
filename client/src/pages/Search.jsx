import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { PageLoading } from '../components/ui'

const SearchContainer = styled.div`
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
`

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing[8]};
`

const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`

const SearchQuery = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.gray[300]};
  margin-bottom: ${props => props.theme.spacing[2]};
  
  span {
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.fontWeights.semibold};
  }
`

const ResultCount = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.base};
  color: ${props => props.theme.colors.gray[400]};
`

const SearchInputContainer = styled.div`
  max-width: 600px;
  margin: 0 auto ${props => props.theme.spacing[8]};
  position: relative;
`

const SearchForm = styled.form`
  position: relative;
`

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${props => props.theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray[400]};
  pointer-events: none;
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[12]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: ${props => props.theme.borderRadius.xl};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.lg};
  transition: all ${props => props.theme.transitions.base};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: ${props => props.theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[400]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${props => props.theme.spacing[5]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[4]};
  }
`

const NoResults = styled(motion.div)`
  text-align: center;
  padding: ${props => props.theme.spacing[12]} 0;
`

const NoResultsIcon = styled.div`
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

const NoResultsTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0 0 ${props => props.theme.spacing[3]} 0;
`

const NoResultsText = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[400]};
  margin: 0;
`

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  const [searchInput, setSearchInput] = useState(query)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (query) {
      searchProducts(query)
    }
  }, [query])

  const searchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setProducts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await axios.get(`${API_URL}/api/products`, {
        params: {
          search: searchQuery.trim()
        }
      })

      if (response.data.success) {
        setProducts(response.data.data.products || [])
      } else {
        setError('Erreur lors de la recherche')
      }
    } catch (err) {
      console.error('Erreur de recherche:', err)
      setError('Erreur lors de la recherche')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handleClear = () => {
    setSearchInput('')
    setProducts([])
    navigate('/search')
  }

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`)
  }

  if (loading) {
    return (
      <SearchContainer>
        <Container>
          <PageLoading text="Recherche en cours..." />
        </Container>
      </SearchContainer>
    )
  }

  return (
    <SearchContainer>
      <Container>
        <SearchHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Recherche
          </PageTitle>
          
          {query && (
            <>
              <SearchQuery
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Résultats pour : <span>"{query}"</span>
              </SearchQuery>
              <ResultCount
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {products.length} résultat{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
              </ResultCount>
            </>
          )}
        </SearchHeader>

        <SearchInputContainer>
          <SearchForm onSubmit={handleSearch}>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Rechercher une montre, une marque..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            {searchInput && (
              <ClearButton type="button" onClick={handleClear}>
                <FiX size={20} />
              </ClearButton>
            )}
          </SearchForm>
        </SearchInputContainer>

        {error && (
          <NoResults
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NoResultsIcon>
              <FiSearch size={48} color="#d4af37" />
            </NoResultsIcon>
            <NoResultsTitle>Erreur</NoResultsTitle>
            <NoResultsText>{error}</NoResultsText>
          </NoResults>
        )}

        {!loading && !error && query && products.length === 0 && (
          <NoResults
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NoResultsIcon>
              <FiSearch size={48} color="#d4af37" />
            </NoResultsIcon>
            <NoResultsTitle>Aucun résultat</NoResultsTitle>
            <NoResultsText>
              Aucune montre ne correspond à votre recherche "{query}"
            </NoResultsText>
          </NoResults>
        )}

        {products.length > 0 && (
          <ProductsGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={() => handleProductClick(product)}
                />
              </motion.div>
            ))}
          </ProductsGrid>
        )}
      </Container>
    </SearchContainer>
  )
}

export default SearchPage