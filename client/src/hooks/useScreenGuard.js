import { useState, useEffect } from 'react'
const MIN_WIDTH = 1024
export const useScreenGuard = () => {
  const [isBlocked, setIsBlocked] = useState(window.innerWidth < MIN_WIDTH)
  useEffect(() => {
    const handler = () => setIsBlocked(window.innerWidth < MIN_WIDTH)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isBlocked
}
