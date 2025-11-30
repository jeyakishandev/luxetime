import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant qui fait défiler la page vers le haut lors des changements de route
 * Utile pour que chaque nouvelle page s'affiche depuis le haut
 * 
 * Pour un meilleur UX, utilise un scroll instantané (pas smooth) lors du changement de page
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    // Scroll vers le haut uniquement si la route a changé
    if (prevPathname.current !== pathname) {
      // Scroll instantané vers le haut (meilleur pour les changements de page)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
      
      // Alternative pour les navigateurs qui ne supportent pas 'instant'
      // On utilise setTimeout pour forcer le scroll même si behavior n'est pas supporté
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
      
      prevPathname.current = pathname
    }
  }, [pathname])

  return null
}

export default ScrollToTop

