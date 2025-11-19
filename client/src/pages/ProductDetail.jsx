import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import { Button, Card, PageLoading } from '../components/ui'
import { formatPrice, getImageUrl } from '../utils/format'
import { reviewAPI } from '../services/api'
import { useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { 
  FiStar, 
  FiTruck, 
  FiShield, 
  FiHeart, 
  FiArrowLeft,
  FiClock,
  FiAward,
  FiCheck,
  FiMinus,
  FiPlus,
  FiShare2,
  FiEye,
  FiZap,
  FiDroplet,
  FiSun,
  FiMoon,
  FiTrendingUp,
  FiUsers,
  FiGift
} from 'react-icons/fi'

const ProductDetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%);
  position: relative;
  overflow: hidden;
  
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
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.spacing[6]} 0;
  }
`

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing[4]};
  position: relative;
  z-index: 1;
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.spacing[3]};
  }
`

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.full};
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[5]};
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  margin-bottom: ${props => props.theme.spacing[8]};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
    transform: translateX(-4px);
  }
`

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[12]};
  margin-bottom: ${props => props.theme.spacing[16]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
`

const ImageSection = styled.div`
  position: relative;
`

const MainImageContainer = styled(motion.div)`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.xl};
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  margin-bottom: ${props => props.theme.spacing[6]};
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`

const ProductImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  transition: transform 0.4s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  ${props => props.theme.media.mobile} {
    height: 400px;
  }
`

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${MainImageContainer}:hover & {
    opacity: 1;
  }
`

const ZoomButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  color: ${props => props.theme.colors.black};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.lg};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
  }
`

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing[3]};
`

const ThumbnailImage = styled(motion.img)`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.lg};
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: scale(1.05);
  }
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
`

const ProductHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const ProductBrand = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::before {
    content: '';
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
  
  &::after {
    content: '';
    width: 20px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`

const ProductTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
`

const ProductSubtitle = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
  line-height: 1.6;
  font-weight: ${props => props.theme.fontWeights.medium};
`

const ProductBadges = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[3]};
  flex-wrap: wrap;
`

const Badge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[1]};
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[4]};
  background: ${props => props.variant === 'new' 
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
    : props.variant === 'popular'
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))'
    : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))'};
  border: 1px solid ${props => props.variant === 'new' 
    ? 'rgba(34, 197, 94, 0.3)'
    : props.variant === 'popular'
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(212, 175, 55, 0.3)'};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.variant === 'new' ? '#22c55e' : props.variant === 'popular' ? '#ef4444' : props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: ${props => props.theme.fontWeights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`

const CurrentPrice = styled(motion.span)`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: ${props => props.theme.fontWeights.bold};
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
`

const OriginalPrice = styled.span`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.gray[500]};
  text-decoration: line-through;
  opacity: 0.7;
`

const DiscountBadge = styled(motion.div)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const StarsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[1]};
`

const Star = styled.div`
  color: ${props => props.filled ? props.theme.colors.primary : props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.lg};
  
  svg {
    fill: ${props => props.filled ? props.theme.colors.primary : 'none'};
    stroke: ${props => props.filled ? props.theme.colors.primary : props.theme.colors.gray[600]};
    stroke-width: ${props => props.filled ? '0' : '1.5'};
  }
`

const RatingText = styled.span`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const QuantitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[3]};
`

const QuantityLabel = styled.label`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const QuantityButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const QuantityInput = styled.input`
  width: 80px;
  height: 40px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  backdrop-filter: blur(10px);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  margin-top: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
  }
`

const AddToCartButton = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing[2]};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.black};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.lg};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const WishlistButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isInWishlist ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isInWishlist ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isInWishlist ? '#ef4444' : props.theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #ef4444;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ShareButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
    color: #3b82f6;
    transform: scale(1.1);
  }
`

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[8]};
  margin-top: ${props => props.theme.spacing[16]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

const DetailsCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
`

const DetailsTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const SpecsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing[3]} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const SpecLabel = styled.span`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const SpecValue = styled.span`
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.semibold};
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing[6]};
  margin-top: ${props => props.theme.spacing[16]};
`

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  text-align: center;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-4px);
  }
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, #f4d03f);
  color: ${props => props.theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing[4]};
  font-size: ${props => props.theme.fontSizes.xl};
`

const FeatureTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const FeatureDescription = styled.p`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.gray[300]};
  margin: 0;
  line-height: 1.5;
`

const ReviewsSection = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[16]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[8]};
  backdrop-filter: blur(20px);
`

const ReviewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[6]};
  
  ${props => props.theme.media.mobile} {
    flex-direction: column;
    gap: ${props => props.theme.spacing[4]};
    align-items: flex-start;
  }
`

const ReviewsTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.white};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
`

const ReviewsStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]};
`

const AverageRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[2]};
`

const RatingNumber = styled.span`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
`

const ReviewsCount = styled.span`
  color: ${props => props.theme.colors.gray[400]};
  font-size: ${props => props.theme.fontSizes.sm};
`

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[4]};
`

const ReviewCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[4]};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(212, 175, 55, 0.3);
    transform: translateY(-2px);
  }
`

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing[3]};
`

const ReviewerName = styled.span`
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.sm};
`

const ReviewDate = styled.span`
  color: ${props => props.theme.colors.gray[500]};
  font-size: ${props => props.theme.fontSizes.xs};
`

const ReviewRating = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[1]};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const ReviewStar = styled.div`
  color: ${props => props.filled ? props.theme.colors.primary : props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.sm};
  
  svg {
    fill: ${props => props.filled ? props.theme.colors.primary : 'none'};
    stroke: ${props => props.filled ? props.theme.colors.primary : props.theme.colors.gray[600]};
    stroke-width: ${props => props.filled ? '0' : '1.5'};
  }
`

const ReviewComment = styled.p`
  color: ${props => props.theme.colors.gray[300]};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
  margin: 0;
`

const ReviewFormCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[8]};
`

const ReviewFormTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.white};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const StarRatingInput = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing[2]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

const StarButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes['2xl']};
  padding: ${props => props.theme.spacing[1]};
  transition: all ${props => props.theme.transitions.base};
  
  svg {
    fill: ${props => props.$active ? props.theme.colors.primary : 'none'};
    stroke: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.gray[600]};
    stroke-width: ${props => props.$active ? '0' : '1.5'};
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    svg {
      fill: ${props => props.theme.colors.primary};
      stroke: ${props => props.theme.colors.primary};
    }
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const ReviewTextarea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  color: ${props => props.theme.colors.white};
  font-size: ${props => props.theme.fontSizes.base};
  font-family: ${props => props.theme.fonts.body};
  margin-bottom: ${props => props.theme.spacing[4]};
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.gray[500]};
  }
`

// Mapping des images pour chaque produit avec galeries complètes
const productImages = {
  1: {
    main: '/assets/images/analog-watch-1845547_1280.jpg',
    gallery: [
      '/assets/images/analog-watch-1845547_1280.jpg',
      '/assets/images/analog-watch-1869928_1280.jpg',
      '/assets/images/rolex-2171960_1280.jpg',
      '/assets/images/watch-5772317_1280.jpg'
    ]
  },
  2: {
    main: '/assets/images/analog-watch-1869928_1280.jpg',
    gallery: [
      '/assets/images/analog-watch-1869928_1280.jpg',
      '/assets/images/analog-watch-1845547_1280.jpg',
      '/assets/images/rolex-2171961_1280.jpg',
      '/assets/images/clock-1224379_1280.jpg'
    ]
  },
  3: {
    main: '/assets/images/rolex-2171960_1280.jpg',
    gallery: [
      '/assets/images/rolex-2171960_1280.jpg',
      '/assets/images/rolex-2171961_1280.jpg',
      '/assets/images/analog-watch-1845547_1280.jpg',
      '/assets/images/watch-5772317_1280.jpg'
    ]
  },
  4: {
    main: '/assets/images/rolex-2171961_1280.jpg',
    gallery: [
      '/assets/images/rolex-2171961_1280.jpg',
      '/assets/images/rolex-2171960_1280.jpg',
      '/assets/images/analog-watch-1869928_1280.jpg',
      '/assets/images/clock-1224379_1280.jpg'
    ]
  },
  5: {
    main: '/assets/images/clock-1224379_1280.jpg',
    gallery: [
      '/assets/images/clock-1224379_1280.jpg',
      '/assets/images/analog-watch-1869928_1280.jpg',
      '/assets/images/rolex-2171961_1280.jpg',
      '/assets/images/watch-5772317_1280.jpg'
    ]
  },
  6: {
    main: '/assets/images/watch-5772317_1280.jpg',
    gallery: [
      '/assets/images/watch-5772317_1280.jpg',
      '/assets/images/analog-watch-1845547_1280.jpg',
      '/assets/images/rolex-2171960_1280.jpg',
      '/assets/images/clock-1224379_1280.jpg'
    ]
  }
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, error } = useProduct(id)
  const { addToCart, isAddingToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist, isAddingToWishlist } = useWishlist()
  const queryClient = useQueryClient()
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewNote, setReviewNote] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  
  // Reset selectedImage when product changes
  React.useEffect(() => {
    const apiResponse = product?.data?.data
    const productData = apiResponse?.data || apiResponse
    if (productData?.id) {
      setSelectedImage(0)
    }
  }, [product])

  const handleAddToCart = () => {
    if (product?.data?.data) {
      addToCart({ produitId: product.data.data.id, quantite: quantity })
    }
  }

  const handleQuantityChange = (newQuantity) => {
    const apiResponse = product?.data?.data
    const productData = apiResponse?.data || apiResponse
    if (newQuantity >= 1 && newQuantity <= (productData?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour ajouter aux favoris')
      navigate('/login')
      return
    }
    
    const apiResponse = product?.data?.data
    const productData = apiResponse?.data || apiResponse
    if (!productData?.id) return
    
    try {
      if (isInWishlist(productData.id)) {
        await removeFromWishlist(productData.id)
      } else {
        await addToWishlist(productData.id)
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour laisser un avis')
      navigate('/login')
      return
    }

    if (reviewNote === 0) {
      toast.error('Veuillez sélectionner une note')
      return
    }

    const apiResponse = product?.data?.data
    const productData = apiResponse?.data || apiResponse
    if (!productData?.id) return

    setIsSubmittingReview(true)
    try {
      // Préparer les données à envoyer
      const reviewData = {
        produitId: productData.id,
        note: reviewNote,
        commentaire: reviewComment && reviewComment.trim() ? reviewComment.trim() : undefined
      }
      
      console.log('📝 Envoi de l\'avis:', reviewData)
      
      const response = await reviewAPI.createOrUpdateReview(
        reviewData.produitId,
        reviewData.note,
        reviewData.commentaire
      )
      
      console.log('📝 Réponse API:', response)
      
      // La réponse axios a la structure : response.data = { success: true, message: ..., data: ... }
      if (response && response.data && response.data.success) {
        toast.success('Votre avis a été enregistré !')
        setReviewNote(0)
        setReviewComment('')
        // Recharger les données du produit pour mettre à jour les avis
        queryClient.invalidateQueries(['product', id])
        // Forcer le refetch immédiat
        setTimeout(async () => {
          await queryClient.refetchQueries(['product', id])
        }, 300)
      } else {
        const errorMsg = response?.data?.message || 'Erreur lors de l\'enregistrement de l\'avis'
        console.error('❌ Erreur dans la réponse:', response)
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de l\'avis:', error)
      console.error('❌ Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg ||
                          error.message || 
                          'Erreur lors de l\'enregistrement de l\'avis'
      toast.error(errorMessage)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // La réponse de l'API est : { success: true, data: product }
  // React Query retourne : product.data = réponse axios complète
  // product.data.data = le body de la réponse = { success: true, data: product }
  // product.data.data.data = le produit lui-même
  const apiResponse = product?.data?.data
  const productData = apiResponse?.data || apiResponse
  
  // Valeurs par défaut pour noteMoyenne et nombreAvis si elles sont manquantes ou à 0
  const noteMoyenne = productData?.noteMoyenne && productData?.noteMoyenne > 0 
    ? productData?.noteMoyenne 
    : 4.5 // Valeur par défaut
  const nombreAvis = productData?.nombreAvis && productData?.nombreAvis > 0 
    ? productData?.nombreAvis 
    : 5 // Valeur par défaut
  
  // Mettre à jour productData avec les valeurs par défaut si nécessaire
  if (productData && (!productData.noteMoyenne || productData.noteMoyenne === 0)) {
    productData.noteMoyenne = noteMoyenne
  }
  if (productData && (!productData.nombreAvis || productData.nombreAvis === 0)) {
    productData.nombreAvis = nombreAvis
  }
  
  // Prix dynamiques
  const currentPrice = productData?.prixPromo && productData?.prixPromo > 0 
    ? productData?.prixPromo 
    : productData?.prix || 0
  const originalPrice = productData?.prixPromo && productData?.prixPromo > 0 
    ? productData?.prix 
    : null
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0
  
  // Images dynamiques - utiliser les vraies images du produit ou fallback
  const productImagesData = productData?.images && productData?.images.length > 0 
    ? productData?.images.map(img => getImageUrl(img.url))
    : (productImages[productData?.id]?.gallery || productImages[1]?.gallery)
  
  // Fonction pour générer des avis fictifs avec des dates fixes (basées sur l'ID du produit pour la stabilité)
  const generateReviews = (productId, noteMoyenne, nombreAvis) => {
    const reviews = []
    const names = ['Jean-Pierre', 'Marie-Claire', 'Antoine', 'Sophie', 'Pierre', 'Isabelle', 'Michel', 'Catherine']
    const comments = [
      'Excellente qualité, finition impeccable !',
      'Très satisfait de mon achat, je recommande.',
      'Montre magnifique, conforme à mes attentes.',
      'Service client au top, livraison rapide.',
      'Un vrai bijou, je ne regrette pas mon choix.',
      'Qualité exceptionnelle pour ce prix.',
      'Parfait pour les occasions spéciales.',
      'Design élégant et intemporel.'
    ]
    
    const count = Math.max(1, Math.min(nombreAvis || 5, 8)) // Au moins 1 avis
    const targetAverage = noteMoyenne || 4.5
    
    // Utiliser l'ID du produit comme seed pour avoir des dates fixes
    const seed = productId || 1
    
    // Générer des notes qui donnent une moyenne proche de noteMoyenne
    const ratings = []
    let totalRating = 0
    
    // Fonction pseudo-aléatoire basée sur le seed pour avoir des valeurs stables
    const seededRandom = (index) => {
      const x = Math.sin((seed + index) * 12.9898) * 43758.5453
      return x - Math.floor(x)
    }
    
    for (let i = 0; i < count; i++) {
      // Calculer la note cible pour maintenir la moyenne
      const remaining = count - i
      const randomOffset = (seededRandom(i) - 0.5) * 0.5 // Entre -0.25 et 0.25
      const targetForThis = remaining > 0 
        ? Math.max(1, Math.min(5, (targetAverage * count - totalRating) / remaining + randomOffset))
        : Math.max(1, Math.min(5, targetAverage * count - totalRating))
      
      const rating = Math.round(targetForThis * 2) / 2 // Arrondir à 0.5 près
      ratings.push(rating)
      totalRating += rating
    }
    
    // Ajuster la dernière note pour que la moyenne soit exacte
    if (ratings.length > 0) {
      const currentAverage = totalRating / count
      const adjustment = (targetAverage - currentAverage) * count
      ratings[ratings.length - 1] = Math.max(1, Math.min(5, ratings[ratings.length - 1] + adjustment))
    }
    
    // Dates fixes basées sur le seed (jours passés depuis aujourd'hui)
    const baseDate = new Date()
    const daysAgo = [25, 18, 12, 8, 5, 3, 2, 1] // Dates fixes en jours passés
    
    for (let i = 0; i < count; i++) {
      const daysOffset = daysAgo[i % daysAgo.length] || (count - i)
      const reviewDate = new Date(baseDate)
      reviewDate.setDate(reviewDate.getDate() - daysOffset)
      
      reviews.push({
        id: `fake-${productId}-${i + 1}`, // ID unique pour les avis fictifs
        name: names[i % names.length],
        rating: ratings[i] || Math.round(targetAverage),
        comment: comments[i % comments.length],
        date: reviewDate.toLocaleDateString('fr-FR')
      })
    }
    
    return reviews
  }
  
  // Utiliser les vrais avis de la base de données (mémorisés)
  const realReviews = useMemo(() => {
    if (!productData?.avis || productData?.avis?.length === 0) {
      return []
    }
    return productData.avis.map(avis => ({
      id: avis.id,
      name: `${avis.user?.prenom || ''} ${avis.user?.nom || ''}`.trim() || 'Client',
      rating: avis.note,
      comment: avis.commentaire || 'Aucun commentaire',
      date: avis.createdAt ? new Date(avis.createdAt).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
    }))
  }, [productData?.avis])
  
  // Générer les avis fictifs une seule fois par produit (mémorisés)
  const fakeReviews = useMemo(() => {
    if (!productData?.id) return []
    
    const minReviews = 5 // Nombre minimum d'avis à afficher
    const fakeReviewsNeeded = Math.max(0, minReviews - realReviews.length)
    
    if (fakeReviewsNeeded <= 0) {
      return []
    }
    
    return generateReviews(
      productData?.id, 
      productData?.noteMoyenne || 4.5, 
      fakeReviewsNeeded
    )
  }, [productData?.id, productData?.noteMoyenne, realReviews.length])
  
  // Combiner : vrais avis en premier, puis avis fictifs
  const reviews = useMemo(() => {
    return [...realReviews, ...fakeReviews]
  }, [realReviews, fakeReviews])
  
  // Retours conditionnels APRÈS tous les hooks
  if (isLoading) {
    return (
      <ProductDetailContainer>
        <Container>
          <PageLoading text="Chargement du produit..." />
        </Container>
      </ProductDetailContainer>
    )
  }

  // Gestion de l'erreur si le produit n'est pas trouvé
  if (product?.error || (product?.data && !product.data.success)) {
    return (
      <ProductDetailContainer>
        <Container>
          <motion.div 
            style={{ textAlign: 'center', padding: '4rem 0' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Produit non trouvé</h1>
            <p style={{ color: '#9ca3af' }}>Ce produit n'existe pas ou a été supprimé.</p>
            <Button 
              onClick={() => navigate('/products')}
              style={{ marginTop: '2rem' }}
            >
              Retour aux produits
            </Button>
          </motion.div>
        </Container>
      </ProductDetailContainer>
    )
  }
  
  if (!productData || !productData.id) {
    return (
      <ProductDetailContainer>
        <Container>
          <motion.div 
            style={{ textAlign: 'center', padding: '4rem 0' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Produit non trouvé</h1>
            <p style={{ color: '#9ca3af' }}>Ce produit n'existe pas ou a été supprimé.</p>
            <Button 
              onClick={() => navigate('/products')}
              style={{ marginTop: '2rem' }}
            >
              Retour aux produits
            </Button>
          </motion.div>
        </Container>
      </ProductDetailContainer>
    )
  }

  // Données fictives détaillées pour chaque produit
  const productDetails = {
    1: {
      name: "Luxetime Classic",
      description: "Une montre intemporelle qui incarne l'élégance classique. Fabriquée en Suisse avec des matériaux d'exception, elle allie tradition horlogère et modernité.",
      movement: "Mécanique automatique Swiss Made",
      case: "Acier inoxydable 316L brossé",
      dial: "Émail grand feu avec index appliqués",
      strap: "Cuir alligator italien noir",
      waterResistance: "5 ATM (50m)",
      powerReserve: "42 heures",
      frequency: "28,800 vibrations/heure",
      jewels: "25 rubis",
      thickness: "12.5mm",
      weight: "85g",
      warranty: "2 ans internationale",
      origin: "Suisse",
      features: ["Chronomètre certifié", "Réserve de marche", "Date", "Luminescence Super-LumiNova"],
      story: "Inspirée des montres de gousset du XIXe siècle, la Luxetime Classic perpétue l'art horloger traditionnel avec une finition exceptionnelle.",
      materials: ["Acier inoxydable 316L", "Sapphire", "Cuir alligator italien", "Or rose 18k"],
      certifications: ["Chronomètre COSC", "Swiss Made", "ISO 3159"]
    },
    2: {
      name: "Luxetime Sport",
      description: "Conçue pour les aventuriers et les sportifs, cette montre allie robustesse et performance. Résistante à l'eau jusqu'à 200m, elle vous accompagne dans tous vos défis.",
      movement: "Quartz haute précision",
      case: "Titane grade 5",
      dial: "Mat noir avec index lumineux",
      strap: "Caoutchouc sport perforé",
      waterResistance: "20 ATM (200m)",
      powerReserve: "3 ans",
      frequency: "32,768 Hz",
      jewels: "0",
      thickness: "14.2mm",
      weight: "95g",
      warranty: "3 ans internationale",
      origin: "Japon",
      features: ["Chronographe", "Tachymètre", "Résistance aux chocs", "Luminescence Super-LumiNova"],
      story: "Née de la collaboration avec des athlètes professionnels, la Luxetime Sport repousse les limites de la résistance horlogère.",
      materials: ["Titane grade 5", "Sapphire anti-reflet", "Caoutchouc haute performance", "Acier inoxydable"],
      certifications: ["ISO 6425", "MIL-STD-810G", "JIS B 7021"]
    },
    3: {
      name: "Luxetime Elegance",
      description: "L'incarnation du luxe horloger. En or rose 18k avec finitions manuelles exceptionnelles, cette montre est un véritable bijou d'artisanat.",
      movement: "Mécanique manuelle Swiss Made",
      case: "Or rose 18k",
      dial: "Émail blanc avec guillochage",
      strap: "Satin noir",
      waterResistance: "3 ATM (30m)",
      frequency: "18,000 vibrations/heure",
      jewels: "17 rubis",
      thickness: "8.5mm",
      weight: "65g",
      warranty: "2 ans internationale",
      origin: "Suisse",
      features: ["Finitions manuelles", "Aiguilles feuille", "Sapphire", "Boucle déployante"],
      story: "Chaque pièce est façonnée à la main par nos maîtres horlogers, perpétuant un savoir-faire ancestral.",
      materials: ["Or rose 18k", "Émail grand feu", "Sapphire", "Satin de soie"],
      certifications: ["Swiss Made", "Poinçon de Genève", "Fleurier Quality Foundation"]
    },
    4: {
      name: "Luxetime Heritage",
      description: "Un hommage aux montres vintage des années 60. Cette édition limitée capture l'essence de l'horlogerie d'époque avec une touche moderne.",
      movement: "Mécanique automatique vintage",
      case: "Acier inoxydable brossé",
      dial: "Mat avec index vintage",
      strap: "Cuir vintage vieilli",
      waterResistance: "5 ATM (50m)",
      powerReserve: "38 heures",
      frequency: "21,600 vibrations/heure",
      jewels: "21 rubis",
      thickness: "11.8mm",
      weight: "78g",
      warranty: "2 ans internationale",
      origin: "Suisse",
      features: ["Style vintage", "Luminescence vintage", "Crown vintage", "Édition limitée"],
      story: "Inspirée des chronographes des années 60, cette montre rend hommage à l'âge d'or de l'horlogerie.",
      materials: ["Acier inoxydable 316L", "Cuir vieilli", "Sapphire", "Laiton"],
      certifications: ["Swiss Made", "Édition limitée", "Certificat d'authenticité"]
    },
    5: {
      name: "Luxetime Modern",
      description: "L'avenir de l'horlogerie durable. Fabriquée avec des matériaux recyclés et alimentée par l'énergie solaire, elle allie innovation et respect de l'environnement.",
      movement: "Quartz solaire",
      case: "Fibre de carbone recyclée",
      dial: "Mat avec index écologiques",
      strap: "Caoutchouc recyclé",
      waterResistance: "10 ATM (100m)",
      powerReserve: "6 mois",
      frequency: "32,768 Hz",
      jewels: "0",
      thickness: "10.5mm",
      weight: "72g",
      warranty: "2 ans internationale",
      origin: "Allemagne",
      features: ["Écologique", "Recharge solaire", "Matériaux recyclés", "Certification éco"],
      story: "Pionnière de l'horlogerie verte, cette montre prouve que luxe et durabilité peuvent coexister.",
      materials: ["Fibre de carbone recyclée", "Sapphire recyclé", "Caoutchouc recyclé", "Acier recyclé"],
      certifications: ["ISO 14001", "Certification éco", "Cradle to Cradle", "Carbon Neutral"]
    },
    6: {
      name: "Luxetime Premium",
      description: "Le summum de l'art horloger. En platine 950 avec complications exceptionnelles, cette montre est réservée aux connaisseurs les plus exigeants.",
      movement: "Mécanique automatique avec réserve de marche",
      case: "Platine 950",
      dial: "Émail grand feu avec complications",
      strap: "Alligator noir",
      waterResistance: "5 ATM (50m)",
      powerReserve: "72 heures",
      frequency: "28,800 vibrations/heure",
      jewels: "31 rubis",
      thickness: "13.8mm",
      weight: "92g",
      warranty: "3 ans internationale",
      origin: "Suisse",
      features: ["Complications", "Tourbillon", "Réserve de marche", "Finitions exceptionnelles"],
      story: "Chaque composant est fabriqué à la main avec une précision millimétrique, créant une œuvre d'art mécanique unique.",
      materials: ["Platine 950", "Émail grand feu", "Alligator exotique", "Or blanc 18k"],
      certifications: ["Poinçon de Genève", "Fleurier Quality Foundation", "Swiss Made", "Certificat de chronomètre"]
    }
  }

  const details = productDetails[productData.id] || productDetails[1]

  return (
    <ProductDetailContainer>
      <Container>
        <BackButton
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft size={18} />
          Retour
        </BackButton>

        <ProductGrid>
          <ImageSection>
            <MainImageContainer
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductImage
                src={getImageUrl(productImagesData[selectedImage] || productImagesData[0])}
                alt={productData.nom}
              />
              <ImageOverlay>
                <ZoomButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEye size={24} />
                </ZoomButton>
              </ImageOverlay>
            </MainImageContainer>

            <ThumbnailGrid>
              {productImagesData.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  src={image}
                  alt={`${productData.nom} - Vue ${index + 1}`}
                  active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </ThumbnailGrid>
          </ImageSection>

          <ProductInfo>
            <ProductHeader>
              <ProductBrand
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {productData.marque}
              </ProductBrand>
              
              <ProductTitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {productData.nom}
              </ProductTitle>
              
              <ProductSubtitle
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {details.description || productData.description}
              </ProductSubtitle>

              <ProductBadges
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {productData.estNouveau && (
                  <Badge variant="new">
                    <FiStar size={12} />
                    Nouveau
                  </Badge>
                )}
                {productData.noteMoyenne >= 4.5 && (
                  <Badge variant="popular">
                    <FiTrendingUp size={12} />
                    Populaire
                  </Badge>
                )}
                {productData.noteMoyenne >= 4.8 && (
                  <Badge>
                    <FiAward size={12} />
                    Premium
                  </Badge>
                )}
              </ProductBadges>
            </ProductHeader>

            <PriceSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <PriceContainer>
                <CurrentPrice>{formatPrice(currentPrice)}</CurrentPrice>
                {originalPrice && (
                  <>
                    <OriginalPrice>{formatPrice(originalPrice)}</OriginalPrice>
                    <DiscountBadge
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      -{discount}%
                    </DiscountBadge>
                  </>
                )}
              </PriceContainer>

              <RatingSection>
                <StarsContainer>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const noteMoyenne = productData.noteMoyenne || 4.5
                    // Étoile pleine si sa valeur est <= à la note moyenne arrondie
                    // Exemples :
                    // - Note 4.3 → Math.round(4.3) = 4 → 4 étoiles pleines
                    // - Note 4.5 → Math.round(4.5) = 5 → 5 étoiles pleines
                    // - Note 4.7 → Math.round(4.7) = 5 → 5 étoiles pleines
                    const isFilled = star <= Math.round(noteMoyenne)
                    return (
                      <Star key={star} filled={isFilled}>
                        <FiStar />
                      </Star>
                    )
                  })}
                </StarsContainer>
                <RatingText>
                  {productData.noteMoyenne?.toFixed(1) || '4.5'}/5 ({productData.nombreAvis || reviews.length} avis)
                </RatingText>
              </RatingSection>
            </PriceSection>

            <QuantitySection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <QuantityLabel>Quantité</QuantityLabel>
              <QuantityControls>
                <QuantityButton
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiMinus size={16} />
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={productData.stock}
                />
                <QuantityButton
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= productData.stock}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiPlus size={16} />
                </QuantityButton>
              </QuantityControls>
            </QuantitySection>

            <ActionButtons
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <AddToCartButton
                onClick={handleAddToCart}
                disabled={productData.stock === 0 || isAddingToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAddingToCart ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <FiClock size={20} />
                    </motion.div>
                    Ajout en cours...
                  </>
                ) : productData.stock === 0 ? (
                  <>
                    <FiCheck size={20} />
                    Rupture de stock
                  </>
                ) : (
                  <>
                    <FiPlus size={20} />
                    Ajouter au panier
                  </>
                )}
              </AddToCartButton>
              
              <WishlistButton
                onClick={toggleWishlist}
                disabled={isAddingToWishlist}
                $isInWishlist={product?.data?.data?.id && isInWishlist(product.data.data.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart size={20} fill={product?.data?.data?.id && isInWishlist(product.data.data.id) ? '#ef4444' : 'none'} />
              </WishlistButton>
              
              <ShareButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShare2 size={20} />
              </ShareButton>
            </ActionButtons>
          </ProductInfo>
        </ProductGrid>

        <ProductDetails>
          <DetailsCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <DetailsTitle>
              <FiZap size={24} />
              Spécifications techniques
            </DetailsTitle>
            <SpecsList>
              <SpecItem>
                <SpecLabel>Mouvement</SpecLabel>
                <SpecValue>{details.movement}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Boîtier</SpecLabel>
                <SpecValue>{details.case}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Cadran</SpecLabel>
                <SpecValue>{details.dial}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Bracelet</SpecLabel>
                <SpecValue>{details.strap}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Étanchéité</SpecLabel>
                <SpecValue>{details.waterResistance}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Réserve de marche</SpecLabel>
                <SpecValue>{details.powerReserve}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Fréquence</SpecLabel>
                <SpecValue>{details.frequency}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Rubis</SpecLabel>
                <SpecValue>{details.jewels}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Épaisseur</SpecLabel>
                <SpecValue>{details.thickness}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Poids</SpecLabel>
                <SpecValue>{details.weight}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Garantie</SpecLabel>
                <SpecValue>{details.warranty}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Origine</SpecLabel>
                <SpecValue>{details.origin}</SpecValue>
              </SpecItem>
            </SpecsList>
          </DetailsCard>

          <DetailsCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <DetailsTitle>
              <FiAward size={24} />
              Caractéristiques
            </DetailsTitle>
            <SpecsList>
              {details?.features?.map((feature, index) => (
                <SpecItem key={index}>
                  <SpecLabel>
                    <FiCheck size={16} style={{ marginRight: '8px', color: '#22c55e' }} />
                    {feature}
                  </SpecLabel>
                </SpecItem>
              ))}
            </SpecsList>
          </DetailsCard>
        </ProductDetails>

        {/* Section Histoire du produit */}
        <DetailsCard
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ marginTop: '4rem' }}
        >
          <DetailsTitle>
            <FiClock size={24} />
            L'histoire de {productData.nom}
          </DetailsTitle>
          <motion.p
            style={{
              color: '#d1d5db',
              fontSize: '16px',
              lineHeight: '1.8',
              margin: '0 0 1.5rem 0'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {details.story}
          </motion.p>
          <motion.p
            style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: '0'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {details.description}
          </motion.p>
        </DetailsCard>

        {/* Section Matériaux et Certifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <DetailsCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <DetailsTitle>
              <FiAward size={24} />
              Matériaux d'exception
            </DetailsTitle>
            <SpecsList>
              {details?.materials?.map((material, index) => (
                <SpecItem key={index}>
                  <SpecLabel>
                    <FiCheck size={16} style={{ marginRight: '8px', color: '#22c55e' }} />
                    {material}
                  </SpecLabel>
                </SpecItem>
              ))}
            </SpecsList>
          </DetailsCard>

          <DetailsCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <DetailsTitle>
              <FiShield size={24} />
              Certifications
            </DetailsTitle>
            <SpecsList>
              {details?.certifications?.map((cert, index) => (
                <SpecItem key={index}>
                  <SpecLabel>
                    <FiAward size={16} style={{ marginRight: '8px', color: '#d4af37' }} />
                    {cert}
                  </SpecLabel>
                </SpecItem>
              ))}
            </SpecsList>
          </DetailsCard>
        </div>

        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <FeatureIcon>
              <FiTruck size={24} />
            </FeatureIcon>
            <FeatureTitle>Livraison gratuite</FeatureTitle>
            <FeatureDescription>
              Livraison gratuite en France métropolitaine sous 24-48h
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <FeatureIcon>
              <FiShield size={24} />
            </FeatureIcon>
            <FeatureTitle>Garantie 2 ans</FeatureTitle>
            <FeatureDescription>
              Garantie constructeur incluse avec service après-vente
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <FeatureIcon>
              <FiStar size={24} />
            </FeatureIcon>
            <FeatureTitle>Qualité premium</FeatureTitle>
            <FeatureDescription>
              Matériaux d'exception et savoir-faire artisanal
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <FeatureIcon>
              <FiUsers size={24} />
            </FeatureIcon>
            <FeatureTitle>Service client</FeatureTitle>
            <FeatureDescription>
              Support client disponible 7j/7 pour vous accompagner
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>

        {/* Section Avis clients */}
        <ReviewsSection
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ReviewsHeader>
            <ReviewsTitle>
              <FiStar size={24} />
              Avis clients
            </ReviewsTitle>
            <ReviewsStats>
              <AverageRating>
                <RatingNumber>{productData.noteMoyenne?.toFixed(1) || '4.5'}</RatingNumber>
                <StarsContainer>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const noteMoyenne = productData.noteMoyenne || 4.5
                    const isFilled = star <= Math.round(noteMoyenne)
                    return (
                      <Star key={star} filled={isFilled}>
                        <FiStar />
                      </Star>
                    )
                  })}
                </StarsContainer>
              </AverageRating>
              <ReviewsCount>
                {productData.nombreAvis || reviews.length} avis
              </ReviewsCount>
            </ReviewsStats>
          </ReviewsHeader>

          {/* Formulaire pour laisser un avis */}
          {isAuthenticated && (
            <ReviewFormCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReviewFormTitle>Laisser un avis</ReviewFormTitle>
              <StarRatingInput>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    type="button"
                    onClick={() => setReviewNote(star)}
                    $active={reviewNote >= star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiStar />
                  </StarButton>
                ))}
              </StarRatingInput>
              <ReviewTextarea
                placeholder="Partagez votre expérience avec ce produit..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview || reviewNote === 0}
                variant="primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmittingReview ? 'Envoi...' : 'Publier mon avis'}
              </Button>
            </ReviewFormCard>
          )}

          {!isAuthenticated && (
            <ReviewFormCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ReviewFormTitle>Connectez-vous pour laisser un avis</ReviewFormTitle>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Se connecter
              </Button>
            </ReviewFormCard>
          )}

          <ReviewsGrid>
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <ReviewHeader>
                  <ReviewerName>{review.name}</ReviewerName>
                  <ReviewDate>{review.date}</ReviewDate>
                </ReviewHeader>
                <ReviewRating>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <ReviewStar key={star} filled={star <= review.rating}>
                      <FiStar />
                    </ReviewStar>
                  ))}
                </ReviewRating>
                <ReviewComment>{review.comment}</ReviewComment>
              </ReviewCard>
            ))}
          </ReviewsGrid>
        </ReviewsSection>
      </Container>
    </ProductDetailContainer>
  )
}

export default ProductDetail