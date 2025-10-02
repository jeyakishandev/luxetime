import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  /* Reset et base */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #ffffff;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Typographie responsive */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  h3 {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }

  h4 {
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  }

  p {
    font-size: clamp(0.9rem, 2vw, 1rem);
    margin-bottom: 1rem;
  }

  /* Liens */
  a {
    color: #d4af37;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  a:hover {
    color: #f4d03f;
    text-decoration: underline;
  }

  /* Boutons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
  }

  /* Inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar personnalisée */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  ::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f4d03f;
  }

  /* Focus visible */
  *:focus-visible {
    outline: 2px solid #d4af37;
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* Utilitaires */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    .container {
      padding: 0 0.75rem;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 13px;
    }
    
    .container {
      padding: 0 0.5rem;
    }
  }

  /* Print styles */
  @media print {
    * {
      background: white !important;
      color: black !important;
    }
  }
`

export default GlobalStyles
