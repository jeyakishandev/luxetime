// Thème responsive pour Luxetime
export const theme = {
  // Couleurs
  colors: {
    primary: '#d4af37',
    primaryLight: '#f4d03f',
    primaryDark: '#b8941f',
    secondary: '#1a1a1a',
    secondaryLight: '#2d2d2d',
    secondaryDark: '#0f0f0f',
    accent: '#116530',
    accentLight: '#1e7e34',
    white: '#ffffff',
    black: '#000000',
    gray: {
      100: '#f8f9fa',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529'
    },
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8'
  },

  // Typographie
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    heading: "'Playfair Display', serif",
    mono: "'Fira Code', 'Monaco', 'Consolas', monospace"
  },

  // Tailles de police responsive
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    // Responsive
    responsive: {
      h1: 'clamp(2rem, 5vw, 3.5rem)',
      h2: 'clamp(1.5rem, 4vw, 2.5rem)',
      h3: 'clamp(1.25rem, 3vw, 1.75rem)',
      h4: 'clamp(1.1rem, 2.5vw, 1.5rem)',
      body: 'clamp(0.9rem, 2vw, 1rem)',
      small: 'clamp(0.8rem, 1.5vw, 0.9rem)'
    }
  },

  // Poids de police
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  // Espacements
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',       // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem'     // 256px
  },

  // Breakpoints responsive
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Media queries
  media: {
    xs: `@media (min-width: 320px)`,
    sm: `@media (min-width: 640px)`,
    md: `@media (min-width: 768px)`,
    lg: `@media (min-width: 1024px)`,
    xl: `@media (min-width: 1280px)`,
    '2xl': `@media (min-width: 1536px)`,
    // Mobile first
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
    desktop: `@media (min-width: 1024px)`,
    // Orientation
    landscape: `@media (orientation: landscape)`,
    portrait: `@media (orientation: portrait)`
  },

  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(212, 175, 55, 0.3)',
    glowStrong: '0 0 30px rgba(212, 175, 55, 0.5)'
  },

  // Bordures
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
    bounce: '0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },

  // Animations
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    bounce: 'bounce 0.6s ease-in-out',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    spin: 'spin 1s linear infinite'
  }
}

// Utilitaires pour les media queries
export const media = {
  mobile: `@media (max-width: 767px)`,
  tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
  desktop: `@media (min-width: 1024px)`,
  landscape: `@media (orientation: landscape)`,
  portrait: `@media (orientation: portrait)`
}

export default theme
