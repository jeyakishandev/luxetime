import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { Button } from './ui'
import { 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHeart,
  FiLogOut
} from 'react-icons/fi'
import { formatPrice, getImageUrl } from '../utils/format'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${props => props.theme.colors.gray[700]};
  z-index: ${props => props.theme.zIndex.sticky};
  transition: all ${props => props.theme.transitions.base};
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
    height: 60px;
  }
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  text-decoration: none;
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.heading};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  transition: color ${props => props.theme.transitions.base};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.theme.media.mobile} {
    font-size: ${props => props.theme.fontSizes.lg};
  }
`

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  
  ${props => props.theme.media.mobile} {
    width: 32px;
    height: 32px;
  }
`

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.gray[300]};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    
    &::after {
      transform: translateX(-50%) scaleX(1);
    }
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      transform: translateX(-50%) scaleX(1);
      width: 30px;
    }
  }
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  margin: 0 ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[2]} ${props => props.theme.spacing[10]};
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid ${props => props.theme.colors.gray[600]};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all ${props => props.theme.transitions.base};
  
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

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const ActionButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.gray[300]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.gray[700]};
    color: ${props => props.theme.colors.primary};
  }
  
  ${props => props.theme.media.mobile} {
    width: 36px;
    height: 36px;
  }
`

const CartBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.bold};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
`

const MobileMenuButton = styled(ActionButton)`
  display: none;
  
  ${props => props.theme.media.mobile} {
    display: flex;
  }
`

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.gray[800]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[700]};
  padding: ${props => props.theme.spacing[4]};
  z-index: ${props => props.theme.zIndex.dropdown};
`

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const MobileNavLink = styled(Link)`
  color: ${props => props.theme.colors.gray[300]};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.transitions.base};
  
  &:hover {
    background: ${props => props.theme.colors.gray[700]};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.black};
  }
`

const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  font-size: 10px;
  font-weight: ${props => props.theme.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid ${props => props.theme.colors.gray[900]};
`

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid ${props => props.theme.colors.gray[700]};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  z-index: ${props => props.theme.zIndex.dropdown};
  overflow: hidden;
`

const UserMenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]};
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[300]};
  text-align: left;
  cursor: pointer;
  transition: background ${props => props.theme.transitions.base};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  &:hover {
    background: ${props => props.theme.colors.gray[700]};
  }
`

const UserInfo = styled.div`
  padding: ${props => props.theme.spacing[3]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[700]};
`

const UserName = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.white};
`

const UserEmail = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
`

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/products', label: 'Montres' },
    { path: '/about', label: 'À propos' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoImage src={getImageUrl("/assets/images/ChatGPT Image 2 oct. 2025, 15_35_31.png")} alt="Luxetime" />
          Luxetime
        </Logo>

        <Navigation>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </Navigation>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon size={18} />
            <SearchInput
              type="text"
              placeholder="Rechercher une montre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        <ActionsContainer>
          <ActionButton as={Link} to="/wishlist" title="Liste de souhaits">
            <FiHeart size={20} />
            {wishlistCount > 0 && (
              <Badge>{wishlistCount}</Badge>
            )}
          </ActionButton>

          <ActionButton as={Link} to="/cart" title="Panier">
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <CartBadge>
                {itemCount > 99 ? '99+' : itemCount}
              </CartBadge>
            )}
          </ActionButton>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <ActionButton
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                title="Mon compte"
              >
                <FiUser size={20} />
              </ActionButton>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <UserMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <UserInfo>
                      <UserName>{user?.prenom} {user?.nom}</UserName>
                      <UserEmail>{user?.email}</UserEmail>
                    </UserInfo>
                    
                    <UserMenuItem as={Link} to="/profile">
                      <FiUser size={16} />
                      Mon profil
                    </UserMenuItem>
                    
                    <UserMenuItem as={Link} to="/orders">
                      Mes commandes
                    </UserMenuItem>
                    
                    <UserMenuItem onClick={handleLogout}>
                      <FiLogOut size={16} />
                      Déconnexion
                    </UserMenuItem>
                  </UserMenu>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button
              as={Link}
              to="/login"
              size="sm"
              variant="outline"
            >
              Connexion
            </Button>
          )}

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </MobileMenuButton>
        </ActionsContainer>
      </HeaderContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MobileNav>
              {navItems.map((item) => (
                <MobileNavLink
                  key={item.path}
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </MobileNavLink>
              ))}
              
              {!isAuthenticated && (
                <MobileNavLink to="/login">
                  Connexion
                </MobileNavLink>
              )}
            </MobileNav>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  )
}

export default Header
