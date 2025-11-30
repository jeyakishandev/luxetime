import React, { useState, useEffect, useRef } from 'react'
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
  FiLogOut,
  FiShield,
  FiAward,
  FiHome,
  FiInfo,
  FiMail
} from 'react-icons/fi'
import { getImageUrl } from '../utils/format'

// ============================================
// MOBILE-FIRST STYLES (Base mobile)
// ============================================

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: ${props => props.theme.zIndex.sticky};
  transition: all 0.3s ease;

  /* Effet de brillance subtil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
    pointer-events: none;
  }
`

const HeaderWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[3]};
  
  /* Desktop */
  @media (min-width: 768px) {
    padding: 0 ${props => props.theme.spacing[6]};
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  position: relative;
  
  /* Desktop */
  @media (min-width: 768px) {
    height: 70px;
  }
`

// ============================================
// LOGO
// ============================================

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  text-decoration: none;
  color: ${props => props.theme.colors.white};
  font-family: 'Playfair Display', serif;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.extrabold};
  letter-spacing: -0.02em;
  transition: transform 0.3s ease;
  z-index: 10;
  
  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  &:active {
    transform: scale(0.98);
  }

  /* Desktop */
  @media (min-width: 768px) {
    font-size: ${props => props.theme.fontSizes['2xl']};
    gap: ${props => props.theme.spacing[3]};
  }
`

const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  
  /* Desktop */
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
  }
`

// ============================================
// NAVIGATION DESKTOP
// ============================================

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: ${props => props.theme.spacing[6]};
  margin: 0 ${props => props.theme.spacing[6]};
  
  /* Desktop */
  @media (min-width: 768px) {
    display: flex;
  }
  
  /* Large desktop */
  @media (min-width: 1024px) {
    gap: ${props => props.theme.spacing[8]};
    margin: 0 ${props => props.theme.spacing[8]};
  }
`

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.gray[300]};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.sm};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  padding: ${props => props.theme.spacing[2]} 0;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      transform: translateX(-50%) scaleX(1);
      width: 100%;
    }
  }
  
  &.active {
    color: ${props => props.theme.colors.primary};
    
    &::after {
      transform: translateX(-50%) scaleX(1);
      width: 100%;
    }
  }
`

// ============================================
// RECHERCHE
// ============================================

const SearchContainer = styled.div`
  display: none;
  position: relative;
  flex: 1;
  max-width: 400px;
  margin: 0 ${props => props.theme.spacing[4]};
  
  /* Desktop */
  @media (min-width: 768px) {
    display: block;
  }
  
  /* Large desktop */
  @media (min-width: 1024px) {
    max-width: 500px;
  }
`

const SearchForm = styled.form`
  position: relative;
  width: 100%;
`

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[2]} ${props => props.theme.spacing[10]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${props => props.theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray[400]};
  pointer-events: none;
  width: 18px;
  height: 18px;
`

// ============================================
// ACTIONS (Cart, Wishlist, User)
// ============================================

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  
  /* Desktop */
  @media (min-width: 768px) {
    gap: ${props => props.theme.spacing[3]};
  }
`

const IconButton = styled.button`
  position: relative;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.gray[300]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Desktop */
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }
`

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: ${props => props.theme.colors.error};
  color: ${props => props.theme.colors.white};
  font-size: 10px;
  font-weight: ${props => props.theme.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 2px solid ${props => props.theme.colors.gray[900]};
  box-sizing: border-box;
`

const CartBadge = styled(Badge)`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.black};
  top: 0;
  right: 0;
`

const LoginButton = styled(Button)`
  display: none;
  
  /* Desktop */
  @media (min-width: 768px) {
    display: inline-flex;
  }
`

// ============================================
// MENU MOBILE
// ============================================

const HamburgerContainer = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  z-index: 10;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Desktop */
  @media (min-width: 768px) {
    display: none;
  }
`

const HamburgerLine = styled(motion.span)`
  width: 100%;
  height: 2px;
  background: ${props => props.theme.colors.gray[300]};
  border-radius: 2px;
  transition: all 0.3s ease;
  
  ${HamburgerContainer}:hover & {
    background: ${props => props.theme.colors.primary};
  }
`

const HamburgerButton = ({ isOpen, onClick, ...props }) => (
  <HamburgerContainer
    onClick={onClick}
    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    aria-expanded={isOpen}
    data-mobile-menu-button
    {...props}
  >
    <HamburgerLine
      animate={isOpen ? { 
        rotate: 45, 
        y: 7,
        backgroundColor: '#d4af37'
      } : { 
        rotate: 0, 
        y: 0,
        backgroundColor: ''
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
    <HamburgerLine
      animate={isOpen ? { 
        opacity: 0, 
        x: -20,
        backgroundColor: '#d4af37'
      } : { 
        opacity: 1, 
        x: 0,
        backgroundColor: ''
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    />
    <HamburgerLine
      animate={isOpen ? { 
        rotate: -45, 
        y: -7,
        backgroundColor: '#d4af37'
      } : { 
        rotate: 0, 
        y: 0,
        backgroundColor: ''
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    />
  </HamburgerContainer>
)

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: ${props => props.theme.zIndex.modal};
  display: block;
  cursor: pointer;
  
  /* Desktop */
  @media (min-width: 768px) {
    display: none;
  }
`

const MobileMenuPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 85%;
  max-width: 400px;
  background: linear-gradient(135deg, ${props => props.theme.colors.gray[900]} 0%, ${props => props.theme.colors.gray[800]} 100%);
  border-left: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: -4px 0 30px rgba(0, 0, 0, 0.6);
  z-index: ${props => props.theme.zIndex.modal + 1};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  
  /* Effet de brillance subtil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.5), transparent);
    pointer-events: none;
  }
  
  /* Desktop */
  @media (min-width: 768px) {
    display: none;
  }
`

const MobileMenuHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[5]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 64px;
  max-height: 64px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: relative;
  flex-shrink: 0;
  z-index: 2;
  
  /* Effet de brillance en haut */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent);
    pointer-events: none;
  }
`

const MobileMenuTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const MobileMenuLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(212, 175, 55, 0.3);
`

const MobileMenuTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(212, 175, 55, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const MobileMenuContent = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing[4]};
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  color: ${props => props.theme.colors.white};
  background: transparent;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  
  /* Scrollbar personnalisée pour le contenu */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.5);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

const MobileSearchContainer = styled(motion.div)`
  margin-bottom: ${props => props.theme.spacing[6]};
  
  /* Desktop */
  @media (min-width: 768px) {
    display: none;
  }
`

const MobileSearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[3]} ${props => props.theme.spacing[10]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  transition: all 0.3s ease;
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.08);
  }
`

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[6]};
`

const MobileNavLink = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.gray[300]};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.base};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s ease;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(212, 175, 55, 0.1), transparent);
    transition: width 0.3s ease;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.primary};
    transform: translateX(4px);
    
    &::before {
      width: 4px;
    }
    
    svg {
      transform: scale(1.1);
      color: ${props => props.theme.colors.primary};
    }
  }
  
  &:active {
    transform: translateX(2px);
  }
  
  &.active {
    background: rgba(212, 175, 55, 0.15);
    color: ${props => props.theme.colors.primary};
    border-left: 3px solid ${props => props.theme.colors.primary};
    
    &::before {
      width: 3px;
      background: ${props => props.theme.colors.primary};
    }
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`

const MobileNavButton = styled(MobileNavLink).attrs({ as: 'button' })`
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
`

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: ${props => props.theme.spacing[4]} 0;
`

// ============================================
// USER MENU
// ============================================

const UserMenuContainer = styled.div`
  position: relative;
`

const UserMenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + ${props => props.theme.spacing[2]});
  right: 0;
  background: ${props => props.theme.colors.gray[800]};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  min-width: 220px;
  z-index: ${props => props.theme.zIndex.dropdown};
  overflow: hidden;
  backdrop-filter: blur(10px);
`

const UserMenuHeader = styled.div`
  padding: ${props => props.theme.spacing[4]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
`

const UserName = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  margin-bottom: ${props => props.theme.spacing[1]};
`

const UserEmail = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[400]};
`

const UserMenuItem = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray[300]};
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  min-height: 44px;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.primary};
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const userMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  // Fermer le menu utilisateur au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isUserMenuOpen])

  // Fermer le menu mobile au clic extérieur et avec Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (!event.target.closest('[data-mobile-menu-button]')) {
          setIsMobileMenuOpen(false)
        }
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Accueil', icon: FiHome },
    { path: '/products', label: 'Montres', icon: null },
    { path: '/about', label: 'À propos', icon: FiInfo },
    { path: '/contact', label: 'Contact', icon: FiMail }
  ]

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <HeaderContent>
          {/* Logo */}
          <Logo to="/" aria-label="Luxetime - Accueil">
            <LogoImage 
              src={getImageUrl("/assets/images/ChatGPT Image 2 oct. 2025, 15_35_31.png")} 
              alt="Luxetime Logo" 
            />
            <span>Luxetime</span>
          </Logo>

          {/* Navigation Desktop */}
          <DesktopNav>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.label}
              </NavLink>
            ))}
          </DesktopNav>

          {/* Recherche Desktop */}
          <SearchContainer>
            <SearchForm onSubmit={handleSearch}>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Rechercher une montre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher"
              />
            </SearchForm>
          </SearchContainer>

          {/* Actions */}
          <ActionsGroup>
            {/* Wishlist */}
            <IconButton 
              as={Link} 
              to="/wishlist" 
              aria-label={`Liste de souhaits${wishlistCount > 0 ? ` (${wishlistCount} articles)` : ''}`}
            >
              <FiHeart size={20} />
              {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
            </IconButton>

            {/* Cart */}
            <IconButton 
              as={Link} 
              to="/cart" 
              aria-label={`Panier${itemCount > 0 ? ` (${itemCount} articles)` : ''}`}
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <CartBadge>
                  {itemCount > 99 ? '99+' : itemCount}
                </CartBadge>
              )}
            </IconButton>

            {/* User Menu / Login */}
            {isAuthenticated ? (
              <UserMenuContainer ref={userMenuRef}>
                <IconButton
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Menu utilisateur"
                  aria-expanded={isUserMenuOpen}
                >
                  <FiUser size={20} />
                </IconButton>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <UserMenuDropdown
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UserMenuHeader>
                        <UserName>{user?.prenom} {user?.nom}</UserName>
                        <UserEmail>{user?.email}</UserEmail>
                      </UserMenuHeader>
                      
                      <UserMenuItem as={Link} to="/profile">
                        <FiUser size={18} />
                        Mon profil
                      </UserMenuItem>
                      
                      <UserMenuItem as={Link} to="/orders">
                        Mes commandes
                      </UserMenuItem>
                      
                      <UserMenuItem as={Link} to="/certificates">
                        <FiAward size={18} />
                        Mes certificats
                      </UserMenuItem>
                      
                      <UserMenuItem as={Link} to="/warranties">
                        <FiShield size={18} />
                        Mes garanties
                      </UserMenuItem>
                      
                      {user?.role === 'ADMIN' && (
                        <UserMenuItem as={Link} to="/admin">
                          <FiShield size={18} />
                          Administration
                        </UserMenuItem>
                      )}
                      
                      <UserMenuItem onClick={handleLogout}>
                        <FiLogOut size={18} />
                        Déconnexion
                      </UserMenuItem>
                    </UserMenuDropdown>
                  )}
                </AnimatePresence>
              </UserMenuContainer>
            ) : (
              <LoginButton
                as={Link}
                to="/login"
                size="sm"
                variant="outline"
              >
                Connexion
              </LoginButton>
            )}

            {/* Menu Mobile Button */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </ActionsGroup>
        </HeaderContent>
      </HeaderWrapper>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MobileMenuOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileMenuPanel
              ref={mobileMenuRef}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            >
              <MobileMenuHeader
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <MobileMenuTitleContainer>
                  <MobileMenuLogo 
                    src={getImageUrl("/assets/images/ChatGPT Image 2 oct. 2025, 15_35_31.png")} 
                    alt="Luxetime Logo" 
                  />
                  <MobileMenuTitle>Menu</MobileMenuTitle>
                </MobileMenuTitleContainer>
                <IconButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <FiX size={20} />
                </IconButton>
              </MobileMenuHeader>

              <MobileMenuContent>
                {/* Recherche Mobile */}
                <MobileSearchContainer
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <SearchForm onSubmit={handleSearch}>
                    <SearchIcon />
                    <MobileSearchInput
                      type="text"
                      placeholder="Rechercher une montre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Rechercher"
                      autoFocus={false}
                    />
                  </SearchForm>
                </MobileSearchContainer>

                {/* Navigation Mobile */}
                <MobileNav>
                  {navItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <MobileNavLink
                        key={item.path}
                        to={item.path}
                        className={location.pathname === item.path ? 'active' : ''}
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                      >
                        {Icon && <Icon />}
                        {item.label}
                      </MobileNavLink>
                    )
                  })}
                </MobileNav>

                <MobileDivider />

                {/* Actions Mobile si non connecté */}
                {!isAuthenticated && (
                  <MobileNav>
                    <MobileNavLink 
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <FiUser />
                      Connexion
                    </MobileNavLink>
                  </MobileNav>
                )}

                {/* Compteurs Mobile */}
                <MobileNav>
                  <MobileNavLink 
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <FiHeart />
                    Liste de souhaits
                    {wishlistCount > 0 && (
                      <Badge style={{ marginLeft: 'auto' }}>{wishlistCount}</Badge>
                    )}
                  </MobileNavLink>
                  
                  <MobileNavLink 
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <FiShoppingCart />
                    Panier
                    {itemCount > 0 && (
                      <CartBadge style={{ marginLeft: 'auto' }}>
                        {itemCount > 99 ? '99+' : itemCount}
                      </CartBadge>
                    )}
                  </MobileNavLink>
                </MobileNav>

                {/* Menu Utilisateur Mobile */}
                {isAuthenticated && (
                  <>
                    <MobileDivider />
                    <MobileNav>
                      <MobileNavLink 
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.3 }}
                      >
                        <FiUser />
                        Mon profil
                      </MobileNavLink>
                      
                      <MobileNavLink 
                        to="/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Mes commandes
                      </MobileNavLink>
                      
                      <MobileNavLink 
                        to="/certificates"
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.45, duration: 0.3 }}
                      >
                        <FiAward />
                        Mes certificats
                      </MobileNavLink>
                      
                      <MobileNavLink 
                        to="/warranties"
                        onClick={() => setIsMobileMenuOpen(false)}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <FiShield />
                        Mes garanties
                      </MobileNavLink>
                      
                      {user?.role === 'ADMIN' && (
                        <MobileNavLink 
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.55, duration: 0.3 }}
                        >
                          <FiShield />
                          Administration
                        </MobileNavLink>
                      )}
                      
                      <MobileNavButton
                        onClick={handleLogout}
                        style={{ color: '#ef4444' }}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: user?.role === 'ADMIN' ? 0.6 : 0.55, duration: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiLogOut />
                        Déconnexion
                      </MobileNavButton>
                    </MobileNav>
                  </>
                )}
              </MobileMenuContent>
            </MobileMenuPanel>
          </>
        )}
      </AnimatePresence>
    </HeaderContainer>
  )
}

export default Header