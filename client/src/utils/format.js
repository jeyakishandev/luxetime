// Formatage des prix
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '0,00 €'
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Formatage des nombres
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0'
  
  return new Intl.NumberFormat('fr-FR').format(number)
}

// Formatage des dates
export const formatDate = (date, options = {}) => {
  if (!date) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(new Date(date))
}

// Formatage des dates courtes
export const formatDateShort = (date) => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Formatage des dates relatives
export const formatDateRelative = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now - targetDate) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Il y a quelques secondes'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `Il y a ${diffInMonths} mois`
  }
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`
}

// Formatage des tailles de fichiers
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Formatage des pourcentages
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== 'number') return '0%'
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

// Formatage des durées
export const formatDuration = (seconds) => {
  if (typeof seconds !== 'number') return '0s'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// Formatage des numéros de téléphone
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return ''
  
  // Supprimer tous les caractères non numériques
  const cleaned = phoneNumber.replace(/\D/g, '')
  
  // Format français
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }
  
  return phoneNumber
}

// Formatage des codes postaux
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return ''
  
  const cleaned = postalCode.replace(/\D/g, '')
  
  if (cleaned.length === 5) {
    return cleaned
  }
  
  return postalCode
}

// Formatage des adresses
export const formatAddress = (address) => {
  if (!address) return ''
  
  const parts = []
  
  if (address.rue) parts.push(address.rue)
  if (address.codePostal && address.ville) {
    parts.push(`${address.codePostal} ${address.ville}`)
  } else if (address.ville) {
    parts.push(address.ville)
  }
  if (address.pays) parts.push(address.pays)
  
  return parts.join(', ')
}

// Formatage des noms
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return ''
  
  const first = firstName?.trim() || ''
  const last = lastName?.trim() || ''
  
  return `${first} ${last}`.trim()
}

// Formatage des initiales
export const formatInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return ''
  
  const first = firstName?.trim().charAt(0).toUpperCase() || ''
  const last = lastName?.trim().charAt(0).toUpperCase() || ''
  
  return `${first}${last}`
}

// Formatage des slugs
export const formatSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .trim()
}

// Formatage des URLs
export const formatUrl = (url) => {
  if (!url) return ''
  
  // Ajouter le protocole si manquant
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  
  return url
}

// Formatage des emails
export const formatEmail = (email) => {
  if (!email) return ''
  
  return email.toLowerCase().trim()
}

// Normalisation des URLs d'images
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    const defaultImage = '/assets/images/analog-watch-1845547_1280.jpg'
    return getImageUrl(defaultImage)
  }
  
  // Si c'est déjà une URL complète (http/https), on la retourne telle quelle
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // En production, servir les images depuis le backend (Render)
  const API_URL = import.meta.env.VITE_API_URL || ''
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production'
  
  // Si c'est un chemin relatif qui commence par /
  if (imageUrl.startsWith('/')) {
    // En production, pointer vers le backend si VITE_API_URL est défini
    if (isProduction && API_URL && API_URL !== 'http://localhost:5000') {
      return `${API_URL}${imageUrl}`
    }
    return imageUrl
  }
  
  // Sinon, on ajoute /assets/images/ au début
  const fullPath = `/assets/images/${imageUrl}`
  if (isProduction && API_URL && API_URL !== 'http://localhost:5000') {
    return `${API_URL}${fullPath}`
  }
  return fullPath
}

// Validation des formats
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone)
}

export const isValidPostalCode = (postalCode) => {
  const postalRegex = /^\d{5}$/
  return postalRegex.test(postalCode)
}
