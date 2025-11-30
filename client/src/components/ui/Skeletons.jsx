import React from 'react'
import styled, { keyframes } from 'styled-components'

// ============================================
// ANIMATION SHIMMER
// ============================================

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.gray[800]} 0%,
    ${props => props.theme.colors.gray[700]} 50%,
    ${props => props.theme.colors.gray[800]} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${props => props.theme.borderRadius.md};
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.03),
      transparent
    );
    animation: ${shimmer} 1.5s ease-in-out infinite;
  }
`

// ============================================
// PRODUCT CARD SKELETON
// ============================================

const ProductCardSkeletonContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[5]};
  overflow: hidden;
`

const ImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    height: 220px;
  }
`

const TextSkeleton = styled(SkeletonBase)`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.theme.spacing[2]};
`

const BadgeSkeleton = styled(SkeletonBase)`
  position: absolute;
  top: ${props => props.theme.spacing[3]};
  right: ${props => props.theme.spacing[3]};
  width: 60px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.full};
`

export const ProductCardSkeleton = () => (
  <ProductCardSkeletonContainer>
    <div style={{ position: 'relative' }}>
      <ImageSkeleton />
      <BadgeSkeleton />
    </div>
    <TextSkeleton height="24px" width="70%" />
    <TextSkeleton height="16px" width="50%" />
    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <TextSkeleton height="28px" width="40%" />
      <SkeletonBase style={{ width: '44px', height: '44px', borderRadius: '50%' }} />
    </div>
  </ProductCardSkeletonContainer>
)

// ============================================
// PRODUCT DETAIL SKELETON
// ============================================

const ProductDetailSkeletonContainer = styled.div`
  padding: ${props => props.theme.spacing[8]} 0;
`

const ProductDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing[12]};
  margin-bottom: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[8]};
  }
`

const MainImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 600px;
  border-radius: ${props => props.theme.borderRadius.xl};
  
  ${props => props.theme.media.tablet} {
    height: 500px;
  }
  
  ${props => props.theme.media.mobile} {
    height: 400px;
  }
`

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme.spacing[3]};
  margin-top: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ThumbnailSkeleton = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.md};
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[4]};
`

const TitleSkeleton = styled(SkeletonBase)`
  height: 48px;
  width: 80%;
  border-radius: ${props => props.theme.borderRadius.md};
`

const PriceSkeleton = styled(SkeletonBase)`
  height: 40px;
  width: 200px;
  border-radius: ${props => props.theme.borderRadius.md};
`

const ButtonSkeleton = styled(SkeletonBase)`
  height: 52px;
  width: 100%;
  border-radius: ${props => props.theme.borderRadius.lg};
`

export const ProductDetailSkeleton = () => (
  <ProductDetailSkeletonContainer>
    <ProductDetailGrid>
      {/* Images */}
      <div>
        <MainImageSkeleton />
        <ThumbnailGrid>
          {[1, 2, 3, 4].map((i) => (
            <ThumbnailSkeleton key={i} />
          ))}
        </ThumbnailGrid>
      </div>

      {/* Infos */}
      <InfoSection>
        <TitleSkeleton />
        <TextSkeleton height="20px" width="60%" />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <SkeletonBase style={{ width: '120px', height: '32px', borderRadius: '8px' }} />
          <SkeletonBase style={{ width: '80px', height: '32px', borderRadius: '8px' }} />
        </div>
        <PriceSkeleton style={{ marginTop: '1.5rem' }} />
        <TextSkeleton height="16px" width="40%" />
        <ButtonSkeleton style={{ marginTop: '2rem' }} />
        <ButtonSkeleton style={{ height: '48px' }} />
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <SkeletonBase style={{ width: '100px', height: '48px', borderRadius: '50%' }} />
          <SkeletonBase style={{ width: '100px', height: '48px', borderRadius: '50%' }} />
        </div>
      </InfoSection>
    </ProductDetailGrid>

    {/* Description skeleton */}
    <div style={{ marginTop: '3rem' }}>
      <TextSkeleton height="32px" width="40%" style={{ marginBottom: '1.5rem' }} />
      <TextSkeleton height="16px" width="100%" />
      <TextSkeleton height="16px" width="95%" />
      <TextSkeleton height="16px" width="90%" />
      <TextSkeleton height="16px" width="100%" />
    </div>
  </ProductDetailSkeletonContainer>
)

// ============================================
// PRODUCTS GRID SKELETON
// ============================================

const ProductsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing[8]};
  
  ${props => props.theme.media.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${props => props.theme.spacing[6]};
  }
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing[6]};
  }
`

export const ProductsGridSkeleton = ({ count = 8 }) => (
  <ProductsGridContainer>
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </ProductsGridContainer>
)

// ============================================
// CART SKELETON
// ============================================

const CartItemSkeleton = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: ${props => props.theme.spacing[4]};
  padding: ${props => props.theme.spacing[5]};
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing[4]};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 100px 1fr;
    gap: ${props => props.theme.spacing[3]};
  }
`

const CartImageSkeleton = styled(SkeletonBase)`
  width: 120px;
  height: 120px;
  border-radius: ${props => props.theme.borderRadius.md};
  
  ${props => props.theme.media.mobile} {
    width: 100px;
    height: 100px;
  }
`

export const CartSkeleton = () => (
  <div>
    {[1, 2, 3].map((i) => (
      <CartItemSkeleton key={i}>
        <CartImageSkeleton />
        <div>
          <TextSkeleton height="20px" width="70%" style={{ marginBottom: '0.5rem' }} />
          <TextSkeleton height="16px" width="50%" style={{ marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SkeletonBase style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
            <SkeletonBase style={{ width: '80px', height: '24px', borderRadius: '8px' }} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <TextSkeleton height="24px" width="80px" />
        </div>
      </CartItemSkeleton>
    ))}
    
    {/* Summary skeleton */}
    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
      <TextSkeleton height="20px" width="60%" style={{ marginBottom: '1rem' }} />
      <TextSkeleton height="16px" width="80%" style={{ marginBottom: '0.5rem' }} />
      <TextSkeleton height="16px" width="70%" style={{ marginBottom: '1rem' }} />
      <SkeletonBase style={{ width: '100%', height: '48px', borderRadius: '12px', marginTop: '1rem' }} />
    </div>
  </div>
)

// ============================================
// ORDER SKELETON
// ============================================

const OrderCardSkeleton = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing[6]};
  margin-bottom: ${props => props.theme.spacing[4]};
`

export const OrderSkeleton = () => (
  <div>
    {[1, 2, 3].map((i) => (
      <OrderCardSkeleton key={i}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <TextSkeleton height="24px" width="200px" />
          <SkeletonBase style={{ width: '100px', height: '28px', borderRadius: '8px' }} />
        </div>
        <TextSkeleton height="16px" width="150px" style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <CartImageSkeleton style={{ width: '80px', height: '80px' }} />
          <CartImageSkeleton style={{ width: '80px', height: '80px' }} />
        </div>
      </OrderCardSkeleton>
    ))}
  </div>
)

// ============================================
// GENERIC SKELETON (for custom use)
// ============================================

export const Skeleton = styled(SkeletonBase)`
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
`

// Alias pour ProductsGridSkeleton
export const ProductsSkeleton = ProductsGridSkeleton

