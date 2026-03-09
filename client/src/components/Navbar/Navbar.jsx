import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>⚙</span>
          <span className={styles.brandText}>DevSetup<span className={styles.brandAccent}>.</span>gen</span>
        </Link>
        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>Home</Link>
          <Link to="/select" className={`${styles.link} ${pathname === '/select' ? styles.active : ''}`}>Build Script</Link>
          <Link to="/admin" className={`${styles.link} ${pathname === '/admin' ? styles.active : ''}`}>Admin</Link>
          <Link to="/select" className={styles.ctaBtn}>Generate Script →</Link>
        </div>
      </div>
    </nav>
  )
}
