import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://luxetime-three.vercel.app'

/**
 * Composant SEO réutilisable pour gérer les meta tags dynamiques
 * 
 * @param {Object} props
 * @param {string} props.title - Titre de la page (sera suffixé avec " | Luxetime")
 * @param {string} props.description - Meta description
 * @param {string} props.image - URL de l'image pour Open Graph (optionnel)
 * @param {string} props.type - Type Open Graph (website, product, article, etc.)
 * @param {Object} props.product - Données produit pour Schema.org (optionnel)
 * @param {boolean} props.noindex - Si true, ajoute noindex (pour pages privées)
 */
const SEO = ({
  title = 'Luxetime - Montres de luxe d\'exception',
  description = 'Découvrez notre collection exclusive de montres de luxe. Élégance intemporelle et précision horlogère suisse. Livraison gratuite, garantie authentique.',
  image = `${BASE_URL}/og-image.jpg`,
  type = 'website',
  product = null,
  noindex = false
}) => {
  const location = useLocation()
  const url = `${BASE_URL}${location.pathname}${location.search}`

  // Construire le titre complet
  const fullTitle = title.includes('Luxetime') ? title : `${title} | Luxetime`

  // Schema.org JSON-LD pour produit
  const productSchema = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.nom,
    description: product.description,
    image: product.images?.[0]?.url || image,
    brand: {
      '@type': 'Brand',
      name: product.marque || 'Luxetime'
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: 'EUR',
      price: product.prixPromo && product.prixPromo > 0 ? product.prixPromo : product.prix,
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    aggregateRating: product.noteMoyenne && product.nombreAvis > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.noteMoyenne,
      reviewCount: product.nombreAvis
    } : undefined
  } : null

  // Schema.org JSON-LD pour Organisation (site web)
  const websiteSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name: 'Luxetime',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Boutique en ligne de montres de luxe d\'exception',
    sameAs: [
      // Ajouter les réseaux sociaux ici si disponibles
    ]
  }

  return (
    <Helmet>
      {/* Meta tags de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Luxetime" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Additional meta tags */}
      <meta name="theme-color" content="#d4af37" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  )
}

export default SEO

